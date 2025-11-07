// ==============================================
// CHARACTER CONTROLLER: MULTI CHARACTER CLASS SYSTEM
// ==============================================
// This example demonstrates a custom character class with:
// - 10 autonomous characters with unique personalities
// - Randomized response characteristics (stress sensitivity, recovery rate, speed)
// - Individual stress parameters affected by device shake
// - Character class encapsulating all behavior and state
//
// CONCEPT: Object-Oriented Character System
// - Each character has unique response to shake input
// - Stress affects movement, color, and jitter differently per character
// - Characters wander autonomously with varied behaviors
//
// PATTERN: INPUT → PARAMETER → OUTPUT (per character instance)
// - INPUT: deviceShaken() affects all characters
// - PARAMETER: Each character's stress level (0-100)
// - OUTPUT: Individual visual and movement responses
//
// ==============================================

// ==============================================
// GLOBAL VARIABLE: Shake Intensity
// ==============================================
let shakeIntensity = 0;  // Global shake detection: 0 (calm) to 10+ (shaking)
const SHAKE_DECAY = 0.92;  // How quickly shake intensity fades

// ==============================================
// CHARACTER SYSTEM
// ==============================================
let characters = [];  // Array to hold all character instances
const NUM_CHARACTERS = 10;  // Number of characters to create

let idleAnimation;
let walkAnimation;

// UI Display
let showUI = true;
let sensorsActive = false;
let selectedCharacter = null;  // For displaying detailed info

// ==============================================
// CHARACTER CLASS DEFINITION
// ==============================================
class StressCharacter {
  constructor(x, y, index) {
    // Sprite reference
    this.sprite = new Sprite(x, y);
    this.baseScale = random(0.1, 0.2);  // Vary character sizes
    this.sprite.scale = this.baseScale;
    this.sprite.physics = 'kinematic';
    this.sprite.collider = 'none';
    
    // Add animations
    this.sprite.addAni('idle', idleAnimation);
    this.sprite.addAni('walk', walkAnimation);
    this.sprite.changeAni('walk');
    
    // Character identity
    this.index = index;
    this.name = `Char ${index + 1}`;
    
    // PERSONALITY ARCHETYPE SYSTEM
    // Randomly assign one of several archetypes for more distinct behavior
    const archetypes = [
      { name: 'Calm', stressMod: 0.3, recoveryMod: 2.5, speedMod: 0.7, jitterMod: 0.3 },
      { name: 'Anxious', stressMod: 2.5, recoveryMod: 0.4, speedMod: 1.5, jitterMod: 2.5 },
      { name: 'Hyper', stressMod: 1.0, recoveryMod: 1.5, speedMod: 3.0, jitterMod: 1.5 },
      { name: 'Sluggish', stressMod: 0.5, recoveryMod: 0.8, speedMod: 0.4, jitterMod: 0.5 },
      { name: 'Volatile', stressMod: 1.8, recoveryMod: 0.3, speedMod: 1.2, jitterMod: 3.5 },
      { name: 'Stoic', stressMod: 0.4, recoveryMod: 1.8, speedMod: 0.9, jitterMod: 0.2 },
      { name: 'Erratic', stressMod: 1.5, recoveryMod: 1.0, speedMod: 2.0, jitterMod: 2.0 },
      { name: 'Balanced', stressMod: 1.0, recoveryMod: 1.0, speedMod: 1.0, jitterMod: 1.0 }
    ];
    this.archetype = random(archetypes);
    
    // RANDOMIZED PERSONALITY TRAITS (influenced by archetype)
    // These define how each character responds to stress
    this.stressSensitivity = random(2, 20) * this.archetype.stressMod;      // How much stress per shake
    this.stressRecovery = random(0.05, 0.5) * this.archetype.recoveryMod;   // Recovery rate
    this.baseSpeed = random(0.8, 5.0) * this.archetype.speedMod;            // Movement speed
    this.warningThreshold = random(15, 60);      // When jitter starts (15-60) - Some are very sensitive
    this.panicThreshold = random(50, 90);        // When extreme jitter starts (50-90)
    this.jitterMultiplier = random(0.2, 3.0) * this.archetype.jitterMod;    // How much they jitter
    this.speedStressMultiplier = random(1.0, 3.5); // Speed increase when stressed (1.0-3.5x) - Some don't speed up, others go crazy
    this.colorShift = random(0.5, 1.5);          // Color intensity variation
    
    // STRESS PARAMETER (individual to each character)
    this.stress = 0;  // Current stress level (0-100)
    this.displayStress = 0;  // Smoothed for visuals
    this.visualInertia = random(0.08, 0.15);  // How smoothly visuals change
    
    // Movement state
    this.currentSpeed = this.baseSpeed;
    this.targetX = random(60, width - 60);
    this.targetY = random(80, height - 80);
    this.wanderTimer = random(0, 120);  // Stagger wander timing
    this.wanderInterval = random(60, 300);  // Much more varied wander frequency (1-5 seconds)
    this.wanderRange = random(50, 200);     // How far they wander from current position
    
    // Visual effects
    this.jitterX = 0;
    this.jitterY = 0;
  }
  
