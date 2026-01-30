// npm install dd-trace express

// datadog.js
const tracer = require("dd-trace");

tracer.init({
  service: "node-backend-service",
  env: "local",
  logInjection: true,
});

module.exports = tracer;
