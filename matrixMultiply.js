const matrixA = [
  [1, 2],
  [3, 4],
];
const matrixB = [
  [5, 6, 11],
  [7, 8, 12],
];
//Matrix Multiply
/*
Matrix A: 2×2, Matrix B: 2×3
Result: 2×3

C[i][j] = Σ A[i][k] * B[k][j]

Formula:
(1×5) + (2×7) = 5 + 14 = 19
(1×6) + (2×8) = 6 + 16 = 22
(1×11) + (2×12) = 11 + 24 = 35
(3×5) + (4×7) = 15 + 28 = 43
(3×6) + (4×8) = 18 + 32 = 50
(3×11) + (4×12) = 33 + 48 = 81
*/

function multiplyMatrices(a, b) {
  const result = [];

  for (let i = 0; i < a.length; i++) {
    result[i] = [];
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < b.length; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }

  return result;
}

console.log(multiplyMatrices(matrixA, matrixB));

//########//
function multiplyMatrices_New(A, B) {
  const rowsA = A.length;
  const colsA = A[0].length;
  const colsB = B[0].length;

  const result = new Array(rowsA).fill(0).map(() => new Array(colsB).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }

  return result;
}

console.log(multiplyMatrices_New(matrixA, matrixB));
