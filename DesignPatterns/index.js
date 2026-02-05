/**
 * DESIGN PATTERNS INDEX
 * Run all design pattern examples
 * 
 * Usage: node DesignPatterns/index.js [pattern-number]
 * Example: node DesignPatterns/index.js 1  (runs only Module Pattern)
 *          node DesignPatterns/index.js     (runs all patterns)
 */

const fs = require('fs');
const path = require('path');

const patterns = [
  { name: 'Module Pattern', file: '1-module-pattern.js' },
  { name: 'Singleton Pattern', file: '2-singleton-pattern.js' },
  { name: 'Observer Pattern', file: '3-observer-pattern.js' },
  { name: 'Factory Pattern', file: '4-factory-pattern.js' },
  { name: 'Promise Pattern', file: '5-promise-pattern.js' },
  { name: 'Middleware Pattern', file: '6-middleware-pattern.js' },
  { name: 'Prototype Pattern', file: '7-prototype-pattern.js' },
  { name: 'Strategy Pattern', file: '8-strategy-pattern.js' }
];

async function runPattern(patternIndex) {
  const pattern = patterns[patternIndex - 1];
  if (!pattern) {
    console.log(`❌ Pattern ${patternIndex} not found. Available patterns: 1-${patterns.length}`);
    return;
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎯 RUNNING: ${pattern.name.toUpperCase()}`);
  console.log(`${'='.repeat(60)}\n`);
  
  try {
    // Import and run the pattern file
    delete require.cache[require.resolve(`./${pattern.file}`)];
    require(`./${pattern.file}`);
  } catch (error) {
    console.error(`❌ Error running ${pattern.name}:`, error.message);
  }
}

async function runAllPatterns() {
  console.log('🚀 JAVASCRIPT/NODE.JS DESIGN PATTERNS DEMO');
  console.log('==========================================\n');
  
  for (let i = 1; i <= patterns.length; i++) {
    await runPattern(i);
    
    // Add delay between patterns for better readability
    if (i < patterns.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ ALL DESIGN PATTERNS COMPLETED!');
  console.log(`${'='.repeat(60)}`);
}

function showHelp() {
  console.log('📚 DESIGN PATTERNS AVAILABLE:\n');
  patterns.forEach((pattern, index) => {
    console.log(`${index + 1}. ${pattern.name}`);
  });
  console.log('\n📖 Usage:');
  console.log('  node DesignPatterns/index.js        # Run all patterns');
  console.log('  node DesignPatterns/index.js 1      # Run specific pattern');
  console.log('  node DesignPatterns/index.js help   # Show this help');
}

// Main execution
const args = process.argv.slice(2);
const command = args[0];

if (command === 'help' || command === '-h' || command === '--help') {
  showHelp();
} else if (command && !isNaN(command)) {
  const patternNumber = parseInt(command);
  runPattern(patternNumber);
} else if (!command) {
  runAllPatterns();
} else {
  console.log(`❌ Unknown command: ${command}`);
  showHelp();
}