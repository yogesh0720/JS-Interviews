const express = require("express");
// const jwt = require("jsonwebtoken"); // Import JWT library
const app = express();
const port = 3111;

// const authMiddleware = (req, res, next) => {
//   // Middleware function
//   const authHeader = req.headers["authorization"]; // Get auth header
//   if (!authHeader)
//     return res.status(401).json({ message: "No token provided" }); // No token

//   const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
//   if (!token) return res.status(401).json({ message: "No token provided" }); // No token

//   jwt.verify(token, "your-secret-key", (err, user) => {
//     // Verify token
//     if (err) return res.status(403).json({ message: "Invalid token" }); // Invalid token
//     req.user = user; // Attach user info to request
//     next(); // Proceed to next middleware/route
//   });
// };

//module.exports = authMiddleware; // Export middleware

let products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Mobile", price: 500 },
];

app.get("/", (req, res) => {
  res.send("Hello, Welcome to the Express starter template for Stackblitz!");
});

// Only authorized users reach here
app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/products", (req, res) => {
  const newProduct = req.body;
  newProduct.id = products.length + 1;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.delete("/products", (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`App is live at http://localhost:${port}`);
});
