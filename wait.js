function randomFunction() {
  var obj1 = { name: "yogesh" };

  return function () {
    console.log(obj1.name);
  };
}

var closure = randomFunction();

closure();
