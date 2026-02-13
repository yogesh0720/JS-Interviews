//######### 1. Using split(), reverse() and join()
let str = "hello";
let reversedStr = str.split("").reverse().join("");
console.log(reversedStr);

//######### 2. Using a for loop
function stringReverse(str) {
  let element = "";
  for (let index = str.length - 1; index >= 0; index--) {
    element += str[index];
  }
  console.warn(element);
}
var fname = "Yogesh";
stringReverse(fname);

//######### 3. Using Recursion
function reverseString(str) {
  if (str === "") {
    return str;
  } else {
    return reverseString(str.substr(1)) + str[0];
  }
}
console.log(reverseString("GeeksforGeeks"));

//######### 4. Using Spread Operator
let s = "GeeksforGeeks";
const ans = [...s].reverse().join("");
console.log(ans);
