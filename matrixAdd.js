const matrixA = [
  [1, 2],
  [3, 4],
];
const matrixB = [
  [5, 6],
  [7, 8],
];

//Matrix Addition
/*
Formula :
[
  [1 + 5, 2 + 6],
  [3 + 7, 4 + 8],
];
Answer:
[ 
  [6, 8],
  [10, 12] 
]
*/

function addMatrices(a, b) {
  return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

console.log(addMatrices(matrixA, matrixB));
