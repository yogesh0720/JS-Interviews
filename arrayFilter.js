//Sample API

const apiResult = await fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((json) => json);

//console.log(apiResult);
let arrayData = [];
const finalData = apiResult
  .filter((res1) => res1.username)
  .map((res2) => arrayData.push(res2.name, res2.email, res2.phone));

console.log(arrayData);
