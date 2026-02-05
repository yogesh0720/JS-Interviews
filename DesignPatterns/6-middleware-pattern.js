/**
 * MIDDLEWARE PATTERN
 * Real-World Example: Airport Security Check
 * 
 * WHEN TO USE:
 * - Request/response processing (Express.js)
 * - Data transformation pipelines
 * - Authentication/authorization
 * - Logging and monitoring
 * - Input validation
 * 
 * WHY TO USE:
 * - Modularity: Separate concerns into discrete functions
 * - Reusability: Middleware can be reused across routes
 * - Flexibility: Easy to add/remove/reorder middleware
 * - Separation of concerns: Each middleware has single responsibility
 */

// Like airport security - passenger goes through multiple checkpoints
class AirportSecurity {
  constructor() {
    this.checkpoints = [];
  }
  
  addCheckpoint(checkpoint) {
    this.checkpoints.push(checkpoint);
  }
  
  async processPassenger(passenger) {
    let currentIndex = 0;
    
    const proceedToNext = async () => {
      if (currentIndex < this.checkpoints.length) {
        const checkpoint = this.checkpoints[currentIndex++];
        await checkpoint(passenger, proceedToNext);
      } else {
        console.log(`✈️  ${passenger.name} cleared all security - boarding allowed!`);
      }
    };
    
    await proceedToNext();
  }
}

// Security checkpoints (middleware functions)
const ticketCheck = async (passenger, next) => {
  console.log(`🎫 Checking ${passenger.name}'s ticket...`);
  
  if (passenger.hasTicket) {
    console.log('✅ Ticket valid');
    passenger.ticketVerified = true;
    await next(); // Proceed to next checkpoint
  } else {
    console.log('❌ No valid ticket - access denied');
    // Don't call next() - stops the chain
  }
};

const idVerification = async (passenger, next) => {
  console.log(`🆔 Verifying ${passenger.name}'s ID...`);
  
  // Simulate ID check delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('✅ ID verified');
  passenger.idVerified = true;
  await next();
};

const securityScan = async (passenger, next) => {
  console.log(`🔍 Security scanning ${passenger.name}...`);
  
  // Simulate security scan
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (Math.random() > 0.1) { // 90% pass rate
    console.log('✅ Security scan clear');
    passenger.securityCleared = true;
    await next();
  } else {
    console.log('⚠️  Additional screening required');
    passenger.additionalScreening = true;
    await next(); // Still proceed but flagged
  }
};

const customsCheck = async (passenger, next) => {
  console.log(`🛃 Customs check for ${passenger.name}...`);
  
  if (passenger.hasRestrictedItems) {
    console.log('⚠️  Restricted items found - confiscated');
    passenger.hasRestrictedItems = false;
  } else {
    console.log('✅ No restricted items');
  }
  
  passenger.customsCleared = true;
  await next();
};

// Usage Examples
console.log('=== MIDDLEWARE PATTERN DEMO ===');

// Like Express.js middleware
const airport = new AirportSecurity();
airport.addCheckpoint(ticketCheck);
airport.addCheckpoint(idVerification);
airport.addCheckpoint(securityScan);
airport.addCheckpoint(customsCheck);

// Process different passengers
const passengers = [
  { name: 'John', hasTicket: true, hasRestrictedItems: false },
  { name: 'Sarah', hasTicket: true, hasRestrictedItems: true },
  { name: 'Mike', hasTicket: false, hasRestrictedItems: false }
];

async function processAllPassengers() {
  for (const passenger of passengers) {
    console.log(`\n--- Processing ${passenger.name} ---`);
    await airport.processPassenger(passenger);
    console.log(`Final status for ${passenger.name}:`, passenger);
  }
}

// Express.js-like middleware example
class WebServer {
  constructor() {
    this.middleware = [];
  }
  
  use(middlewareFunction) {
    this.middleware.push(middlewareFunction);
  }
  
  async handleRequest(request) {
    let index = 0;
    
    const next = async () => {
      if (index < this.middleware.length) {
        const middleware = this.middleware[index++];
        await middleware(request, next);
      }
    };
    
    await next();
    return request;
  }
}

// Web middleware functions
const authMiddleware = async (req, next) => {
  console.log('🔐 Authentication middleware');
  
  if (req.headers.authorization) {
    req.user = { id: 1, name: 'John Doe' };
    console.log('✅ User authenticated');
  } else {
    req.user = null;
    console.log('❌ No authentication token');
  }
  
  await next();
};

const loggingMiddleware = async (req, next) => {
  console.log('📝 Logging middleware');
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  req.timestamp = Date.now();
  await next();
};

const rateLimitMiddleware = async (req, next) => {
  console.log('⏱️  Rate limiting middleware');
  
  // Simulate rate limit check
  if (Math.random() > 0.2) { // 80% pass rate
    console.log('✅ Rate limit OK');
    await next();
  } else {
    console.log('❌ Rate limit exceeded');
    req.rateLimited = true;
    // Still call next() but mark as rate limited
    await next();
  }
};

const validationMiddleware = async (req, next) => {
  console.log('✔️  Validation middleware');
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('✅ Request body valid');
    req.validated = true;
  } else {
    console.log('⚠️  Empty request body');
    req.validated = false;
  }
  
  await next();
};

// Data processing pipeline example
class DataPipeline {
  constructor() {
    this.processors = [];
  }
  
  addProcessor(processor) {
    this.processors.push(processor);
  }
  
  async process(data) {
    let index = 0;
    
    const next = async () => {
      if (index < this.processors.length) {
        const processor = this.processors[index++];
        await processor(data, next);
      }
    };
    
    await next();
    return data;
  }
}

// Data processors
const validateData = async (data, next) => {
  console.log('🔍 Validating data...');
  data.isValid = data.value !== undefined && data.value !== null;
  console.log(`Validation result: ${data.isValid ? 'Valid' : 'Invalid'}`);
  await next();
};

const transformData = async (data, next) => {
  console.log('🔄 Transforming data...');
  if (data.isValid && typeof data.value === 'string') {
    data.value = data.value.toUpperCase();
    console.log(`Transformed value: ${data.value}`);
  }
  await next();
};

const enrichData = async (data, next) => {
  console.log('➕ Enriching data...');
  data.timestamp = new Date().toISOString();
  data.processedBy = 'DataPipeline v1.0';
  console.log('Data enriched with metadata');
  await next();
};

// Run examples
async function runExamples() {
  // Airport security example
  await processAllPassengers();
  
  // Web server middleware example
  console.log('\n=== WEB SERVER MIDDLEWARE ===');
  const server = new WebServer();
  server.use(loggingMiddleware);
  server.use(authMiddleware);
  server.use(rateLimitMiddleware);
  server.use(validationMiddleware);
  
  const request = {
    method: 'POST',
    url: '/api/users',
    headers: { authorization: 'Bearer token123' },
    body: { name: 'John', email: 'john@example.com' }
  };
  
  const processedRequest = await server.handleRequest(request);
  console.log('Final request object:', processedRequest);
  
  // Data pipeline example
  console.log('\n=== DATA PROCESSING PIPELINE ===');
  const pipeline = new DataPipeline();
  pipeline.addProcessor(validateData);
  pipeline.addProcessor(transformData);
  pipeline.addProcessor(enrichData);
  
  const inputData = { value: 'hello world' };
  const processedData = await pipeline.process(inputData);
  console.log('Final processed data:', processedData);
}

runExamples();