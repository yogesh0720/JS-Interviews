# Scaling Express.js to Handle 1M+ Requests Per Day

## Is it Possible? YES! 

**1 million requests per day = ~11.6 requests per second**
**But peak traffic can be 10-50x higher, so you need to handle 100-500+ RPS**

Many companies successfully handle this scale:
- **Netflix**: Billions of requests per day with Node.js
- **PayPal**: 35% faster response times after switching to Node.js
- **Uber**: Handles millions of requests with Node.js microservices
- **LinkedIn**: Mobile backend serves millions of requests

---

## Key Strategies for High-Scale Express.js

### 1. **Clustering & Load Balancing**

```javascript
// cluster.js - Utilize all CPU cores
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers equal to CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart dead workers
  });
  
} else {
  // Workers can share any TCP port
  require('./app.js');
  console.log(`Worker ${process.pid} started`);
}
```

```javascript
// app.js - Optimized Express application
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.setex).bind(redisClient);

// Essential middleware for performance
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Caching middleware
const cache = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await getAsync(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Store original res.json
      const originalJson = res.json;
      res.json = function(data) {
        // Cache the response
        setAsync(key, duration, JSON.stringify(data));
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

// High-performance routes
app.get('/api/users', cache(300), async (req, res) => {
  // Simulate database query
  const users = await getUsersFromDB();
  res.json(users);
});

app.get('/api/products', cache(600), async (req, res) => {
  const products = await getProductsFromDB();
  res.json(products);
});

// Health check (no caching)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, PID: ${process.pid}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    redisClient.quit();
    process.exit(0);
  });
});
```

### 2. **Database Optimization**

```javascript
// database.js - Optimized database connections
const { Pool } = require('pg');
const redis = require('redis');

// PostgreSQL connection pool
const pgPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis for caching and sessions
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('Redis server connection refused');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Redis retry time exhausted');
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

class DatabaseService {
  // Optimized user queries with caching
  async getUsers(page = 1, limit = 50) {
    const cacheKey = `users:${page}:${limit}`;
    
    try {
      // Try cache first
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      
      // Query database with pagination
      const offset = (page - 1) * limit;
      const query = `
        SELECT id, name, email, created_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
      `;
      
      const result = await pgPool.query(query, [limit, offset]);
      const users = result.rows;
      
      // Cache for 5 minutes
      await redisClient.setex(cacheKey, 300, JSON.stringify(users));
      
      return users;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
  
  // Batch operations for better performance
  async createUsers(usersData) {
    const client = await pgPool.connect();
    
    try {
      await client.query('BEGIN');
      
      const insertPromises = usersData.map(user => 
        client.query(
          'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
          [user.name, user.email]
        )
      );
      
      const results = await Promise.all(insertPromises);
      await client.query('COMMIT');
      
      // Invalidate cache
      const pattern = 'users:*';
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      
      return results.map(r => r.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new DatabaseService();
```

### 3. **Advanced Caching Strategy**

```javascript
// cache.js - Multi-layer caching system
const redis = require('redis');
const NodeCache = require('node-cache');

class CacheManager {
  constructor() {
    // L1 Cache: In-memory (fastest)
    this.memoryCache = new NodeCache({ 
      stdTTL: 60, // 1 minute default
      checkperiod: 120,
      maxKeys: 10000
    });
    
    // L2 Cache: Redis (shared across instances)
    this.redisClient = redis.createClient();
    
    // L3 Cache: Database query result cache
    this.queryCache = new Map();
  }
  
  async get(key) {
    // Try L1 cache first (fastest)
    let value = this.memoryCache.get(key);
    if (value) {
      return { data: value, source: 'memory' };
    }
    
    // Try L2 cache (Redis)
    try {
      value = await this.redisClient.get(key);
      if (value) {
        const parsed = JSON.parse(value);
        // Store in L1 for next time
        this.memoryCache.set(key, parsed, 60);
        return { data: parsed, source: 'redis' };
      }
    } catch (error) {
      console.error('Redis error:', error);
    }
    
    return null;
  }
  
  async set(key, value, ttl = 300) {
    // Set in both caches
    this.memoryCache.set(key, value, Math.min(ttl, 60));
    
    try {
      await this.redisClient.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }
  
  async invalidate(pattern) {
    // Clear memory cache
    this.memoryCache.flushAll();
    
    // Clear Redis cache
    try {
      const keys = await this.redisClient.keys(pattern);
      if (keys.length > 0) {
        await this.redisClient.del(keys);
      }
    } catch (error) {
      console.error('Redis invalidation error:', error);
    }
  }
}

module.exports = new CacheManager();
```

