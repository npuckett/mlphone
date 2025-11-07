// ==============================================
// CHARACTER CONTROLLER: STRESS COLLISION
// ==============================================
// This example demonstrates stress that only accumulates when
// the user touches/clicks ON the character (collision detection).
// 
// CONCEPT: "Stress from Direct Contact"
// - Character wanders around autonomously
// - Touching the character INCREASES stress (harmful contact)
// - Touching empty space does NOT increase stress
// - Stress naturally decreases over time (recovery)
// - High stress causes visual effects and behavior changes
// - Uses all 3 animations: idle, walk, walkBack
//
// PATTERN: COLLISION INPUT → PARAMETER → OUTPUT
// - INPUT: Touch collision with character (harmful)
// - PARAMETER: stress (0-100)
// - OUTPUT: Color, jitter, walk speed, animation
//
// ==============================================

// ==============================================
// PARAMETER: Stress Level
// ==============================================
let stress = 0;  // Current stress level (0 = calm, 100 = maximum stress)

// Parameter configuration
const STRESS_TOUCH_INCREASE = 0.8;  // Stress per frame when touched
const STRESS_RECOVERY = 0.15;       // How fast stress decreases naturally
const STRESS_PANIC_THRESHOLD = 70;  // When character behavior becomes erratic
const STRESS_WARNING_THRESHOLD = 40; // When visual effects start

// Smoothing for visual changes
let displayStress = 0;  // Smoothed version for visual feedback
const STRESS_VISUAL_INERTIA = 0.12;

// ==============================================
// CHARACTER SYSTEM
// ==============================================
let character;
let idleAnimation;
let walkAnimation;
let walkBackAnimation;

// Character AI - Autonomous wandering
let targetX = 0;
let targetY = 0;
let wanderTimer = 0;
const WANDER_INTERVAL = 120;  // Frames between choosing new destinations

// Movement settings
let baseSpeed = 1.5;
let currentSpeed = 1.5;

// Jitter effect for high stress
let jitterX = 0;
let jitterY = 0;

// Direction tracking
let movingBackward = false;

// ==============================================
// UI DISPLAY
// ==============================================
let showUI = true;
let touchIndicator = false;
let touchIndicatorTimer = 0;

// ==============================================
// PRELOAD
// ==============================================
function preload() {
  // Load all 3 animations
  idleAnimation = loadAni('animations/idle/idleAnim_1.png', 9);
  walkAnimation = loadAni('animations/walk/walkAnim_1.png', 13);
  walkBackAnimation = loadAni('animations/walkBack/walkAnimBack_1.png', 13);
}

// ==============================================
// SETUP
// ==============================================
function setup() {
  new Canvas(405, 720);  // 9:16 mobile aspect ratio
  
  // Lock mobile gestures (prevents zoom/scroll)
  try {
    if (typeof lockGestures !== 'undefined') {
      lockGestures();
      console.log('✅ Mobile gestures locked');
    }
  } catch(e) {
    console.log('⚠️ Could not lock gestures:', e);
  }
  
    // Create character sprite with collider
  // Increased to 200x200 for easier touch detection (40px after 0.2 scale)
  character = new Sprite(width/2, height/2, 200, 200, 'kinematic');
  character.scale = 0.2;
  character.rotationLock = true;
  character.addAni('idle', idleAnimation);
  character.addAni('walk', walkAnimation);
  character.addAni('walkBack', walkBackAnimation);
  character.changeAni('idle');
  
  console.log('Character width:', character.width, 'scale:', character.scale, 'collider diameter:', character.diameter);
  
  // Set initial wander target
  chooseNewWanderTarget();
}

// ==============================================
// DRAW LOOP
// ==============================================
function draw() {
  background(20, 20, 30);
  
  // Update stress parameter
  updateStressParameter();
  
  // Update visual smoothing
  displayStress = lerp(displayStress, stress, STRESS_VISUAL_INERTIA);
  
  // Update character behavior
  updateCharacterWandering();
  updateCharacterColor();
  updateStressJitter();
  
  // Move character
  moveCharacter();
  
  // Visual elements
  drawWanderTarget();
  drawStressBar();
  
  // UI overlay
  if (showUI) {
    drawUI();
  }
  
  // Touch indicator
  if (touchIndicator) {
    drawTouchIndicator();
    touchIndicatorTimer--;
    if (touchIndicatorTimer <= 0) {
      touchIndicator = false;
    }
  }
}

// ==============================================
// INPUT HANDLING - Collision Detection
// ==============================================
function mousePressed() {
  // Use p5play's built-in mouse collision detection
  if (character.mouse.pressing()) {
    // COLLISION! Touching the character increases stress
    stress += STRESS_TOUCH_INCREASE * 20;  // Big instant boost
    stress = constrain(stress, 0, 100);
    
    console.log('✅ HIT! Stress increased to:', stress);
    
    // Visual feedback for successful touch
    touchIndicator = true;
    touchIndicatorTimer = 30;
  } else {
    console.log('❌ Miss - clicked empty space');
  }
  
  return false;  // Prevent default
}

