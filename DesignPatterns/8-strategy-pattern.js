/**
 * STRATEGY PATTERN
 * Real-World Example: Navigation App (Google Maps)
 * 
 * WHEN TO USE:
 * - Multiple algorithms for same task
 * - Runtime algorithm selection
 * - Avoiding conditional statements
 * - Plugin architectures
 * 
 * WHY TO USE:
 * - Flexibility: Easy to switch algorithms
 * - Extensibility: Easy to add new strategies
 * - Clean code: Eliminates complex conditionals
 * - Testability: Each strategy can be tested independently
 */

// Like Google Maps - different routes for same destination
class NavigationApp {
  constructor(routeStrategy) {
    this.routeStrategy = routeStrategy;
  }
  
  setRouteStrategy(strategy) {
    this.routeStrategy = strategy;
    console.log(`🔄 Route strategy changed to: ${strategy.name}`);
  }
  
  calculateRoute(from, to) {
    console.log(`🗺️  Calculating route from ${from} to ${to}...`);
    return this.routeStrategy.calculate(from, to);
  }
  
  getAvailableStrategies() {
    return Object.keys(routingStrategies);
  }
}

// Different routing strategies
const routingStrategies = {
  fastest: {
    name: 'Fastest Route',
    calculate: (from, to) => ({
      route: `${from} → Highway → ${to}`,
      time: '25 minutes',
      distance: '30 miles',
      cost: '$3.50 (tolls)',
      fuelUsage: '2.1 gallons',
      description: '🚗 Fastest route via highway',
      trafficLevel: 'moderate'
    })
  },
  
  shortest: {
    name: 'Shortest Distance',
    calculate: (from, to) => ({
      route: `${from} → City Streets → ${to}`,
      time: '35 minutes', 
      distance: '22 miles',
      cost: '$0 (no tolls)',
      fuelUsage: '1.8 gallons',
      description: '📍 Shortest distance via city roads',
      trafficLevel: 'heavy'
    })
  },
  
  scenic: {
    name: 'Scenic Route',
    calculate: (from, to) => ({
      route: `${from} → Coastal Road → ${to}`,
      time: '45 minutes',
      distance: '28 miles', 
      cost: '$0 (no tolls)',
      fuelUsage: '2.0 gallons',
      description: '🌊 Scenic route along the coast',
      trafficLevel: 'light'
    })
  },
  
  eco: {
    name: 'Eco-Friendly',
    calculate: (from, to) => ({
      route: `${from} → Bike Lanes → ${to}`,
      time: '60 minutes',
      distance: '20 miles',
      cost: '$0 (eco-friendly)',
      fuelUsage: '0 gallons (bike)',
      description: '🚴 Most eco-friendly route',
      trafficLevel: 'none'
    })
  },
  
  budget: {
    name: 'Budget Route',
    calculate: (from, to) => ({
      route: `${from} → Free Roads → ${to}`,
      time: '40 minutes',
      distance: '26 miles',
      cost: '$0 (no tolls)',
      fuelUsage: '1.9 gallons',
      description: '💰 Most cost-effective route',
      trafficLevel: 'moderate'
    })
  }
};

// Usage Examples
console.log('=== STRATEGY PATTERN DEMO ===');

// User can switch strategies based on preference
const maps = new NavigationApp(routingStrategies.fastest);

console.log('🗺️  Route Options:');
let route = maps.calculateRoute('Home', 'Office');
console.log(route);

// User changes preference to scenic
console.log('\n--- Switching to scenic route ---');
maps.setRouteStrategy(routingStrategies.scenic);
route = maps.calculateRoute('Home', 'Office');
console.log(route);

// Rush hour - switch to shortest
console.log('\n--- Rush hour: switching to shortest ---');
maps.setRouteStrategy(routingStrategies.shortest);
route = maps.calculateRoute('Home', 'Office');
console.log(route);

// Compare all strategies
console.log('\n=== COMPARING ALL STRATEGIES ===');
const from = 'Downtown';
const to = 'Airport';

Object.entries(routingStrategies).forEach(([key, strategy]) => {
  const result = strategy.calculate(from, to);
  console.log(`\n${strategy.name}:`);
  console.log(`  ${result.description}`);
  console.log(`  Time: ${result.time}, Distance: ${result.distance}`);
  console.log(`  Cost: ${result.cost}, Fuel: ${result.fuelUsage}`);
});

// Real-world example: Payment Processing
class PaymentProcessor {
  constructor(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }
  
  setPaymentStrategy(strategy) {
    this.paymentStrategy = strategy;
    console.log(`💳 Payment method changed to: ${strategy.name}`);
  }
  
  processPayment(amount, details = {}) {
    console.log(`💰 Processing $${amount} payment...`);
    return this.paymentStrategy.process(amount, details);
  }
}

