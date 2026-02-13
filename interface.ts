interface Profile {
  name: string;
  age: number;
  Display(): void;
}

class Yogesh implements Profile {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  Display() {
    return { name: this.name, age: this.age };
  }
}

const nameProfile: Profile = new Yogesh("Yogesh Nayi", 33);
console.log(nameProfile.Display());
