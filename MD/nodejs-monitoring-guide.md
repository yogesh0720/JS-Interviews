# Node.js Application Monitoring: Logs, Metrics & Error Tracking

## Overview

Monitoring is crucial for production Node.js applications. This guide covers comprehensive monitoring strategies including:

- **Application Logs** - Track application behavior and debug issues
- **System Metrics** - Monitor CPU, memory, disk, network usage
- **Error Tracking** - Capture and analyze application errors
- **Performance Metrics** - Track response times, throughput, latency
- **Business Metrics** - Monitor user actions, conversions, revenue

---

## 1. Application Logging

### Winston Logger Setup

```javascript
// logger.js - Comprehensive logging setup
const winston = require('winston');
const path = require('path');

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'my-app',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File outputs
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 10
    }),
    
    // Separate file for audit logs
    new winston.transports.File({
      filename: path.join('logs', 'audit.log'),
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join('logs', 'exceptions.log') })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join('logs', 'rejections.log') })
  ]
});

// Add request ID to logs
logger.addRequestId = (req, res, next) => {
  req.requestId = Math.random().toString(36).substr(2, 9);
  req.logger = logger.child({ requestId: req.requestId });
  next();
};

// Structured logging methods
logger.logUserAction = (userId, action, details = {}) => {
  logger.info('User action', {
    userId,
    action,
    details,
    category: 'user_action'
  });
};

logger.logAPICall = (method, url, statusCode, responseTime, userId = null) => {
  logger.info('API call', {
    method,
    url,
    statusCode,
    responseTime,
    userId,
    category: 'api_call'
  });
};

logger.logError = (error, context = {}) => {
  logger.error('Application error', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    context,
    category: 'error'
  });
};

logger.logPerformance = (operation, duration, metadata = {}) => {
  logger.info('Performance metric', {
    operation,
    duration,
    metadata,
    category: 'performance'
  });
};

module.exports = logger;
```

### Express Middleware for Request Logging

```javascript
// middleware/logging.js - Request logging middleware
const logger = require('../logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Add request ID
  req.requestId = Math.random().toString(36).substr(2, 9);
  res.setHeader('X-Request-ID', req.requestId);
  
  // Log request
  logger.info('Incoming request', {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id || null
  });
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    
    logger.info('Request completed', {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: duration,
      userId: req.user?.id || null
    });
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error('Request error', {
    requestId: req.requestId,
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    },
    method: req.method,
    url: req.url,
    userId: req.user?.id || null,
    body: req.body,
    params: req.params,
    query: req.query
  });
  
  next(err);
};

module.exports = { requestLogger, errorLogger };
```

---

## 2. Metrics Collection with Prometheus

```javascript
// metrics.js - Prometheus metrics setup
const client = require('prom-client');

// Create a Registry
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({
  register,
  timeout: 5000,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
});

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register]
});

const databaseConnections = new client.Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections',
  registers: [register]
});

const businessMetrics = {
  userRegistrations: new client.Counter({
    name: 'user_registrations_total',
    help: 'Total number of user registrations',
    registers: [register]
  }),
  
  orderValue: new client.Histogram({
    name: 'order_value_dollars',
    help: 'Order value in dollars',
    buckets: [10, 50, 100, 500, 1000, 5000],
    registers: [register]
  }),
  
  loginAttempts: new client.Counter({
    name: 'login_attempts_total',
    help: 'Total login attempts',
    labelNames: ['status'],
    registers: [register]
  })
};

// Middleware to collect HTTP metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  activeConnections.inc();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
      
    httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc();
      
    activeConnections.dec();
  });
  
  next();
};

// Business metrics helpers
const trackUserRegistration = () => {
  businessMetrics.userRegistrations.inc();
};

const trackOrderValue = (value) => {
  businessMetrics.orderValue.observe(value);
};

const trackLoginAttempt = (success) => {
  businessMetrics.loginAttempts.labels(success ? 'success' : 'failure').inc();
};

module.exports = {
  register,
  metricsMiddleware,
  trackUserRegistration,
  trackOrderValue,
  trackLoginAttempt,
  databaseConnections
};
```

---

## 3. Error Tracking with Sentry

