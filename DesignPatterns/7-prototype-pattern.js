/**
 * PROTOTYPE PATTERN
 * Real-World Example: Game Character Creation (RPG Games)
 * 
 * WHEN TO USE:
 * - Creating objects from templates
 * - When object creation is expensive
 * - Need multiple similar objects
 * - Dynamic object creation
 * 
 * WHY TO USE:
 * - Performance: Faster than creating from scratch
 * - Memory efficiency: Shares methods through prototype chain
 * - Flexibility: Easy to modify prototypes
 * - Dynamic creation: Create objects at runtime
 */

// Like RPG games - create characters from templates
const characterPrototype = {
  init(name, characterClass) {
    this.name = name;
    this.class = characterClass;
    this.level = 1;
    this.experience = 0;
    this.inventory = [];
    return this;
  },
  
  attack() {
    const damage = this.strength * 2 + Math.floor(Math.random() * 10);
    console.log(`⚔️  ${this.name} attacks for ${damage} damage!`);
    return damage;
  },
  
  defend() {
    const defense = this.defense + Math.floor(Math.random() * 5);
    console.log(`🛡️  ${this.name} defends with ${defense} defense!`);
    return defense;
  },
  
  levelUp() {
    this.level++;
    this.health += 10;
    this.strength += 2;
    this.defense += 1;
    this.experience = 0;
    console.log(`🎉 ${this.name} leveled up to ${this.level}!`);
  },
  
  addExperience(exp) {
    this.experience += exp;
    console.log(`${this.name} gained ${exp} experience (${this.experience}/100)`);
    
    if (this.experience >= 100) {
      this.levelUp();
    }
  },
  
  addToInventory(item) {
    this.inventory.push(item);
    console.log(`${this.name} acquired ${item}`);
  },
  
  getStats() {
    return {
      name: this.name,
      class: this.class,
      level: this.level,
      health: this.health,
      strength: this.strength,
      defense: this.defense,
      magic: this.magic,
      experience: this.experience
    };
  },
  
  clone() {
    return Object.create(this);
  }
};

// Character class templates
const warriorTemplate = Object.create(characterPrototype);
warriorTemplate.health = 100;
warriorTemplate.strength = 15;
warriorTemplate.defense = 12;
warriorTemplate.magic = 5;
warriorTemplate.specialAbility = function() {
  console.log(`💪 ${this.name} uses Berserker Rage! Strength doubled for next attack!`);
  return this.strength * 2;
};

const mageTemplate = Object.create(characterPrototype);
mageTemplate.health = 60;
mageTemplate.strength = 8;
mageTemplate.defense = 6;
mageTemplate.magic = 20;
mageTemplate.specialAbility = function() {
  const damage = this.magic * 3;
  console.log(`🔮 ${this.name} casts Fireball for ${damage} magic damage!`);
  return damage;
};

const rogueTemplate = Object.create(characterPrototype);
rogueTemplate.health = 80;
rogueTemplate.strength = 12;
rogueTemplate.defense = 8;
rogueTemplate.magic = 10;
rogueTemplate.stealth = 15;
rogueTemplate.specialAbility = function() {
  const damage = this.strength * 3;
  console.log(`🗡️  ${this.name} performs Sneak Attack for ${damage} critical damage!`);
  return damage;
};

const healerTemplate = Object.create(characterPrototype);
healerTemplate.health = 70;
healerTemplate.strength = 6;
healerTemplate.defense = 8;
healerTemplate.magic = 18;
healerTemplate.healing = 20;
healerTemplate.specialAbility = function() {
  const healAmount = this.healing + this.magic;
  console.log(`✨ ${this.name} casts Heal for ${healAmount} health restoration!`);
  return healAmount;
};

// Usage Examples
console.log('=== PROTOTYPE PATTERN DEMO ===');

// Clone templates to create characters
const player1 = warriorTemplate.clone().init('Aragorn', 'Warrior');
const player2 = mageTemplate.clone().init('Gandalf', 'Mage');
const player3 = rogueTemplate.clone().init('Legolas', 'Rogue');
const player4 = healerTemplate.clone().init('Elrond', 'Healer');

console.log('🎮 Characters Created:');
console.log(`${player1.name}: Health=${player1.health}, Strength=${player1.strength}, Magic=${player1.magic}`);
console.log(`${player2.name}: Health=${player2.health}, Strength=${player2.strength}, Magic=${player2.magic}`);
console.log(`${player3.name}: Health=${player3.health}, Strength=${player3.strength}, Stealth=${player3.stealth}`);
console.log(`${player4.name}: Health=${player4.health}, Healing=${player4.healing}, Magic=${player4.magic}`);