// Continuous touch detection
function mouseDragged() {
  // Check if currently hovering over character
  if (character.mouse.hovering()) {
    // Continuous stress while touching
    stress += STRESS_TOUCH_INCREASE;
    stress = constrain(stress, 0, 100);
    
    touchIndicator = true;
    touchIndicatorTimer = 5;
  }
  
  return false;
}

// Mobile touch support - mirrors mouse behavior
function touchStarted() {
  // Use p5play's built-in touch collision detection
  if (character.mouse.pressing()) {
    stress += STRESS_TOUCH_INCREASE * 20;
    stress = constrain(stress, 0, 100);
    console.log('✅ TOUCH HIT! Stress increased to:', stress);
    touchIndicator = true;
    touchIndicatorTimer = 30;
  } else {
    console.log('❌ Miss - touched empty space');
  }
  
  // Prevent default touch behavior
  return false;
}

// Continuous touch detection for mobile
function touchMoved() {
  // Check if currently touching character
  if (character.mouse.hovering()) {
    stress += STRESS_TOUCH_INCREASE;
    stress = constrain(stress, 0, 100);
    touchIndicator = true;
    touchIndicatorTimer = 5;
  }
  
  // Prevent default touch behavior
  return false;
}

// ==============================================
// PARAMETER UPDATE: Stress System
// ==============================================
function updateStressParameter() {
  // Natural stress recovery (always happening)
  stress -= STRESS_RECOVERY;
  stress = constrain(stress, 0, 100);
}

// ==============================================
// CHARACTER AI: Autonomous Wandering
// ==============================================
function updateCharacterWandering() {
  // Timer to choose new destinations
  wanderTimer++;
  
  if (wanderTimer >= WANDER_INTERVAL) {
    chooseNewWanderTarget();
    wanderTimer = 0;
  }
  
  // Stress affects movement speed
  if (stress >= STRESS_PANIC_THRESHOLD) {
    // Panicked - erratic fast movement
    currentSpeed = baseSpeed * 2.5;
  } else if (stress >= STRESS_WARNING_THRESHOLD) {
    // Stressed - faster movement (trying to escape)
    currentSpeed = baseSpeed * 1.8;
  } else {
    // Calm - normal speed
    currentSpeed = baseSpeed;
  }
}

function chooseNewWanderTarget() {
  // Pick random point on screen
  targetX = random(80, width - 80);
  targetY = random(100, height - 100);
  
  // Determine if moving backward (up screen) or forward (down screen)
  movingBackward = targetY < character.y;
}

// ==============================================
// OUTPUT FUNCTION: Character Movement
// ==============================================
function moveCharacter() {
  // Calculate distance and direction to target
  let dx = targetX - character.x;
  let dy = targetY - character.y;
  let distance = dist(character.x, character.y, targetX, targetY);
  
  if (distance > 10) {
    // Use p5play's moveTo method for smooth movement
    character.moveTo(targetX, targetY, currentSpeed);
    
    // Apply stress jitter by offsetting position slightly
    if (jitterX !== 0 || jitterY !== 0) {
      character.x += jitterX;
      character.y += jitterY;
    }
    
    // Choose animation based on direction
    if (movingBackward) {
      if (character.ani.name !== 'walkBack') {
        character.changeAni('walkBack');
      }
    } else {
      if (character.ani.name !== 'walk') {
        character.changeAni('walk');
      }
    }
    
    // Mirror sprite based on horizontal direction
    character.mirror.x = dx < 0;
    
  } else {
    // Arrived at target - idle
    if (character.ani.name !== 'idle') {
      character.changeAni('idle');
    }
  }
}

// ==============================================
// OUTPUT FUNCTION: Visual Feedback
// ==============================================
function updateCharacterColor() {
  // Change character color based on stress level
  if (stress >= STRESS_PANIC_THRESHOLD) {
    // Panic level: Intense red
    character.color = color(255, 80, 80);
  } else if (stress >= STRESS_WARNING_THRESHOLD) {
    // Warning level: Orange
    character.color = color(255, 140, 100);
  } else if (stress >= 20) {
    // Mild stress: Yellow tint
    character.color = color(255, 240, 200);
  } else {
    // Calm: Normal colors
    character.color = 255;
  }
}

function updateStressJitter() {
  // Position jitter when stressed
  if (stress > STRESS_WARNING_THRESHOLD) {
    let jitterAmount = map(stress, STRESS_WARNING_THRESHOLD, 100, 0, 4);
    jitterX = random(-jitterAmount, jitterAmount);
    jitterY = random(-jitterAmount, jitterAmount);
  } else {
    jitterX = 0;
    jitterY = 0;
  }
}

