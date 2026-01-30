let tracer = require("./datadog"); // must come before other imports

const express = require("express");

const app = express();

app.get("/health", (req, res) => {
  res.send("ok");
});

app.get("/users", async (req, res) => {
  try {
    // simulate DB call
    await new Promise((resolve) => setTimeout(resolve, 100));
    res.json({ users: [] });
  } catch (err) {
    res.status(500).send("Error");
  }
});

app.get("/error", (req, res) => {
  try {
    throw new Error("Something went wrong");
  } catch (err) {
    tracer.trace("custom.error", (span) => {
      span.setTag("error", err);
    });
    res.status(500).send("Failure");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
