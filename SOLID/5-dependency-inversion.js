/**
 * DEPENDENCY INVERSION PRINCIPLE (DIP)
 * "High-level modules should not depend on low-level modules. Both should depend on abstractions."
 * 
 * WHEN TO USE:
 * - When you want to switch implementations easily
 * - When writing testable code
 * - When building modular applications
 * 
 * WHY IMPORTANT:
 * - Flexibility: Easy to swap implementations
 * - Testability: Easy to inject mocks
 * - Maintainability: Changes in low-level modules don't affect high-level ones
 * - Reusability: High-level modules can work with different implementations
 */

console.log('=== DEPENDENCY INVERSION PRINCIPLE ===\n');

// ❌ BAD EXAMPLE - Violates DIP
console.log('❌ BAD EXAMPLE (Violates DIP):');

// High-level class depends directly on low-level implementation ❌
class BadMySQLDatabase {
  save(data) {
    console.log('💾 Saving to MySQL database:', data);
    return { success: true, id: Math.random().toString(36).substr(2, 9) };
  }
  
  find(id) {
    console.log('🔍 Finding in MySQL database:', id);
    return { id, data: 'MySQL data' };
  }
}

class BadUserService {
  constructor() {
    this.database = new BadMySQLDatabase(); // Direct dependency ❌
  }
  
  createUser(userData) {
    console.log('👤 Creating user in service layer');
    const user = { ...userData, id: Date.now(), createdAt: new Date() };
    return this.database.save(user); // Tightly coupled ❌
  }
  
  getUser(id) {
    console.log('👤 Getting user from service layer');
    return this.database.find(id); // Tightly coupled ❌
  }
}

// Usage - Cannot easily switch database implementations
const badUserService = new BadUserService();
badUserService.createUser({ name: 'John', email: 'john@example.com' });

console.log('❌ Problems with this approach:');
console.log('  - Cannot easily switch to MongoDB or other databases');
console.log('  - Hard to test (cannot mock database)');
console.log('  - UserService is tightly coupled to MySQL');
console.log('  - Changes in MySQL implementation affect UserService');

console.log('\n' + '='.repeat(50) + '\n');

// ✅ GOOD EXAMPLE - Follows DIP
console.log('✅ GOOD EXAMPLE (Follows DIP):');

// Abstraction (interface) that both high and low-level modules depend on ✅
class Database {
  save(data) {
    throw new Error('save method must be implemented');
  }
  
  find(id) {
    throw new Error('find method must be implemented');
  }
  
  findAll() {
    throw new Error('findAll method must be implemented');
  }
  
  update(id, data) {
    throw new Error('update method must be implemented');
  }
  
  delete(id) {
    throw new Error('delete method must be implemented');
  }
}

// Low-level implementations depend on abstraction ✅
class MySQLDatabase extends Database {
  constructor() {
    super();
    this.data = new Map();
  }
  
  save(data) {
    const id = 'mysql_' + Math.random().toString(36).substr(2, 9);
    this.data.set(id, data);
    console.log('💾 Saving to MySQL database:', { id, ...data });
    return { success: true, id };
  }
  
  find(id) {
    const data = this.data.get(id);
    console.log('🔍 Finding in MySQL database:', id);
    return data ? { id, ...data } : null;
  }
  
  findAll() {
    console.log('📋 Getting all records from MySQL');
    return Array.from(this.data.entries()).map(([id, data]) => ({ id, ...data }));
  }
  
  update(id, newData) {
    if (this.data.has(id)) {
      this.data.set(id, { ...this.data.get(id), ...newData });
      console.log('✏️ Updated in MySQL database:', id);
      return { success: true };
    }
    return { success: false, error: 'Record not found' };
  }
  
  delete(id) {
    const deleted = this.data.delete(id);
    console.log('🗑️ Deleted from MySQL database:', id);
    return { success: deleted };
  }
}

class MongoDatabase extends Database {
  constructor() {
    super();
    this.data = new Map();
  }
  
  save(data) {
    const id = 'mongo_' + Math.random().toString(36).substr(2, 9);
    this.data.set(id, data);
    console.log('🍃 Saving to MongoDB:', { id, ...data });
    return { success: true, id };
  }
  
  find(id) {
    const data = this.data.get(id);
    console.log('🔍 Finding in MongoDB:', id);
    return data ? { id, ...data } : null;
  }
  
