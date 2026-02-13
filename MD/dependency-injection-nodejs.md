# Dependency Injection in Node.js

## Does Node.js Have DI?

**Short Answer**: Node.js doesn't have built-in DI like Angular or Java Spring, but you can implement it using:

1. **Manual DI** (Constructor/Function injection)
2. **DI Libraries** (InversifyJS, Awilix, TypeDI)
3. **DI Patterns** (Service locator, Factory pattern)

---

## Why Use Dependency Injection?

### Benefits

- ✅ **Testability** - Easy to mock dependencies
- ✅ **Loose Coupling** - Components don't depend on concrete implementations
- ✅ **Maintainability** - Easy to swap implementations
- ✅ **Reusability** - Components can be reused with different dependencies
- ✅ **Single Responsibility** - Classes focus on their core logic

### Without DI (Tightly Coupled) ❌

```javascript
// Bad: Tightly coupled - hard to test and maintain
class UserService {
  constructor() {
    this.database = new MySQLDatabase(); // Direct dependency
    this.emailService = new EmailService(); // Direct dependency
    this.logger = new Logger(); // Direct dependency
  }

  async createUser(userData) {
    this.logger.log("Creating user");
    const user = await this.database.save(userData);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}

// Problems:
// - Cannot test without real database
// - Cannot swap MySQL for MongoDB
// - Cannot mock email service
// - Hard to test in isolation
```

### With DI (Loosely Coupled) ✅

```javascript
// Good: Loosely coupled - easy to test and maintain
class UserService {
  constructor(database, emailService, logger) {
    this.database = database; // Injected dependency
    this.emailService = emailService; // Injected dependency
    this.logger = logger; // Injected dependency
  }

  async createUser(userData) {
    this.logger.log("Creating user");
    const user = await this.database.save(userData);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}

// Benefits:
// - Easy to inject mock database for testing
// - Can swap implementations easily
// - Can test in isolation
// - Follows SOLID principles
```

---

## 1. Manual Dependency Injection

### Constructor Injection (Recommended)

```javascript
// services/database.js
class Database {
  async save(data) {
    throw new Error("save method must be implemented");
  }

  async find(id) {
    throw new Error("find method must be implemented");
  }
}

class MySQLDatabase extends Database {
  constructor(config) {
    super();
    this.config = config;
  }

  async save(data) {
    console.log("Saving to MySQL:", data);
    return { id: Date.now(), ...data };
  }

  async find(id) {
    console.log("Finding in MySQL:", id);
    return { id, name: "User" };
  }
}

class MongoDatabase extends Database {
  constructor(config) {
    super();
    this.config = config;
  }

  async save(data) {
    console.log("Saving to MongoDB:", data);
    return { _id: Date.now(), ...data };
  }

  async find(id) {
    console.log("Finding in MongoDB:", id);
    return { _id: id, name: "User" };
  }
}

// services/email.js
class EmailService {
  async sendEmail(to, subject, body) {
    console.log(`Sending email to ${to}: ${subject}`);
  }

  async sendWelcomeEmail(email) {
    await this.sendEmail(email, "Welcome!", "Welcome to our platform");
  }
}

// services/logger.js
class Logger {
  log(message, level = "info") {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }

  error(message) {
    this.log(message, "error");
  }

  info(message) {
    this.log(message, "info");
  }
}

// services/user-service.js
class UserService {
  constructor(database, emailService, logger) {
    this.database = database;
    this.emailService = emailService;
    this.logger = logger;
  }

  async createUser(userData) {
    try {
      this.logger.info("Creating user");

      // Validate
      if (!userData.name || !userData.email) {
        throw new Error("Name and email are required");
      }

      // Save to database
      const user = await this.database.save(userData);

      // Send welcome email
      await this.emailService.sendWelcomeEmail(user.email);

      this.logger.info(`User created: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw error;
    }
  }

  async getUser(id) {
    this.logger.info(`Getting user: ${id}`);
    return await this.database.find(id);
  }
}

// app.js - Manual dependency injection
const database = new MySQLDatabase({ host: "localhost", port: 3306 });
const emailService = new EmailService();
const logger = new Logger();

