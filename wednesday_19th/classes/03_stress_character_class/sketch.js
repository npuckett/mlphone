// ==============================================
// STRESS CHARACTER CLASS EXAMPLE - Main Sketch
// ==============================================
// This example demonstrates the same functionality as the
// localStorage stress_shake_persistent example, but organized
// using a class structure.
//
// COMPARE THIS to the function-based version to see how
// classes help organize complex behavior!
// ==============================================

// ==============================================
// GLOBAL VARIABLES
// ==============================================
let character;          // StressCharacter instance
let idleAnimation;      // Animation assets
let walkAnimation;
let showUI = true;      // UI toggle
let sensorsActive = false;  // Sensor status
let resetButton;        // Reset button UI element

// ==============================================
// PRELOAD - Load animations before setup
// ==============================================
function preload() {
  // Load idle animation (9 frames)
  idleAnimation = loadAni('animations/idle/idleAnim_1.png', 9);
  
  // Load walk animation (13 frames)
  walkAnimation = loadAni('animations/walk/walkAnim_1.png', 13);
}

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  // Create portrait canvas (9:16 aspect ratio for mobile)
  createCanvas(405, 720);
  
  // Lock mobile gestures (prevent zoom/refresh)
  lockGestures();
  
  // Enable device motion sensors with tap
  enableGyroTap('Tap to enable shake detection');
  
  // Turn off physics gravity
  world.gravity.y = 0;
  
  // CREATE character using class
  // Notice how simple this is - the class handles all initialization!
  character = new StressCharacter(width / 2, height / 2, idleAnimation, walkAnimation);
  
  // Create reset button
  createResetButton();
}

// ==============================================
// DRAW - Main game loop
// ==============================================
function draw() {
  background(30, 30, 40);
  
  // Check sensor status
  sensorsActive = window.sensorsEnabled || false;
  
  // UPDATE character
  // All the complex update logic is encapsulated in the class!
  character.update();
  
  // DISPLAY character
  character.display();
  
  // Visual feedback
  drawStressBar();
  drawShakeIndicator();
  
  // UI overlay
  if (showUI) {
    drawUI();
  }
}

// ==============================================
// DEVICE SHAKE EVENT
// ==============================================
// This is the p5.js event callback for shake detection
// We simply forward it to the character's onShake method
function deviceShaken() {
  if (window.sensorsEnabled) {
    character.onShake();
  }
}

// ==============================================
// RESET BUTTON
// ==============================================
function createResetButton() {
  resetButton = createButton('Reset Stress');
  resetButton.position(width - 120, 10);
  resetButton.mousePressed(() => {
    character.resetStress();  // Call the character's reset method
  });
  resetButton.style('padding', '8px 15px');
  resetButton.style('font-size', '14px');
  resetButton.style('background-color', '#ff4444');
  resetButton.style('color', 'white');
  resetButton.style('border', 'none');
  resetButton.style('border-radius', '5px');
  resetButton.style('cursor', 'pointer');
  resetButton.style('font-family', 'Arial, sans-serif');
}

// ==============================================
// INPUT HANDLING
// ==============================================
function mousePressed() {
  return false;
}

function touchStarted() {
  return false;
}

function keyPressed() {
  if (key === ' ') {
    showUI = !showUI;
  }
}

// ==============================================
// VISUAL FEEDBACK: Stress Bar
// ==============================================
function drawStressBar() {
  // Background bar
  push();
  noStroke();
  fill(50, 50, 60);
  rect(20, 20, width - 160, 30, 5);
  
  // Stress level bar
  let stress = character.getStress();
  let displayStress = character.getDisplayStress();
  let barWidth = map(displayStress, 0, 100, 0, width - 160);
  let r = map(displayStress, 0, 100, 100, 255);
  let g = map(displayStress, 0, 100, 255, 50);
  fill(r, g, 100);
  rect(20, 20, barWidth, 30, 5);
  
  // Text label
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text(`STRESS: ${floor(stress)}`, (width - 160) / 2 + 20, 35);
  pop();
}

