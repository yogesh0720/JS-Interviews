const numbers = [2, 4, 8, 10];
const sum = numbers.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  0,
);
console.log(sum); // Output: 24