```javascript
// error-tracking.js - Sentry integration
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const logger = require('./logger');

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app: require('./app') }),
  ],
  
  beforeSend(event, hint) {
    // Filter out certain errors
    if (event.exception) {
      const error = hint.originalException;
      
      // Don't send validation errors to Sentry
      if (error.name === 'ValidationError') {
        return null;
      }
      
      // Don't send 404 errors
      if (error.status === 404) {
        return null;
      }
    }
    
    return event;
  }
});

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 400);
    this.field = field;
    this.name = 'ValidationError';
  }
}

class DatabaseError extends AppError {
  constructor(message, query) {
    super(message, 500);
    this.query = query;
    this.name = 'DatabaseError';
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.logError(err, {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    userId: req.user?.id,
    body: req.body,
    params: req.params
  });
  
  // Send to Sentry for non-operational errors
  if (!err.isOperational) {
    Sentry.captureException(err, {
      tags: {
        component: 'error_handler'
      },
      user: {
        id: req.user?.id,
        ip_address: req.ip
      },
      extra: {
        requestId: req.requestId,
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params
      }
    });
  }
  
  // Send response
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      message,
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    }
  });
};

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  Sentry.captureException(reason);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error });
  Sentry.captureException(error);
  process.exit(1);
});

module.exports = {
  Sentry,
  AppError,
  ValidationError,
  DatabaseError,
  errorHandler
};
```

---

## 4. System Monitoring

```javascript
// system-monitor.js - System resource monitoring
const os = require('os');
const fs = require('fs').promises;
const logger = require('./logger');
const { databaseConnections } = require('./metrics');

class SystemMonitor {
  constructor() {
    this.metrics = {
      cpu: 0,
      memory: {},
      disk: {},
      network: {},
      processes: {}
    };
    
    this.startMonitoring();
  }
  
  startMonitoring() {
    // Monitor every 30 seconds
    setInterval(() => {
      this.collectMetrics();
    }, 30000);
    
    // Initial collection
    this.collectMetrics();
  }
  
  async collectMetrics() {
    try {
      // CPU Usage
      this.metrics.cpu = await this.getCPUUsage();
      
      // Memory Usage
      this.metrics.memory = this.getMemoryUsage();
      
      // Disk Usage
      this.metrics.disk = await this.getDiskUsage();
      
      // Process Info
      this.metrics.processes = this.getProcessInfo();
      
      // Log metrics
      logger.info('System metrics', {
        category: 'system_metrics',
        metrics: this.metrics
      });
      
      // Check for alerts
      this.checkAlerts();
      
    } catch (error) {
      logger.error('Failed to collect system metrics', { error });
    }
  }
  
  async getCPUUsage() {
    return new Promise((resolve) => {
      const startMeasure = this.cpuAverage();
      
      setTimeout(() => {
        const endMeasure = this.cpuAverage();
        const idleDifference = endMeasure.idle - startMeasure.idle;
        const totalDifference = endMeasure.total - startMeasure.total;
        const percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
        
        resolve(percentageCPU);
      }, 1000);
    });
  }
  
  cpuAverage() {
    const cpus = os.cpus();
    let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;
    
    for (let cpu of cpus) {
      user += cpu.times.user;
      nice += cpu.times.nice;
      sys += cpu.times.sys;
      idle += cpu.times.idle;
      irq += cpu.times.irq;
    }
    
    const total = user + nice + sys + idle + irq;
    return { idle, total };
  }
  
  getMemoryUsage() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    return {
      total: Math.round(totalMem / 1024 / 1024), // MB
      free: Math.round(freeMem / 1024 / 1024), // MB
      used: Math.round(usedMem / 1024 / 1024), // MB
      percentage: Math.round((usedMem / totalMem) * 100)
    };
  }
  
  async getDiskUsage() {
    try {
      const stats = await fs.stat('.');
      // This is a simplified version - in production, use a proper disk usage library
      return {
        available: 'N/A', // Would need platform-specific implementation
        used: 'N/A',
        percentage: 0
      };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  getProcessInfo() {
    const memUsage = process.memoryUsage();
    
    return {
      pid: process.pid,
      uptime: Math.round(process.uptime()),
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024) // MB
      },
      cpu: process.cpuUsage()
    };
  }
  
  checkAlerts() {
    const { cpu, memory } = this.metrics;
    
    // CPU Alert
    if (cpu > 80) {
      logger.warn('High CPU usage detected', {
        category: 'alert',
        type: 'high_cpu',
        value: cpu
      });
    }
    
    // Memory Alert
    if (memory.percentage > 85) {
      logger.warn('High memory usage detected', {
        category: 'alert',
        type: 'high_memory',
        value: memory.percentage
      });
    }
    
    // Process memory alert
    if (this.metrics.processes.memory.heapUsed > 500) { // 500MB
      logger.warn('High process memory usage', {
        category: 'alert',
        type: 'high_process_memory',
        value: this.metrics.processes.memory.heapUsed
      });
    }
  }
  
  getMetrics() {
    return this.metrics;
  }
}

module.exports = new SystemMonitor();
```

