const EventEmitter = require("events");

class Greeter extends EventEmitter {
  greet(name) {
    this.emit("greet", {
      message: `Hello, ${name}!`,
      timestamp: new Date(),
    });
  }
}

// Usage
const greeter = new Greeter();

greeter.on("greet", (data) => {
  console.log(data.message);
});

greeter.greet("Yogesh");
