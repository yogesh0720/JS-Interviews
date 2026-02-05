/**
 * OBSERVER PATTERN
 * Real-World Example: YouTube Notifications
 * 
 * WHEN TO USE:
 * - Event-driven architectures
 * - Model-View patterns
 * - Real-time notifications
 * - Decoupled communication between components
 * - DOM event handling
 * 
 * WHY TO USE:
 * - Loose coupling: Components don't need direct references
 * - Scalability: Easy to add/remove observers
 * - Separation of concerns: Clear event-based communication
 * - Flexibility: Dynamic subscription/unsubscription
 */

// Like YouTube - when creator uploads, all subscribers get notified
class YouTubeChannel {
  constructor(name) {
    this.name = name;
    this.subscribers = [];
    this.videos = [];
  }
  
  subscribe(subscriber) {
    this.subscribers.push(subscriber);
    console.log(`${subscriber.name} subscribed to ${this.name}`);
  }
  
  unsubscribe(subscriber) {
    this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
    console.log(`${subscriber.name} unsubscribed from ${this.name}`);
  }
  
  uploadVideo(videoTitle) {
    const video = {
      title: videoTitle,
      uploadDate: new Date(),
      views: 0
    };
    
    this.videos.push(video);
    console.log(`${this.name} uploaded: ${videoTitle}`);
    
    // Notify all subscribers
    this.subscribers.forEach(subscriber => {
      subscriber.notify(this.name, videoTitle);
    });
  }
  
  getSubscriberCount() {
    return this.subscribers.length;
  }
  
  getVideoCount() {
    return this.videos.length;
  }
}

class Subscriber {
  constructor(name) {
    this.name = name;
    this.notifications = [];
  }
  
  notify(channelName, videoTitle) {
    const notification = {
      channel: channelName,
      video: videoTitle,
      timestamp: new Date()
    };
    
    this.notifications.push(notification);
    console.log(`📱 ${this.name} got notification: ${channelName} uploaded "${videoTitle}"`);
  }
  
  getNotificationCount() {
    return this.notifications.length;
  }
  
  getNotifications() {
    return [...this.notifications];
  }
}

// Usage Examples
console.log('=== OBSERVER PATTERN DEMO ===');

// Create channels
const techChannel = new YouTubeChannel('TechReviews');
const cookingChannel = new YouTubeChannel('CookingMaster');

// Create subscribers
const alice = new Subscriber('Alice');
const bob = new Subscriber('Bob');
const charlie = new Subscriber('Charlie');

// Subscribe to channels
techChannel.subscribe(alice);
techChannel.subscribe(bob);
cookingChannel.subscribe(alice); // Alice likes both tech and cooking
cookingChannel.subscribe(charlie);

console.log(`Tech channel subscribers: ${techChannel.getSubscriberCount()}`);
console.log(`Cooking channel subscribers: ${cookingChannel.getSubscriberCount()}`);

// Upload videos - all subscribers get notified
techChannel.uploadVideo('iPhone 15 Review');
cookingChannel.uploadVideo('Perfect Pasta Recipe');
techChannel.uploadVideo('Best Laptops 2024');

// Check notifications
console.log(`Alice notifications: ${alice.getNotificationCount()}`); // 3 (both channels)
console.log(`Bob notifications: ${bob.getNotificationCount()}`); // 2 (tech only)
console.log(`Charlie notifications: ${charlie.getNotificationCount()}`); // 1 (cooking only)

// Unsubscribe
bob.notify = function(channelName, videoTitle) {
  console.log(`📱 ${this.name} got notification but ignored: ${channelName} - "${videoTitle}"`);
};

techChannel.unsubscribe(bob);
techChannel.uploadVideo('MacBook Pro M3 Review'); // Bob won't get this

console.log(`Final notifications - Alice: ${alice.getNotificationCount()}, Bob: ${bob.getNotificationCount()}`);

// Real-world example: Stock Price Observer
class Stock {
  constructor(symbol, price) {
    this.symbol = symbol;
    this.price = price;
    this.investors = [];
  }
  
  addInvestor(investor) {
    this.investors.push(investor);
  }
  
  removeInvestor(investor) {
    this.investors = this.investors.filter(inv => inv !== investor);
  }
  
  setPrice(newPrice) {
    const oldPrice = this.price;
    this.price = newPrice;
    
    this.investors.forEach(investor => {
      investor.update(this.symbol, oldPrice, newPrice);
    });
  }
}

class Investor {
  constructor(name) {
    this.name = name;
  }
  
  update(symbol, oldPrice, newPrice) {
    const change = ((newPrice - oldPrice) / oldPrice * 100).toFixed(2);
    console.log(`💰 ${this.name}: ${symbol} changed from $${oldPrice} to $${newPrice} (${change}%)`);
  }
}

// Stock market example
console.log('\n=== STOCK MARKET OBSERVER ===');
const appleStock = new Stock('AAPL', 150);
const investor1 = new Investor('John');
const investor2 = new Investor('Sarah');

appleStock.addInvestor(investor1);
appleStock.addInvestor(investor2);

appleStock.setPrice(155); // Both investors get notified
appleStock.setPrice(148); // Both investors get notified