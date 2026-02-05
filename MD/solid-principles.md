# SOLID Principles in JavaScript/Node.js

## Overview
SOLID is an acronym for five design principles that make software designs more understandable, flexible, and maintainable.

- **S** - Single Responsibility Principle (SRP)
- **O** - Open/Closed Principle (OCP)
- **L** - Liskov Substitution Principle (LSP)
- **I** - Interface Segregation Principle (ISP)
- **D** - Dependency Inversion Principle (DIP)

---

## 1. Single Responsibility Principle (SRP)

### Definition
A class should have only one reason to change. Each class should have only one job or responsibility.

### ❌ Bad Example (Violates SRP)
```javascript
// User class doing too many things
class User {
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
}
```

### ✅ Good Example (Follows SRP)
```javascript
// Each class has single responsibility
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  getName() { return this.name; }
  getEmail() { return this.email; }
}

class EmailService {
  sendEmail(user, message) {
    console.log(`Sending email to ${user.getEmail()}: ${message}`);
  }
}

class UserRepository {
  save(user) {
    console.log(`Saving user ${user.getName()} to database`);
  }
}

class EmailValidator {
  validate(email) {
    return email.includes('@');
  }
}

// Usage
const user = new User('John', 'john@example.com');
const emailService = new EmailService();
const userRepository = new UserRepository();
const emailValidator = new EmailValidator();

if (emailValidator.validate(user.getEmail())) {
  userRepository.save(user);
  emailService.sendEmail(user, 'Welcome!');
}
```

### When to Use
- When a class is doing multiple unrelated tasks
- When changes in one feature require modifying multiple classes
- When testing becomes complex due to multiple responsibilities

### Why Important
- **Easier maintenance**: Changes affect only one class
- **Better testing**: Each class can be tested independently
- **Improved readability**: Clear purpose for each class
- **Reduced coupling**: Classes depend on fewer things

---

## 2. Open/Closed Principle (OCP)

### Definition
Software entities should be open for extension but closed for modification.

### ❌ Bad Example (Violates OCP)
```javascript
// Adding new shapes requires modifying existing code
class AreaCalculator {
  calculateArea(shapes) {
    let totalArea = 0;
    
    for (const shape of shapes) {
      if (shape.type === 'rectangle') {
        totalArea += shape.width * shape.height;
      } else if (shape.type === 'circle') {
        totalArea += Math.PI * shape.radius * shape.radius;
      }
      // Adding triangle requires modifying this class
      else if (shape.type === 'triangle') {
        totalArea += 0.5 * shape.base * shape.height;
      }
    }
    
    return totalArea;
  }
}
```

### ✅ Good Example (Follows OCP)
```javascript
// Base shape interface
class Shape {
  calculateArea() {
    throw new Error('calculateArea method must be implemented');
  }
}

// Concrete shapes
class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  
  calculateArea() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  
  calculateArea() {
    return Math.PI * this.radius * this.radius;
  }
}

// New shapes can be added without modifying existing code
class Triangle extends Shape {
  constructor(base, height) {
    super();
    this.base = base;
    this.height = height;
  }
  
  calculateArea() {
    return 0.5 * this.base * this.height;
  }
}

// Calculator doesn't need to change for new shapes
class AreaCalculator {
  calculateArea(shapes) {
    return shapes.reduce((total, shape) => total + shape.calculateArea(), 0);
  }
}

// Usage
const shapes = [
  new Rectangle(5, 4),
  new Circle(3),
  new Triangle(6, 4)
];

const calculator = new AreaCalculator();
console.log('Total area:', calculator.calculateArea(shapes));
```

### When to Use
- When you need to add new functionality frequently
- When modifying existing code is risky or expensive
- When building plugin architectures

### Why Important
- **Extensibility**: Easy to add new features
- **Stability**: Existing code remains unchanged
- **Reduced bugs**: Less chance of breaking existing functionality
- **Better architecture**: Promotes good design patterns

---

## 3. Liskov Substitution Principle (LSP)

### Definition
Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.

### ❌ Bad Example (Violates LSP)
```javascript
class Bird {
  fly() {
    console.log('Flying...');
  }
}

class Eagle extends Bird {
  fly() {
    console.log('Eagle soaring high!');
  }
}

// Penguin can't fly - violates LSP
class Penguin extends Bird {
  fly() {
    throw new Error('Penguins cannot fly!');
  }
}

// This will break when penguin is used
function makeBirdFly(bird) {
  bird.fly(); // Throws error for Penguin
}
```

