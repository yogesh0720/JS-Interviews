var uniqueInOrder = function (iterable) {
  //your code here - remember iterable can be a string or an array
  let finalArr = [];
  //finalArr = [...new Set(iterable)];

  if (Array.isArray(iterable)) {
    //console.log("isArray");
    iterable.forEach((value, index) => {
      //console.log(value, index);
      finalArr = iterable.filter(fetchUnique);
    });
  } else {
    //console.log("isString");
    const testArr = iterable.split("");
    //console.log(testArr);
    finalArr = testArr.filter(fetchUnique);
  }
  return finalArr;
}

function fetchUnique(value, index, arr) {
  return arr.indexOf(value) === index;
}

console.log(uniqueInOrder("AAAABBBCCDAABBB")); //['A', 'B', 'C', 'D', 'A', 'B']
console.log(uniqueInOrder("ABBCcAD")); //        ['A', 'B', 'C', 'c', 'A', 'D']
console.log(uniqueInOrder([1, 2, 2, 3, 3])); //      [1,2,3]
