// ==============================================
// CHARACTER TEMPLATE CLASS EXAMPLE - Main Sketch
// ==============================================
// This example demonstrates a simple parameter-driven character
// using a class structure with localStorage persistence.
//
// PATTERN: PARAMETER → THRESHOLD → BEHAVIOR + STORAGE
// ==============================================

// ==============================================
// GLOBAL VARIABLES
// ==============================================
let character;          // HealthCharacter instance
let animation1;         // High health animation
let animation2;         // Low health animation
let resetButton;        // Reset button UI element

// ==============================================
// PRELOAD - Load animations before setup
// ==============================================
function preload() {
  // Load two animations
  animation1 = loadAni('animations/idle/idleAnim_1.png', 9);
  animation2 = loadAni('animations/walk/walkAnim_1.png', 13);
}

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  // Create canvas (9:16 mobile aspect ratio)
  createCanvas(405, 720);
  
  // Lock mobile gestures
  lockGestures();
  
  // Disable physics gravity
  world.gravity.y = 0;
  
  // CREATE character using class
  // The class handles initialization, including loading from localStorage
  character = new HealthCharacter(width / 2, height / 2, animation1, animation2);
  
  // Create reset button
  createResetButton();
}

// ==============================================
// DRAW - Main loop
// ==============================================
function draw() {
  background(30, 30, 40);
  
  // UPDATE character
  // This single call handles:
  // - Parameter calculation
  // - Threshold checking
  // - Behavior execution
  // - localStorage saving
  character.update();
  
  // DISPLAY character
  character.display();
  
  // Draw UI
  drawUI();
}

// ==============================================
// RESET BUTTON
// ==============================================
function createResetButton() {
  resetButton = createButton('Reset Health');
  resetButton.position(width - 120, 10);
  resetButton.mousePressed(() => {
    character.resetHealth();
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
  // Click to increase health
  character.increaseHealth(10);
  return false;
}

function touchStarted() {
  // Touch to increase health (mobile)
  character.increaseHealth(10);
  return false;
}

function keyPressed() {
  // Spacebar to decrease health
  if (key === ' ') {
    character.decreaseHealth(10);
  }
}

// ==============================================
// UI DISPLAY
// ==============================================
function drawUI() {
  push();
  
  // Get character state using getters
  let health = character.getHealth();
  let threshold = character.getThreshold();
  let savedHealth = character.getSavedHealth();
  let isHealthy = character.isHealthy();
  let currentAni = character.getCurrentAnimation();
  
  // Health bar background
  noStroke();
  fill(50, 50, 60);
  rect(20, 20, width - 160, 30, 5);
  
  // Health bar fill
  let barWidth = map(health, 0, 100, 0, width - 160);
  if (isHealthy) {
    fill(100, 255, 100);  // Green when above threshold
  } else {
    fill(255, 100, 100);  // Red when below threshold
  }
  rect(20, 20, barWidth, 30, 5);
  
  // Health value text
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text(`Health: ${floor(health)}`, (width - 160) / 2 + 20, 35);
  
  // Info panel
  let x = 20;
  let y = 70;
  let lineHeight = 20;
  
  fill(0, 0, 0, 180);
  rect(x - 10, y - 10, 340, 200, 5);
  
  fill(255, 200, 0);
  textAlign(LEFT, TOP);
  textSize(14);
  text('SIMPLE CHARACTER TEMPLATE (CLASS)', x, y);
  y += lineHeight * 1.5;
  
  // LOCAL STORAGE Section
  fill(100, 255, 255);
  textSize(13);
  text('LOCAL STORAGE:', x, y);
  y += lineHeight;
  
  fill(255);
  textSize(12);
  text(`  Saved: ${savedHealth !== null ? savedHealth.toFixed(1) : 'none'}`, x, y);
  y += lineHeight;
  text(`  Current: ${health.toFixed(1)}`, x, y);
  y += lineHeight * 1.3;
  
  // PARAMETER Section
  fill(255, 200, 100);
  textSize(13);
  text('PARAMETER:', x, y);
  y += lineHeight;
  
  fill(255);
  textSize(12);
  text(`  health = ${health.toFixed(1)}`, x, y);
  y += lineHeight;
  text(`  threshold = ${threshold}`, x, y);
  y += lineHeight * 1.3;
  
  // STATE Section
  if (isHealthy) {
    fill(100, 255, 100);
    text('State: ABOVE threshold', x, y);
    y += lineHeight;
    fill(255);
    text(`Animation: ${currentAni}`, x, y);
    y += lineHeight;
    text('Behavior: behaviour1()', x, y);
  } else {
    fill(255, 100, 100);
    text('State: BELOW threshold', x, y);
    y += lineHeight;
    fill(255);
    text(`Animation: ${currentAni}`, x, y);
    y += lineHeight;
    text('Behavior: behaviour2()', x, y);
  }
  y += lineHeight * 1.5;
  
  // Instructions
  fill(200);
  textSize(11);
  text('Click/Touch: +10 health', x, y);
  y += lineHeight;
  text('Space: -10 health', x, y);
  y += lineHeight;
  text('Refresh page - health persists!', x, y);
  
  pop();
}

// ==============================================
// COMPARISON: CLASS vs FUNCTION TEMPLATE
// ==============================================
/*

CREATING CHARACTER:

Function version (00_template_simple):
  health = 50;
  character = new Sprite(width / 2, height / 2);
  character.scale = 0.2;
  character.physics = 'kinematic';
  character.collider = 'none';
  character.addAni('animation1', animation1);
  character.addAni('animation2', animation2);
  character.changeAni('animation1');

Class version (04_character_template_class):
  character = new HealthCharacter(width / 2, height / 2, animation1, animation2);
  // One line! + automatic localStorage loading


UPDATING CHARACTER:

Function version:
  health = calculateHealth();
  if (health >= HEALTH_THRESHOLD) {
    behaviour1();
  } else {
    behaviour2();
  }

Class version:
  character.update();
  // Everything handled internally


MODIFYING HEALTH:

Function version:
  health += 10;
  health = constrain(health, 0, 100);

Class version:
  character.increaseHealth(10);
  // Built-in constraining


PERSISTENCE:

Function version:
  // No localStorage support

Class version:
  // Automatic save/load built-in
  // loadHealthFromStorage() in constructor
  // saveHealthToStorage() in update()
  // resetHealth() method


ACCESSING STATE:

Function version:
  // Direct global variable access
  let h = health;
  let t = HEALTH_THRESHOLD;

Class version:
  // Controlled access through getters
  let h = character.getHealth();
  let t = character.getThreshold();


CODE ORGANIZATION:

Function version:
  - All in sketch.js
  - 242 lines
  - Good for learning basics

Class version:
  - HealthCharacter.js: 280 lines (reusable class)
  - sketch.js: 180 lines (simple main program)
  - Better organization
  - Professional structure


EXTENDING FUNCTIONALITY:

Function version:
  - Modify existing code
  - Risk breaking things

Class version:
  - Extend with inheritance
  - Override specific methods
  - Keep original intact

Example:
  class DecayingCharacter extends HealthCharacter {
    calculateHealth() {
      this.health -= 0.1;
      this.health = constrain(this.health, 0, 100);
    }
  }


USE AS TEMPLATE:

This class serves as a starting point for:
1. Different parameters (stress, energy, mood, etc.)
2. Different calculation methods (sensors, time, distance)
3. Different behaviors (movement, effects, sounds)
4. Multiple thresholds (calm, worried, panic zones)
5. Character variants through inheritance

*/