---

## 5. Health Checks

```javascript
// health-check.js - Comprehensive health monitoring
const logger = require('./logger');
const systemMonitor = require('./system-monitor');

class HealthChecker {
  constructor() {
    this.checks = new Map();
    this.setupDefaultChecks();
  }
  
  setupDefaultChecks() {
    // Database health check
    this.addCheck('database', async () => {
      const { Pool } = require('pg');
      const pool = new Pool(); // Your DB config
      
      try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        return { status: 'healthy', responseTime: Date.now() };
      } catch (error) {
        return { 
          status: 'unhealthy', 
          error: error.message,
          responseTime: Date.now()
        };
      }
    });
    
    // Redis health check
    this.addCheck('redis', async () => {
      const redis = require('redis');
      const client = redis.createClient();
      
      try {
        await client.ping();
        return { status: 'healthy', responseTime: Date.now() };
      } catch (error) {
        return { 
          status: 'unhealthy', 
          error: error.message,
          responseTime: Date.now()
        };
      }
    });
    
    // External API health check
    this.addCheck('external-api', async () => {
      const axios = require('axios');
      
      try {
        const start = Date.now();
        await axios.get('https://api.external-service.com/health', {
          timeout: 5000
        });
        const responseTime = Date.now() - start;
        
        return { 
          status: 'healthy', 
          responseTime 
        };
      } catch (error) {
        return { 
          status: 'unhealthy', 
          error: error.message,
          responseTime: Date.now()
        };
      }
    });
    
    // System resources check
    this.addCheck('system', async () => {
      const metrics = systemMonitor.getMetrics();
      const issues = [];
      
      if (metrics.cpu > 90) issues.push('High CPU usage');
      if (metrics.memory.percentage > 90) issues.push('High memory usage');
      
      return {
        status: issues.length === 0 ? 'healthy' : 'degraded',
        issues,
        metrics: {
          cpu: metrics.cpu,
          memory: metrics.memory.percentage
        }
      };
    });
  }
  
  addCheck(name, checkFunction) {
    this.checks.set(name, checkFunction);
  }
  
  async runCheck(name) {
    const check = this.checks.get(name);
    if (!check) {
      throw new Error(`Health check '${name}' not found`);
    }
    
    const start = Date.now();
    try {
      const result = await check();
      const duration = Date.now() - start;
      
      return {
        ...result,
        duration,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const duration = Date.now() - start;
      
      return {
        status: 'unhealthy',
        error: error.message,
        duration,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  async runAllChecks() {
    const results = {};
    const promises = [];
    
    for (const [name] of this.checks) {
      promises.push(
        this.runCheck(name).then(result => {
          results[name] = result;
        })
      );
    }
    
    await Promise.all(promises);
    
    // Determine overall health
    const allHealthy = Object.values(results).every(
      result => result.status === 'healthy'
    );
    
    const overallStatus = allHealthy ? 'healthy' : 
      Object.values(results).some(result => result.status === 'unhealthy') ? 
      'unhealthy' : 'degraded';
    
    const healthReport = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: results,
      uptime: process.uptime(),
      version: process.env.APP_VERSION || '1.0.0'
    };
    
    // Log health status
    logger.info('Health check completed', {
      category: 'health_check',
      status: overallStatus,
      results
    });
    
    return healthReport;
  }
}

module.exports = new HealthChecker();
```

---

## 6. Complete Express App Integration

