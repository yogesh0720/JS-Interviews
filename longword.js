function longWords(str) {
  const words = str.split(" ");
  let longWordStr = "";

  for (let i = 0; i < words.length; i++) {
    if (words[i].length > longWordStr.length) {
      longWordStr = words[i];
    }
  }
  return longWordStr;
}

let text = "Hello my name is yogeshkumar nayi";
let output = longWords(text);
console.log(output);
