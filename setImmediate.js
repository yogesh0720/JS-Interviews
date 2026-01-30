// // timeout_vs_immediate.js
// setTimeout(() => {
//   console.log("timeout");
// }, 0);

// setImmediate(() => {
//   console.log("immediate");
// });

const baz = () => console.log("baz");
const foo = () => console.log("foo");
const zoo = () => console.log("zoo");

const start = () => {
  console.log("start"); //1
  setImmediate(baz); //5
  new Promise((resolve, reject) => {
    resolve("bar"); //3
  }).then((resolve) => {
    console.log(resolve);
    process.nextTick(zoo); //4
  });
  process.nextTick(foo); //2
};

start();

// start foo bar zoo baz
