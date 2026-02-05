/**
 * OPEN/CLOSED PRINCIPLE (OCP)
 * "Software entities should be open for extension but closed for modification"
 * 
 * WHEN TO USE:
 * - When you need to add new functionality frequently
 * - When modifying existing code is risky or expensive
 * - When building plugin architectures
 * 
 * WHY IMPORTANT:
 * - Extensibility: Easy to add new features
 * - Stability: Existing code remains unchanged
 * - Reduced bugs: Less chance of breaking existing functionality
 * - Better architecture: Promotes good design patterns
 */

console.log('=== OPEN/CLOSED PRINCIPLE ===\n');

// ❌ BAD EXAMPLE - Violates OCP
console.log('❌ BAD EXAMPLE (Violates OCP):');

class BadAreaCalculator {
  calculateArea(shapes) {
    let totalArea = 0;
    
    for (const shape of shapes) {
      if (shape.type === 'rectangle') {
        totalArea += shape.width * shape.height;
        console.log(`Rectangle area: ${shape.width * shape.height}`);
      } else if (shape.type === 'circle') {
        const area = Math.PI * shape.radius * shape.radius;
        totalArea += area;
        console.log(`Circle area: ${area.toFixed(2)}`);
      }
      // Adding triangle requires modifying this class ❌
      else if (shape.type === 'triangle') {
        const area = 0.5 * shape.base * shape.height;
        totalArea += area;
        console.log(`Triangle area: ${area}`);
      }
      // Adding hexagon requires modifying this class again ❌
      else if (shape.type === 'hexagon') {
        const area = (3 * Math.sqrt(3) / 2) * shape.side * shape.side;
        totalArea += area;
        console.log(`Hexagon area: ${area.toFixed(2)}`);
      }
    }
    
    return totalArea;
  }
}

// Usage of bad example
const badCalculator = new BadAreaCalculator();
const badShapes = [
  { type: 'rectangle', width: 5, height: 4 },
  { type: 'circle', radius: 3 },
  { type: 'triangle', base: 6, height: 4 }
];

console.log('Total area (bad way):', badCalculator.calculateArea(badShapes));

console.log('\n' + '='.repeat(50) + '\n');

// ✅ GOOD EXAMPLE - Follows OCP
console.log('✅ GOOD EXAMPLE (Follows OCP):');

// Base shape interface
class Shape {
  calculateArea() {
    throw new Error('calculateArea method must be implemented');
  }
  
  getInfo() {
    throw new Error('getInfo method must be implemented');
  }
}

// Concrete shapes - can add new ones without modifying existing code
class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  
  calculateArea() {
    return this.width * this.height;
  }
  
  getInfo() {
    return `Rectangle (${this.width}x${this.height})`;
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
  
  getInfo() {
    return `Circle (radius: ${this.radius})`;
  }
}

// New shapes can be added without modifying existing code ✅
class Triangle extends Shape {
  constructor(base, height) {
    super();
    this.base = base;
    this.height = height;
  }
  
  calculateArea() {
    return 0.5 * this.base * this.height;
  }
  
  getInfo() {
    return `Triangle (base: ${this.base}, height: ${this.height})`;
  }
}

class Hexagon extends Shape {
  constructor(side) {
    super();
    this.side = side;
  }
  
  calculateArea() {
    return (3 * Math.sqrt(3) / 2) * this.side * this.side;
  }
  
  getInfo() {
    return `Hexagon (side: ${this.side})`;
  }
}

// Calculator doesn't need to change for new shapes ✅
class AreaCalculator {
  calculateArea(shapes) {
    let totalArea = 0;
    
    for (const shape of shapes) {
      const area = shape.calculateArea();
      totalArea += area;
      console.log(`${shape.getInfo()} area: ${area.toFixed(2)}`);
    }
    
    return totalArea;
  }
  
  calculatePerimeter(shapes) {
    // This method can be added without affecting area calculation
    return shapes.reduce((total, shape) => {
      if (shape.calculatePerimeter) {
        return total + shape.calculatePerimeter();
      }
      return total;
    }, 0);
  }
}

// Usage of good example
const calculator = new AreaCalculator();
const shapes = [
  new Rectangle(5, 4),
  new Circle(3),
  new Triangle(6, 4),
  new Hexagon(2)
];

console.log('Total area (good way):', calculator.calculateArea(shapes).toFixed(2));

console.log('\n=== REAL-WORLD EXAMPLE: DISCOUNT SYSTEM ===');

// Real-world example: E-commerce discount system
class DiscountCalculator {
  calculateDiscount(order, discountStrategies) {
    let totalDiscount = 0;
    
    for (const strategy of discountStrategies) {
      const discount = strategy.calculate(order);
      totalDiscount += discount;
      console.log(`${strategy.getName()}: -$${discount.toFixed(2)}`);
    }
    
    return totalDiscount;
  }
}

// Base discount strategy
class DiscountStrategy {
  calculate(order) {
    throw new Error('calculate method must be implemented');
  }
  
  getName() {
    throw new Error('getName method must be implemented');
  }
}

// Existing discount strategies
class PercentageDiscount extends DiscountStrategy {
  constructor(percentage) {
    super();
    this.percentage = percentage;
  }
  