  findAll() {
    console.log('📋 Getting all documents from MongoDB');
    return Array.from(this.data.entries()).map(([id, data]) => ({ id, ...data }));
  }
  
  update(id, newData) {
    if (this.data.has(id)) {
      this.data.set(id, { ...this.data.get(id), ...newData });
      console.log('✏️ Updated in MongoDB:', id);
      return { success: true };
    }
    return { success: false, error: 'Document not found' };
  }
  
  delete(id) {
    const deleted = this.data.delete(id);
    console.log('🗑️ Deleted from MongoDB:', id);
    return { success: deleted };
  }
}

class FileDatabase extends Database {
  constructor() {
    super();
    this.data = new Map();
  }
  
  save(data) {
    const id = 'file_' + Math.random().toString(36).substr(2, 9);
    this.data.set(id, data);
    console.log('📁 Saving to file system:', { id, ...data });
    return { success: true, id };
  }
  
  find(id) {
    const data = this.data.get(id);
    console.log('🔍 Finding in file system:', id);
    return data ? { id, ...data } : null;
  }
  
  findAll() {
    console.log('📋 Getting all records from files');
    return Array.from(this.data.entries()).map(([id, data]) => ({ id, ...data }));
  }
  
  update(id, newData) {
    if (this.data.has(id)) {
      this.data.set(id, { ...this.data.get(id), ...newData });
      console.log('✏️ Updated in file system:', id);
      return { success: true };
    }
    return { success: false, error: 'File not found' };
  }
  
  delete(id) {
    const deleted = this.data.delete(id);
    console.log('🗑️ Deleted from file system:', id);
    return { success: deleted };
  }
}

// High-level module depends on abstraction ✅
class UserService {
  constructor(database) {
    this.database = database; // Injected dependency ✅
  }
  
  createUser(userData) {
    console.log('👤 Creating user in service layer');
    
    // Business logic
    const user = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    // Validate user data
    if (!user.name || !user.email) {
      throw new Error('Name and email are required');
    }
    
    return this.database.save(user);
  }
  
  getUser(id) {
    console.log('👤 Getting user from service layer');
    return this.database.find(id);
  }
  
  getAllUsers() {
    console.log('👥 Getting all users from service layer');
    return this.database.findAll();
  }
  
  updateUser(id, userData) {
    console.log('👤 Updating user in service layer');
    
    // Business logic - add updated timestamp
    const updateData = {
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    return this.database.update(id, updateData);
  }
  
  deleteUser(id) {
    console.log('👤 Deleting user from service layer');
    return this.database.delete(id);
  }
}

// Usage - dependency injection allows easy switching ✅
console.log('=== USING MYSQL DATABASE ===');
const mysqlDb = new MySQLDatabase();
const userService1 = new UserService(mysqlDb);

const user1 = userService1.createUser({ name: 'Alice', email: 'alice@example.com' });
userService1.getUser(user1.id);

console.log('\n=== SWITCHING TO MONGODB ===');
const mongoDb = new MongoDatabase();
const userService2 = new UserService(mongoDb);

const user2 = userService2.createUser({ name: 'Bob', email: 'bob@example.com' });
userService2.getUser(user2.id);

console.log('\n=== SWITCHING TO FILE DATABASE ===');
const fileDb = new FileDatabase();
const userService3 = new UserService(fileDb);

const user3 = userService3.createUser({ name: 'Charlie', email: 'charlie@example.com' });
userService3.getUser(user3.id);

console.log('\n=== REAL-WORLD EXAMPLE: NOTIFICATION SYSTEM ===');

// Real-world example: Notification system
class NotificationSender {
  send(message, recipient) {
    throw new Error('send method must be implemented');
  }
  
  getDeliveryStatus(messageId) {
    throw new Error('getDeliveryStatus method must be implemented');
  }
}

// Low-level implementations
class EmailSender extends NotificationSender {
  send(message, recipient) {
    const messageId = 'email_' + Math.random().toString(36).substr(2, 9);
    console.log(`📧 Sending email to ${recipient}: ${message}`);
    return { success: true, messageId, method: 'email' };
  }
  
