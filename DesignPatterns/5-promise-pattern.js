/**
 * PROMISE PATTERN (Async)
 * Real-World Example: Food Delivery App (like Uber Eats)
 * 
 * WHEN TO USE:
 * - Asynchronous operations
 * - API calls
 * - File operations
 * - Database queries
 * - Any non-blocking operations
 * 
 * WHY TO USE:
 * - Non-blocking: Prevents UI freezing
 * - Error handling: Built-in error propagation
 * - Composability: Easy to chain operations
 * - Readability: Cleaner than callbacks
 */

// Like Uber Eats - order food, wait for delivery
function orderFood(restaurant, dish) {
  return new Promise((resolve, reject) => {
    console.log(`🍕 Ordering ${dish} from ${restaurant}...`);
    
    // Simulate cooking time
    const cookingTime = Math.random() * 3000 + 2000; // 2-5 seconds
    
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        resolve({
          order: `${dish} from ${restaurant}`,
          status: 'delivered',
          estimatedTime: Math.round(cookingTime / 1000) + ' minutes',
          price: '$12.99',
          orderId: Math.random().toString(36).substr(2, 9)
        });
      } else {
        reject(new Error(`${restaurant} is currently closed`));
      }
    }, cookingTime);
  });
}

// Payment processing
function processPayment(amount) {
  return new Promise((resolve, reject) => {
    console.log(`💳 Processing payment of ${amount}...`);
    
    setTimeout(() => {
      if (Math.random() > 0.05) { // 95% success rate
        resolve({
          status: 'success',
          transactionId: Math.random().toString(36).substr(2, 9),
          amount: amount
        });
      } else {
        reject(new Error('Payment failed - insufficient funds'));
      }
    }, 1000);
  });
}

// Delivery tracking
function trackDelivery(orderId) {
  return new Promise((resolve) => {
    console.log(`🚗 Tracking delivery for order ${orderId}...`);
    
    setTimeout(() => {
      resolve({
        orderId,
        status: 'delivered',
        deliveryTime: '25 minutes',
        driver: 'Mike',
        rating: 4.8
      });
    }, 2000);
  });
}

// Usage with async/await (modern way)
async function getMyFood() {
  try {
    console.log('📱 Placing order...');
    
    // Step 1: Order food
    const order = await orderFood('Pizza Palace', 'Margherita Pizza');
    console.log('✅ Order confirmed:', order);
    
    // Step 2: Process payment
    const payment = await processPayment(order.price);
    console.log('✅ Payment processed:', payment);
    
    // Step 3: Track delivery
    const delivery = await trackDelivery(order.orderId);
    console.log('✅ Order delivered:', delivery);
    
    return { order, payment, delivery };
    
  } catch (error) {
    console.log('❌ Order failed:', error.message);
    throw error;
  }
}

// Usage with .then() (traditional way)
function orderWithThen() {
  console.log('\n=== ORDERING WITH .THEN() ===');
  
  orderFood('Burger King', 'Whopper')
    .then(order => {
      console.log('🎉 Order received:', order);
      return processPayment(order.price);
    })
    .then(payment => {
      console.log('💰 Payment successful:', payment);
      return trackDelivery(payment.transactionId);
    })
    .then(delivery => {
      console.log('🚚 Delivery completed:', delivery);
    })
    .catch(error => {
      console.log('😞 Something went wrong:', error.message);
    });
}

// Promise.all - Multiple orders at once
async function orderMultipleFoods() {
  console.log('\n=== ORDERING MULTIPLE ITEMS ===');
  
  try {
    const orders = await Promise.all([
      orderFood('Pizza Hut', 'Pepperoni Pizza'),
      orderFood('Subway', 'Italian BMT'),
      orderFood('KFC', 'Fried Chicken')
    ]);
    
    console.log('🎉 All orders received:');
    orders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.order} - ${order.price}`);
    });
    
    return orders;
    
  } catch (error) {
    console.log('❌ One or more orders failed:', error.message);
  }
}

// Promise.race - First delivery wins
async function fastestDelivery() {
  console.log('\n=== FASTEST DELIVERY RACE ===');
  
  try {
    const winner = await Promise.race([
      orderFood('Fast Food', 'Quick Burger'),
      orderFood('Speed Pizza', 'Express Pizza'),
      orderFood('Rapid Delivery', 'Lightning Sandwich')
    ]);
    
    console.log('🏆 Fastest delivery winner:', winner);
    return winner;
    
  } catch (error) {
    console.log('❌ All deliveries failed:', error.message);
  }
}

// Real-world API example
class WeatherAPI {
  static fetchWeather(city) {
    return new Promise((resolve, reject) => {
      console.log(`🌤️  Fetching weather for ${city}...`);
      
      setTimeout(() => {
        if (city && city.length > 0) {
          resolve({
            city,
            temperature: Math.round(Math.random() * 30 + 10) + '°C',
            condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
            humidity: Math.round(Math.random() * 100) + '%'
          });
        } else {
          reject(new Error('Invalid city name'));
        }
      }, 1000);
    });
  }
}

async function getWeatherReport() {
  console.log('\n=== WEATHER API EXAMPLE ===');
  
  try {
    const cities = ['New York', 'London', 'Tokyo'];
    const weatherPromises = cities.map(city => WeatherAPI.fetchWeather(city));
    
    const weatherReports = await Promise.all(weatherPromises);
    
    console.log('🌍 Weather Reports:');
    weatherReports.forEach(report => {
      console.log(`${report.city}: ${report.temperature}, ${report.condition}, ${report.humidity} humidity`);
    });
    
  } catch (error) {
    console.log('❌ Weather fetch failed:', error.message);
  }
}

// Run examples
console.log('=== PROMISE PATTERN DEMO ===');

// Non-blocking - other code can run while waiting
getMyFood();
orderWithThen();

// Wait a bit then run other examples
setTimeout(() => {
  orderMultipleFoods();
}, 6000);

setTimeout(() => {
  fastestDelivery();
}, 8000);

setTimeout(() => {
  getWeatherReport();
}, 10000);

// Demonstrate non-blocking nature
console.log('🔄 This code runs immediately while orders are being processed...');
console.log('⏰ Promises allow other code to execute without waiting!');