/**
 * SINGLE RESPONSIBILITY PRINCIPLE (SRP)
 * "A class should have only one reason to change"
 * 
 * WHEN TO USE:
 * - When a class is doing multiple unrelated tasks
 * - When changes in one feature require modifying multiple classes
 * - When testing becomes complex due to multiple responsibilities
 * 
 * WHY IMPORTANT:
 * - Easier maintenance: Changes affect only one class
 * - Better testing: Each class can be tested independently
 * - Improved readability: Clear purpose for each class
 * - Reduced coupling: Classes depend on fewer things
 */

console.log('=== SINGLE RESPONSIBILITY PRINCIPLE ===\n');

// ❌ BAD EXAMPLE - Violates SRP
console.log('❌ BAD EXAMPLE (Violates SRP):');

class BadUser {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  // User data management
  getName() { return this.name; }
  getEmail() { return this.email; }
  
  // Email functionality (different responsibility)
  sendEmail(message) {
    console.log(`Sending email to ${this.email}: ${message}`);
  }
  
  // Database operations (different responsibility)
  save() {
    console.log(`Saving user ${this.name} to database`);
  }
  
  // Validation (different responsibility)
  validateEmail() {
    return this.email.includes('@');
  }
  
  // Logging (different responsibility)
  log(action) {
    console.log(`[${new Date().toISOString()}] User ${this.name}: ${action}`);
  }
}

const badUser = new BadUser('John Doe', 'john@example.com');
badUser.sendEmail('Welcome!');
badUser.save();
console.log('Email valid:', badUser.validateEmail());
badUser.log('User created');

console.log('\n' + '='.repeat(50) + '\n');

// ✅ GOOD EXAMPLE - Follows SRP
console.log('✅ GOOD EXAMPLE (Follows SRP):');

// Each class has single responsibility
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  getName() { return this.name; }
  getEmail() { return this.email; }
  setName(name) { this.name = name; }
  setEmail(email) { this.email = email; }
}

class EmailService {
  sendEmail(user, message) {
    console.log(`📧 Sending email to ${user.getEmail()}: ${message}`);
    return { success: true, messageId: 'msg_123' };
  }
  
  sendBulkEmail(users, message) {
    users.forEach(user => this.sendEmail(user, message));
  }
}

class UserRepository {
  constructor() {
    this.users = [];
  }
  
  save(user) {
    this.users.push(user);
    console.log(`💾 Saving user ${user.getName()} to database`);
    return { success: true, id: this.users.length };
  }
  
  findByEmail(email) {
    return this.users.find(user => user.getEmail() === email);
  }
  
  getAll() {
    return [...this.users];
  }
}

class EmailValidator {
  validate(email) {
    const isValid = email.includes('@') && email.includes('.');
    console.log(`✅ Email ${email} is ${isValid ? 'valid' : 'invalid'}`);
    return isValid;
  }
  
  validateDomain(email) {
    const domain = email.split('@')[1];
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
    return validDomains.includes(domain);
  }
}

class Logger {
  log(level, message) {
    const timestamp = new Date().toISOString();
    console.log(`📝 [${timestamp}] ${level.toUpperCase()}: ${message}`);
  }
  
  info(message) { this.log('info', message); }
  error(message) { this.log('error', message); }
  warn(message) { this.log('warn', message); }
}

// Usage - Each service has single responsibility
const user = new User('Jane Smith', 'jane@gmail.com');
const emailService = new EmailService();
const userRepository = new UserRepository();
const emailValidator = new EmailValidator();
const logger = new Logger();

// Each operation is handled by appropriate service
logger.info('Creating new user');

if (emailValidator.validate(user.getEmail())) {
  const saveResult = userRepository.save(user);
  
  if (saveResult.success) {
    emailService.sendEmail(user, 'Welcome to our platform!');
    logger.info(`User ${user.getName()} created successfully`);
  }
} else {
  logger.error('Invalid email provided');
}

