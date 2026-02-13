# SOLID Principles in JavaScript/Node.js

This folder contains comprehensive examples of all 5 SOLID principles with real-world implementations perfect for interview preparation.

## 📁 Files Structure

```
SOLID/
├── 1-single-responsibility.js    # User management system
├── 2-open-closed.js             # Shape calculator & discount system
├── 3-liskov-substitution.js     # Bird hierarchy & payment system
├── 4-interface-segregation.js   # Worker interfaces & media player
├── 5-dependency-inversion.js    # Database abstraction & notification system
├── index.js                     # Run all principles
└── README.md                   # This file
```

## 🚀 How to Run

### Run All Principles

```bash
node SOLID/index.js
```

### Run Specific Principle

```bash
node SOLID/index.js 1    # Single Responsibility Principle
node SOLID/index.js 2    # Open/Closed Principle
node SOLID/index.js 3    # Liskov Substitution Principle
node SOLID/index.js 4    # Interface Segregation Principle
node SOLID/index.js 5    # Dependency Inversion Principle
```

### Run Individual Files

```bash
node SOLID/1-single-responsibility.js
node SOLID/2-open-closed.js
# ... etc
```

### Show Help

```bash
node SOLID/index.js help
```

## 📋 SOLID Principles Overview

| Principle                 | Acronym | Definition                                            | Key Benefit             |
| ------------------------- | ------- | ----------------------------------------------------- | ----------------------- |
| **Single Responsibility** | **S**RP | A class should have only one reason to change         | Easier maintenance      |
| **Open/Closed**           | **O**CP | Open for extension, closed for modification           | Stable, extensible code |
| **Liskov Substitution**   | **L**SP | Subclasses should be substitutable for parent classes | True polymorphism       |
| **Interface Segregation** | **I**SP | Clients shouldn't depend on unused methods            | Focused interfaces      |
| **Dependency Inversion**  | **D**IP | Depend on abstractions, not concretions               | Flexible, testable code |

## 🎯 Real-World Examples

### 1. Single Responsibility Principle (SRP)

- **Bad**: User class handling data, email, database, validation
- **Good**: Separate classes for User, EmailService, UserRepository, EmailValidator
- **Real Example**: E-commerce order system with separate services

### 2. Open/Closed Principle (OCP)

- **Bad**: AreaCalculator with if/else for each shape type
- **Good**: Shape interface with concrete implementations
- **Real Example**: Discount system, notification channels

### 3. Liskov Substitution Principle (LSP)

- **Bad**: Penguin extends Bird but throws error on fly()
- **Good**: Separate FlyingBird and SwimmingBird classes
- **Real Example**: Payment methods, vehicle hierarchy

### 4. Interface Segregation Principle (ISP)

- **Bad**: Fat Worker interface forcing robots to implement eat()
- **Good**: Separate interfaces for Workable, Eatable, Sleepable
- **Real Example**: Media player system, document processor

### 5. Dependency Inversion Principle (DIP)

- **Bad**: UserService directly creating MySQLDatabase
- **Good**: UserService depends on Database abstraction
- **Real Example**: Notification system, payment gateways

## 🎓 Interview Preparation

### Common Questions & Answers

**Q: What are SOLID principles?**
A: SOLID is an acronym for five design principles that make software more maintainable, flexible, and scalable.

**Q: Why is Single Responsibility important?**
A: It makes code easier to maintain, test, and understand. Changes affect only one class.

**Q: How does Open/Closed principle work?**
A: You can add new functionality by extending existing code, not modifying it. Use inheritance and polymorphism.

**Q: What's the difference between LSP and inheritance?**
A: LSP ensures subclasses can replace parent classes without breaking functionality. Regular inheritance doesn't guarantee this.

**Q: When would you use Interface Segregation?**
A: When interfaces become too large and classes are forced to implement methods they don't need.

**Q: How does Dependency Inversion help with testing?**
A: You can inject mock implementations instead of real dependencies, making unit tests easier.

### Key Points to Remember

1. **SRP**: One class, one job
2. **OCP**: Extend, don't modify
3. **LSP**: Subclasses must work like parent
4. **ISP**: Small, focused interfaces
5. **DIP**: Depend on abstractions

## 🔧 Code Features

Each principle file includes:

- ✅ **Bad examples** showing violations
- ✅ **Good examples** following the principle
- ✅ **Real-world scenarios** (e-commerce, media players, etc.)
- ✅ **Multiple use cases** demonstrating flexibility
- ✅ **Complete working code** ready to run
- ✅ **Clear explanations** of when and why to use

## 💡 Benefits of Following SOLID

### Maintainability

- Changes are localized and predictable
- Easy to find and fix bugs
- Clear separation of concerns

### Testability

- Each component can be tested independently
- Easy to mock dependencies
- Better test coverage

### Flexibility

- Easy to swap implementations
- Support for multiple providers/strategies
- Adaptable to changing requirements

### Scalability

- Easy to add new features
- Modular architecture
- Reduced coupling between components

## 🌟 Best Practices

1. **Don't over-engineer**: Apply principles when they solve real problems
2. **Start simple**: Refactor towards SOLID as complexity grows
3. **Consider trade-offs**: Sometimes breaking a principle is acceptable
4. **Focus on readability**: Code should be easy to understand
5. **Test your design**: Good architecture makes testing easier

## 📚 Additional Resources

- [Clean Code by Robert Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [SOLID Principles Explained](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns)

---

**Happy Learning! 🎉**

These examples will help you confidently explain SOLID principles in interviews with practical, real-world context that demonstrates the value of good software design.
