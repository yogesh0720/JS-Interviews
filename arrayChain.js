const numbers = [1, 2, 3, 4, 5, 6, 7];
const result = numbers
  .filter((num) => num % 2 === 0) // [2, 4, 6]
  .map((val) => val * 2) // [4, 8, 12]
  .reduce((acc, curr) => acc + curr, 0); // 24 [ array.reduce((previousValue, currentValue, currentIndex)) ]

console.log(result); // Output: 24
