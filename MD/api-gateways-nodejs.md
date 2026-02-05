# API Gateways in Node.js

## What is an API Gateway?

An API Gateway is a server that acts as an entry point for all client requests to your microservices. It sits between clients and backend services, providing a unified interface and handling cross-cutting concerns.

## Key Functions of API Gateway

1. **Request Routing** - Routes requests to appropriate microservices
2. **Authentication & Authorization** - Validates user credentials and permissions
3. **Rate Limiting** - Controls request frequency to prevent abuse
4. **Load Balancing** - Distributes requests across multiple service instances
5. **Request/Response Transformation** - Modifies data format between client and services
6. **Logging & Monitoring** - Tracks API usage and performance
7. **Caching** - Stores frequently requested data
8. **SSL Termination** - Handles HTTPS encryption/decryption

## When to Use API Gateway

✅ **Use When:**
- Building microservices architecture
- Need centralized authentication
- Multiple clients (web, mobile, IoT) accessing same services
- Cross-cutting concerns like logging, monitoring
- Need to aggregate data from multiple services

❌ **Don't Use When:**
- Simple monolithic application
- Single service with few endpoints
- Internal-only APIs with no external access
- Performance is critical and latency matters most

## Benefits

- **Simplified Client Code** - Single endpoint for all services
- **Security** - Centralized authentication and authorization
- **Monitoring** - Single place to track all API calls
- **Flexibility** - Easy to modify backend without affecting clients
- **Protocol Translation** - Convert between different protocols

## Drawbacks

- **Single Point of Failure** - If gateway goes down, all APIs are affected
- **Performance Bottleneck** - Additional network hop adds latency
- **Complexity** - Another component to maintain and monitor
- **Development Overhead** - Need to configure routing and policies

---

## Implementation Examples

### 1. Simple API Gateway with Express.js

```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use(limiter);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Logging middleware
const logRequests = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};

app.use(logRequests);

// Service routes with proxy
const userServiceProxy = createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/users'
  }
});

const orderServiceProxy = createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/orders': '/orders'
  }
});

const productServiceProxy = createProxyMiddleware({
  target: 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '/products'
  }
});

// Public routes (no authentication required)
app.use('/api/products', productServiceProxy);

// Protected routes (authentication required)
app.use('/api/users', authenticateToken, userServiceProxy);
app.use('/api/orders', authenticateToken, orderServiceProxy);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
```

### 2. Advanced API Gateway with Custom Routing

```javascript
const express = require('express');
const axios = require('axios');
const redis = require('redis');

class APIGateway {
  constructor() {
    this.app = express();
    this.services = new Map();
    this.cache = redis.createClient();
    this.setupMiddleware();
    this.setupRoutes();
  }

  // Register microservices
  registerService(name, config) {
    this.services.set(name, {
      url: config.url,
      healthCheck: config.healthCheck || '/health',
      timeout: config.timeout || 5000,
      retries: config.retries || 3
    });
  }

  setupMiddleware() {
    this.app.use(express.json());
    
    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      next();
    });

    // Request ID for tracing
    this.app.use((req, res, next) => {
      req.requestId = Math.random().toString(36).substr(2, 9);
      res.setHeader('X-Request-ID', req.requestId);
      next();
    });
  }

  // Circuit breaker pattern
  async callService(serviceName, path, method = 'GET', data = null, headers = {}) {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    const url = `${service.url}${path}`;
    
    try {
      const response = await axios({
        method,
        url,
        data,
        headers,
        timeout: service.timeout
      });
      
      return response.data;
    } catch (error) {
      console.error(`Service ${serviceName} error:`, error.message);
      throw error;
    }
  }

  // Caching middleware
  async getCachedResponse(key) {
    try {
      const cached = await this.cache.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache error:', error);
      return null;
    }
  }

  async setCachedResponse(key, data, ttl = 300) {
    try {
      await this.cache.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  setupRoutes() {
    // Dynamic routing
    this.app.all('/api/:service/*', async (req, res) => {
      const { service } = req.params;
      const path = req.path.replace(`/api/${service}`, '');
      
      try {
        // Check cache for GET requests
        if (req.method === 'GET') {
          const cacheKey = `${service}:${path}:${JSON.stringify(req.query)}`;
          const cached = await this.getCachedResponse(cacheKey);
          
          if (cached) {
            return res.json({ ...cached, cached: true });
          }
        }

        // Call microservice
        const result = await this.callService(
          service,
          path,
          req.method,
          req.body,
          req.headers
        );

        // Cache GET responses
        if (req.method === 'GET') {
          const cacheKey = `${service}:${path}:${JSON.stringify(req.query)}`;
          await this.setCachedResponse(cacheKey, result);
        }

        res.json(result);
      } catch (error) {
        res.status(error.response?.status || 500).json({
          error: error.message,
          service,
          requestId: req.requestId
        });
      }
    });

    // Aggregation endpoint - combine data from multiple services
    this.app.get('/api/dashboard/:userId', async (req, res) => {
      const { userId } = req.params;
      
      try {
        const [user, orders, recommendations] = await Promise.all([
          this.callService('users', `/users/${userId}`),
          this.callService('orders', `/orders/user/${userId}`),
          this.callService('recommendations', `/recommendations/${userId}`)
        ]);

        res.json({
          user,
          recentOrders: orders.slice(0, 5),
          recommendations: recommendations.slice(0, 10),
          requestId: req.requestId
        });
      } catch (error) {
        res.status(500).json({
          error: 'Failed to load dashboard data',
          requestId: req.requestId
        });
      }
    });

    // Health check for all services
    this.app.get('/health', async (req, res) => {
      const healthChecks = {};
      
      for (const [name, service] of this.services) {
        try {
          await axios.get(`${service.url}${service.healthCheck}`, { timeout: 2000 });
          healthChecks[name] = 'healthy';
        } catch (error) {
          healthChecks[name] = 'unhealthy';
        }
      }

      const allHealthy = Object.values(healthChecks).every(status => status === 'healthy');
      
      res.status(allHealthy ? 200 : 503).json({
        status: allHealthy ? 'healthy' : 'degraded',
        services: healthChecks,
        timestamp: new Date().toISOString()
      });
    });
  }

  start(port = 3000) {
    this.app.listen(port, () => {
      console.log(`API Gateway running on port ${port}`);
    });
  }
}

// Usage
const gateway = new APIGateway();

// Register services
gateway.registerService('users', {
  url: 'http://localhost:3001',
  timeout: 5000
});

gateway.registerService('orders', {
  url: 'http://localhost:3002',
  timeout: 3000
});

gateway.registerService('recommendations', {
  url: 'http://localhost:3003',
  timeout: 2000
});

gateway.start(3000);
```