### ✅ Good Example (Follows LSP)
```javascript
// Base class with common behavior
class Bird {
  eat() {
    console.log('Eating...');
  }
}

// Separate interface for flying birds
class FlyingBird extends Bird {
  fly() {
    console.log('Flying...');
  }
}

class Eagle extends FlyingBird {
  fly() {
    console.log('Eagle soaring high!');
  }
}

class Penguin extends Bird {
  swim() {
    console.log('Penguin swimming!');
  }
}

// Functions work with appropriate types
function makeFlyingBirdFly(bird) {
  if (bird instanceof FlyingBird) {
    bird.fly();
  }
}

function feedBird(bird) {
  bird.eat(); // Works for all birds
}

// Usage
const eagle = new Eagle();
const penguin = new Penguin();

makeFlyingBirdFly(eagle);   // Works - eagle can fly
makeFlyingBirdFly(penguin); // Safe - checks instance type

feedBird(eagle);   // Works for all birds
feedBird(penguin); // Works for all birds
```

### When to Use
- When designing inheritance hierarchies
- When creating polymorphic functions
- When building frameworks or libraries

### Why Important
- **Polymorphism**: Enables true object-oriented design
- **Reliability**: Subclasses behave as expected
- **Maintainability**: Changes don't break existing code
- **Testability**: Easy to mock and test

---

## 4. Interface Segregation Principle (ISP)

### Definition
No client should be forced to depend on methods it does not use. Create specific interfaces rather than one general-purpose interface.

### ❌ Bad Example (Violates ISP)
```javascript
// Fat interface - forces classes to implement unused methods
class Worker {
  work() { throw new Error('Must implement work'); }
  eat() { throw new Error('Must implement eat'); }
  sleep() { throw new Error('Must implement sleep'); }
}

class HumanWorker extends Worker {
  work() { console.log('Human working'); }
  eat() { console.log('Human eating'); }
  sleep() { console.log('Human sleeping'); }
}

// Robot doesn't eat or sleep but forced to implement
class RobotWorker extends Worker {
  work() { console.log('Robot working'); }
  eat() { throw new Error('Robots do not eat'); }
  sleep() { throw new Error('Robots do not sleep'); }
}
```

### ✅ Good Example (Follows ISP)
```javascript
// Segregated interfaces
class Workable {
  work() { throw new Error('Must implement work'); }
}

class Eatable {
  eat() { throw new Error('Must implement eat'); }
}

class Sleepable {
  sleep() { throw new Error('Must implement sleep'); }
}

// Human implements all interfaces
class HumanWorker extends Workable {
  work() { console.log('Human working'); }
}

class HumanEater extends Eatable {
  eat() { console.log('Human eating'); }
}

class HumanSleeper extends Sleepable {
  sleep() { console.log('Human sleeping'); }
}

// Robot only implements what it needs
class RobotWorker extends Workable {
  work() { console.log('Robot working'); }
}

// Using composition
class Human {
  constructor() {
    this.worker = new HumanWorker();
    this.eater = new HumanEater();
    this.sleeper = new HumanSleeper();
  }
  
  doWork() { this.worker.work(); }
  eatMeal() { this.eater.eat(); }
  getSleep() { this.sleeper.sleep(); }
}

class Robot {
  constructor() {
    this.worker = new RobotWorker();
  }
  
  doWork() { this.worker.work(); }
}

// Usage
const human = new Human();
const robot = new Robot();

human.doWork();  // Human working
human.eatMeal(); // Human eating
human.getSleep(); // Human sleeping

robot.doWork();  // Robot working
// robot.eatMeal(); // Not available - robot doesn't need to eat
```

### When to Use
- When interfaces become too large
- When classes implement empty or throwing methods
- When different clients need different methods

### Why Important
- **Flexibility**: Classes implement only what they need
- **Maintainability**: Changes affect fewer classes
- **Clarity**: Interfaces have clear, focused purposes
- **Testability**: Easier to mock specific behaviors

---

## 5. Dependency Inversion Principle (DIP)

### Definition
High-level modules should not depend on low-level modules. Both should depend on abstractions.

### ❌ Bad Example (Violates DIP)
```javascript
// High-level class depends on low-level implementation
class MySQLDatabase {
  save(data) {
    console.log('Saving to MySQL database');
  }
}

class UserService {
  constructor() {
    this.database = new MySQLDatabase(); // Direct dependency
  }
  
  createUser(userData) {
    // Business logic
    const user = { ...userData, id: Date.now() };
    this.database.save(user);
  }
}
```

