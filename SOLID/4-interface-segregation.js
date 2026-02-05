/**
 * INTERFACE SEGREGATION PRINCIPLE (ISP)
 * "No client should be forced to depend on methods it does not use"
 * 
 * WHEN TO USE:
 * - When interfaces become too large
 * - When classes implement empty or throwing methods
 * - When different clients need different methods
 * 
 * WHY IMPORTANT:
 * - Flexibility: Classes implement only what they need
 * - Maintainability: Changes affect fewer classes
 * - Clarity: Interfaces have clear, focused purposes
 * - Testability: Easier to mock specific behaviors
 */

console.log('=== INTERFACE SEGREGATION PRINCIPLE ===\n');

// ❌ BAD EXAMPLE - Violates ISP
console.log('❌ BAD EXAMPLE (Violates ISP):');

// Fat interface - forces classes to implement unused methods ❌
class BadWorker {
  work() { throw new Error('Must implement work'); }
  eat() { throw new Error('Must implement eat'); }
  sleep() { throw new Error('Must implement sleep'); }
  takeBreak() { throw new Error('Must implement takeBreak'); }
  attendMeeting() { throw new Error('Must implement attendMeeting'); }
}

class BadHumanWorker extends BadWorker {
  work() { console.log('👨‍💼 Human working on tasks'); }
  eat() { console.log('🍽️ Human eating lunch'); }
  sleep() { console.log('😴 Human sleeping at night'); }
  takeBreak() { console.log('☕ Human taking coffee break'); }
  attendMeeting() { console.log('🤝 Human attending meeting'); }
}

// Robot doesn't eat, sleep, or take breaks but forced to implement ❌
class BadRobotWorker extends BadWorker {
  work() { console.log('🤖 Robot executing tasks'); }
  eat() { throw new Error('Robots do not eat'); } // Forced to implement
  sleep() { throw new Error('Robots do not sleep'); } // Forced to implement
  takeBreak() { throw new Error('Robots do not take breaks'); } // Forced to implement
  attendMeeting() { console.log('🤖 Robot joining virtual meeting'); }
}

// AI doesn't have physical needs but forced to implement ❌
class BadAIWorker extends BadWorker {
  work() { console.log('🧠 AI processing data'); }
  eat() { throw new Error('AI does not eat'); } // Forced to implement
  sleep() { throw new Error('AI does not sleep'); } // Forced to implement
  takeBreak() { throw new Error('AI does not take breaks'); } // Forced to implement
  attendMeeting() { console.log('🧠 AI participating in meeting analysis'); }
}

console.log('Testing bad implementation:');
const badHuman = new BadHumanWorker();
const badRobot = new BadRobotWorker();

badHuman.work();
badHuman.eat();

