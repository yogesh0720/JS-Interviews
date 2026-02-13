type User = {
  name: string;
  age: number;
};

const users: User[] = [
  { name: "yogesh", age: 33 },
  { name: "Riddhi", age: 20 },
];

const result = users.filter((user) => user.age > 25);
console.log(result);
