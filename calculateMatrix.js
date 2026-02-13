const matrixA = [
  [1, 2],
  [3, 4],
];
const matrixB = [
  [5, 6],
  [7, 8],
];

// const matrixA = [[1, 2, 3],[4, 5, 6],[7, 8, 9]];
// const matrixB = [[9, 8, 7],[6, 5, 4],[3, 2, 1]];

function calculateMatrix(matrixA, matrixB) {
  const rowA = matrixA.length;
  const colA = matrixA[0].length;
  const rowB = matrixB.length;
  const colB = matrixB[0].length;

  let result = new Array(rowA).fill(0).map(() => new Array(colB).fill(0));
  //console.log(result);
  for (let i = 0; i < rowA; i++) {
    for (let j = 0; j < rowB; j++) {
      //console.log(matrixA[i][j] * matrixB[i][j]);
      for (let k = 0; k < colA; k++) {
        //console.log(matrixA[i][k] , matrixB[k][j]);
        result[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }
  return result;
}

console.log(calculateMatrix(matrixA, matrixB));

/*
result = [
[19, 22],
[43, 50]
];

C[0][0] = (1×5) + (2×7) = 5 + 14 = 19
C[0][1] = (1×6) + (2×8) = 6 + 16 = 22
C[1][0] = (3×5) + (4×7) = 15 + 28 = 43
C[1][1] = (3×6) + (4×8) = 18 + 32 = 50
*/
