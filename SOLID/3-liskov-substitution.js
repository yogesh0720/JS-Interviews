/**
 * LISKOV SUBSTITUTION PRINCIPLE (LSP)
 * "Objects of a superclass should be replaceable with objects of its subclasses without breaking the application"
 * 
 * WHEN TO USE:
 * - When designing inheritance hierarchies
 * - When creating polymorphic functions
 * - When building frameworks or libraries
 * 
 * WHY IMPORTANT:
 * - Polymorphism: Enables true object-oriented design
 * - Reliability: Subclasses behave as expected
 * - Maintainability: Changes don't break existing code
 * - Testability: Easy to mock and test
 */

console.log('=== LISKOV SUBSTITUTION PRINCIPLE ===\n');

// ❌ BAD EXAMPLE - Violates LSP
console.log('❌ BAD EXAMPLE (Violates LSP):');

class BadBird {
  fly() {
    console.log('Flying...');
  }
  
  eat() {
    console.log('Eating...');
  }
}

class BadEagle extends BadBird {
  fly() {
    console.log('Eagle soaring high!');
  }
}

// Penguin can't fly - violates LSP ❌
class BadPenguin extends BadBird {
  fly() {
    throw new Error('Penguins cannot fly!');
  }
  
  swim() {
    console.log('Penguin swimming!');
  }
}

// This will break when penguin is used ❌
function makeBirdFly(bird) {
  console.log('Making bird fly...');
  bird.fly(); // Throws error for Penguin
}

console.log('Testing with Eagle:');
const badEagle = new BadEagle();
makeBirdFly(badEagle); // Works fine