// Battle simulation
console.log('\n⚔️  BATTLE SIMULATION ⚔️');
player1.attack();
player2.specialAbility();
player3.specialAbility();
player4.specialAbility();

// Add experience and items
console.log('\n📈 CHARACTER PROGRESSION');
player1.addExperience(50);
player1.addToInventory('Iron Sword');
player1.addExperience(60); // This will trigger level up

player2.addExperience(75);
player2.addToInventory('Magic Staff');

// Create multiple characters from same template
console.log('\n👥 CREATING MULTIPLE WARRIORS');
const warriors = [];
const warriorNames = ['Conan', 'Beowulf', 'Achilles'];

warriorNames.forEach(name => {
  const warrior = warriorTemplate.clone().init(name, 'Warrior');
  warrior.addToInventory('Steel Sword');
  warriors.push(warrior);
});

warriors.forEach(warrior => {
  console.log(`${warrior.name} stats:`, warrior.getStats());
});

// Real-world example: Document Templates
const documentPrototype = {
  init(title, author) {
    this.title = title;
    this.author = author;
    this.createdAt = new Date();
    this.content = '';
    this.metadata = {};
    return this;
  },
  
  addContent(content) {
    this.content += content;
  },
  
  setMetadata(key, value) {
    this.metadata[key] = value;
  },
  
  export() {
    return {
      title: this.title,
      author: this.author,
      createdAt: this.createdAt,
      content: this.content,
      metadata: this.metadata
    };
  },
  
  clone() {
    return Object.create(this);
  }
};

// Document type templates
const reportTemplate = Object.create(documentPrototype);
reportTemplate.type = 'report';
reportTemplate.sections = ['Executive Summary', 'Analysis', 'Conclusions'];
reportTemplate.format = function() {
  console.log(`📊 Formatting ${this.title} as a ${this.type}`);
  return `REPORT: ${this.title}\nBy: ${this.author}\n\n${this.content}`;
};

const letterTemplate = Object.create(documentPrototype);
letterTemplate.type = 'letter';
letterTemplate.recipient = '';
letterTemplate.format = function() {
  console.log(`✉️  Formatting ${this.title} as a ${this.type}`);
  return `Dear ${this.recipient},\n\n${this.content}\n\nSincerely,\n${this.author}`;
};

const invoiceTemplate = Object.create(documentPrototype);
invoiceTemplate.type = 'invoice';
invoiceTemplate.items = [];
invoiceTemplate.total = 0;
invoiceTemplate.addItem = function(item, price) {
  this.items.push({ item, price });
  this.total += price;
};
invoiceTemplate.format = function() {
  console.log(`💰 Formatting ${this.title} as an ${this.type}`);
  const itemList = this.items.map(item => `${item.item}: $${item.price}`).join('\n');
  return `INVOICE: ${this.title}\n\n${itemList}\n\nTotal: $${this.total}`;
};

console.log('\n=== DOCUMENT TEMPLATE EXAMPLE ===');

// Create documents from templates
const monthlyReport = reportTemplate.clone().init('Monthly Sales Report', 'John Manager');
monthlyReport.addContent('Sales increased by 15% this month...');
monthlyReport.setMetadata('department', 'Sales');

const businessLetter = letterTemplate.clone().init('Partnership Proposal', 'Jane CEO');
businessLetter.recipient = 'ABC Company';
businessLetter.addContent('We would like to propose a strategic partnership...');

const clientInvoice = invoiceTemplate.clone().init('Invoice #001', 'Accounting Dept');
clientInvoice.addItem('Web Development', 2500);
clientInvoice.addItem('SEO Services', 800);
clientInvoice.addItem('Maintenance', 300);

console.log(monthlyReport.format());
console.log('\n' + businessLetter.format());
console.log('\n' + clientInvoice.format());

// Performance comparison
console.log('\n⚡ PERFORMANCE COMPARISON');

// Creating objects with prototype (fast)
console.time('Prototype Creation');
for (let i = 0; i < 1000; i++) {
  const character = warriorTemplate.clone().init(`Warrior${i}`, 'Warrior');
}
console.timeEnd('Prototype Creation');

// Creating objects with constructor (slower)
class WarriorClass {
  constructor(name) {
    this.name = name;
    this.class = 'Warrior';
    this.level = 1;
    this.health = 100;
    this.strength = 15;
    this.defense = 12;
    this.magic = 5;
  }
}

console.time('Constructor Creation');
for (let i = 0; i < 1000; i++) {
  const character = new WarriorClass(`Warrior${i}`);
}
console.timeEnd('Constructor Creation');