console.log('\n=== REAL-WORLD EXAMPLE: E-COMMERCE ===');

// Real-world example: E-commerce order system
class Product {
  constructor(id, name, price, stock) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
  }
  
  getId() { return this.id; }
  getName() { return this.name; }
  getPrice() { return this.price; }
  getStock() { return this.stock; }
  
  reduceStock(quantity) {
    if (this.stock >= quantity) {
      this.stock -= quantity;
      return true;
    }
    return false;
  }
}

class Order {
  constructor(customerId) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.customerId = customerId;
    this.items = [];
    this.status = 'pending';
    this.createdAt = new Date();
  }
  
  addItem(product, quantity) {
    this.items.push({ product, quantity });
  }
  
  getTotal() {
    return this.items.reduce((total, item) => 
      total + (item.product.getPrice() * item.quantity), 0);
  }
  
  setStatus(status) { this.status = status; }
  getStatus() { return this.status; }
}

class InventoryService {
  checkAvailability(product, quantity) {
    const available = product.getStock() >= quantity;
    console.log(`📦 Product ${product.getName()}: ${available ? 'Available' : 'Out of stock'}`);
    return available;
  }
  
  reserveItems(order) {
    for (const item of order.items) {
      if (!item.product.reduceStock(item.quantity)) {
        console.log(`❌ Cannot reserve ${item.quantity} of ${item.product.getName()}`);
        return false;
      }
    }
    console.log('✅ All items reserved successfully');
    return true;
  }
}

class PaymentService {
  processPayment(order, paymentMethod) {
    const amount = order.getTotal();
    console.log(`💳 Processing payment of $${amount} via ${paymentMethod}`);
    
    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      console.log('✅ Payment processed successfully');
      return { success: true, transactionId: 'txn_' + Math.random().toString(36).substr(2, 9) };
    } else {
      console.log('❌ Payment failed');
      return { success: false, error: 'Payment declined' };
    }
  }
}

class OrderService {
  constructor(inventoryService, paymentService, logger) {
    this.inventoryService = inventoryService;
    this.paymentService = paymentService;
    this.logger = logger;
  }
  
  processOrder(order, paymentMethod) {
    this.logger.info(`Processing order ${order.id}`);
    
    // Check inventory
    if (!this.inventoryService.reserveItems(order)) {
      order.setStatus('failed');
      this.logger.error('Order failed - insufficient inventory');
      return { success: false, error: 'Insufficient inventory' };
    }
    
    // Process payment
    const paymentResult = this.paymentService.processPayment(order, paymentMethod);
    
    if (paymentResult.success) {
      order.setStatus('completed');
      this.logger.info(`Order ${order.id} completed successfully`);
      return { success: true, order, transactionId: paymentResult.transactionId };
    } else {
      order.setStatus('failed');
      this.logger.error(`Order ${order.id} failed - payment error`);
      return { success: false, error: paymentResult.error };
    }
  }
}

// Usage
const product1 = new Product(1, 'Laptop', 999, 5);
const product2 = new Product(2, 'Mouse', 29, 10);

const order = new Order('customer_123');
order.addItem(product1, 1);
order.addItem(product2, 2);

const inventoryService = new InventoryService();
const paymentService = new PaymentService();
const orderLogger = new Logger();

const orderService = new OrderService(inventoryService, paymentService, orderLogger);

console.log(`\n🛒 Processing order total: $${order.getTotal()}`);
const result = orderService.processOrder(order, 'Credit Card');

if (result.success) {
  console.log(`🎉 Order completed! Transaction ID: ${result.transactionId}`);
} else {
  console.log(`😞 Order failed: ${result.error}`);
}

console.log('\n=== SRP BENEFITS DEMONSTRATED ===');
console.log('✅ Each class has single, clear responsibility');
console.log('✅ Easy to test each component independently');
console.log('✅ Changes to email logic don\'t affect user data');
console.log('✅ Can swap implementations easily (e.g., different databases)');
console.log('✅ Code is more readable and maintainable');