### ✅ Good Example (Follows DIP)
```javascript
// Abstraction (interface)
class Database {
  save(data) {
    throw new Error('save method must be implemented');
  }
}

// Low-level implementations
class MySQLDatabase extends Database {
  save(data) {
    console.log('Saving to MySQL database:', data);
  }
}

class MongoDatabase extends Database {
  save(data) {
    console.log('Saving to MongoDB:', data);
  }
}

class FileDatabase extends Database {
  save(data) {
    console.log('Saving to file system:', data);
  }
}

// High-level module depends on abstraction
class UserService {
  constructor(database) {
    this.database = database; // Injected dependency
  }
  
  createUser(userData) {
    // Business logic
    const user = { ...userData, id: Date.now() };
    this.database.save(user);
  }
}

// Usage - dependency injection
const mysqlDb = new MySQLDatabase();
const mongoDb = new MongoDatabase();
const fileDb = new FileDatabase();

const userService1 = new UserService(mysqlDb);
const userService2 = new UserService(mongoDb);
const userService3 = new UserService(fileDb);

// All work the same way
userService1.createUser({ name: 'John', email: 'john@example.com' });
userService2.createUser({ name: 'Jane', email: 'jane@example.com' });
userService3.createUser({ name: 'Bob', email: 'bob@example.com' });
```mplemented');
  }
}

// Low-level implementations
class MySQLDatabase extends Database {
  save(data) {
    console.log('Saving to MySQL database:', data);
  }
}

class MongoDatabase extends Database {
  save(data) {
    console.log('Saving to MongoDB:', data);
  }
}

class FileDatabase extends Database {
  save(data) {
    console.log('Saving to file system:', data);
  }
}

// High-level module depends on abstraction
class UserService {
  constructor(database) {
    this.database = database; // Injected dependency
  }
  
  createUser(userData) {
    // Business logic
    const user = { ...userData, id: Date.now() };
    this.database.save(user);
  }
}

// Usage - dependency injection
const mysqlDb = new MySQLDatabase();
const mongoDb = new MongoDatabase();
const fileDb = new FileDatabase();

const userService1 = new UserService(mysqlDb);
const userService2 = new UserService(mongoDb);
const userService3 = new UserService(fileDb);
```

### When to Use
- When you want to switch implementations easily
- When writing testable code
- When building modular applications

### Why Important
- **Flexibility**: Easy to swap implementations
- **Testability**: Easy to inject mocks
- **Maintainability**: Changes in low-level modules don't affect high-level ones
- **Reusability**: High-level modules can work with different implementations

---

## Real-World Example: E-commerce System

```javascript
// Following all SOLID principles

// SRP - Single responsibility classes
class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class Order {
  constructor() {
    this.items = [];
    this.total = 0;
  }
  
  addItem(product, quantity) {
    this.items.push({ product, quantity });
    this.total += product.price * quantity;
  }
}

// ISP - Segregated interfaces
class PaymentProcessor {
  process(amount) { throw new Error('Must implement process'); }
}

class NotificationSender {
  send(message) { throw new Error('Must implement send'); }
}

// OCP & DIP - Open for extension, depends on abstractions
class CreditCardProcessor extends PaymentProcessor {
  process(amount) {
    console.log(`Processing $${amount} via Credit Card`);
    return { success: true, transactionId: 'cc_123' };
  }
}

class PayPalProcessor extends PaymentProcessor {
  process(amount) {
    console.log(`Processing $${amount} via PayPal`);
    return { success: true, transactionId: 'pp_456' };
  }
}

class EmailNotification extends NotificationSender {
  send(message) {
    console.log(`Email: ${message}`);
  }
}

class SMSNotification extends NotificationSender {
  send(message) {
    console.log(`SMS: ${message}`);
  }
}

// LSP - Substitutable implementations
class OrderService {
  constructor(paymentProcessor, notificationSender) {
    this.paymentProcessor = paymentProcessor;
    this.notificationSender = notificationSender;
  }
  
  processOrder(order) {
    const result = this.paymentProcessor.process(order.total);
    
    if (result.success) {
      this.notificationSender.send(`Order processed successfully! Transaction: ${result.transactionId}`);
    }
    
    return result;
  }
}

// Usage
const product1 = new Product(1, 'Laptop', 999);
const product2 = new Product(2, 'Mouse', 29);

const order = new Order();
order.addItem(product1, 1);
order.addItem(product2, 2);

// Can easily switch implementations
const creditCardService = new OrderService(
  new CreditCardProcessor(),
  new EmailNotification()
);

const paypalService = new OrderService(
  new PayPalProcessor(),
  new SMSNotification()
);

creditCardService.processOrder(order);
paypalService.processOrder(order);
```

## Benefits of Following SOLID

1. **Maintainable Code**: Easy to modify and extend
2. **Testable Code**: Each component can be tested independently
3. **Flexible Architecture**: Easy to swap implementations
4. **Reduced Coupling**: Components are loosely connected
5. **Better Collaboration**: Clear responsibilities and interfaces
6. **Scalable Systems**: Easy to add new features

## Interview Tips

- **Explain with examples**: Use real-world scenarios
- **Know the problems**: Understand what happens when principles are violated
- **Practice refactoring**: Show how to improve bad code
- **Connect to experience**: Relate to projects you've worked on
- **Understand trade-offs**: Know when to bend the rules