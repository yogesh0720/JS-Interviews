//Given a string, remove adjacent duplicates only, preserving the case and position in the result.
function removeAdjacentDuplicates(input) {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    if (i === 0 || input[i] !== input[i - 1]) {
      result += input[i];
    }
  }
  return result;
}
const input = "aAaBbCCcBBXxYXYZzz";
const output = "aBCBXYXYZ";
console.log(removeAdjacentDuplicates(input));
