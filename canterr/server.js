//npm init -y
//npm install express

const express = require("express");
const app = express();

app.use(express.json());

let users = [
  { id: 1, name: "Yogesh" },
  { id: 2, name: "Rahul" },
];

// GET all users
app.get("/users", (req, res) => {
  res.json(users);
});

// GET single user
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id == req.params.id);
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json(user);
});

// POST user
app.post("/users", (req, res) => {
  const newUser = {
    id: Date.now(),
    name: req.body.name,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT update
app.put("/users/:id", (req, res) => {
  const user = users.find((u) => u.id == req.params.id);
  if (!user) return res.status(404).json({ msg: "User not found" });

  user.name = req.body.name;
  res.json(user);
});

// DELETE
app.delete("/users/:id", (req, res) => {
  users = users.filter((u) => u.id != req.params.id);
  res.json({ msg: "Deleted successfully" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