  getDeliveryStatus(messageId) {
    console.log(`📧 Checking email delivery status for ${messageId}`);
    return { delivered: true, timestamp: new Date().toISOString() };
  }
}

class SMSSender extends NotificationSender {
  send(message, recipient) {
    const messageId = 'sms_' + Math.random().toString(36).substr(2, 9);
    console.log(`📱 Sending SMS to ${recipient}: ${message}`);
    return { success: true, messageId, method: 'sms' };
  }
  
  getDeliveryStatus(messageId) {
    console.log(`📱 Checking SMS delivery status for ${messageId}`);
    return { delivered: true, timestamp: new Date().toISOString() };
  }
}

class PushNotificationSender extends NotificationSender {
  send(message, recipient) {
    const messageId = 'push_' + Math.random().toString(36).substr(2, 9);
    console.log(`🔔 Sending push notification to ${recipient}: ${message}`);
    return { success: true, messageId, method: 'push' };
  }
  
  getDeliveryStatus(messageId) {
    console.log(`🔔 Checking push notification status for ${messageId}`);
    return { delivered: true, timestamp: new Date().toISOString() };
  }
}

class SlackSender extends NotificationSender {
  send(message, recipient) {
    const messageId = 'slack_' + Math.random().toString(36).substr(2, 9);
    console.log(`💬 Sending Slack message to ${recipient}: ${message}`);
    return { success: true, messageId, method: 'slack' };
  }
  
  getDeliveryStatus(messageId) {
    console.log(`💬 Checking Slack message status for ${messageId}`);
    return { delivered: true, timestamp: new Date().toISOString() };
  }
}

// High-level notification service
class NotificationService {
  constructor(notificationSender) {
    this.notificationSender = notificationSender;
  }
  
  sendWelcomeMessage(user) {
    const message = `Welcome to our platform, ${user.name}! We're excited to have you.`;
    console.log('🎉 Sending welcome message...');
    return this.notificationSender.send(message, user.contact);
  }
  
  sendOrderConfirmation(user, orderId) {
    const message = `Your order #${orderId} has been confirmed and is being processed.`;
    console.log('📦 Sending order confirmation...');
    return this.notificationSender.send(message, user.contact);
  }
  
  sendPasswordReset(user, resetToken) {
    const message = `Your password reset token is: ${resetToken}. This token expires in 1 hour.`;
    console.log('🔐 Sending password reset...');
    return this.notificationSender.send(message, user.contact);
  }
  
  checkDeliveryStatus(messageId) {
    return this.notificationSender.getDeliveryStatus(messageId);
  }
}

// Usage with different notification methods
const users = [
  { name: 'Alice', contact: 'alice@example.com' },
  { name: 'Bob', contact: '+1234567890' },
  { name: 'Charlie', contact: 'device_123' },
  { name: 'Diana', contact: '#general' }
];

const notificationSenders = [
  new EmailSender(),
  new SMSSender(),
  new PushNotificationSender(),
  new SlackSender()
];

users.forEach((user, index) => {
  const sender = notificationSenders[index];
  const notificationService = new NotificationService(sender);
  
  console.log(`\n--- Notifications for ${user.name} ---`);
  const welcomeResult = notificationService.sendWelcomeMessage(user);
  const orderResult = notificationService.sendOrderConfirmation(user, 'ORD-12345');
  
  // Check delivery status
  notificationService.checkDeliveryStatus(welcomeResult.messageId);
});

console.log('\n=== PAYMENT PROCESSING EXAMPLE ===');

// Another example: Payment processing
class PaymentGateway {
  processPayment(amount, paymentDetails) {
    throw new Error('processPayment method must be implemented');
  }
  
  refundPayment(transactionId, amount) {
    throw new Error('refundPayment method must be implemented');
  }
  
  getTransactionStatus(transactionId) {
    throw new Error('getTransactionStatus method must be implemented');
  }
}

class StripeGateway extends PaymentGateway {
  processPayment(amount, paymentDetails) {
    const transactionId = 'stripe_' + Math.random().toString(36).substr(2, 9);
    console.log(`💳 Processing $${amount} payment via Stripe`);
    console.log(`   Card: ****-****-****-${paymentDetails.cardNumber.slice(-4)}`);
    return { success: true, transactionId, fee: amount * 0.029 };
  }
  
  refundPayment(transactionId, amount) {
    console.log(`💳 Refunding $${amount} via Stripe for transaction ${transactionId}`);
    return { success: true, refundId: 'stripe_refund_' + Math.random().toString(36).substr(2, 9) };
  }
  
