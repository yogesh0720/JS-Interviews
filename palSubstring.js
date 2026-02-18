function palSubstring(input1) {
  // Return input if it's empty or has only one character
  if (!input1 || input1.length < 1) return input1; // Check for empty or single character string

  let start = 0; // Start index of the longest palindrome
  let end = 0; // End index of the longest palindrome

  // Helper function to expand around the center
  function expandCenter(s, left, right) {
    // Expand as long as the characters at left and right are equal and within bounds
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--; // Move left pointer to the left
      right++; // Move right pointer to the right
    }
    // Return the length of the palindrome found
    return right - left - 1; // Subtract 1 because the last increment/decrement went too far
  }

  // Loop through each character in the string
  for (let i = 0; i < input1.length; i++) {
    let len1 = expandCenter(input1, i, i); // Odd length palindrome
    let len2 = expandCenter(input1, i, i + 1); // Even length palindrome
    let len = Math.max(len1, len2); // Get the maximum length
    if (len > end - start) {
      // If this palindrome is longer
      start = i - Math.floor((len - 1) / 2); // Update start index
      end = i + Math.floor(len / 2); // Update end index
    }
  }
  return input1.substring(start, end + 1); // Return the longest palindromic substring
}

let output = palSubstring("babad");
console.log(output);
