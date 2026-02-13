# JavaScript/Node.js Design Patterns

This folder contains comprehensive examples of 8 essential design patterns with real-world implementations perfect for interview preparation.

## 📁 Files Structure

```
DesignPatterns/
├── 1-module-pattern.js      # Shopping Cart (Amazon-like)
├── 2-singleton-pattern.js   # Application Logger (Winston-like)
├── 3-observer-pattern.js    # YouTube Notifications
├── 4-factory-pattern.js     # Vehicle Manufacturing (Tesla-like)
├── 5-promise-pattern.js     # Food Delivery App (Uber Eats-like)
├── 6-middleware-pattern.js  # Airport Security Check
├── 7-prototype-pattern.js   # Game Character Creation (RPG)
├── 8-strategy-pattern.js    # Navigation App (Google Maps-like)
├── index.js                 # Run all patterns
└── README.md               # This file
```

## 🚀 How to Run

### Run All Patterns

```bash
node DesignPatterns/index.js
```

### Run Specific Pattern

```bash
node DesignPatterns/index.js 1    # Module Pattern
node DesignPatterns/index.js 2    # Singleton Pattern
node DesignPatterns/index.js 3    # Observer Pattern
# ... and so on
```

### Run Individual Files

```bash
node DesignPatterns/1-module-pattern.js
node DesignPatterns/2-singleton-pattern.js
# ... etc
```

### Show Help

```bash
node DesignPatterns/index.js help
```

## 📋 Pattern Overview

| Pattern        | Real-World Example     | When to Use                      | Key Benefits                        |
| -------------- | ---------------------- | -------------------------------- | ----------------------------------- |
| **Module**     | Shopping Cart (Amazon) | Private variables, libraries     | Encapsulation, namespace management |
| **Singleton**  | Application Logger     | Database connections, config     | Resource control, global access     |
| **Observer**   | YouTube Notifications  | Event systems, real-time updates | Loose coupling, scalability         |
| **Factory**    | Vehicle Manufacturing  | Complex object creation          | Flexibility, centralized creation   |
| **Promise**    | Food Delivery App      | Async operations, API calls      | Non-blocking, error handling        |
| **Middleware** | Airport Security       | Request processing, pipelines    | Modularity, reusability             |
| **Prototype**  | Game Characters        | Object templates, cloning        | Performance, memory efficiency      |
| **Strategy**   | Navigation Routes      | Multiple algorithms              | Flexibility, clean code             |

## 🎯 Interview Tips

### For Each Pattern, Be Ready to Explain:

1. **What it is**: Brief definition
2. **Real-world example**: Relatable scenario
3. **When to use**: Specific use cases
4. **Why to use**: Benefits and advantages
5. **Code example**: Simple implementation
6. **Alternatives**: Other patterns that could work

### Sample Interview Questions:

- "Explain the Singleton pattern with a real example"
- "How would you implement an Observer pattern for a notification system?"
- "What's the difference between Factory and Strategy patterns?"
- "When would you use Promises over callbacks?"
- "How does the Module pattern help with encapsulation?"

## 🔧 Code Features

Each pattern file includes:

- ✅ **Detailed comments** explaining when and why to use
- ✅ **Real-world examples** that are easy to understand
- ✅ **Multiple use cases** showing pattern flexibility
- ✅ **Complete working code** ready to run
- ✅ **Performance comparisons** where relevant
- ✅ **Best practices** and common pitfalls

## 🌟 Key Takeaways

1. **Node.js and JavaScript share the same patterns** - they're built on the same language
2. **Choose patterns based on problems** - don't force patterns where they're not needed
3. **Real-world examples** make patterns easier to remember and explain
4. **Practice explaining** each pattern in simple terms
5. **Understand trade-offs** - every pattern has pros and cons

## 📚 Additional Resources

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns)

---

**Happy Learning! 🎉**

These examples will help you confidently explain design patterns in interviews with real-world context that interviewers can easily understand and relate to.
