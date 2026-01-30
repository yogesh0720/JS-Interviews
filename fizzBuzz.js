// JavaScript program for the above approach

// Function to generate FizzBuzz sequence
function fizzBuzz(N) {
  // Stores count of multiples
  // of 3 and 5 respectively
  let count3 = 0;
  let count5 = 0;

  // Iterate from 1 to N
  for (let i = 1; i <= N; i++) {
    // Increment count3 by 1
    count3++;

    // Increment count5 by 1
    count5++;

    // Initialize a boolean variable
    // to check if none of the
    // condition matches
    let flag = false;

    // Check if the value of count3
    // is equal to 3
    if (count3 == 3) {
      console.log("Fizz");

      // Reset count3 to 0, and
      // set flag as True
      count3 = 0;
      flag = true;
    }

    // Check if the value of count5
    // is equal to 5
    else if (count5 == 5) {
      console.log("Buzz");

      // Reset count5 to 0, and
      // set flag as True
      count5 = 0;
      flag = true;
    }

    // If none of the condition matches
    if (!flag) {
      console.log(i);
    }

    console.log(" ");
  }
}

// Driver Code
let N = 50;
fizzBuzz(N);

// This code is contributed by unknown2108
