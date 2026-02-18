# Insert Data in Array Without Database

## Your Current Code (Already Working!)

You're already using an in-memory array:

```javascript
let products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Mobile", price: 500 },
];

// This inserts data into the array
app.post("/products", (req, res) => {
  const newProduct = req.body;
  newProduct.id = products.length + 1;
  products.push(newProduct);  // ← This inserts into array
  res.status(201).json(newProduct);
});
```

---

## All Methods to Insert Data in Array

### 1. push() - Add to End (Most Common)

```javascript
let products = [];

// Add single item
products.push({ id: 1, name: "Laptop", price: 1000 });

// Add multiple items
products.push(
  { id: 2, name: "Mobile", price: 500 },
  { id: 3, name: "Tablet", price: 300 }
);

console.log(products);
// [
//   { id: 1, name: "Laptop", price: 1000 },
//   { id: 2, name: "Mobile", price: 500 },
//   { id: 3, name: "Tablet", price: 300 }
// ]
```

### 2. unshift() - Add to Beginning

```javascript
let products = [
  { id: 2, name: "Mobile", price: 500 }
];

products.unshift({ id: 1, name: "Laptop", price: 1000 });

console.log(products);
// [
//   { id: 1, name: "Laptop", price: 1000 },
//   { id: 2, name: "Mobile", price: 500 }
// ]
```

### 3. splice() - Add at Specific Position

```javascript
let products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 3, name: "Tablet", price: 300 }
];

// Insert at index 1
products.splice(1, 0, { id: 2, name: "Mobile", price: 500 });

console.log(products);
// [
//   { id: 1, name: "Laptop", price: 1000 },
//   { id: 2, name: "Mobile", price: 500 },
//   { id: 3, name: "Tablet", price: 300 }
// ]
```

### 4. Spread Operator - Create New Array

```javascript
let products = [
  { id: 1, name: "Laptop", price: 1000 }
];

// Add to end
products = [...products, { id: 2, name: "Mobile", price: 500 }];

// Add to beginning
products = [{ id: 0, name: "Desktop", price: 1500 }, ...products];

// Add in middle
products = [
  ...products.slice(0, 1),
  { id: 1.5, name: "Tablet", price: 300 },
  ...products.slice(1)
];
```

### 5. concat() - Merge Arrays

```javascript
let products = [
  { id: 1, name: "Laptop", price: 1000 }
];

let newProducts = [
  { id: 2, name: "Mobile", price: 500 },
  { id: 3, name: "Tablet", price: 300 }
];

products = products.concat(newProducts);
// or
products = [...products, ...newProducts];
```

---

## Complete Express.js Example with All CRUD Operations

```javascript
const express = require("express");
const app = express();
const port = 3111;

app.use(express.json());

// In-memory data storage
let products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Mobile", price: 500 },
];

let nextId = 3; // Track next ID

// CREATE - Insert new product
app.post("/products", (req, res) => {
  const newProduct = {
    id: nextId++,
    name: req.body.name,
    price: req.body.price
  };
  
  products.push(newProduct); // Insert into array
  res.status(201).json(newProduct);
});

// READ - Get all products
app.get("/products", (req, res) => {
  res.json(products);
});

// READ - Get single product
app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  
  res.json(product);
});

// UPDATE - Update product
app.put("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  
  products[index] = {
    id: id,
    name: req.body.name || products[index].name,
    price: req.body.price || products[index].price
  };
  
  res.json(products[index]);
});

// DELETE - Remove product
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = products.length;
  
  products = products.filter(p => p.id !== id);
  
  if (products.length === initialLength) {
    return res.status(404).json({ error: "Product not found" });
  }
  
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

---

## Advanced: Multiple Data Collections

```javascript
const express = require("express");
const app = express();
app.use(express.json());

// Multiple in-memory collections
let products = [];
let users = [];
let orders = [];

let productId = 1;
let userId = 1;
let orderId = 1;

// Products
app.post("/products", (req, res) => {
  const product = { id: productId++, ...req.body };
  products.push(product);
  res.status(201).json(product);
});

app.get("/products", (req, res) => {
  res.json(products);
});

// Users
app.post("/users", (req, res) => {
  const user = { id: userId++, ...req.body };
  users.push(user);
  res.status(201).json(user);
});

app.get("/users", (req, res) => {
  res.json(users);
});

// Orders
app.post("/orders", (req, res) => {
  const order = { 
    id: orderId++, 
    userId: req.body.userId,
    productId: req.body.productId,
    quantity: req.body.quantity,
    createdAt: new Date()
  };
  orders.push(order);
  res.status(201).json(order);
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.listen(3111);
```

---

## Persist Data to File (Optional)

If you want data to survive server restarts:

```javascript
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const DATA_FILE = "./products.json";

// Load data from file
let products = [];
try {
  const data = fs.readFileSync(DATA_FILE, "utf8");
  products = JSON.parse(data);
} catch (error) {
  products = [
    { id: 1, name: "Laptop", price: 1000 },
    { id: 2, name: "Mobile", price: 500 }
  ];
}

// Save data to file
function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

// CREATE
app.post("/products", (req, res) => {
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: req.body.name,
    price: req.body.price
  };
  
  products.push(newProduct);
  saveData(); // Save to file
  res.status(201).json(newProduct);
});

// READ
app.get("/products", (req, res) => {
  res.json(products);
});

// UPDATE
app.put("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  
  products[index] = { id, ...req.body };
  saveData(); // Save to file
  res.json(products[index]);
});

// DELETE
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  saveData(); // Save to file
  res.status(204).send();
});

app.listen(3111);
```

---

## Testing Insert Operations

### Using cURL

```bash
# Insert single product
curl -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Tablet","price":300}'

# Insert multiple products (call multiple times)
curl -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","price":80}'

curl -X POST http://localhost:3111/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Mouse","price":40}'

# Get all products
curl http://localhost:3111/products
```

### Using JavaScript

```javascript
// Insert data
async function addProduct(name, price) {
  const response = await fetch('http://localhost:3111/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price })
  });
  return await response.json();
}

// Usage
addProduct('Tablet', 300);
addProduct('Keyboard', 80);
addProduct('Mouse', 40);
```

---

## Comparison: Array Methods

| Method | Position | Returns | Modifies Original |
|--------|----------|---------|-------------------|
| push() | End | New length | Yes |
| unshift() | Beginning | New length | Yes |
| splice() | Any | Removed items | Yes |
| concat() | End | New array | No |
| Spread [...] | Any | New array | No |

---

## Key Points

1. ✅ **Your code already works** - You're using `products.push()`
2. ✅ **Data is in memory** - Lost when server restarts
3. ✅ **No database needed** - Perfect for testing/prototyping
4. ✅ **Fast and simple** - No database setup required
5. ⚠️ **Not for production** - Use database for real apps

---

## Quick Fix for Your Code

Add this line to parse JSON:

```javascript
const express = require("express");
const app = express();
const port = 3111;

app.use(express.json()); // ← Add this line

let products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Mobile", price: 500 },
];

// Rest of your code...
```

Now your POST request will work perfectly! 🚀