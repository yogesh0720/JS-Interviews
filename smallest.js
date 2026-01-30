//find smallest value
function findSmallest(arr) {
  if (!Array.isArray(arr)) {
    return false;
  }
  if (arr.length === 0) {
    return null;
  }

  // Check for non-number values
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== "number" || isNaN(arr[i]) || !isFinite(arr[i])) {
      return false;
    }
  }

  let smallest = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < smallest) {
      smallest = arr[i];
    }
  }
  return smallest;
}

console.log(findSmallest([3, 1, 2])); // 1
console.log(findSmallest([-5, 2, -3, 4])); // -5
console.log(findSmallest([0, 2, 3])); // 0
console.log(findSmallest([])); // null
console.log(findSmallest([1, 2, 3])); // 1
console.log(findSmallest([-1, -2, -3])); // -3
console.log(findSmallest([-1.5, -0.1, 0, 2.2])); // -1.5
