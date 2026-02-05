/**
 * SINGLETON PATTERN
 * Real-World Example: Application Logger (like Winston)
 * 
 * WHEN TO USE:
 * - Database connections
 * - Configuration objects
 * - Logging services
 * - Cache managers
 * - Application state management
 * 
 * WHY TO USE:
 * - Resource control: Ensures single instance of expensive resources
 * - Global access: Provides single point of access
 * - Memory efficiency: Prevents multiple instances
 * - State consistency: Maintains single source of truth
 */

// Like Winston logger - only one instance across entire app
class Logger {
  constructor() {
    if (Logger.instance) return Logger.instance;
    
    this.logs = [];
    this.level = 'info';
    this.maxLogs = 100;
    Logger.instance = this;
  }
  
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, level };
    
    this.logs.push(logEntry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
  }
  
  error(message) { 
    this.log(message, 'error'); 
  }
  
  warn(message) { 
    this.log(message, 'warn'); 
  }
  
  info(message) { 
    this.log(message, 'info'); 
  }
  
  debug(message) { 
    this.log(message, 'debug'); 
  }
  
  getLogs() {
    return [...this.logs]; // Return copy
  }
  
  getLogCount() {
    return this.logs.length;
  }
  
  clearLogs() {
    this.logs = [];
    console.log('Logs cleared');
  }
}

// Usage Examples
console.log('=== SINGLETON PATTERN DEMO ===');

// Same logger instance everywhere
const logger1 = new Logger();
const logger2 = new Logger();
const logger3 = new Logger();

console.log('Are all instances the same?', logger1 === logger2 === logger3); // true

// All loggers share the same log array
logger1.info('User logged in');
logger2.error('Database connection failed');
logger3.warn('Low memory warning');
logger1.debug('Processing user data');

console.log('Total logs from logger1:', logger1.getLogCount()); // 4
console.log('Total logs from logger2:', logger2.getLogCount()); // 4 (same instance)

// Demonstrate shared state
console.log('Logs from logger3:', logger3.getLogs().length); // 4 (same logs)

// Clear logs from any instance affects all
logger2.clearLogs();
console.log('Logs after clearing from logger2:', logger1.getLogCount()); // 0

// Real-world usage in different modules
class UserService {
  constructor() {
    this.logger = new Logger(); // Gets same instance
  }
  
  createUser(username) {
    this.logger.info(`Creating user: ${username}`);
    // User creation logic...
    this.logger.info(`User ${username} created successfully`);
  }
}

class DatabaseService {
  constructor() {
    this.logger = new Logger(); // Gets same instance
  }
  
  connect() {
    this.logger.info('Connecting to database...');
    // Connection logic...
    this.logger.info('Database connected');
  }
  
  disconnect() {
    this.logger.warn('Disconnecting from database');
  }
}

// Usage across different services
const userService = new UserService();
const dbService = new DatabaseService();

dbService.connect();
userService.createUser('john_doe');
dbService.disconnect();

console.log('Final log count:', logger1.getLogCount()); // All logs from different services