const paymentStrategies = {
  creditCard: {
    name: 'Credit Card',
    process: (amount, details) => {
      const fee = amount * 0.029; // 2.9% fee
      return {
        method: 'Credit Card',
        amount: amount,
        fee: fee.toFixed(2),
        total: (amount + fee).toFixed(2),
        processingTime: '2-3 seconds',
        security: 'High (encrypted)',
        cardNumber: `****-****-****-${details.cardNumber?.slice(-4) || '1234'}`
      };
    }
  },
  
  paypal: {
    name: 'PayPal',
    process: (amount, details) => {
      const fee = amount * 0.034; // 3.4% fee
      return {
        method: 'PayPal',
        amount: amount,
        fee: fee.toFixed(2),
        total: (amount + fee).toFixed(2),
        processingTime: '1-2 seconds',
        security: 'High (OAuth)',
        email: details.email || 'user@example.com'
      };
    }
  },
  
  crypto: {
    name: 'Cryptocurrency',
    process: (amount, details) => {
      const fee = 5.00; // Fixed $5 network fee
      return {
        method: 'Cryptocurrency',
        amount: amount,
        fee: fee.toFixed(2),
        total: (amount + fee).toFixed(2),
        processingTime: '10-30 minutes',
        security: 'Very High (blockchain)',
        wallet: details.wallet || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      };
    }
  },
  
  bankTransfer: {
    name: 'Bank Transfer',
    process: (amount, details) => {
      const fee = 0; // No fee for bank transfer
      return {
        method: 'Bank Transfer',
        amount: amount,
        fee: fee.toFixed(2),
        total: amount.toFixed(2),
        processingTime: '1-3 business days',
        security: 'High (bank-grade)',
        account: details.account || '****-****-1234'
      };
    }
  }
};

console.log('\n=== PAYMENT PROCESSING EXAMPLE ===');

const paymentProcessor = new PaymentProcessor(paymentStrategies.creditCard);

// Process payment with different strategies
const amount = 100;

console.log('\n--- Credit Card Payment ---');
let result = paymentProcessor.processPayment(amount, { cardNumber: '4532123456789012' });
console.log(result);

console.log('\n--- Switching to PayPal ---');
paymentProcessor.setPaymentStrategy(paymentStrategies.paypal);
result = paymentProcessor.processPayment(amount, { email: 'john@example.com' });
console.log(result);

console.log('\n--- Switching to Cryptocurrency ---');
paymentProcessor.setPaymentStrategy(paymentStrategies.crypto);
result = paymentProcessor.processPayment(amount, { wallet: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5' });
console.log(result);

// Sorting strategies example
class DataSorter {
  constructor(sortStrategy) {
    this.sortStrategy = sortStrategy;
  }
  
  setSortStrategy(strategy) {
    this.sortStrategy = strategy;
  }
  
  sort(data) {
    console.log(`🔄 Sorting data using ${this.sortStrategy.name}...`);
    const startTime = Date.now();
    const result = this.sortStrategy.sort([...data]); // Clone array
    const endTime = Date.now();
    
    return {
      sorted: result,
      algorithm: this.sortStrategy.name,
      time: `${endTime - startTime}ms`,
      complexity: this.sortStrategy.complexity
    };
  }
}

const sortingStrategies = {
  bubble: {
    name: 'Bubble Sort',
    complexity: 'O(n²)',
    sort: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          }
        }
      }
      return arr;
    }
  },
  
  quick: {
    name: 'Quick Sort',
    complexity: 'O(n log n)',
    sort: (arr) => {
      if (arr.length <= 1) return arr;
      
      const pivot = arr[Math.floor(arr.length / 2)];
      const left = arr.filter(x => x < pivot);
      const middle = arr.filter(x => x === pivot);
      const right = arr.filter(x => x > pivot);
      
      return [...sortingStrategies.quick.sort(left), ...middle, ...sortingStrategies.quick.sort(right)];
    }
  },
  
  merge: {
    name: 'Merge Sort',
    complexity: 'O(n log n)',
    sort: (arr) => {
      if (arr.length <= 1) return arr;
      
      const mid = Math.floor(arr.length / 2);
      const left = sortingStrategies.merge.sort(arr.slice(0, mid));
      const right = sortingStrategies.merge.sort(arr.slice(mid));
      
      return merge(left, right);
    }
  }
};

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

console.log('\n=== SORTING STRATEGIES EXAMPLE ===');

const sorter = new DataSorter(sortingStrategies.bubble);
const testData = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42];

console.log('Original data:', testData);

// Test different sorting strategies
Object.entries(sortingStrategies).forEach(([key, strategy]) => {
  sorter.setSortStrategy(strategy);
  const result = sorter.sort(testData);
  console.log(`\n${result.algorithm}:`);
  console.log(`  Sorted: [${result.sorted.join(', ')}]`);
  console.log(`  Time: ${result.time}, Complexity: ${result.complexity}`);
});

// Dynamic strategy selection based on data size
function selectOptimalSortingStrategy(dataSize) {
  if (dataSize < 10) {
    return sortingStrategies.bubble; // Simple for small data
  } else if (dataSize < 1000) {
    return sortingStrategies.quick; // Good for medium data
  } else {
    return sortingStrategies.merge; // Stable for large data
  }
}

console.log('\n=== DYNAMIC STRATEGY SELECTION ===');
const smallData = [3, 1, 4, 1, 5];
const optimalStrategy = selectOptimalSortingStrategy(smallData.length);
sorter.setSortStrategy(optimalStrategy);
const optimalResult = sorter.sort(smallData);
console.log(`Optimal strategy for ${smallData.length} items: ${optimalResult.algorithm}`);