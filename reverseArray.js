//######### 1. Using the reverse() Method
let a1 = [1, 2, 3, 4, 5];
a1.reverse();
console.log(a1);

//######### 2. Using For Loop
const a2 = [1, 2, 3, 4, 5];
for (let i = 0; i < Math.floor(a2.length / 2); i++) {
  let temp = a2[i];
  a2[i] = a2[a2.length - 1 - i];
  a2[a2.length - 1 - i] = temp;
}
console.log(a2);

//######### 3. Using Recursion
const a3 = [1, 2, 3, 4, 5];
const reversed = (function reverse(a3) {
  if (a3.length === 0) {
    return [];
  }
  return [a3.pop()].concat(reverse(a3));
})([...a3]);
console.log(reversed);

//######### 4. Using the reduce() Method
let a4 = [1, 2, 3, 4, 5];
let revArr = a4.reduce((acc, current) => [current, ...acc], []);

console.log(revArr);

//######### 5. Using the Spread Operator and reverse()

let a5 = [1, 2, 3, 4, 5];
let reversed5 = [...a5].reverse();
console.log(reversed5);

//######### 6. Using a Stack (Last-In-First-Out Approach)

const a6 = [1, 2, 3, 4, 5];
const rev = [];
while (a6.length > 0) {
  rev.push(a6.pop());
}
console.log(rev);