console.log('\nTesting with Penguin:');
const badPenguin = new BadPenguin();
try {
  makeBirdFly(badPenguin); // Throws error!
} catch (error) {
  console.log('❌ Error:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// ✅ GOOD EXAMPLE - Follows LSP
console.log('✅ GOOD EXAMPLE (Follows LSP):');

// Base class with common behavior
class Bird {
  eat() {
    console.log(`${this.constructor.name} is eating...`);
  }
  
  sleep() {
    console.log(`${this.constructor.name} is sleeping...`);
  }
  
  makeSound() {
    console.log(`${this.constructor.name} makes a sound...`);
  }
}

// Separate interface for flying birds
class FlyingBird extends Bird {
  fly() {
    console.log(`${this.constructor.name} is flying...`);
  }
  
  land() {
    console.log(`${this.constructor.name} is landing...`);
  }
}

// Separate interface for swimming birds
class SwimmingBird extends Bird {
  swim() {
    console.log(`${this.constructor.name} is swimming...`);
  }
  
  dive() {
    console.log(`${this.constructor.name} is diving...`);
  }
}

// Concrete implementations
class Eagle extends FlyingBird {
  fly() {
    console.log('🦅 Eagle soaring majestically at high altitude!');
  }
  
  hunt() {
    console.log('Eagle hunting for prey...');
  }
  
  makeSound() {
    console.log('Eagle: Screech!');
  }
}

class Sparrow extends FlyingBird {
  fly() {
    console.log('🐦 Sparrow flying quickly between trees!');
  }
  
  makeSound() {
    console.log('Sparrow: Chirp chirp!');
  }
}

class Penguin extends SwimmingBird {
  swim() {
    console.log('🐧 Penguin swimming gracefully underwater!');
  }
  
  slide() {
    console.log('Penguin sliding on ice!');
  }
  
  makeSound() {
    console.log('Penguin: Squawk!');
  }
}

class Duck extends FlyingBird {
  constructor() {
    super();
    this.canSwim = true;
  }
  
  fly() {
    console.log('🦆 Duck flying over the lake!');
  }
  
  swim() {
    console.log('Duck swimming on water surface!');
  }
  
  makeSound() {
    console.log('Duck: Quack quack!');
  }
}

// Functions work with appropriate types ✅
function makeFlyingBirdFly(bird) {
  if (bird instanceof FlyingBird) {
    console.log('🛫 Preparing for flight...');
    bird.fly();
    bird.land();
  } else {
    console.log('❌ This bird cannot fly');
  }
}

function makeSwimmingBirdSwim(bird) {
  if (bird instanceof SwimmingBird) {
    console.log('🏊 Entering water...');
    bird.swim();
    bird.dive();
  } else {
    console.log('❌ This bird cannot swim');
  }
}

function feedBird(bird) {
  console.log('🍽️ Feeding time!');
  bird.eat(); // Works for all birds ✅
  bird.makeSound();
}

// Usage - All substitutions work correctly
const eagle = new Eagle();
const sparrow = new Sparrow();
const penguin = new Penguin();
const duck = new Duck();

console.log('=== FLYING BIRDS ===');
makeFlyingBirdFly(eagle);
makeFlyingBirdFly(sparrow);
makeFlyingBirdFly(duck);

console.log('\n=== SWIMMING BIRDS ===');
makeSwimmingBirdSwim(penguin);
if (duck.canSwim) {
  duck.swim(); // Duck can both fly and swim
}

console.log('\n=== FEEDING ALL BIRDS ===');
[eagle, sparrow, penguin, duck].forEach(bird => {
  feedBird(bird); // Works for all birds
});

console.log('\n=== REAL-WORLD EXAMPLE: PAYMENT SYSTEM ===');

// Real-world example: Payment processing system
class PaymentMethod {
  processPayment(amount) {
    throw new Error('processPayment must be implemented');
  }
  
  validatePayment(amount) {
    return amount > 0;
  }
  
  getPaymentInfo() {
    throw new Error('getPaymentInfo must be implemented');
  }
}

class CreditCard extends PaymentMethod {
  constructor(cardNumber, expiryDate, cvv) {
    super();
    this.cardNumber = cardNumber;
    this.expiryDate = expiryDate;
    this.cvv = cvv;
  }
  
  processPayment(amount) {
    if (!this.validatePayment(amount)) {
      throw new Error('Invalid payment amount');
    }
    
    console.log(`💳 Processing $${amount} via Credit Card ending in ${this.cardNumber.slice(-4)}`);
    
    // Simulate processing time
    return {
      success: true,
      transactionId: 'cc_' + Math.random().toString(36).substr(2, 9),
      method: 'Credit Card',
      amount: amount
    };
  }
  
  getPaymentInfo() {
    return {
      type: 'Credit Card',
      lastFour: this.cardNumber.slice(-4),
      expiry: this.expiryDate
    };
  }
}

class PayPal extends PaymentMethod {
  constructor(email) {
    super();
    this.email = email;
  }
  
  processPayment(amount) {
    if (!this.validatePayment(amount)) {
      throw new Error('Invalid payment amount');
    }
    
    console.log(`🅿️ Processing $${amount} via PayPal account ${this.email}`);
    
    return {
      success: true,
      transactionId: 'pp_' + Math.random().toString(36).substr(2, 9),
      method: 'PayPal',
      amount: amount
    };
  }
  
  getPaymentInfo() {
    return {
      type: 'PayPal',
      email: this.email
    };
  }
}

class BankTransfer extends PaymentMethod {
  constructor(accountNumber, routingNumber) {
    super();
    this.accountNumber = accountNumber;
    this.routingNumber = routingNumber;
  }
  
  processPayment(amount) {
    if (!this.validatePayment(amount)) {
      throw new Error('Invalid payment amount');
    }
    
    console.log(`🏦 Processing $${amount} via Bank Transfer from account ${this.accountNumber.slice(-4)}`);
    
    return {
      success: true,
      transactionId: 'bt_' + Math.random().toString(36).substr(2, 9),
      method: 'Bank Transfer',
      amount: amount,
      processingTime: '1-3 business days'
    };
  }
  
  getPaymentInfo() {
    return {
      type: 'Bank Transfer',
      accountLastFour: this.accountNumber.slice(-4),
      routing: this.routingNumber
    };
  }
}

// Payment processor that works with any payment method ✅
class PaymentProcessor {
  processOrder(paymentMethod, amount) {
    console.log(`\n💰 Processing order for $${amount}`);
    console.log('Payment method:', paymentMethod.getPaymentInfo().type);
    
    try {
      // This works with any PaymentMethod subclass ✅
      const result = paymentMethod.processPayment(amount);
      
      if (result.success) {
        console.log(`✅ Payment successful! Transaction ID: ${result.transactionId}`);
        return result;
      }
    } catch (error) {
      console.log(`❌ Payment failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
  
  // This method works with any payment method ✅
  getPaymentSummary(paymentMethods) {
    console.log('\n📊 Payment Methods Summary:');
    paymentMethods.forEach((method, index) => {
      const info = method.getPaymentInfo();
      console.log(`${index + 1}. ${info.type} - ${JSON.stringify(info)}`);
    });
  }
}

// Usage - All payment methods are substitutable ✅
const creditCard = new CreditCard('1234567890123456', '12/25', '123');
const paypal = new PayPal('user@example.com');
const bankTransfer = new BankTransfer('9876543210', '123456789');

const processor = new PaymentProcessor();

// All payment methods work the same way ✅
processor.processOrder(creditCard, 100);
processor.processOrder(paypal, 75);
processor.processOrder(bankTransfer, 200);

// Summary works with all payment methods ✅
processor.getPaymentSummary([creditCard, paypal, bankTransfer]);

console.log('\n=== VEHICLE EXAMPLE ===');

// Another example: Vehicle system
class Vehicle {
  start() {
    console.log(`${this.constructor.name} is starting...`);
  }
  
  stop() {
    console.log(`${this.constructor.name} is stopping...`);
  }
  
  getInfo() {
    throw new Error('getInfo must be implemented');
  }
}

class Car extends Vehicle {
  constructor(make, model) {
    super();
    this.make = make;
    this.model = model;
    this.wheels = 4;
  }
  
  start() {
    console.log(`🚗 ${this.make} ${this.model} engine started`);
  }
  
  honk() {
    console.log('Car: Beep beep!');
  }
  
  getInfo() {
    return `${this.make} ${this.model} (${this.wheels} wheels)`;
  }
}

class Motorcycle extends Vehicle {
  constructor(make, model) {
    super();
    this.make = make;
    this.model = model;
    this.wheels = 2;
  }
  
  start() {
    console.log(`🏍️ ${this.make} ${this.model} engine roared to life`);
  }
  
  wheelie() {
    console.log('Motorcycle doing a wheelie!');
  }
  
  getInfo() {
    return `${this.make} ${this.model} (${this.wheels} wheels)`;
  }
}

// Functions that work with any vehicle ✅
function startVehicle(vehicle) {
  console.log('🔑 Starting vehicle...');
  vehicle.start(); // Works with any Vehicle subclass
}

function stopVehicle(vehicle) {
  console.log('🛑 Stopping vehicle...');
  vehicle.stop(); // Works with any Vehicle subclass
}

function getVehicleDetails(vehicles) {
  console.log('\n🚙 Vehicle Fleet:');
  vehicles.forEach((vehicle, index) => {
    console.log(`${index + 1}. ${vehicle.getInfo()}`);
  });
}

// Usage
const car = new Car('Toyota', 'Camry');
const motorcycle = new Motorcycle('Harley', 'Davidson');

startVehicle(car);      // ✅ Works
startVehicle(motorcycle); // ✅ Works

stopVehicle(car);       // ✅ Works
stopVehicle(motorcycle); // ✅ Works

getVehicleDetails([car, motorcycle]); // ✅ Works with both

console.log('\n=== LSP BENEFITS DEMONSTRATED ===');
console.log('✅ Subclasses can be used interchangeably with parent class');
console.log('✅ No unexpected behavior or exceptions');
console.log('✅ Polymorphic functions work correctly');
console.log('✅ Easy to add new implementations');
console.log('✅ Code is more reliable and predictable');