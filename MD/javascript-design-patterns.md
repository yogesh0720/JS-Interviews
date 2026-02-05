# JavaScript/Node.js Design Patterns

## Overview

Node.js and JavaScript share the same design patterns since Node.js is built on JavaScript. The patterns work identically in both environments, though some are more commonly used in specific contexts (browser vs server).

---

## 1. Module Pattern

### Example

```javascript
// Encapsulates private variables and methods
const Calculator = (() => {
  let result = 0;

  return {
    add: (x) => (result += x),
    subtract: (x) => (result -= x),
    getResult: () => result,
    reset: () => (result = 0),
  };
})();

// Usage
Calculator.add(5);
Calculator.subtract(2);
console.log(Calculator.getResult()); // 3
```

### When to Use

- Need to create private variables/methods
- Want to avoid global namespace pollution
- Building libraries or utilities
- Creating encapsulated functionality

### Why to Use

- **Encapsulation**: Keeps internal state private
- **Namespace management**: Prevents variable conflicts
- **Clean API**: Exposes only necessary methods
- **Memory efficiency**: Single instance with shared methods

---

## 2. Singleton Pattern

### Example

```javascript
class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    this.connection = "connected";
    this.data = [];
    Database.instance = this;
  }

  query(sql) {
    return `Executing: ${sql}`;
  }
}

// Usage
const db1 = new Database();
const db2 = new Database(); // Same instance
console.log(db1 === db2); // true
```

### When to Use

- Database connections
- Configuration objects
- Logging services
- Cache managers
- Application state management

### Why to Use

- **Resource control**: Ensures single instance of expensive resources
- **Global access**: Provides single point of access
- **Memory efficiency**: Prevents multiple instances
- **State consistency**: Maintains single source of truth

---

## 3. Observer Pattern

### Example

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(callback);
  }

  emit(event, data) {
    this.events[event]?.forEach((callback) => callback(data));
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }
}

// Usage
const emitter = new EventEmitter();
emitter.on("user-login", (user) => console.log(`${user} logged in`));
emitter.emit("user-login", "John"); // John logged in
```

### When to Use

- Event-driven architectures
- Model-View patterns
- Real-time notifications
- Decoupled communication between components
- DOM event handling

### Why to Use

- **Loose coupling**: Components don't need direct references
- **Scalability**: Easy to add/remove observers
- **Separation of concerns**: Clear event-based communication
- **Flexibility**: Dynamic subscription/unsubscription

---

## 4. Factory Pattern

### Example

```javascript
class UserFactory {
  static createUser(type, name, email) {
    const baseUser = { name, email, createdAt: new Date() };

    switch (type) {
      case "admin":
        return {
          ...baseUser,
          role: "admin",
          permissions: ["read", "write", "delete"],
        };
      case "editor":
        return { ...baseUser, role: "editor", permissions: ["read", "write"] };
      case "viewer":
        return { ...baseUser, role: "viewer", permissions: ["read"] };
      default:
        throw new Error("Invalid user type");
    }
  }
}

// Usage
const admin = UserFactory.createUser("admin", "John", "john@example.com");
const viewer = UserFactory.createUser("viewer", "Jane", "jane@example.com");
```

### When to Use

- Creating objects with complex initialization
- Multiple object types with similar structure
- Runtime object creation decisions
- Abstracting object creation logic

### Why to Use

- **Flexibility**: Easy to add new object types
- **Centralized creation**: Single place for object creation logic
- **Consistency**: Ensures objects are created correctly
- **Abstraction**: Hides complex creation details

---

## 5. Promise Pattern (Async)

### Example

```javascript
// Promise creation
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: "User" + userId });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 1000);
  });
}