### 3. Microservice Examples (Backend Services)

#### User Service (Port 3001)
```javascript
const express = require('express');
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'users' });
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.listen(3001, () => {
  console.log('User service running on port 3001');
});
```

#### Order Service (Port 3002)
```javascript
const express = require('express');
const app = express();

app.use(express.json());

const orders = [
  { id: 1, userId: 1, product: 'Laptop', amount: 999.99, status: 'completed' },
  { id: 2, userId: 1, product: 'Mouse', amount: 29.99, status: 'pending' },
  { id: 3, userId: 2, product: 'Keyboard', amount: 79.99, status: 'completed' }
];

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'orders' });
});

app.get('/orders', (req, res) => {
  res.json(orders);
});

app.get('/orders/user/:userId', (req, res) => {
  const userOrders = orders.filter(o => o.userId === parseInt(req.params.userId));
  res.json(userOrders);
});

app.post('/orders', (req, res) => {
  const newOrder = {
    id: orders.length + 1,
    ...req.body,
    status: 'pending'
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.listen(3002, () => {
  console.log('Order service running on port 3002');
});
```

### 4. Client Usage Examples

```javascript
// Frontend client code
class APIClient {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User operations
  async getUsers() {
    return this.request('/api/users');
  }

  async getUser(id) {
    return this.request(`/api/users/${id}`);
  }

  async createUser(userData) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // Order operations
  async getUserOrders(userId) {
    return this.request(`/api/orders/user/${userId}`);
  }

  async createOrder(orderData) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  // Dashboard data
  async getDashboard(userId) {
    return this.request(`/api/dashboard/${userId}`);
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }
}

// Usage
const api = new APIClient();

// Get dashboard data
api.getDashboard(1)
  .then(data => {
    console.log('Dashboard data:', data);
  })
  .catch(error => {
    console.error('Failed to load dashboard:', error);
  });

// Create new user
api.createUser({ name: 'Bob Wilson', email: 'bob@example.com' })
  .then(user => {
    console.log('User created:', user);
  })
  .catch(error => {
    console.error('Failed to create user:', error);
  });
```

## Popular API Gateway Solutions

### 1. **Express Gateway**
```bash
npm install -g express-gateway
eg create
```

### 2. **Kong (with Node.js plugins)**
```javascript
// Custom Kong plugin in Node.js
const kong = require('kong-plugin');

module.exports = kong.create({
  name: 'custom-auth',
  handler: function(req, res, next) {
    // Custom authentication logic
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  }
});
```

### 3. **AWS API Gateway with Lambda**
```javascript
// Lambda function for API Gateway
exports.handler = async (event) => {
  const { httpMethod, path, body } = event;
  
  try {
    // Route to appropriate microservice
    const result = await routeRequest(httpMethod, path, body);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

## Best Practices

1. **Keep Gateway Lightweight** - Don't put business logic in gateway
2. **Implement Circuit Breakers** - Prevent cascade failures
3. **Use Caching Wisely** - Cache frequently accessed, rarely changing data
4. **Monitor Everything** - Track latency, errors, and throughput
5. **Version Your APIs** - Support multiple API versions
6. **Implement Proper Error Handling** - Return meaningful error messages
7. **Use Load Balancing** - Distribute traffic across service instances
8. **Secure by Default** - Always validate and sanitize inputs

## Interview Tips

- **Explain the problem it solves**: Centralized entry point for microservices
- **Know the trade-offs**: Single point of failure vs. simplified client code
- **Understand patterns**: Circuit breaker, bulkhead, timeout patterns
- **Be familiar with tools**: Express Gateway, Kong, AWS API Gateway
- **Discuss scalability**: How to scale gateway horizontally

This comprehensive guide covers API Gateways from basic concepts to advanced implementations, perfect for both understanding and interview preparation!