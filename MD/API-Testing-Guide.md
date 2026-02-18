# API Testing Guide - Express.js Application

## Base URL
```
http://localhost:3111
```

---

## 1. Test Home Route (GET /)

### cURL Request
```bash
curl -X GET http://localhost:3111/
```

### Postman
- **Method**: GET
- **URL**: `http://localhost:3111/`
- **Headers**: None required
- **Body**: None

### Expected Response
```
Hello, Welcome to the Express starter template for Stackblitz!
```

---

## 2. Get All Products (GET /products) - WITH AUTH

### First, Generate a JWT Token

You need to generate a JWT token first. Add this route to your express.js file temporarily:

```javascript
// Add this route to generate token for testing
app.post('/login', (req, res) => {
  const user = { id: 1, username: 'testuser' };
  const token = jwt.sign(user, 'your-secret-key', { expiresIn: '1h' });
  res.json({ token });
});
```

### Generate Token - cURL
```bash
curl -X POST http://localhost:3111/login \
  -H "Content-Type: application/json"
```

### Generate Token - Postman
- **Method**: POST
- **URL**: `http://localhost:3111/login`
- **Headers**: 
  - `Content-Type: application/json`
- **Body**: None

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Products with Token - cURL
```bash
# Replace YOUR_TOKEN_HERE with actual token from login
curl -X GET http://localhost:3111/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Products with Token - Postman
- **Method**: GET
- **URL**: `http://localhost:3111/products`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Body**: None

### Expected Response (Success)
```json
[
  { "id": 1, "name": "Laptop", "price": 1000 },
  { "id": 2, "name": "Mobile", "price": 500 }
]
```

### Expected Response (No Token)
```json
{
  "message": "No token provided"
}
```

### Expected Response (Invalid Token)
```json
{
  "message": "Invalid token"
}
```

---

## 3. Create Product (POST /products)

**Note**: Your current code has a bug - it doesn't use `express.json()` middleware. Add this line before routes:

```javascript
app.use(express.json()); // Add this line in your express.js
```

### cURL Request
```bash
curl -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tablet",
    "price": 300
  }'
```

### Postman
- **Method**: POST
- **URL**: `http://localhost:3111/products`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Tablet",
  "price": 300
}
```

### Expected Response
```json
{
  "id": 3,
  "name": "Tablet",
  "price": 300
}
```

---

## 4. Delete Product (DELETE /products/:id)

**Note**: Your current code has a bug in the route. It should be `/products/:id` not `/products`. Fix:

```javascript
// Change this line in your express.js
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});
```

### cURL Request
```bash
# Delete product with ID 1
curl -X DELETE http://localhost:3111/products/1
```

### Postman
- **Method**: DELETE
- **URL**: `http://localhost:3111/products/1`
- **Headers**: None required
- **Body**: None

### Expected Response
- **Status Code**: 204 No Content
- **Body**: Empty

---

## Complete Fixed Code

Here's your complete fixed `express.js` file:

```javascript
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3111;

// Add JSON middleware
app.use(express.json());

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, "your-secret-key", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

let products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Mobile", price: 500 },
];

// Home route
app.get("/", (req, res) => {
  res.send("Hello, Welcome to the Express starter template for Stackblitz!");
});

// Login route to generate token
app.post("/login", (req, res) => {
  const user = { id: 1, username: "testuser" };
  const token = jwt.sign(user, "your-secret-key", { expiresIn: "1h" });
  res.json({ token });
});

// Get all products (protected)
app.get("/products", authMiddleware, (req, res) => {
  res.json(products);
});

// Create product
app.post("/products", (req, res) => {
  const newProduct = req.body;
  newProduct.id = products.length + 1;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Delete product (FIXED)
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`App is live at http://localhost:${port}`);
});
```

---

## Postman Collection JSON

Import this into Postman:

```json
{
  "info": {
    "name": "Express API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Home",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3111/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3111",
          "path": [""]
        }
      }
    },
    {
      "name": "Login - Get Token",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3111/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3111",
          "path": ["login"]
        }
      }
    },
    {
      "name": "Get Products (Protected)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer YOUR_TOKEN_HERE",
            "description": "Replace with actual token from login"
          }
        ],
        "url": {
          "raw": "http://localhost:3111/products",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3111",
          "path": ["products"]
        }
      }
    },
    {
      "name": "Create Product",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Tablet\",\n  \"price\": 300\n}"
        },
        "url": {
          "raw": "http://localhost:3111/products",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3111",
          "path": ["products"]
        }
      }
    },
    {
      "name": "Delete Product",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "http://localhost:3111/products/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3111",
          "path": ["products", "1"]
        }
      }
    }
  ]
}
```

---

## Testing Workflow

### Step 1: Start Server
```bash
node express.js
```

### Step 2: Test Home Route
```bash
curl http://localhost:3111/
```

### Step 3: Generate Token
```bash
curl -X POST http://localhost:3111/login
```

**Save the token from response!**

### Step 4: Get Products (with token)
```bash
curl -X GET http://localhost:3111/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 5: Create Product
```bash
curl -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Tablet","price":300}'
```

### Step 6: Delete Product
```bash
curl -X DELETE http://localhost:3111/products/1
```

---

## Common Issues & Solutions

### Issue 1: "Cannot read property 'name' of undefined"
**Solution**: Add `app.use(express.json())` before routes

### Issue 2: "Cannot DELETE /products"
**Solution**: Change route to `/products/:id`

### Issue 3: "No token provided" even with token
**Solution**: Ensure Authorization header format is `Bearer <token>` with space

### Issue 4: Token comparison issue in delete
**Solution**: Use `!==` instead of `!=` for strict comparison

---

## Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3111"

echo "1. Testing Home Route..."
curl -s $BASE_URL/
echo -e "\n"

echo "2. Getting Token..."
TOKEN=$(curl -s -X POST $BASE_URL/login | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo -e "\n"

echo "3. Getting Products (with auth)..."
curl -s -X GET $BASE_URL/products \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

echo "4. Creating Product..."
curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Tablet","price":300}'
echo -e "\n"

echo "5. Getting Products Again..."
curl -s -X GET $BASE_URL/products \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

echo "6. Deleting Product..."
curl -s -X DELETE $BASE_URL/products/1
echo -e "\n"

echo "7. Final Product List..."
curl -s -X GET $BASE_URL/products \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"
```

Run with:
```bash
chmod +x test-api.sh
./test-api.sh
```

This guide provides everything you need to test your Express.js API with both cURL and Postman!