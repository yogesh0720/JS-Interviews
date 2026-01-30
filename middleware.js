const express = require("express");
const app = express();

// First middleware
app.use((req, res, next) => {
  console.log("Middleware 1: This always runs");
  next();
});

// Second middleware
app.use((req, res, next) => {
  console.log("Middleware 2: This also always runs");
  next();
});

// Route handler
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
