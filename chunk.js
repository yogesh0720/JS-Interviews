const fs = require("fs");
//import * as fs from "fs";
const readStream = fs.createReadStream("file.txt");

console.log("Start");

readStream.on("data", (chunk) => {
  console.log(chunk.toString());
});

console.log("End");
