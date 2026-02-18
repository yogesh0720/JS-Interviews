/**
 * NODE.JS EVENT LOOP - ALL 6 PHASES (SIMPLE)
 *
 * 1. Timers - setTimeout, setInterval
 * 2. Pending Callbacks - I/O callbacks deferred
 * 3. Idle, Prepare - Internal (not shown)
 * 4. Poll - I/O events (file, network)
 * 5. Check - setImmediate
 * 6. Close Callbacks - socket.on('close')
 */

const fs = require("fs");
const net = require("net");

console.log("1. Start");

// Microtasks (run before any phase)
process.nextTick(() => console.log("2. nextTick"));
Promise.resolve().then(() => console.log("3. Promise"));

// Phase 1: Timers
setTimeout(() => console.log("5. setTimeout (Timers)"), 0);

// Phase 2: Pending Callbacks (I/O errors, TCP errors)
// Automatically handled by Node.js

// Phase 3: Idle, Prepare
// Internal use only - not accessible

// Phase 4: Poll (I/O)
fs.readFile(__filename, () => {
  console.log("6. File read (Poll)");

  setTimeout(() => console.log("9. setTimeout in I/O"), 0);
  setImmediate(() => console.log("8. setImmediate in I/O"));
});

// Phase 5: Check
setImmediate(() => console.log("4. setImmediate (Check)"));

// Phase 6: Close Callbacks
const server = net.createServer();
server.on("close", () => console.log("10. Server close (Close Callbacks)"));
server.listen(8080, () => server.close());

console.log("7. End");

setTimeout(() => process.exit(0), 500);

/**
 * OUTPUT:
 * 1. Start
 * 7. End
 * 2. nextTick (Microtask)
 * 3. Promise (Microtask)
 * 4. setImmediate (Check Phase)
 * 5. setTimeout (Timers Phase)
 * 6. File read (Poll Phase)
 * 8. setImmediate in I/O (Check Phase)
 * 9. setTimeout in I/O (Timers Phase)
 * 10. Server close (Close Callbacks Phase)
 */
