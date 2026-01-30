// // Helper function to simulate an API call
// function fetchData(id) {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(`Data for ID ${id}`), 1000);
//   });
// }

// // Sequential operation - takes ~3 seconds
// async function fetchSequential() {
//   console.time("sequential");
//   const data1 = await fetchData(1);
//   const data2 = await fetchData(2);
//   const data3 = await fetchData(3);
//   console.timeEnd("sequential");
//   return [data1, data2, data3];
// }

// // Parallel operation - takes ~1 second
// async function fetchParallel() {
//   console.time("parallel");
//   const results = await Promise.all([fetchData(1), fetchData(2), fetchData(3)]);
//   console.timeEnd("parallel");
//   return results;
// }

// // Demo
// async function runDemo() {
//   console.log("Running sequentially...");
//   const seqResults = await fetchSequential();
//   console.log(seqResults);

//   console.log("\nRunning in parallel...");
//   const parResults = await fetchParallel();
//   console.log(parResults);
// }

// runDemo();

const express = require("express");
const app = express();
const port = 8080;

// Route that may throw an error
app.get("/error", (req, res) => {
  // Simulating an error
  throw new Error("Something went wrong!");
});

// Route that uses next(error) for asynchronous code
app.get("/async-error", (req, res, next) => {
  // Simulating an asynchronous operation that fails
  setTimeout(() => {
    try {
      // Something that might fail
      const result = nonExistentFunction(); // This will throw an error
      res.send(result);
    } catch (error) {
      next(error); // Pass errors to Express
    }
  }, 100);
});

// Custom error handling middleware
// Must have four parameters to be recognized as an error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