badRobot.work();
try {
  badRobot.eat(); // Throws error!
} catch (error) {
  console.log('❌ Error:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// ✅ GOOD EXAMPLE - Follows ISP
console.log('✅ GOOD EXAMPLE (Follows ISP):');

// Segregated interfaces - each has specific purpose ✅
class Workable {
  work() { throw new Error('Must implement work'); }
}

class Eatable {
  eat() { throw new Error('Must implement eat'); }
}

class Sleepable {
  sleep() { throw new Error('Must implement sleep'); }
}

class Breakable {
  takeBreak() { throw new Error('Must implement takeBreak'); }
}

class MeetingAttendable {
  attendMeeting() { throw new Error('Must implement attendMeeting'); }
}

class Maintainable {
  performMaintenance() { throw new Error('Must implement performMaintenance'); }
}

class Rechargeable {
  recharge() { throw new Error('Must implement recharge'); }
}

// Human implements only relevant interfaces ✅
class HumanWorker extends Workable {
  work() { console.log('👨‍💼 Human working efficiently on projects'); }
}

class HumanEater extends Eatable {
  eat() { console.log('🍽️ Human enjoying a healthy meal'); }
}

class HumanSleeper extends Sleepable {
  sleep() { console.log('😴 Human getting 8 hours of rest'); }
}

class HumanBreaker extends Breakable {
  takeBreak() { console.log('☕ Human taking a refreshing break'); }
}

class HumanMeetingAttendee extends MeetingAttendable {
  attendMeeting() { console.log('🤝 Human actively participating in meeting'); }
}

// Robot implements only what it needs ✅
class RobotWorker extends Workable {
  work() { console.log('🤖 Robot executing tasks with precision'); }
}

class RobotMaintainer extends Maintainable {
  performMaintenance() { console.log('🔧 Robot performing self-maintenance'); }
}

class RobotRecharger extends Rechargeable {
  recharge() { console.log('🔋 Robot recharging batteries'); }
}

class RobotMeetingAttendee extends MeetingAttendable {
  attendMeeting() { console.log('🤖 Robot providing data analysis in meeting'); }
}

// AI implements only relevant interfaces ✅
class AIWorker extends Workable {
  work() { console.log('🧠 AI processing complex algorithms'); }
}

class AIMeetingAttendee extends MeetingAttendable {
  attendMeeting() { console.log('🧠 AI providing intelligent insights'); }
}

// Using composition to combine behaviors ✅
class Human {
  constructor() {
    this.worker = new HumanWorker();
    this.eater = new HumanEater();
    this.sleeper = new HumanSleeper();
    this.breaker = new HumanBreaker();
    this.meetingAttendee = new HumanMeetingAttendee();
  }
  
  doWork() { this.worker.work(); }
  eatMeal() { this.eater.eat(); }
  getSleep() { this.sleeper.sleep(); }
  takeBreak() { this.breaker.takeBreak(); }
  joinMeeting() { this.meetingAttendee.attendMeeting(); }
}

class Robot {
  constructor() {
    this.worker = new RobotWorker();
    this.maintainer = new RobotMaintainer();
    this.recharger = new RobotRecharger();
    this.meetingAttendee = new RobotMeetingAttendee();
  }
  
  doWork() { this.worker.work(); }
  maintain() { this.maintainer.performMaintenance(); }
  recharge() { this.recharger.recharge(); }
  joinMeeting() { this.meetingAttendee.attendMeeting(); }
}

class AI {
  constructor() {
    this.worker = new AIWorker();
    this.meetingAttendee = new AIMeetingAttendee();
  }
  
  doWork() { this.worker.work(); }
  joinMeeting() { this.meetingAttendee.attendMeeting(); }
}

// Usage - Each entity only uses what it needs ✅
console.log('=== HUMAN ACTIVITIES ===');
const human = new Human();
human.doWork();
human.eatMeal();
human.takeBreak();
human.joinMeeting();
human.getSleep();

console.log('\n=== ROBOT ACTIVITIES ===');
const robot = new Robot();
robot.doWork();
robot.maintain();
robot.recharge();
robot.joinMeeting();

console.log('\n=== AI ACTIVITIES ===');
const ai = new AI();
ai.doWork();
ai.joinMeeting();

console.log('\n=== REAL-WORLD EXAMPLE: MEDIA PLAYER ===');

// Real-world example: Media player system
// Bad approach - fat interface ❌
class BadMediaPlayer {
  playAudio() { throw new Error('Must implement playAudio'); }
  playVideo() { throw new Error('Must implement playVideo'); }
  recordAudio() { throw new Error('Must implement recordAudio'); }
  recordVideo() { throw new Error('Must implement recordVideo'); }
  editAudio() { throw new Error('Must implement editAudio'); }
  editVideo() { throw new Error('Must implement editVideo'); }
  streamLive() { throw new Error('Must implement streamLive'); }
}

// Good approach - segregated interfaces ✅
class AudioPlayable {
  playAudio() { throw new Error('Must implement playAudio'); }
}

class VideoPlayable {
  playVideo() { throw new Error('Must implement playVideo'); }
}

class AudioRecordable {
  recordAudio() { throw new Error('Must implement recordAudio'); }
}

class VideoRecordable {
  recordVideo() { throw new Error('Must implement recordVideo'); }
}

class AudioEditable {
  editAudio() { throw new Error('Must implement editAudio'); }
}

class VideoEditable {
  editVideo() { throw new Error('Must implement editVideo'); }
}

class LiveStreamable {
  streamLive() { throw new Error('Must implement streamLive'); }
}

// Specific implementations
class MusicPlayer extends AudioPlayable {
  playAudio() {
    console.log('🎵 Playing music with high-quality audio');
  }
}

class VideoPlayer extends VideoPlayable {
  playVideo() {
    console.log('🎬 Playing video with HD quality');
  }
}

class AudioRecorder extends AudioRecordable {
  recordAudio() {
    console.log('🎤 Recording audio with noise cancellation');
  }
}

class VideoRecorder extends VideoRecordable {
  recordVideo() {
    console.log('📹 Recording video in 4K resolution');
  }
}

class AudioEditor extends AudioEditable {
  editAudio() {
    console.log('🎛️ Editing audio with professional tools');
  }
}

class VideoEditor extends VideoEditable {
  editVideo() {
    console.log('✂️ Editing video with advanced effects');
  }
}

class LiveStreamer extends LiveStreamable {
  streamLive() {
    console.log('📡 Streaming live to multiple platforms');
  }
}

// Composite classes that combine only needed functionality ✅
class BasicMusicApp {
  constructor() {
    this.player = new MusicPlayer();
  }
  
  play() { this.player.playAudio(); }
}

class PodcastApp {
  constructor() {
    this.player = new MusicPlayer();
    this.recorder = new AudioRecorder();
    this.editor = new AudioEditor();
  }
  
  play() { this.player.playAudio(); }
  record() { this.recorder.recordAudio(); }
  edit() { this.editor.editAudio(); }
}

class VideoStreamingApp {
  constructor() {
    this.videoPlayer = new VideoPlayer();
    this.audioPlayer = new MusicPlayer();
  }
  
  playVideo() { this.videoPlayer.playVideo(); }
  playAudio() { this.audioPlayer.playAudio(); }
}

class ContentCreatorApp {
  constructor() {
    this.videoPlayer = new VideoPlayer();
    this.audioPlayer = new MusicPlayer();
    this.videoRecorder = new VideoRecorder();
    this.audioRecorder = new AudioRecorder();
    this.videoEditor = new VideoEditor();
    this.audioEditor = new AudioEditor();
    this.streamer = new LiveStreamer();
  }
  
  playVideo() { this.videoPlayer.playVideo(); }
  playAudio() { this.audioPlayer.playAudio(); }
  recordVideo() { this.videoRecorder.recordVideo(); }
  recordAudio() { this.audioRecorder.recordAudio(); }
  editVideo() { this.videoEditor.editVideo(); }
  editAudio() { this.audioEditor.editAudio(); }
  goLive() { this.streamer.streamLive(); }
}

// Usage
console.log('🎵 Basic Music App:');
const musicApp = new BasicMusicApp();
musicApp.play();

console.log('\n🎙️ Podcast App:');
const podcastApp = new PodcastApp();
podcastApp.record();
podcastApp.edit();
podcastApp.play();

console.log('\n📺 Video Streaming App:');
const streamingApp = new VideoStreamingApp();
streamingApp.playVideo();
streamingApp.playAudio();

console.log('\n🎬 Content Creator App:');
const creatorApp = new ContentCreatorApp();
creatorApp.recordVideo();
creatorApp.editVideo();
creatorApp.recordAudio();
creatorApp.editAudio();
creatorApp.goLive();

console.log('\n=== DOCUMENT PROCESSOR EXAMPLE ===');

// Another example: Document processing system
class Readable {
  read() { throw new Error('Must implement read'); }
}

class Writable {
  write() { throw new Error('Must implement write'); }
}

class Printable {
  print() { throw new Error('Must implement print'); }
}

class Scannable {
  scan() { throw new Error('Must implement scan'); }
}

class Faxable {
  fax() { throw new Error('Must implement fax'); }
}

class Emailable {
  email() { throw new Error('Must implement email'); }
}

// Specific implementations
class DocumentReader extends Readable {
  read() { console.log('📖 Reading document content'); }
}

class DocumentWriter extends Writable {
  write() { console.log('✍️ Writing document content'); }
}

class DocumentPrinter extends Printable {
  print() { console.log('🖨️ Printing document'); }
}

class DocumentScanner extends Scannable {
  scan() { console.log('📄 Scanning document'); }
}

class DocumentFax extends Faxable {
  fax() { console.log('📠 Faxing document'); }
}

class DocumentEmailer extends Emailable {
  email() { console.log('📧 Emailing document'); }
}

// Different devices with only needed capabilities ✅
class SimpleReader {
  constructor() {
    this.reader = new DocumentReader();
  }
  
  readDocument() { this.reader.read(); }
}

class BasicPrinter {
  constructor() {
    this.printer = new DocumentPrinter();
  }
  
  printDocument() { this.printer.print(); }
}

class MultiFunctionPrinter {
  constructor() {
    this.reader = new DocumentReader();
    this.writer = new DocumentWriter();
    this.printer = new DocumentPrinter();
    this.scanner = new DocumentScanner();
    this.emailer = new DocumentEmailer();
  }
  
  readDocument() { this.reader.read(); }
  writeDocument() { this.writer.write(); }
  printDocument() { this.printer.print(); }
  scanDocument() { this.scanner.scan(); }
  emailDocument() { this.emailer.email(); }
}

class LegacyFaxMachine {
  constructor() {
    this.fax = new DocumentFax();
    this.printer = new DocumentPrinter();
  }
  
  sendFax() { this.fax.fax(); }
  printDocument() { this.printer.print(); }
}

// Usage
console.log('📱 Simple E-Reader:');
const eReader = new SimpleReader();
eReader.readDocument();

console.log('\n🖨️ Basic Printer:');
const basicPrinter = new BasicPrinter();
basicPrinter.printDocument();

console.log('\n🖨️📄 Multi-Function Printer:');
const mfp = new MultiFunctionPrinter();
mfp.scanDocument();
mfp.printDocument();
mfp.emailDocument();

console.log('\n📠 Legacy Fax Machine:');
const faxMachine = new LegacyFaxMachine();
faxMachine.sendFax();
faxMachine.printDocument();

console.log('\n=== ISP BENEFITS DEMONSTRATED ===');
console.log('✅ Classes implement only methods they actually use');
console.log('✅ No empty or throwing method implementations');
console.log('✅ Interfaces are focused and cohesive');
console.log('✅ Easy to add new implementations');
console.log('✅ Better testability with smaller interfaces');
console.log('✅ Reduced coupling between components');