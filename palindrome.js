function isPalindrome(str, s, subsIndex) {
  console.log(s);
  if (str.length === 1) return true;

  if (str === str.split("").reverse().join("")) {
    return true;
  } else {
    if (subsIndex === 0) {
      return false;
    } else {
      for (let i = 0; i < str.length; i++) {
        for (let j = 0; j < s.length; j++) {
          let newStr = str.replace(str[i], s[j]);
          if (newStr === newStr.split("").reverse().join("")) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }
}

function palindromeChecker(s, startIndex, endIndex, subs) {
  // Write your code here

  let result = [];

  for (let i = 0; i < startIndex.length; i++) {
    let sub = s.substring(startIndex[i], endIndex[i]);

    if (isPalindrome(sub, s, subs[i])) {
      result.push(1);
    } else {
      result.push(0);
    }
  }

  return result.join("");
}

let s = "bcba";
let start_index = [1, 2, 1];
let end_index = [3, 3, 1];
let subs = [2, 0, 0];

// console.log(
//   palindromeChecker("cdecd", [0, 0, 0, 0], [0, 1, 2, 3], [0, 1, 1, 0])
// );
console.log(palindromeChecker("bcba", [1, 2, 1], [3, 3, 1], [2, 0, 0]));
