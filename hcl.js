const items = [
  {
    id: 1,
    name: "USA",
    values: [
      {
        id: 2,
        name: "Chevy",
        values: [
          {
            id: 3,
            name: "Suburban",
          },
          {
            id: 4,
            name: "Camaro",
            values: [],
          },
        ],
      },

      {
        id: 5,
        name: "Ford",
        values: [],
      },
    ],
  },
];
const dig = (obj, target) =>
  target in obj
    ? obj[target]
    : Object.values(obj).reduce((acc, val) => {
        if (acc !== undefined) return acc;
        if (typeof val === "object") return dig(val, target);
      }, undefined);
let deee = dig(items, "values");
console.log(Object.values(deee));

function getNestedKeys(nestedObj, key) {
  //for (key in nestedObj) {
  // Check if the key is an object
  if (typeof nestedObj[key] === "object") {
    // Loop through the keys of the inner object
    for (let innerKey in nestedObj[key]) {
      // Get the value of the inner key
      const value = nestedObj[key][innerKey];
      // Log the key-value pair
      console.log(`${innerKey}: ${value}`);
    }
  }
  //}
}

// function to access the nested properties
// function getNestedKeys(obj, key) {
//   let Object = obj[0];

//   if (key in Object) {
//     return Object[key];
//   }
//   const keys = key.split(".");
//   let value = Object;
//   for (let i = 0; i < keys.length; i++) {
//     value = value[keys[i]];
//     if (value === undefined) {
//       break;
//     }
//   }

//   return value;
// }

const names = getNestedKeys(items, "name");
console.log(names);

// let data = Object.values(items).map(function (items) {
//   let a = items?.values.map(function (item) {
//     //console.log(item.name);
//     let b = items?.values.map(function (item2) {
//       console.log(item2.values.name);
//     });
//   });
// });