// Inject dependencies
const userService = new UserService(database, emailService, logger);

// Usage
userService.createUser({ name: "John", email: "john@example.com" });

// Easy to swap implementations
const mongoDatabase = new MongoDatabase({ host: "localhost", port: 27017 });
const userServiceWithMongo = new UserService(
  mongoDatabase,
  emailService,
  logger,
);
```

### Function Injection

```javascript
// Inject dependencies as function parameters
function createUserService(database, emailService, logger) {
  return {
    async createUser(userData) {
      logger.info("Creating user");
      const user = await database.save(userData);
      await emailService.sendWelcomeEmail(user.email);
      return user;
    },

    async getUser(id) {
      logger.info(`Getting user: ${id}`);
      return await database.find(id);
    },
  };
}

// Usage
const userService = createUserService(database, emailService, logger);
```

### Property Injection

```javascript
// Less common, but useful for optional dependencies
class UserService {
  constructor(database) {
    this.database = database;
    this.emailService = null; // Optional
    this.logger = console; // Default
  }

  setEmailService(emailService) {
    this.emailService = emailService;
  }

  setLogger(logger) {
    this.logger = logger;
  }

  async createUser(userData) {
    this.logger.log("Creating user");
    const user = await this.database.save(userData);

    if (this.emailService) {
      await this.emailService.sendWelcomeEmail(user.email);
    }

    return user;
  }
}

// Usage
const userService = new UserService(database);
userService.setEmailService(emailService);
userService.setLogger(logger);
```

---

## 2. DI Container Pattern

### Simple DI Container

```javascript
// container.js - Simple DI container
class DIContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  // Register a service
  register(name, definition, options = {}) {
    this.services.set(name, {
      definition,
      singleton: options.singleton || false,
      dependencies: options.dependencies || [],
    });
  }

  // Resolve a service
  resolve(name) {
    const service = this.services.get(name);

    if (!service) {
      throw new Error(`Service '${name}' not found`);
    }

    // Return singleton instance if exists
    if (service.singleton && this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Resolve dependencies
    const dependencies = service.dependencies.map((dep) => this.resolve(dep));

    // Create instance
    const instance =
      typeof service.definition === "function"
        ? new service.definition(...dependencies)
        : service.definition(...dependencies);

    // Store singleton
    if (service.singleton) {
      this.singletons.set(name, instance);
    }

    return instance;
  }

  // Clear all services
  clear() {
    this.services.clear();
    this.singletons.clear();
  }
}

// Usage
const container = new DIContainer();

// Register services
container.register("database", MySQLDatabase, {
  singleton: true,
  dependencies: [],
});

container.register("emailService", EmailService, {
  singleton: true,
  dependencies: [],
});

container.register("logger", Logger, {
  singleton: true,
  dependencies: [],
});

container.register("userService", UserService, {
  singleton: false,
  dependencies: ["database", "emailService", "logger"],
});

// Resolve services
const userService = container.resolve("userService");
userService.createUser({ name: "John", email: "john@example.com" });
```

### Advanced DI Container with Factory Functions

```javascript
// advanced-container.js
class AdvancedDIContainer {
  constructor() {
    this.services = new Map();
    this.instances = new Map();
  }

  // Register with factory function
  registerFactory(name, factory, options = {}) {
    this.services.set(name, {
      type: "factory",
      factory,
      singleton: options.singleton || false,
    });
  }

  // Register with class
  registerClass(name, Class, options = {}) {
    this.services.set(name, {
      type: "class",
      Class,
      singleton: options.singleton || false,
      dependencies: options.dependencies || [],
    });
  }

  // Register value
  registerValue(name, value) {
    this.services.set(name, {
      type: "value",
      value,
    });
  }

  // Resolve service
  resolve(name) {
    const service = this.services.get(name);

    if (!service) {
      throw new Error(`Service '${name}' not found`);
    }

    // Return cached singleton
    if (service.singleton && this.instances.has(name)) {
      return this.instances.get(name);
    }

    let instance;

    switch (service.type) {
      case "value":
        instance = service.value;
        break;

      case "factory":
        instance = service.factory(this);
        break;

      case "class":
        const deps = service.dependencies.map((dep) => this.resolve(dep));
        instance = new service.Class(...deps);
        break;

      default:
        throw new Error(`Unknown service type: ${service.type}`);
    }

    // Cache singleton
    if (service.singleton) {
      this.instances.set(name, instance);
    }

    return instance;
  }
}