  getTransactionStatus(transactionId) {
    console.log(`💳 Checking Stripe transaction status for ${transactionId}`);
    return { status: 'completed', amount: 100 };
  }
}

class PayPalGateway extends PaymentGateway {
  processPayment(amount, paymentDetails) {
    const transactionId = 'paypal_' + Math.random().toString(36).substr(2, 9);
    console.log(`🅿️ Processing $${amount} payment via PayPal`);
    console.log(`   Account: ${paymentDetails.email}`);
    return { success: true, transactionId, fee: amount * 0.034 };
  }
  
  refundPayment(transactionId, amount) {
    console.log(`🅿️ Refunding $${amount} via PayPal for transaction ${transactionId}`);
    return { success: true, refundId: 'paypal_refund_' + Math.random().toString(36).substr(2, 9) };
  }
  
  getTransactionStatus(transactionId) {
    console.log(`🅿️ Checking PayPal transaction status for ${transactionId}`);
    return { status: 'completed', amount: 100 };
  }
}

class CryptoGateway extends PaymentGateway {
  processPayment(amount, paymentDetails) {
    const transactionId = 'crypto_' + Math.random().toString(36).substr(2, 9);
    console.log(`₿ Processing $${amount} payment via Cryptocurrency`);
    console.log(`   Wallet: ${paymentDetails.walletAddress}`);
    return { success: true, transactionId, fee: 5.00 };
  }
  
  refundPayment(transactionId, amount) {
    console.log(`₿ Refunding $${amount} via Crypto for transaction ${transactionId}`);
    return { success: true, refundId: 'crypto_refund_' + Math.random().toString(36).substr(2, 9) };
  }
  
  getTransactionStatus(transactionId) {
    console.log(`₿ Checking crypto transaction status for ${transactionId}`);
    return { status: 'pending', confirmations: 3 };
  }
}

// High-level payment service
class PaymentService {
  constructor(paymentGateway) {
    this.paymentGateway = paymentGateway;
  }
  
  processOrder(order, paymentDetails) {
    console.log(`💰 Processing order #${order.id} for $${order.total}`);
    
    // Business logic
    if (order.total <= 0) {
      throw new Error('Invalid order amount');
    }
    
    const result = this.paymentGateway.processPayment(order.total, paymentDetails);
    
    if (result.success) {
      console.log(`✅ Payment successful! Transaction ID: ${result.transactionId}`);
      console.log(`💸 Processing fee: $${result.fee}`);
      
      // Update order status
      order.status = 'paid';
      order.transactionId = result.transactionId;
    }
    
    return result;
  }
  
  processRefund(order, reason) {
    console.log(`🔄 Processing refund for order #${order.id}: ${reason}`);
    
    if (!order.transactionId) {
      throw new Error('No transaction ID found for refund');
    }
    
    return this.paymentGateway.refundPayment(order.transactionId, order.total);
  }
}

// Usage with different payment gateways
const order = { id: 'ORD-12345', total: 99.99, status: 'pending' };

const paymentGateways = [
  { gateway: new StripeGateway(), details: { cardNumber: '4532123456789012', cvv: '123' } },
  { gateway: new PayPalGateway(), details: { email: 'user@example.com' } },
  { gateway: new CryptoGateway(), details: { walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' } }
];

paymentGateways.forEach(({ gateway, details }, index) => {
  console.log(`\n--- Payment Method ${index + 1} ---`);
  const paymentService = new PaymentService(gateway);
  
  // Create a copy of order for each test
  const testOrder = { ...order, id: `${order.id}-${index + 1}` };
  
  const result = paymentService.processOrder(testOrder, details);
  
  if (result.success) {
    // Simulate refund
    setTimeout(() => {
      paymentService.processRefund(testOrder, 'Customer requested refund');
    }, 100);
  }
});

console.log('\n=== DIP BENEFITS DEMONSTRATED ===');
console.log('✅ High-level modules independent of low-level implementations');
console.log('✅ Easy to swap implementations (MySQL → MongoDB → File)');
console.log('✅ Highly testable with dependency injection');
console.log('✅ Flexible architecture supporting multiple providers');
console.log('✅ Reduced coupling between layers');
console.log('✅ Easy to add new implementations without changing existing code');