  // ==============================================
  // UPDATE METHOD - Called every frame
  // ==============================================
  update() {
    this.updateStress();
    this.updateWandering();
    this.updateColor();
    this.updateJitter();
    this.updateSpeed();
    this.updateScale();  // Add scale variation based on stress
    this.move();
  }
  
  // ==============================================
  // STRESS SYSTEM
  // ==============================================
  addStressFromShake() {
    // Each character responds differently to shake
    this.stress += this.stressSensitivity;
    this.stress = constrain(this.stress, 0, 100);
  }
  
  updateStress() {
    // Natural stress recovery (individual rate)
    this.stress -= this.stressRecovery;
    this.stress = constrain(this.stress, 0, 100);
    
    // Smooth display value
    this.displayStress = lerp(this.displayStress, this.stress, this.visualInertia);
  }
  
  // ==============================================
  // WANDERING AI
  // ==============================================
  updateWandering() {
    this.wanderTimer++;
    
    if (this.wanderTimer >= this.wanderInterval) {
      this.chooseNewTarget();
      this.wanderTimer = 0;
    }
  }
  
  chooseNewTarget() {
    // Pick random point based on wander range (some explore more, some stay local)
    let angle = random(TWO_PI);
    let distance = random(this.wanderRange * 0.5, this.wanderRange);
    
    this.targetX = this.sprite.x + cos(angle) * distance;
    this.targetY = this.sprite.y + sin(angle) * distance;
    
    // Keep within bounds with margin
    this.targetX = constrain(this.targetX, 60, width - 60);
    this.targetY = constrain(this.targetY, 80, height - 80);
  }
  
  // ==============================================
  // VISUAL OUTPUT: Color
  // ==============================================
  updateColor() {
    // Map stress to color with individual variation
    let r = map(this.displayStress, 0, 100, 100, 255) * this.colorShift;
    let g = map(this.displayStress, 0, 100, 255, 50) * this.colorShift;
    let b = 100;
    
    this.sprite.color = color(r, g, b);
  }
  
  // ==============================================
  // VISUAL OUTPUT: Jitter
  // ==============================================
  updateJitter() {
    let jitterAmount = 0;
    
    if (this.stress >= this.panicThreshold) {
      // Panic level - extreme jitter
      jitterAmount = map(this.stress, this.panicThreshold, 100, 3, 8);
      jitterAmount += shakeIntensity * 0.5;
      jitterAmount *= this.jitterMultiplier;
    } else if (this.stress >= this.warningThreshold) {
      // Warning level - mild jitter
      jitterAmount = map(this.stress, this.warningThreshold, this.panicThreshold, 0, 3);
      jitterAmount += shakeIntensity * 0.3;
      jitterAmount *= this.jitterMultiplier;
    }
    
    this.jitterX = random(-jitterAmount, jitterAmount);
    this.jitterY = random(-jitterAmount, jitterAmount);
  }
  
  // ==============================================
  // MOVEMENT OUTPUT: Speed
  // ==============================================
  updateSpeed() {
    if (this.stress >= this.panicThreshold) {
      // Panicked - fast movement
      this.currentSpeed = this.baseSpeed * this.speedStressMultiplier;
    } else if (this.stress >= this.warningThreshold) {
      // Anxious - slightly faster
      this.currentSpeed = this.baseSpeed * 1.2;
    } else {
      // Calm - normal speed
      this.currentSpeed = this.baseSpeed;
    }
  }
  
  // ==============================================
  // VISUAL OUTPUT: Scale (stressed characters change size)
  // ==============================================
  updateScale() {
    // Some characters grow when stressed, others shrink
    let scaleChange = map(this.displayStress, 0, 100, 0, 0.05);
    
    // Archetype determines if they grow or shrink under stress
    if (this.archetype.name === 'Volatile' || this.archetype.name === 'Anxious') {
      // These characters shrink when stressed
      this.sprite.scale = this.baseScale * (1 - scaleChange);
    } else if (this.archetype.name === 'Hyper' || this.archetype.name === 'Erratic') {
      // These characters grow when stressed
      this.sprite.scale = this.baseScale * (1 + scaleChange);
    } else {
      // Others stay the same size
      this.sprite.scale = this.baseScale;
    }
  }
  