// Usage
const container = new AdvancedDIContainer();

// Register configuration
container.registerValue("config", {
  database: { host: "localhost", port: 3306 },
  email: { apiKey: "key123" },
});

// Register with factory
container.registerFactory(
  "database",
  (container) => {
    const config = container.resolve("config");
    return new MySQLDatabase(config.database);
  },
  { singleton: true },
);

// Register with class
container.registerClass("logger", Logger, { singleton: true });
container.registerClass("emailService", EmailService, { singleton: true });
container.registerClass("userService", UserService, {
  dependencies: ["database", "emailService", "logger"],
});

// Resolve
const userService = container.resolve("userService");
```

---

## 3. Using InversifyJS (Popular DI Library)

```javascript
// Install: npm install inversify reflect-metadata

// types.js - Define service identifiers
const TYPES = {
  Database: Symbol.for("Database"),
  EmailService: Symbol.for("EmailService"),
  Logger: Symbol.for("Logger"),
  UserService: Symbol.for("UserService"),
};

module.exports = TYPES;

// services with decorators
import "reflect-metadata";
import { injectable, inject } from "inversify";

// database.js
@injectable()
class MySQLDatabase {
  async save(data) {
    console.log("Saving to MySQL:", data);
    return { id: Date.now(), ...data };
  }

  async find(id) {
    console.log("Finding in MySQL:", id);
    return { id, name: "User" };
  }
}

// email.js
@injectable()
class EmailService {
  async sendWelcomeEmail(email) {
    console.log(`Sending welcome email to ${email}`);
  }
}

// logger.js
@injectable()
class Logger {
  log(message) {
    console.log(`[LOG] ${message}`);
  }
}

// user-service.js
@injectable()
class UserService {
  constructor(
    @inject(TYPES.Database) database,
    @inject(TYPES.EmailService) emailService,
    @inject(TYPES.Logger) logger,
  ) {
    this.database = database;
    this.emailService = emailService;
    this.logger = logger;
  }

