let randomValue = { name: "Lydia" };
randomValue = 23;
console.log(typeof randomValue);
if (!typeof randomValue === "string") {
  console.log("It's not a string!");
} else {
  console.log("Yay it's a string!");
}
