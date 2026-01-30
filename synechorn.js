/* const express = require("express");
const app = express();
const portNumber = 3000;

app.get("/", (req, res) => {
  res.send("Welcome");
});
app.listen(portNumber, (req, res) => {}); */

/* function foo1() {
  return {
    bar: "hello",
  };
}

function foo2() {
  return;
  {
    bar: "hello";
  }
}
console.log(foo1(), foo2()); */

/* const [mValue, setMValue] = useState("");
setMValue("vikas");
console.log(mValue); */

const obj1 = { a: 1, b: 2, c: 3 };
const obj2 = { a: 4, e: 5, f: 6 };
//let mergeData = { obj1, obj2 };
//let mergeData = { ...obj1, ...obj2 }; // option 2
//let mergeData = Object.assign(obj1, obj2);  // option 3

console.log(mergeData);

/* 
let str = "Yogesh";
function getReverse(str) {
  let strArr = str.split("");
  let rev = "";
  let count = strArr.length;
  for (var i = count - 1; i >= 0; i--) {
    rev = rev + strArr[i];
  }
  return rev;
}
console.log(getReverse(str));
*/

/* let str = "Yogesh";
let rev = str.split("").reduce((a, b) => (a = b + a), "");
console.log(rev); */

/* let str = "vikash"; // k = "kash"
let result = str.substring(2, str.length);
console.log(result); */

/* async function foo() {
  return 1;
}
let d = foo().then((resolve) => {
  console.log(resolve);
}); */

/* 
console.log(5 + -"3" + "2"); //22
console.log(5 + "3" + "2"); //532
console.log("V" - "N" + "2"); // Nan2
 */
