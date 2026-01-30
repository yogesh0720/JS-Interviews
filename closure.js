//Example:1
function randomFunc() {
  var obj1 = { name: "Yogesh", age: 30 };

  return function () {
    console.log(obj1.name + " is " + "awesome"); // Has access to obj1 even when the randomFunc function is executed
  };
}

var initialiseClosure = randomFunc(); // Returns a function

initialiseClosure();

// Example:2
//A closure is when a function remembers variables from its outer scope even after the outer function has finished execution.
function counter() {
  let count = 0;
  function inner() {
    count++;
    console.log(count);
  }
  return inner;
}

const c = counter();
c(); // 1
c(); // 2