// ==============================================
// VISUAL FEEDBACK: Shake Indicator
// ==============================================
function drawShakeIndicator() {
  push();
  
  let shakeIntensity = character.getShakeIntensity();
  
  // Draw shake intensity meter
  let meterX = 20;
  let meterY = 70;
  let meterWidth = 150;
  let meterHeight = 20;
  
  // Background
  noStroke();
  fill(40, 40, 50);
  rect(meterX, meterY, meterWidth, meterHeight, 3);
  
  // Shake intensity level
  let intensityWidth = map(shakeIntensity, 0, 10, 0, meterWidth);
  fill(255, 150, 0);
  rect(meterX, meterY, intensityWidth, meterHeight, 3);
  
  // Label
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(12);
  text('Shake:', meterX, meterY - 10);
  text(shakeIntensity.toFixed(2), meterX + meterWidth + 10, meterY + meterHeight / 2);
  
  pop();
}

// ==============================================
// UI: Debug Information
// ==============================================
function drawUI() {
  push();
  
  // Get character state using getter methods
  let stress = character.getStress();
  let displayStress = character.getDisplayStress();
  let savedStress = character.getSavedStress();
  let currentSpeed = character.getCurrentSpeed();
  let jitterAmount = character.getJitterAmount();
  
  let x = 20;
  let y = 120;
  let lineHeight = 18;
  
  // Semi-transparent background
  fill(0, 0, 0, 180);
  noStroke();
  rect(x - 10, y - 10, 370, 310, 5);
  
  // Title
  fill(255, 200, 0);
  textAlign(LEFT, TOP);
  textSize(16);
  text('⚡ PERSISTENT SHAKE STRESS (CLASS)', x, y);
  y += lineHeight * 1.5;
  
  // LOCAL STORAGE Section
  fill(100, 255, 255);
  textSize(14);
  text('LOCAL STORAGE:', x, y);
  y += lineHeight;
  
  fill(255);
  textSize(12);
  text(`  Saved Value: ${savedStress !== null ? savedStress.toFixed(1) : 'none'}`, x, y);
  y += lineHeight;
  text(`  Current Stress: ${stress.toFixed(1)}`, x, y);
  y += lineHeight;
  text(`  Auto-saves every frame`, x, y);
  y += lineHeight * 1.3;
  
  // Parameter Section
  fill(255, 200, 100);
  textSize(14);
  text('PARAMETER:', x, y);
  y += lineHeight;
  
  fill(255);
  textSize(12);
  text(`  stress = ${stress.toFixed(1)}`, x, y);
  y += lineHeight;
  text(`  displayStress = ${displayStress.toFixed(1)}`, x, y);
  y += lineHeight * 1.3;
  
  // Input Section
  fill(100, 200, 255);
  textSize(14);
  text('INPUT (DEVICE SHAKE):', x, y);
  y += lineHeight;
  
  fill(255);
  textSize(12);
  text(`  Sensors: ${sensorsActive ? 'ENABLED ✓' : 'DISABLED ✗'}`, x, y);
  y += lineHeight;
  text(`  Shake adds: +${character.STRESS_SHAKE_INCREASE} stress`, x, y);
  y += lineHeight;
  text(`  Recovery: -${character.STRESS_RECOVERY}/frame`, x, y);
  y += lineHeight * 1.3;
  
  // Thresholds
  fill(255, 150, 150);
  textSize(14);
  text('THRESHOLDS:', x, y);
  y += lineHeight;
  
  fill(255);
  textSize(12);
  text(`  Warning: ${character.STRESS_WARNING_THRESHOLD} (jitter starts)`, x, y);
  y += lineHeight;
  text(`  Panic: ${character.STRESS_PANIC_THRESHOLD} (extreme jitter)`, x, y);
  y += lineHeight * 1.3;
  
  // Current State
  fill(200, 200, 255);
  textSize(14);
  text('CURRENT STATE:', x, y);
  y += lineHeight;
  
  fill(255);
  textSize(12);
  text(`  Speed: ${currentSpeed.toFixed(2)}x`, x, y);
  y += lineHeight;
  text(`  Jitter: ${jitterAmount.toFixed(2)}`, x, y);
  y += lineHeight * 1.3;
  
  // Instructions
  fill(200);
  textSize(11);
  if (!sensorsActive) {
    text('Tap screen to enable motion sensors', x, y);
    y += lineHeight;
  }
  text('Shake device to stress character!', x, y);
  y += lineHeight;
  text('Refresh page - stress persists!', x, y);
  y += lineHeight;
  text('Click "Reset Stress" to clear', x, y);
  y += lineHeight;
  text('Space: Toggle UI', x, y);
  
  pop();
}

