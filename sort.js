// Create a function and return sorted array for a given array, take argument order(1 - ascending, 2 - descending)? don't use default array method sort.
// example1:  input: [3,6,6,6,1,9,2], order:1,  result: [1,2,3,6,6,6,9];
// example2:  input:  [3,6,6,6,1,9,2], order:2, result: [9,6,6,6,3,2,1];

function makeSortFunction(array, order) {
  for (var i = 0; i < array.length - 1; i++) {
    for (var j = 0; j < array.length - 1; j++) {
      if (order === 1 && array[j] > array[j + 1]) {
        temp = array[j + 1];
        array[j + 1] = array[j];
        array[j] = temp;
      } else if (order === 2 && array[j] < array[j + 1]) {
        temp = array[j + 1];
        array[j + 1] = array[j];
        array[j] = temp;
      }
    }
  }
  return array;
}

function checkSortFunction(array, order) {
  for (i = 0; i < array.length; i++) {
    for (j = i + 1; j < array.length; j++) {
      if (array[i] > array[j]) {
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
  }
}

let input = [3, 6, 6, 6, 1, 9, 2];

console.log("OLDER:", input);
//console.log("NEW:", makeSortFunction(input, 1));
console.log("NEW:", checkSortFunction(input, 1));
