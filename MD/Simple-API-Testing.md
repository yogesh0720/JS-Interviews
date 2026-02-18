# Simple API Testing Guide - No Authentication

## Base URL
```
http://localhost:3111
```

---

## Fixed Code First

Your code has 2 bugs. Here's the fixed version:

```javascript
const express = require("express");
const app = express();
const port = 3111;

// Add this line to parse JSON body
app.use(express.json());

let products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Mobile", price: 500 },
];

app.get("/", (req, res) => {
  res.send("Hello, Welcome to the Express starter template for Stackblitz!");
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/products", (req, res) => {
  const newProduct = req.body;
  newProduct.id = products.length + 1;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Fixed: Changed /products to /products/:id
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter((p) => p.id !== id); // Fixed: != to !==
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`App is live at http://localhost:${port}`);
});
```

---

## 1. GET / - Home Route

### cURL
```bash
curl http://localhost:3111/
```

### Postman
- **Method**: GET
- **URL**: `http://localhost:3111/`

### Response
```
Hello, Welcome to the Express starter template for Stackblitz!
```

---

## 2. GET /products - Get All Products

### cURL
```bash
curl http://localhost:3111/products
```

### Postman
- **Method**: GET
- **URL**: `http://localhost:3111/products`

### Response
```json
[
  { "id": 1, "name": "Laptop", "price": 1000 },
  { "id": 2, "name": "Mobile", "price": 500 }
]
```

---

## 3. POST /products - Create Product

### cURL
```bash
curl -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Tablet","price":300}'
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

### Response
```json
{
  "id": 3,
  "name": "Tablet",
  "price": 300
}
```

---

## 4. DELETE /products/:id - Delete Product

### cURL - Delete Product ID 1
```bash
curl -X DELETE http://localhost:3111/products/1
```

### cURL - Delete Product ID 2
```bash
curl -X DELETE http://localhost:3111/products/2
```

### Postman
- **Method**: DELETE
- **URL**: `http://localhost:3111/products/1`

### Response
- **Status**: 204 No Content
- **Body**: Empty

---

## Complete Test Sequence

### Using cURL

```bash
# 1. Test home
curl http://localhost:3111/

# 2. Get all products
curl http://localhost:3111/products

# 3. Create new product
curl -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Tablet","price":300}'

# 4. Get products again (should see 3 products)
curl http://localhost:3111/products

# 5. Create another product
curl -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Headphones","price":150}'

# 6. Get all products (should see 4 products)
curl http://localhost:3111/products

# 7. Delete product with ID 1
curl -X DELETE http://localhost:3111/products/1

# 8. Get products again (should see 3 products, no ID 1)
curl http://localhost:3111/products
```

---

## Postman Collection (Import This)

```json
{
  "info": {
    "name": "Express API - Simple",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Home",
      "request": {
        "method": "GET",
        "header": [],
        "url": "http://localhost:3111/"
      }
    },
    {
      "name": "Get All Products",
      "request": {
        "method": "GET",
        "header": [],
        "url": "http://localhost:3111/products"
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
        "url": "http://localhost:3111/products"
      }
    },
    {
      "name": "Delete Product",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": "http://localhost:3111/products/1"
      }
    }
  ]
}
```

---

## Quick Test Script

Save as `test.sh`:

```bash
#!/bin/bash

echo "=== Testing Express API ==="
echo ""

echo "1. Home Route"
curl -s http://localhost:3111/
echo -e "\n"

echo "2. Get All Products"
curl -s http://localhost:3111/products | json_pp
echo ""

echo "3. Create Product - Tablet"
curl -s -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Tablet","price":300}' | json_pp
echo ""

echo "4. Create Product - Headphones"
curl -s -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Headphones","price":150}' | json_pp
echo ""

echo "5. Get All Products (After Creation)"
curl -s http://localhost:3111/products | json_pp
echo ""

echo "6. Delete Product ID 1"
curl -s -X DELETE http://localhost:3111/products/1
echo "Deleted"
echo ""

echo "7. Get All Products (After Deletion)"
curl -s http://localhost:3111/products | json_pp
echo ""
```

Run with:
```bash
chmod +x test.sh
./test.sh
```

---

## Sample Test Data

### Create Multiple Products

```bash
# Product 1
curl -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Tablet","price":300}'

# Product 2
curl -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Headphones","price":150}'

# Product 3
curl -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","price":80}'

# Product 4
curl -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Mouse","price":40}'
```

---

## Testing in Browser

### GET Requests (Just paste in browser)

```
http://localhost:3111/
http://localhost:3111/products
```

### POST/DELETE Requests (Use Browser Console)

```javascript
// Create Product
fetch('http://localhost:3111/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Tablet', price: 300 })
})
.then(res => res.json())
.then(data => console.log(data));

// Get Products
fetch('http://localhost:3111/products')
.then(res => res.json())
.then(data => console.log(data));

// Delete Product
fetch('http://localhost:3111/products/1', {
  method: 'DELETE'
})
.then(res => console.log('Deleted:', res.status));
```

---

## Common Issues

### Issue 1: "Cannot read property 'name' of undefined"
**Fix**: Add `app.use(express.json());` before routes

### Issue 2: "Cannot DELETE /products"
**Fix**: Change route to `/products/:id`

### Issue 3: Product not deleted
**Fix**: Use `!==` instead of `!=` in filter

---

## All Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Home page |
| GET | /products | Get all products |
| POST | /products | Create new product |
| DELETE | /products/:id | Delete product by ID |

Simple and ready to test! 🚀