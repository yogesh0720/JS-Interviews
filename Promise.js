// let x = 1;
// let myPromise = new Promise((resolve, reject) => {

//   if (x === 0) {
//     console.log('oka');
//   } else {
//     console.error('error');
//   }
// })
// .then(function (result) {});

/*
Promise has resolve and reject
.then() for success
.catch() for error

“Promises are commonly used for API calls and async operations.”
*/

function divide(x, y) {
  return new Promise((resolve, reject) => {
    if (y === 0) {
      console.error("This is zero");
      reject("cannot divide by zero");
    } else {
      resolve(x / y);
    }
  });
}

divide(2, 0)
  .then((result) => {
    console.log("Promise divided");
    console.log(`ans:`, result);
  })
  .catch((err) => {
    console.error(err);
  });

divide(10, 2)
  .then((result) => {
    console.log("Promise divided");
    console.log(`ans:`, result);
  })
  .catch((err) => {
    console.error(err);
  });