// Toggle UI display
function keyPressed() {
  if (key === ' ') {
    showUI = !showUI;
  }
}

// ==============================================
// VISUAL ELEMENTS
// ==============================================

function drawWanderTarget() {
  // Show where character is heading
  push();
  noFill();
  stroke(100, 150, 255, 100);
  strokeWeight(2);
  circle(targetX, targetY, 30);
  
  // Crosshair
  line(targetX - 15, targetY, targetX + 15, targetY);
  line(targetX, targetY - 15, targetX, targetY + 15);
  pop();
}

function drawStressBar() {
  let barWidth = width - 40;
  let barHeight = 30;
  let barX = 20;
  let barY = 20;
  
  push();
  
  // Background
  fill(40, 40, 50);
  noStroke();
  rect(barX, barY, barWidth, barHeight, 5);
  
  // Stress fill
  let fillColor;
  if (displayStress >= STRESS_PANIC_THRESHOLD) {
    fillColor = color(255, 80, 80);
  } else if (displayStress >= STRESS_WARNING_THRESHOLD) {
    fillColor = color(255, 180, 100);
  } else {
    fillColor = color(100, 200, 255);
  }
  
  fill(fillColor);
  let fillWidth = map(displayStress, 0, 100, 0, barWidth);
  rect(barX, barY, fillWidth, barHeight, 5);
  
  // Border
  noFill();
  stroke(200, 200, 220);
  strokeWeight(2);
  rect(barX, barY, barWidth, barHeight, 5);
  
  // Label
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text(`STRESS: ${Math.round(displayStress)}`, width/2, barY + barHeight/2);
  
  pop();
}

function drawTouchIndicator() {
  // Visual feedback when touching character
  push();
  noFill();
  stroke(255, 100, 100, 200);
  strokeWeight(3);
  let size = map(touchIndicatorTimer, 0, 30, 80, 40);
  circle(character.x, character.y, size);
  pop();
}

function drawUI() {
  // Information overlay
  push();
  
  // Semi-transparent background
  fill(0, 0, 0, 180);
  noStroke();
  rect(10, 70, width - 20, 300, 10);
  
  fill(255);
  textAlign(LEFT, TOP);
  textSize(12);
  textFont('Courier New');
  
  let x = 25;
  let y = 85;
  let lineHeight = 18;
  
  // Title
  textSize(14);
  fill(255, 100, 100);
  text('⚠️ STRESS COLLISION', x, y);
  y += lineHeight * 1.8;
  
  // Parameter info
  textSize(11);
  fill(255, 255, 200);
  text('PARAMETER:', x, y);
  y += lineHeight;
  
  fill(200, 200, 220);
  text(`  stress = ${Math.round(stress)}`, x, y);
  y += lineHeight * 1.5;
  
  // Input info
  fill(255, 200, 200);
  text('INPUT (COLLISION):', x, y);
  y += lineHeight;
  
  fill(200, 200, 220);
  text(`  Touch Character: +stress`, x, y);
  y += lineHeight;
  text(`  Touch Empty: No effect`, x, y);
  y += lineHeight;
  text(`  Recovery: -${STRESS_RECOVERY.toFixed(2)}/frame`, x, y);
  y += lineHeight * 1.5;
  
  // Behavior
  fill(150, 255, 150);
  text('BEHAVIOR:', x, y);
  y += lineHeight;
  
  fill(200, 200, 220);
  text(`  Autonomous wandering`, x, y);
  y += lineHeight;
  text(`  Uses 3 animations:`, x, y);
  y += lineHeight;
  text(`    - idle (at destination)`, x, y);
  y += lineHeight;
  text(`    - walk (moving forward)`, x, y);
  y += lineHeight;
  text(`    - walkBack (moving back)`, x, y);
  y += lineHeight * 1.5;
  
  // Current state
  fill(150, 200, 255);
  text('CURRENT STATE:', x, y);
  y += lineHeight;
  
  fill(200, 200, 220);
  text(`  Animation: ${character.ani.name}`, x, y);
  y += lineHeight;
  text(`  Speed: ${currentSpeed.toFixed(1)}x`, x, y);
  y += lineHeight;
  
  // Stress effects
  if (stress > STRESS_PANIC_THRESHOLD) {
    fill(255, 180, 100);
    text(`  STATE: PANIC!`, x, y);
  } else if (stress > STRESS_WARNING_THRESHOLD) {
    fill(255, 180, 100);
    text(`  STATE: Stressed`, x, y);
  }
  
  // Instructions
  y = height - 45;
  fill(150, 200, 255);
  textAlign(CENTER);
  text('Touch the character to stress it!', width/2, y);
  y += lineHeight;
  text('Press SPACE to toggle UI', width/2, y);
  
  pop();
}