  calculate(order) {
    return order.total * (this.percentage / 100);
  }
  
  getName() {
    return `${this.percentage}% Discount`;
  }
}

class FixedAmountDiscount extends DiscountStrategy {
  constructor(amount) {
    super();
    this.amount = amount;
  }
  
  calculate(order) {
    return Math.min(this.amount, order.total);
  }
  
  getName() {
    return `$${this.amount} Fixed Discount`;
  }
}

// New discount strategies can be added without modifying existing code ✅
class BuyTwoGetOneDiscount extends DiscountStrategy {
  calculate(order) {
    let discount = 0;
    
    for (const item of order.items) {
      const freeItems = Math.floor(item.quantity / 3);
      discount += freeItems * item.price;
    }
    
    return discount;
  }
  
  getName() {
    return 'Buy 2 Get 1 Free';
  }
}

class LoyaltyDiscount extends DiscountStrategy {
  constructor(customerTier) {
    super();
    this.customerTier = customerTier;
  }
  
  calculate(order) {
    const discountRates = {
      'bronze': 0.05,
      'silver': 0.10,
      'gold': 0.15,
      'platinum': 0.20
    };
    
    const rate = discountRates[this.customerTier] || 0;
    return order.total * rate;
  }
  
  getName() {
    return `${this.customerTier.toUpperCase()} Loyalty Discount`;
  }
}

class SeasonalDiscount extends DiscountStrategy {
  constructor(season, rate) {
    super();
    this.season = season;
    this.rate = rate;
  }
  
  calculate(order) {
    const currentMonth = new Date().getMonth();
    const seasonMonths = {
      'winter': [11, 0, 1],
      'spring': [2, 3, 4],
      'summer': [5, 6, 7],
      'fall': [8, 9, 10]
    };
    
    if (seasonMonths[this.season].includes(currentMonth)) {
      return order.total * this.rate;
    }
    
    return 0;
  }
  
  getName() {
    return `${this.season.toUpperCase()} Seasonal Discount`;
  }
}

// Usage
const order = {
  total: 200,
  items: [
    { name: 'Laptop', price: 100, quantity: 1 },
    { name: 'Mouse', price: 25, quantity: 4 }
  ],
  customer: { tier: 'gold' }
};

const discountCalculator = new DiscountCalculator();

// Can combine multiple discount strategies
const discountStrategies = [
  new PercentageDiscount(10),
  new FixedAmountDiscount(15),
  new BuyTwoGetOneDiscount(),
  new LoyaltyDiscount(order.customer.tier),
  new SeasonalDiscount('winter', 0.05)
];

console.log(`\n🛒 Order total: $${order.total}`);
console.log('Applied discounts:');

const totalDiscount = discountCalculator.calculateDiscount(order, discountStrategies);
const finalTotal = order.total - totalDiscount;

console.log(`\n💰 Total discount: -$${totalDiscount.toFixed(2)}`);
console.log(`💳 Final total: $${finalTotal.toFixed(2)}`);

console.log('\n=== NOTIFICATION SYSTEM EXAMPLE ===');

// Another example: Notification system
class NotificationSender {
  sendNotifications(message, channels) {
    console.log(`📢 Sending: "${message}"`);
    
    for (const channel of channels) {
      channel.send(message);
    }
  }
}

class NotificationChannel {
  send(message) {
    throw new Error('send method must be implemented');
  }
  
  getName() {
    throw new Error('getName method must be implemented');
  }
}

// Existing channels
class EmailChannel extends NotificationChannel {
  constructor(email) {
    super();
    this.email = email;
  }
  
  send(message) {
    console.log(`📧 Email sent to ${this.email}: ${message}`);
  }
  
  getName() {
    return 'Email';
  }
}

class SMSChannel extends NotificationChannel {
  constructor(phone) {
    super();
    this.phone = phone;
  }
  
  send(message) {
    console.log(`📱 SMS sent to ${this.phone}: ${message}`);
  }
  
  getName() {
    return 'SMS';
  }
}

// New channels can be added without modifying existing code ✅
class SlackChannel extends NotificationChannel {
  constructor(webhook) {
    super();
    this.webhook = webhook;
  }
  
  send(message) {
    console.log(`💬 Slack message sent to ${this.webhook}: ${message}`);
  }
  
  getName() {
    return 'Slack';
  }
}

class PushNotificationChannel extends NotificationChannel {
  constructor(deviceId) {
    super();
    this.deviceId = deviceId;
  }
  
  send(message) {
    console.log(`🔔 Push notification sent to ${this.deviceId}: ${message}`);
  }
  
  getName() {
    return 'Push Notification';
  }
}

// Usage
const notificationSender = new NotificationSender();
const channels = [
  new EmailChannel('user@example.com'),
  new SMSChannel('+1234567890'),
  new SlackChannel('#general'),
  new PushNotificationChannel('device_123')
];

notificationSender.sendNotifications('Your order has been shipped!', channels);

console.log('\n=== OCP BENEFITS DEMONSTRATED ===');
console.log('✅ New shapes/discounts/channels added without modifying existing code');
console.log('✅ Existing functionality remains stable and tested');
console.log('✅ Easy to extend system with new features');
console.log('✅ Follows polymorphism principles');
console.log('✅ Reduces risk of introducing bugs in working code');