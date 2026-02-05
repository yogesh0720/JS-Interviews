/**
 * FACTORY PATTERN
 * Real-World Example: Vehicle Manufacturing (like Tesla)
 * 
 * WHEN TO USE:
 * - Creating objects with complex initialization
 * - Multiple object types with similar structure
 * - Runtime object creation decisions
 * - Abstracting object creation logic
 * 
 * WHY TO USE:
 * - Flexibility: Easy to add new object types
 * - Centralized creation: Single place for object creation logic
 * - Consistency: Ensures objects are created correctly
 * - Abstraction: Hides complex creation details
 */

// Like Tesla factory - same process, different car models
class VehicleFactory {
  static createVehicle(type, model, options = {}) {
    const baseVehicle = {
      model,
      year: 2024,
      warranty: '3 years',
      manufacturer: 'AutoCorp',
      ...options
    };
    
    switch(type) {
      case 'sedan':
        return new Sedan(baseVehicle);
      case 'suv':
        return new SUV(baseVehicle);
      case 'electric':
        return new ElectricVehicle(baseVehicle);
      case 'truck':
        return new Truck(baseVehicle);
      default:
        throw new Error(`Vehicle type "${type}" not supported`);
    }
  }
  
  static getSupportedTypes() {
    return ['sedan', 'suv', 'electric', 'truck'];
  }
}

// Vehicle classes
class Sedan {
  constructor(baseVehicle) {
    Object.assign(this, baseVehicle);
    this.type = 'sedan';
    this.doors = 4;
    this.fuelType = 'gasoline';
    this.price = 25000;
    this.mpg = 30;
  }
  
  start() {
    console.log(`${this.model} sedan engine started`);
  }
  
  getInfo() {
    return `${this.year} ${this.model} Sedan - $${this.price} - ${this.mpg} MPG`;
  }
}

class SUV {
  constructor(baseVehicle) {
    Object.assign(this, baseVehicle);
    this.type = 'suv';
    this.doors = 5;
    this.fuelType = 'gasoline';
    this.price = 35000;
    this.groundClearance = '8 inches';
    this.mpg = 25;
  }
  
  start() {
    console.log(`${this.model} SUV engine started`);
  }
  
  getInfo() {
    return `${this.year} ${this.model} SUV - $${this.price} - ${this.groundClearance} clearance`;
  }
}

class ElectricVehicle {
  constructor(baseVehicle) {
    Object.assign(this, baseVehicle);
    this.type = 'electric';
    this.doors = 4;
    this.fuelType = 'electric';
    this.price = 45000;
    this.range = '300 miles';
    this.chargingTime = '45 minutes';
  }
  
  start() {
    console.log(`${this.model} electric vehicle powered on silently`);
  }
  
  charge() {
    console.log(`Charging ${this.model}... Full charge in ${this.chargingTime}`);
  }
  
  getInfo() {
    return `${this.year} ${this.model} Electric - $${this.price} - ${this.range} range`;
  }
}

class Truck {
  constructor(baseVehicle) {
    Object.assign(this, baseVehicle);
    this.type = 'truck';
    this.doors = 2;
    this.fuelType = 'diesel';
    this.price = 40000;
    this.towingCapacity = '10,000 lbs';
    this.mpg = 20;
  }
  
  start() {
    console.log(`${this.model} truck diesel engine started`);
  }
  
  getInfo() {
    return `${this.year} ${this.model} Truck - $${this.price} - ${this.towingCapacity} towing`;
  }
}

// Usage Examples
console.log('=== FACTORY PATTERN DEMO ===');

// Factory decides what to create based on type
const myCar = VehicleFactory.createVehicle('electric', 'Model 3', { color: 'red' });
const familyCar = VehicleFactory.createVehicle('suv', 'Explorer', { color: 'blue' });
const workTruck = VehicleFactory.createVehicle('truck', 'F-150', { color: 'white' });

console.log(myCar.getInfo());
console.log(familyCar.getInfo());
console.log(workTruck.getInfo());

myCar.start();
myCar.charge();

familyCar.start();
workTruck.start();

// Dynamic vehicle creation
const vehicleOrders = [
  { type: 'sedan', model: 'Camry', options: { color: 'silver' } },
  { type: 'electric', model: 'Tesla Y', options: { color: 'black' } },
  { type: 'suv', model: 'Tahoe', options: { color: 'red' } }
];

console.log('\n=== PROCESSING VEHICLE ORDERS ===');
vehicleOrders.forEach((order, index) => {
  try {
    const vehicle = VehicleFactory.createVehicle(order.type, order.model, order.options);
    console.log(`Order ${index + 1}: ${vehicle.getInfo()}`);
  } catch (error) {
    console.log(`Order ${index + 1} failed: ${error.message}`);
  }
});

// Real-world example: UI Component Factory
class UIComponentFactory {
  static createComponent(type, props = {}) {
    switch(type) {
      case 'button':
        return new Button(props);
      case 'input':
        return new Input(props);
      case 'modal':
        return new Modal(props);
      default:
        throw new Error(`Component type "${type}" not supported`);
    }
  }
}

class Button {
  constructor(props) {
    this.text = props.text || 'Click me';
    this.color = props.color || 'blue';
    this.size = props.size || 'medium';
  }
  
  render() {
    return `<button class="${this.color} ${this.size}">${this.text}</button>`;
  }
}

class Input {
  constructor(props) {
    this.placeholder = props.placeholder || 'Enter text';
    this.type = props.type || 'text';
  }
  
  render() {
    return `<input type="${this.type}" placeholder="${this.placeholder}">`;
  }
}

class Modal {
  constructor(props) {
    this.title = props.title || 'Modal';
    this.content = props.content || 'Modal content';
  }
  
  render() {
    return `<div class="modal"><h2>${this.title}</h2><p>${this.content}</p></div>`;
  }
}

console.log('\n=== UI COMPONENT FACTORY ===');
const submitButton = UIComponentFactory.createComponent('button', { 
  text: 'Submit', 
  color: 'green' 
});
const emailInput = UIComponentFactory.createComponent('input', { 
  placeholder: 'Enter email', 
  type: 'email' 
});
const confirmModal = UIComponentFactory.createComponent('modal', { 
  title: 'Confirm Action', 
  content: 'Are you sure?' 
});

console.log(submitButton.render());
console.log(emailInput.render());
console.log(confirmModal.render());