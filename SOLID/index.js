/**
 * SOLID PRINCIPLES INDEX
 * Run all SOLID principle examples
 * 
 * Usage: node SOLID/index.js [principle-number]
 * Example: node SOLID/index.js 1  (runs only Single Responsibility Principle)
 *          node SOLID/index.js     (runs all principles)
 */

const fs = require('fs');
const path = require('path');

const principles = [
  { name: 'Single Responsibility Principle (SRP)', file: '1-single-responsibility.js' },
  { name: 'Open/Closed Principle (OCP)', file: '2-open-closed.js' },
  { name: 'Liskov Substitution Principle (LSP)', file: '3-liskov-substitution.js' },
  { name: 'Interface Segregation Principle (ISP)', file: '4-interface-segregation.js' },
  { name: 'Dependency Inversion Principle (DIP)', file: '5-dependency-inversion.js' }
];

async function runPrinciple(principleIndex) {
  const principle = principles[principleIndex - 1];
  if (!principle) {
    console.log(`❌ Principle ${principleIndex} not found. Available principles: 1-${principles.length}`);
    return;
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🎯 RUNNING: ${principle.name.toUpperCase()}`);
  console.log(`${'='.repeat(70)}\n`);
  
  try {
    // Import and run the principle file
    delete require.cache[require.resolve(`./${principle.file}`)];
    require(`./${principle.file}`);
  } catch (error) {
    console.error(`❌ Error running ${principle.name}:`, error.message);
  }
}

async function runAllPrinciples() {
  console.log('🚀 SOLID PRINCIPLES DEMONSTRATION');
  console.log('==================================\n');
  
  console.log('📚 SOLID stands for:');
  console.log('  S - Single Responsibility Principle');
  console.log('  O - Open/Closed Principle');
  console.log('  L - Liskov Substitution Principle');
  console.log('  I - Interface Segregation Principle');
  console.log('  D - Dependency Inversion Principle\n');
  
  for (let i = 1; i <= principles.length; i++) {
    await runPrinciple(i);
    
    // Add delay between principles for better readability
    if (i < principles.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('✅ ALL SOLID PRINCIPLES COMPLETED!');
  console.log(`${'='.repeat(70)}`);
  
  console.log('\n🎯 KEY TAKEAWAYS:');
  console.log('==================');
  console.log('✅ SRP: Each class should have only one reason to change');
  console.log('✅ OCP: Open for extension, closed for modification');
  console.log('✅ LSP: Subclasses should be substitutable for their base classes');
  console.log('✅ ISP: Clients should not depend on interfaces they don\'t use');
  console.log('✅ DIP: Depend on abstractions, not concretions');
  
  console.log('\n💡 BENEFITS OF FOLLOWING SOLID:');
  console.log('================================');
  console.log('🔧 Maintainable code that\'s easy to modify');
  console.log('🧪 Testable components with clear responsibilities');
  console.log('🔄 Flexible architecture that adapts to change');
  console.log('🔗 Reduced coupling between components');
  console.log('👥 Better collaboration with clear interfaces');
  console.log('📈 Scalable systems that grow with requirements');
}

function showHelp() {
  console.log('📚 SOLID PRINCIPLES AVAILABLE:\n');
  principles.forEach((principle, index) => {
    console.log(`${index + 1}. ${principle.name}`);
  });
  console.log('\n📖 Usage:');
  console.log('  node SOLID/index.js        # Run all principles');
  console.log('  node SOLID/index.js 1      # Run specific principle');
  console.log('  node SOLID/index.js help   # Show this help');
  
  console.log('\n🎯 What Each Principle Teaches:');
  console.log('================================');
  console.log('1. SRP: One class, one responsibility');
  console.log('2. OCP: Extend behavior without modifying existing code');
  console.log('3. LSP: Subclasses must be interchangeable with parent classes');
  console.log('4. ISP: Small, focused interfaces over large, monolithic ones');
  console.log('5. DIP: Depend on abstractions, not concrete implementations');
}

// Main execution
const args = process.argv.slice(2);
const command = args[0];

if (command === 'help' || command === '-h' || command === '--help') {
  showHelp();
} else if (command && !isNaN(command)) {
  const principleNumber = parseInt(command);
  runPrinciple(principleNumber);
} else if (!command) {
  runAllPrinciples();
} else {
  console.log(`❌ Unknown command: ${command}`);
  showHelp();
}