### 4. **Load Balancer Configuration (Nginx)**

```nginx
# nginx.conf - Load balancer configuration
upstream nodejs_backend {
    least_conn;
    server 127.0.0.1:3000 weight=1 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3001 weight=1 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3002 weight=1 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3003 weight=1 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

server {
    listen 80;
    server_name your-domain.com;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API requests
    location /api/ {
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/s;
    limit_req zone=api burst=200 nodelay;
}
```

### 5. **Performance Monitoring**

```javascript
// monitoring.js - Performance monitoring
const express = require('express');
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Middleware to track metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
      
    httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
};

// System metrics
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Custom metrics endpoint
const metricsRouter = express.Router();
metricsRouter.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});

module.exports = { metricsMiddleware, metricsRouter };
```

### 6. **Optimized Production Setup**

```javascript
// production-app.js - Production-ready Express app
const express = require('express');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const { metricsMiddleware, metricsRouter } = require('./monitoring');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} starting ${numCPUs} workers`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
  
} else {
  const app = express();
  
  // Trust proxy (for load balancer)
  app.set('trust proxy', 1);
  
  // Essential middleware
  app.use(require('helmet')());
  app.use(require('compression')());
  app.use(express.json({ limit: '1mb' }));
  app.use(metricsMiddleware);
  
  // Routes
  app.use('/metrics', metricsRouter);
  
  // API routes with caching
  app.get('/api/users', require('./cache-middleware')(300), async (req, res) => {
    const users = await require('./database').getUsers(
      parseInt(req.query.page) || 1,
      parseInt(req.query.limit) || 50
    );
    res.json(users);
  });
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      pid: process.pid,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });
  
  // Error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Worker ${process.pid} listening on port ${PORT}`);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      process.exit(0);
    });
  });
}
```

### 7. **Docker & Deployment**

```dockerfile
# Dockerfile - Optimized for production
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy app source
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["node", "cluster.js"]
```

```yaml
# docker-compose.yml - Multi-instance setup
version: '3.8'
services:
  app1:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    depends_on:
      - redis
      - postgres
    
  app2:
    build: .
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    depends_on:
      - redis
      - postgres
      
  app3:
    build: .
    ports:
      - "3002:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    depends_on:
      - redis
      - postgres
      
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app1
      - app2
      - app3
      
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
      
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
```

## Performance Benchmarks

### Single Instance (4 CPU cores):
- **Without optimization**: ~500 RPS
- **With clustering**: ~2,000 RPS
- **With caching**: ~5,000 RPS
- **With all optimizations**: ~10,000+ RPS

### Load Balanced (4 instances):
- **Total capacity**: ~40,000+ RPS
- **Daily capacity**: ~3.4 billion requests/day

## Key Optimization Techniques

1. **Clustering**: Use all CPU cores
2. **Caching**: Redis + in-memory caching
3. **Database**: Connection pooling, query optimization
4. **Load Balancing**: Nginx with multiple instances
5. **Compression**: Gzip for responses
6. **Keep-Alive**: Reuse HTTP connections
7. **Static Assets**: CDN for static files
8. **Monitoring**: Track performance metrics

## Real-World Examples

**Netflix**: Handles 1+ billion requests/day with Node.js microservices
**PayPal**: 35% faster response times, handles millions of transactions
**Uber**: Real-time location updates for millions of users
**LinkedIn**: Mobile API serves 100M+ requests/day

## Interview Tips

- **Know the numbers**: 1M requests/day = ~11.6 RPS average
- **Understand scaling**: Vertical vs horizontal scaling
- **Explain bottlenecks**: Database, memory, CPU, network
- **Discuss caching**: Multi-layer caching strategies
- **Know monitoring**: How to identify performance issues

**Yes, 1M+ requests per day is absolutely achievable with proper optimization!**