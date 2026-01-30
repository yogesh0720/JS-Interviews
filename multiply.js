function multiply(x) {
  return (y) => {
    return x * y;
  };
  // return setTimeout((y)=>{
  // 	return x * y;
  // }, 2000);
}

let x = 2;
let y = 3;

const mul = multiply(10);
console.log("Answer of multiply: ", mul());

let multiplyTest = (x, y) => x * y;
console.log("Answer of multiplyTest: ", multiplyTest(10, 5));

let subtraction = (x, y) => x - y;
console.log("Answer of subtraction: ", subtraction(10, 5));