```javascript
// app.js - Complete monitoring integration
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Monitoring imports
const logger = require('./logger');
const { requestLogger, errorLogger } = require('./middleware/logging');
const { metricsMiddleware, register, trackUserRegistration, trackLoginAttempt } = require('./metrics');
const { Sentry, errorHandler, ValidationError } = require('./error-tracking');
const healthChecker = require('./health-check');
const systemMonitor = require('./system-monitor');

const app = express();

// Sentry request handler (must be first)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));

// Monitoring middleware
app.use(logger.addRequestId);
app.use(requestLogger);
app.use(metricsMiddleware);

// Routes
app.get('/health', async (req, res) => {
  try {
    const health = await healthChecker.runAllChecks();
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;
    
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check failed', { error });
    res.status(500).json({ 
      status: 'error', 
      message: 'Health check failed' 
    });
  }
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

app.get('/system-metrics', (req, res) => {
  const metrics = systemMonitor.getMetrics();
  res.json(metrics);
});

// Sample API routes with monitoring
app.post('/api/users/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      throw new ValidationError('Missing required fields');
    }
    
    // Simulate user creation
    const user = { id: Date.now(), name, email };
    
    // Track business metric
    trackUserRegistration();
    
    // Log user action
    logger.logUserAction(user.id, 'register', { email });
    
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Simulate authentication
    const success = Math.random() > 0.1; // 90% success rate
    
    // Track login attempt
    trackLoginAttempt(success);
    
    if (success) {
      const user = { id: Date.now(), email };
      logger.logUserAction(user.id, 'login', { email });
      res.json({ user, token: 'jwt-token' });
    } else {
      throw new ValidationError('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use(errorLogger);
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    requestId: req.requestId
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`, {
    category: 'startup',
    port: PORT,
    environment: process.env.NODE_ENV
  });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully`);
  
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
```

---

## 7. Log Analysis & Alerting

### ELK Stack Configuration

```yaml
# docker-compose.yml - ELK Stack setup
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.15.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:7.15.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5044:5044"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:7.15.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

### Logstash Configuration

```ruby
# logstash.conf - Log processing pipeline
input {
  file {
    path => "/app/logs/*.log"
    start_position => "beginning"
    codec => "json"
  }
}

filter {
  if [level] == "error" {
    mutate {
      add_tag => ["error"]
    }
  }
  
  if [category] == "api_call" {
    mutate {
      add_tag => ["api"]
    }
  }
  
  if [responseTime] {
    if [responseTime] > 1000 {
      mutate {
        add_tag => ["slow_request"]
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "app-logs-%{+YYYY.MM.dd}"
  }
  
  if "error" in [tags] {
    email {
      to => "alerts@company.com"
      subject => "Application Error Alert"
      body => "Error: %{message}"
    }
  }
}
```

---

## 8. Monitoring Dashboard Setup

### Grafana Dashboard Configuration

```json
{
  "dashboard": {
    "title": "Node.js Application Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      },
      {
        "title": "System Resources",
        "type": "graph",
        "targets": [
          {
            "expr": "process_resident_memory_bytes",
            "legendFormat": "Memory Usage"
          },
          {
            "expr": "rate(process_cpu_seconds_total[5m]) * 100",
            "legendFormat": "CPU Usage %"
          }
        ]
      }
    ]
  }
}
```

---

## 9. Alerting Rules

### Prometheus Alerting Rules

```yaml
# alerts.yml - Prometheus alerting rules
groups:
  - name: nodejs-app
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }} seconds"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes > 500000000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value }} bytes"

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "Service has been down for more than 1 minute"
```

---

## 10. Best Practices & Tips

### Logging Best Practices

1. **Use Structured Logging** - JSON format for easy parsing
2. **Include Context** - Request IDs, user IDs, timestamps
3. **Log Levels** - Use appropriate levels (error, warn, info, debug)
4. **Avoid Sensitive Data** - Don't log passwords, tokens, PII
5. **Performance** - Use async logging to avoid blocking

### Metrics Best Practices

1. **RED Method** - Rate, Errors, Duration
2. **USE Method** - Utilization, Saturation, Errors
3. **Business Metrics** - Track user actions, conversions
4. **Cardinality** - Avoid high-cardinality labels
5. **Retention** - Set appropriate retention policies

### Error Tracking Best Practices

1. **Error Classification** - Operational vs Programming errors
2. **Context** - Include request details, user info
3. **Filtering** - Don't send validation errors to error tracking
4. **Rate Limiting** - Prevent spam from repeated errors
5. **Alerting** - Set up alerts for critical errors

### Monitoring Strategy

1. **Four Golden Signals** - Latency, Traffic, Errors, Saturation
2. **SLIs/SLOs** - Define service level indicators and objectives
3. **Alerting** - Alert on symptoms, not causes
4. **Dashboards** - Create role-specific dashboards
5. **Runbooks** - Document response procedures

This comprehensive monitoring setup provides visibility into your Node.js application's health, performance, and user behavior, enabling proactive issue detection and resolution.