  async createUser(userData) {
    this.logger.log("Creating user");
    const user = await this.database.save(userData);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}

// container.js - Configure container
import { Container } from "inversify";

const container = new Container();

container.bind(TYPES.Database).to(MySQLDatabase).inSingletonScope();
container.bind(TYPES.EmailService).to(EmailService).inSingletonScope();
container.bind(TYPES.Logger).to(Logger).inSingletonScope();
container.bind(TYPES.UserService).to(UserService);

// Usage
const userService = container.get(TYPES.UserService);
userService.createUser({ name: "John", email: "john@example.com" });
```

---

## 4. Using Awilix (Lightweight DI Library)

```javascript
// Install: npm install awilix

const awilix = require("awilix");

// Create container
const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

// Register services
container.register({
  // Register as singleton
  database: awilix.asClass(MySQLDatabase).singleton(),
  emailService: awilix.asClass(EmailService).singleton(),
  logger: awilix.asClass(Logger).singleton(),

  // Register as transient (new instance each time)
  userService: awilix.asClass(UserService).transient(),
});

// Resolve service
const userService = container.resolve("userService");

// Or use cradle for easier access
const { userService: service } = container.cradle;
service.createUser({ name: "John", email: "john@example.com" });

// Express integration
const express = require("express");
const app = express();

// Add container to request
app.use((req, res, next) => {
  req.container = container.createScope();
  next();
});

// Use in routes
app.post("/users", async (req, res) => {
  const userService = req.container.resolve("userService");
  const user = await userService.createUser(req.body);
  res.json(user);
});
```

---

## 5. Testing with DI

```javascript
// user-service.test.js
const { expect } = require("chai");
const sinon = require("sinon");

describe("UserService", () => {
  let userService;
  let mockDatabase;
  let mockEmailService;
  let mockLogger;

  beforeEach(() => {
    // Create mocks
    mockDatabase = {
      save: sinon
        .stub()
        .resolves({ id: 1, name: "John", email: "john@example.com" }),
      find: sinon.stub().resolves({ id: 1, name: "John" }),
    };

    mockEmailService = {
      sendWelcomeEmail: sinon.stub().resolves(),
    };

    mockLogger = {
      log: sinon.stub(),
      info: sinon.stub(),
      error: sinon.stub(),
    };

    // Inject mocks
    userService = new UserService(mockDatabase, mockEmailService, mockLogger);
  });

  describe("createUser", () => {
    it("should create user and send welcome email", async () => {
      const userData = { name: "John", email: "john@example.com" };

      const result = await userService.createUser(userData);

      // Verify database was called
      expect(mockDatabase.save.calledOnce).to.be.true;
      expect(mockDatabase.save.calledWith(userData)).to.be.true;

      // Verify email was sent
      expect(mockEmailService.sendWelcomeEmail.calledOnce).to.be.true;
      expect(mockEmailService.sendWelcomeEmail.calledWith("john@example.com"))
        .to.be.true;

      // Verify logger was called
      expect(mockLogger.info.called).to.be.true;

      // Verify result
      expect(result).to.deep.equal({
        id: 1,
        name: "John",
        email: "john@example.com",
      });
    });

    it("should throw error for invalid data", async () => {
      const userData = { name: "John" }; // Missing email

      try {
        await userService.createUser(userData);
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("email");
        expect(mockDatabase.save.called).to.be.false;
      }
    });
  });
});
```

---

## 6. Express.js Integration

```javascript
// app.js - Complete Express app with DI
const express = require("express");
const { createContainer, asClass, asValue } = require("awilix");
const { scopePerRequest } = require("awilix-express");

// Create container
const container = createContainer();

// Register services
container.register({
  // Configuration
  config: asValue({
    database: { host: "localhost", port: 3306 },
    email: { apiKey: "key123" },
  }),

  // Services
  database: asClass(MySQLDatabase).singleton(),
  emailService: asClass(EmailService).singleton(),
  logger: asClass(Logger).singleton(),
  userService: asClass(UserService).scoped(),
  orderService: asClass(OrderService).scoped(),
});

const app = express();
app.use(express.json());

// Add container to each request
app.use(scopePerRequest(container));

// Routes with DI
app.post("/users", async (req, res, next) => {
  try {
    const { userService } = req.container.cradle;
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

app.get("/users/:id", async (req, res, next) => {
  try {
    const { userService } = req.container.cradle;
    const user = await userService.getUser(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Error handler
app.use((err, req, res, next) => {
  const { logger } = req.container.cradle;
  logger.error(err.message);
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

## Comparison: Manual DI vs Libraries

| Feature                | Manual DI  | InversifyJS           | Awilix            |
| ---------------------- | ---------- | --------------------- | ----------------- |
| **Setup Complexity**   | Simple     | Complex               | Medium            |
| **Learning Curve**     | Easy       | Steep                 | Moderate          |
| **TypeScript Support** | Basic      | Excellent             | Good              |
| **Decorators**         | No         | Yes                   | Optional          |
| **Performance**        | Fast       | Slower                | Fast              |
| **Bundle Size**        | Minimal    | Large                 | Small             |
| **Best For**           | Small apps | Large TypeScript apps | Medium-large apps |

## Best Practices

1. **Use Constructor Injection** - Most explicit and testable
2. **Avoid Service Locator** - Makes dependencies implicit
3. **Register at Startup** - Configure container once
4. **Use Interfaces** - Depend on abstractions, not concretions
5. **Keep It Simple** - Don't over-engineer for small projects
6. **Test with Mocks** - DI makes testing much easier

## When to Use DI

✅ **Use DI When:**

- Building large applications
- Need high testability
- Multiple implementations of same interface
- Complex dependency graphs
- Team collaboration

❌ **Skip DI When:**

- Simple scripts or utilities
- Prototypes or MVPs
- Single-file applications
- Performance is critical

Node.js doesn't have built-in DI, but with proper patterns and libraries, you can achieve excellent dependency management and testability!