  // ==============================================
  // MOVEMENT
  // ==============================================
  move() {
    let distance = dist(this.sprite.x, this.sprite.y, this.targetX, this.targetY);
    
    if (distance > 10) {
      // Move toward target
      this.sprite.moveTo(this.targetX, this.targetY, this.currentSpeed);
      
      // Apply jitter
      if (this.jitterX !== 0 || this.jitterY !== 0) {
        this.sprite.x += this.jitterX;
        this.sprite.y += this.jitterY;
      }
      
      // Use walk animation
      if (this.sprite.ani.name !== 'walk') {
        this.sprite.changeAni('walk');
      }
    } else {
      // Reached target - pick new one
      this.chooseNewTarget();
    }
  }
  
  // ==============================================
  // VISUAL: Draw stress indicator above character
  // ==============================================
  drawStressIndicator() {
    push();
    
    // Position above character
    let barX = this.sprite.x - 20;
    let barY = this.sprite.y - 60;
    let barWidth = 40;
    let barHeight = 4;
    
    // Background
    fill(40, 40, 50);
    noStroke();
    rect(barX, barY, barWidth, barHeight, 2);
    
    // Stress level
    let stressWidth = map(this.displayStress, 0, 100, 0, barWidth);
    let r = map(this.displayStress, 0, 100, 100, 255);
    let g = map(this.displayStress, 0, 100, 255, 50);
    fill(r, g, 100);
    rect(barX, barY, stressWidth, barHeight, 2);
    
    // Character number
    fill(255, 200);
    textAlign(CENTER, CENTER);
    textSize(10);
    text(this.index + 1, this.sprite.x, barY - 8);
    
    pop();
  }
}

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
  
  // Create 10 characters with randomized positions
  createCharacters();
  
  // Select first character for detailed view
  selectedCharacter = characters[0];
}

// ==============================================
// CREATE CHARACTERS
// ==============================================
function createCharacters() {
  // Create grid layout for initial positions
  let cols = 5;
  let rows = 2;
  let spacingX = width / (cols + 1);
  let spacingY = (height * 0.6) / (rows + 1);
  let startY = 150;
  
  for (let i = 0; i < NUM_CHARACTERS; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    
    let x = spacingX * (col + 1) + random(-20, 20);
    let y = startY + spacingY * (row + 1) + random(-20, 20);
    
    let char = new StressCharacter(x, y, i);
    characters.push(char);
  }
}

// ==============================================
// DRAW - Main game loop
// ==============================================
function draw() {
  background(30, 30, 40);
  
  // Check if sensors are enabled
  sensorsActive = window.sensorsEnabled || false;
  
  // Update global shake intensity
  updateShakeIntensity();
  
  // Update all characters
  for (let char of characters) {
    char.update();
    char.drawStressIndicator();
  }
  
  // Draw UI
  drawGlobalShakeIndicator();
  
  if (showUI) {
    drawUI();
  }
}

// ==============================================
// INPUT DETECTION: Device Shake Event
// ==============================================
function deviceShaken() {
  if (window.sensorsEnabled) {
    // Increase global shake intensity
    shakeIntensity += 1.0;
    shakeIntensity = constrain(shakeIntensity, 0, 10);
    
    // Apply stress to ALL characters (each responds differently)
    for (let char of characters) {
      char.addStressFromShake();
    }
    
    console.log('🔔 SHAKE! Intensity:', shakeIntensity.toFixed(2));
  }
}

// ==============================================
// UPDATE: Shake Intensity
// ==============================================
function updateShakeIntensity() {
  shakeIntensity *= SHAKE_DECAY;
  if (shakeIntensity < 0.01) {
    shakeIntensity = 0;
  }
}

// ==============================================
// INPUT HANDLING: Touch/Click to select character
// ==============================================
function mousePressed() {
  // Check if clicked on any character
  for (let char of characters) {
    let d = dist(mouseX, mouseY, char.sprite.x, char.sprite.y);
    if (d < 40) {
      selectedCharacter = char;
      console.log('Selected:', char.name);
      break;
    }
  }
  return false;
}

function touchStarted() {
  mousePressed();
  return false;
}

// Toggle UI with keyboard
function keyPressed() {
  if (key === ' ') {
    showUI = !showUI;
  } else if (key >= '1' && key <= '9') {
    // Select character by number
    let index = parseInt(key) - 1;
    if (index < characters.length) {
      selectedCharacter = characters[index];
    }
  } else if (key === '0') {
    if (characters.length >= 10) {
      selectedCharacter = characters[9];
    }
  }
}