// ==============================================
// COMPARISON: CLASS vs FUNCTION APPROACH
// ==============================================
/*

SKETCH.JS SIMPLICITY:

Function Version (02_stress_shake_persistent):
  - 550 lines in sketch.js
  - All logic in one file
  - Many global variables
  - Hard to see organization

Class Version (03_stress_character_class):
  - 280 lines in sketch.js
  - 320 lines in StressCharacter.js
  - Clean separation of concerns
  - Easy to see what's character logic vs UI


CREATING A CHARACTER:

Function Version:
  // Lots of setup code scattered in setup()
  stress = 0;
  displayStress = 0;
  shakeIntensity = 0;
  targetX = random(...);
  targetY = random(...);
  character = new Sprite(...);
  // ... etc

Class Version:
  character = new StressCharacter(x, y, idleAni, walkAni);
  // That's it! Everything handled in constructor


UPDATING CHARACTER:

Function Version:
  updateShakeIntensity();
  updateStressParameter();
  updateWandering();
  updateCharacterColor();
  updateStressJitter();
  updateMovementSpeed();
  moveCharacterToTarget();
  saveStressToStorage();
  // 8 function calls

Class Version:
  character.update();
  // 1 method call, does everything internally


RESPONDING TO SHAKE:

Function Version:
  function deviceShaken() {
    shakeIntensity += 1.0;
    shakeIntensity = constrain(...);
    stress += STRESS_SHAKE_INCREASE;
    stress = constrain(...);
  }

Class Version:
  function deviceShaken() {
    character.onShake();  // Delegate to character
  }


ACCESSING STATE:

Function Version:
  // Direct access to global variables
  stress
  displayStress
  shakeIntensity
  // Anyone can modify these!

Class Version:
  // Controlled access through getters
  character.getStress()
  character.getDisplayStress()
  character.getShakeIntensity()
  // Only character can modify its own state


MULTIPLE CHARACTERS:

Function Version:
  // Would need separate variables for each character:
  let stress1, stress2, stress3;
  let displayStress1, displayStress2, displayStress3;
  let shakeIntensity1, shakeIntensity2, shakeIntensity3;
  // ... nightmare!

Class Version:
  let char1 = new StressCharacter(...);
  let char2 = new StressCharacter(...);
  let char3 = new StressCharacter(...);
  // Each has independent state, easy!


CODE ORGANIZATION:

Function Version:
  ✗ Everything in one big file
  ✗ Hard to find specific functionality
  ✗ Functions scattered throughout
  ✗ No clear boundaries

Class Version:
  ✓ StressCharacter.js - character logic
  ✓ sketch.js - setup, draw, UI
  ✓ Clear separation
  ✓ Easy to navigate


MAINTAINABILITY:

Function Version:
  - Add new feature: Search through 550 lines
  - Fix bug: Could be anywhere
  - Understand code: Read everything

Class Version:
  - Add new feature: Modify class or create subclass
  - Fix bug: If character-related, check class
  - Understand code: Read class documentation


PROFESSIONAL PRACTICE:

Function Version:
  - Good for learning
  - Good for simple prototypes
  - Not scalable

Class Version:
  - Industry standard
  - Scalable architecture
  - Easy to collaborate on
  - Reusable components

*/
