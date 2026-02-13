var users = [
  { name: "yogesh", age: 33 },
  { name: "Riddhi", age: 20 },
];
var result = users.filter(function (user) {
  return user.age > 25;
});
console.log(result);