// ==============================================
// VISUAL FEEDBACK: Global Shake Indicator
// ==============================================
function drawGlobalShakeIndicator() {
  push();
  
  let meterX = 20;
  let meterY = 20;
  let meterWidth = width - 40;
  let meterHeight = 25;
  
  // Background
  noStroke();
  fill(40, 40, 50);
  rect(meterX, meterY, meterWidth, meterHeight, 5);
  
  // Shake intensity level
  let intensityWidth = map(shakeIntensity, 0, 10, 0, meterWidth);
  fill(255, 150, 0);
  rect(meterX, meterY, intensityWidth, meterHeight, 5);
  
  // Label
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(`SHAKE: ${shakeIntensity.toFixed(2)}`, width / 2, meterY + meterHeight / 2);
  
  pop();
}

// ==============================================
// UI: Character Information & System Info
// ==============================================
function drawUI() {
  if (!selectedCharacter) return;
  
  push();
  
  let x = 20;
  let y = 60;
  let lineHeight = 16;
  
  // Semi-transparent background
  fill(0, 0, 0, 200);
  noStroke();
  rect(x - 10, y - 5, 385, 320, 5);
  
  // Title
  fill(255, 200, 0);
  textAlign(LEFT, TOP);
  textSize(16);
  text(`⚡ ${selectedCharacter.name.toUpperCase()} - ${selectedCharacter.archetype.name.toUpperCase()}`, x, y);
  y += lineHeight * 1.5;
  
  // Personality Traits
  fill(100, 255, 100);
  textSize(14);
  text('PERSONALITY TRAITS:', x, y);
  y += lineHeight;
  
  fill(255);
  textSize(11);
  text(`  Stress Sensitivity: ${selectedCharacter.stressSensitivity.toFixed(1)} per shake`, x, y);
  y += lineHeight;
  text(`  Recovery Rate: ${selectedCharacter.stressRecovery.toFixed(3)}/frame`, x, y);
  y += lineHeight;
  text(`  Base Speed: ${selectedCharacter.baseSpeed.toFixed(2)}`, x, y);
  y += lineHeight;
  text(`  Warning Threshold: ${selectedCharacter.warningThreshold.toFixed(0)}`, x, y);
  y += lineHeight;
  text(`  Panic Threshold: ${selectedCharacter.panicThreshold.toFixed(0)}`, x, y);
  y += lineHeight;
  text(`  Jitter Multiplier: ${selectedCharacter.jitterMultiplier.toFixed(2)}x`, x, y);
  y += lineHeight;
  text(`  Speed Multiplier: ${selectedCharacter.speedStressMultiplier.toFixed(2)}x`, x, y);
  y += lineHeight * 1.3;
  
  // Current State
  fill(255, 200, 100);
  textSize(14);
  text('CURRENT STATE:', x, y);
  y += lineHeight;
  
  fill(255);
  textSize(11);
  text(`  Stress: ${selectedCharacter.stress.toFixed(1)} / 100`, x, y);
  y += lineHeight;
  text(`  Current Speed: ${selectedCharacter.currentSpeed.toFixed(2)}`, x, y);
  y += lineHeight;
  text(`  Jitter: ${(abs(selectedCharacter.jitterX) + abs(selectedCharacter.jitterY)).toFixed(2)}`, x, y);
  y += lineHeight;
  text(`  Animation: ${selectedCharacter.sprite.ani.name}`, x, y);
  y += lineHeight * 1.3;
  
  // Global Info
  fill(100, 200, 255);
  textSize(14);
  text('SYSTEM INFO:', x, y);
  y += lineHeight;
  
  fill(255);
  textSize(11);
  text(`  Total Characters: ${characters.length}`, x, y);
  y += lineHeight;
  text(`  Sensors: ${sensorsActive ? 'ENABLED ✓' : 'DISABLED ✗'}`, x, y);
  y += lineHeight;
  text(`  Global Shake: ${shakeIntensity.toFixed(2)}`, x, y);
  y += lineHeight * 1.3;
  
  // Average stress across all characters
  let avgStress = characters.reduce((sum, char) => sum + char.stress, 0) / characters.length;
  fill(255, 150, 150);
  textSize(14);
  text('POPULATION STATS:', x, y);
  y += lineHeight;
  
  fill(255);
  textSize(11);
  text(`  Average Stress: ${avgStress.toFixed(1)}`, x, y);
  y += lineHeight;
  
  // Count stressed characters
  let stressedCount = characters.filter(char => char.stress > 50).length;
  text(`  Stressed (>50): ${stressedCount}/${characters.length}`, x, y);
  y += lineHeight * 1.3;
  
  // Instructions
  fill(200);
  textSize(10);
  if (!sensorsActive) {
    text('Tap screen to enable motion sensors', x, y);
    y += lineHeight;
  }
  text('Shake device to stress all characters!', x, y);
  y += lineHeight;
  text('Tap character to select | 1-9,0: Select by number', x, y);
  y += lineHeight;
  text('Space: Toggle UI', x, y);
  
  pop();
}