// Usage with async/await
async function getUserInfo(userId) {
  try {
    const user = await fetchUserData(userId);
    return user;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Usage with .then()
fetchUserData(1)
  .then((user) => console.log(user))
  .catch((error) => console.error(error));
```

### When to Use

- Asynchronous operations
- API calls
- File operations
- Database queries
- Any non-blocking operations

### Why to Use

- **Non-blocking**: Prevents UI freezing
- **Error handling**: Built-in error propagation
- **Composability**: Easy to chain operations
- **Readability**: Cleaner than callbacks

---

## 6. Middleware Pattern

### Example

```javascript
class MiddlewareManager {
  constructor() {
    this.middleware = [];
  }

  use(fn) {
    this.middleware.push(fn);
  }

  async execute(context) {
    let index = 0;

    const next = async () => {
      if (index < this.middleware.length) {
        const middleware = this.middleware[index++];
        await middleware(context, next);
      }
    };

    await next();
  }
}

// Usage
const app = new MiddlewareManager();

app.use(async (ctx, next) => {
  console.log("Auth middleware");
  ctx.user = { id: 1 };
  await next();
});

app.use(async (ctx, next) => {
  console.log("Logging middleware");
  console.log("User:", ctx.user);
  await next();
});

app.execute({});
```

### When to Use

- Request/response processing (Express.js)
- Data transformation pipelines
- Authentication/authorization
- Logging and monitoring
- Input validation

### Why to Use

- **Modularity**: Separate concerns into discrete functions
- **Reusability**: Middleware can be reused across routes
- **Flexibility**: Easy to add/remove/reorder middleware
- **Separation of concerns**: Each middleware has single responsibility

---

## 7. Prototype Pattern

### Example

```javascript
const vehiclePrototype = {
  init(make, model) {
    this.make = make;
    this.model = model;
    return this;
  },

  start() {
    console.log(`${this.make} ${this.model} engine started`);
  },

  clone() {
    return Object.create(this);
  },
};

// Usage
const car1 = vehiclePrototype.clone().init("Toyota", "Camry");
const car2 = vehiclePrototype.clone().init("Honda", "Civic");

car1.start(); // Toyota Camry engine started
car2.start(); // Honda Civic engine started
```

### When to Use

- Creating objects from templates
- When object creation is expensive
- Need multiple similar objects
- Dynamic object creation

### Why to Use

- **Performance**: Faster than creating from scratch
- **Memory efficiency**: Shares methods through prototype chain
- **Flexibility**: Easy to modify prototypes
- **Dynamic creation**: Create objects at runtime

---

## 8. Strategy Pattern

### Example

```javascript
class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  processPayment(amount) {
    return this.strategy.process(amount);
  }
}

const paymentStrategies = {
  creditCard: {
    process: (amount) => `Processing $${amount} via Credit Card`,
  },
  paypal: {
    process: (amount) => `Processing $${amount} via PayPal`,
  },
  crypto: {
    process: (amount) => `Processing $${amount} via Cryptocurrency`,
  },
};

// Usage
const processor = new PaymentProcessor(paymentStrategies.creditCard);
console.log(processor.processPayment(100));

processor.setStrategy(paymentStrategies.paypal);
console.log(processor.processPayment(50));
```

### When to Use

- Multiple algorithms for same task
- Runtime algorithm selection
- Avoiding conditional statements
- Plugin architectures

### Why to Use

- **Flexibility**: Easy to switch algorithms
- **Extensibility**: Easy to add new strategies
- **Clean code**: Eliminates complex conditionals
- **Testability**: Each strategy can be tested independently

---

## Environment-Specific Usage

### Browser-Specific Patterns

- **Module Pattern**: Namespace management, avoiding global pollution
- **Observer Pattern**: DOM event handling, UI state management
- **Singleton Pattern**: Application configuration, user session

### Node.js-Specific Patterns

- **Middleware Pattern**: Express.js request processing
- **Observer Pattern**: EventEmitter for server events
- **Factory Pattern**: Creating different types of server responses
- **Promise Pattern**: File system operations, database queries

---

## Best Practices

1. **Choose the right pattern**: Don't force patterns where they're not needed
2. **Keep it simple**: Use the simplest pattern that solves your problem
3. **Consider performance**: Some patterns have overhead
4. **Test thoroughly**: Patterns can add complexity
5. **Document usage**: Make pattern usage clear to other developers

---

## Conclusion

Design patterns provide proven solutions to common programming problems. In JavaScript/Node.js, these patterns help create maintainable, scalable, and efficient applications. Choose patterns based on your specific needs and context rather than trying to use all of them.
