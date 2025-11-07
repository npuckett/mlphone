// ==============================================
// CHARACTER CONTROLLER TEMPLATE: STRESS PARAMETER
// ==============================================
// This example demonstrates how user INPUT can NEGATIVELY affect a parameter.
// 
// CONCEPT: "Stress" - A negative feedback system
// - Each click/tap INCREASES stress (harmful input)
// - Stress naturally decreases over time (recovery)
// - High stress causes visual distortion and movement jitter
// - Character cannot walk when overly stressed
//
// PATTERN: INPUT → PARAMETER → OUTPUT
// - INPUT: Mouse/touch clicks (harmful)
// - PARAMETER: stress (0-100)
// - OUTPUT: Color shift, position jitter, walk ability
//
// ==============================================

// ==============================================
// PARAMETER: Stress Level
// ==============================================
let stress = 0;  // Current stress level (0 = calm, 100 = maximum stress)

// Parameter configuration
const STRESS_INCREASE = 18;      // How much stress each click adds
const STRESS_RECOVERY = 0.12;    // How fast stress decreases naturally
const STRESS_PANIC_THRESHOLD = 70;  // When character cannot walk
const STRESS_WARNING_THRESHOLD = 40; // When visual effects start

// Smoothing for visual changes
let displayStress = 0;  // Smoothed version for visual feedback
const STRESS_VISUAL_INERTIA = 0.12;  // How smoothly visuals change (lower = smoother)

// ==============================================
// CHARACTER SYSTEM
// ==============================================
let character;
let idleAnimation;
let walkAnimation;

// Movement settings
const WALK_SPEED = 2.5;
let targetX = 0;
let targetY = 0;
let canWalk = true;

// Jitter effect for high stress
let jitterX = 0;
let jitterY = 0;

// ==============================================
// UI DISPLAY
// ==============================================
let showUI = true;

// ==============================================
// PRELOAD
// ==============================================
function preload() {
  // Load animations - specify first frame explicitly
  idleAnimation = loadAni('animations/idle/idleAnim_1.png', 9);
  walkAnimation = loadAni('animations/walk/walkAnim_1.png', 13);
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
  
  // Create character sprite
  character = new Sprite(width/2, height/2, 100, 100, 'none');
  character.scale = 0.2;  // Scale down sprite to fit canvas
  character.addAni('idle', idleAnimation);
  character.addAni('walk', walkAnimation);
  character.changeAni('idle');
  
  // Set initial target to character position
  targetX = character.x;
  targetY = character.y;
}

// ==============================================
// DRAW LOOP
// ==============================================
function draw() {
  background(20, 20, 30);
  
  // Update stress parameter (always decreasing, like natural recovery)
  updateStressParameter();
  
  // Update visual smoothing
  displayStress = lerp(displayStress, stress, STRESS_VISUAL_INERTIA);
  
  // Determine walk ability based on stress
  updateWalkAbility();
  
  // Update character visual feedback
  updateCharacterColor();
  updateStressJitter();
  
  // Move character toward target
  moveCharacterToTarget();
  
  // Visual elements
  drawTarget();
  drawStressBar();
  
  // UI overlay
  if (showUI) {
    drawUI();
  }
}

// ==============================================
// INPUT HANDLING
// ==============================================
function mousePressed() {
  // Set new target position
  targetX = mouseX;
  targetY = mouseY;
  
  // NEGATIVE INPUT: Each click INCREASES stress
  // This is the key difference - input harms the character
  stress += STRESS_INCREASE;
  stress = constrain(stress, 0, 100);
  
  return false;  // Prevent default
}

// Mobile touch support - mirrors mousePressed behavior
function touchStarted() {
  // Use same logic as mousePressed for touch input
  targetX = mouseX;
  targetY = mouseY;
  stress += STRESS_INCREASE;
  stress = constrain(stress, 0, 100);
  
  // Prevent default touch behavior
  return false;
}

// ==============================================
// PARAMETER UPDATE: Stress System
// ==============================================
function updateStressParameter() {
  // ENVIRONMENTAL FORCE: Natural stress recovery
  // Stress always decreases over time (like health always decreased)
  stress -= STRESS_RECOVERY;
  
  // Keep stress within valid range
  stress = constrain(stress, 0, 100);
}

// ==============================================
// OUTPUT FUNCTION: Walk Ability
// ==============================================
function updateWalkAbility() {
  // OUTPUT driven by PARAMETER
  // When stress is too high, character is too panicked to walk properly
  
  if (stress >= STRESS_PANIC_THRESHOLD) {
    canWalk = false;
    // Force to idle animation when too stressed
    if (character.ani.name !== 'idle') {
      character.changeAni('idle');
    }
  } else {
    canWalk = true;
  }
}

// ==============================================
// OUTPUT FUNCTION: Character Movement
// ==============================================
function moveCharacterToTarget() {
  // Calculate distance to target
  let distance = dist(character.x, character.y, targetX, targetY);
  
  // Only move if we can walk and we're not at the target
  if (canWalk && distance > 5) {
    // Use p5play's moveTo method for smooth movement
    character.moveTo(targetX, targetY, WALK_SPEED);
    
    // Apply stress jitter by offsetting position slightly
    if (jitterX !== 0 || jitterY !== 0) {
      character.x += jitterX;
      character.y += jitterY;
    }
    
    // Play walk animation
    if (character.ani.name !== 'walk') {
      character.changeAni('walk');
    }
  } else {
    // At target or can't walk - play idle animation
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
  // This is a visual OUTPUT driven by the stress PARAMETER
  
  if (stress >= STRESS_PANIC_THRESHOLD) {
    // Panic level: Intense red (danger)
    character.color = color(255, 80, 80);
  } else if (stress >= STRESS_WARNING_THRESHOLD) {
    // Warning level: Orange/red (stressed)
    character.color = color(255, 140, 100);
  } else if (stress >= 20) {
    // Mild stress: Slight yellow tint
    character.color = color(255, 240, 200);
  } else {
    // Calm: Normal colors
    character.color = 255;
  }
}

function updateStressJitter() {
  // HIGH STRESS = VISUAL JITTER
  // Character position shakes when stressed
  
  if (stress > STRESS_WARNING_THRESHOLD) {
    // Jitter intensity based on stress level
    let jitterAmount = map(stress, STRESS_WARNING_THRESHOLD, 100, 0, 3);
    jitterX = random(-jitterAmount, jitterAmount);
    jitterY = random(-jitterAmount, jitterAmount);
  } else {
    jitterX = 0;
    jitterY = 0;
  }
}

// Toggle UI display with keyboard
function keyPressed() {
  if (key === ' ') {
    showUI = !showUI;
  }
}

// ==============================================
// VISUAL ELEMENTS
// ==============================================

function drawTarget() {
  // Show where character is trying to move
  push();
  noFill();
  stroke(100, 200, 255, 100);
  strokeWeight(2);
  circle(targetX, targetY, 30);
  
  // Crosshair
  line(targetX - 15, targetY, targetX + 15, targetY);
  line(targetX, targetY - 15, targetX, targetY + 15);
  pop();
}

function drawStressBar() {
  // Visual representation of stress parameter
  let barWidth = width - 40;
  let barHeight = 30;
  let barX = 20;
  let barY = 20;
  
  push();
  
  // Background
  fill(40, 40, 50);
  noStroke();
  rect(barX, barY, barWidth, barHeight, 5);
  
  // Stress fill (red when high, yellow when medium)
  let fillColor;
  if (displayStress >= STRESS_PANIC_THRESHOLD) {
    fillColor = color(255, 80, 80);
  } else if (displayStress >= STRESS_WARNING_THRESHOLD) {
    fillColor = color(255, 180, 100);
  } else {
    fillColor = color(150, 200, 255);
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

function drawUI() {
  // Information overlay
  push();
  
  // Semi-transparent background
  fill(0, 0, 0, 180);
  noStroke();
  rect(10, 70, width - 20, 280, 10);
  
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
  text('⚠️ STRESS PARAMETER', x, y);
  y += lineHeight * 1.8;
  
  // Parameter info
  textSize(11);
  fill(255, 255, 200);
  text('PARAMETER:', x, y);
  y += lineHeight;
  
  fill(200, 200, 220);
  text(`  stress = ${Math.round(stress)}`, x, y);
  y += lineHeight * 1.5;
  
  // Input info (NEGATIVE)
  fill(255, 200, 200);
  text('INPUT (HARMFUL):', x, y);
  y += lineHeight;
  
  fill(200, 200, 220);
  text(`  Click/Tap: +${STRESS_INCREASE} stress`, x, y);
  y += lineHeight;
  text(`  Time: -${STRESS_RECOVERY.toFixed(2)}/frame`, x, y);
  y += lineHeight * 1.5;
  
  // Thresholds
  fill(255, 180, 180);
  text('THRESHOLDS:', x, y);
  y += lineHeight;
  
  fill(200, 200, 220);
  text(`  Panic: ${STRESS_PANIC_THRESHOLD}+ (can't walk)`, x, y);
  y += lineHeight;
  text(`  Warning: ${STRESS_WARNING_THRESHOLD}+ (jitter starts)`, x, y);
  y += lineHeight * 1.5;
  
  // Current state
  fill(150, 255, 150);
  text('CURRENT STATE:', x, y);
  y += lineHeight;
  
  fill(200, 200, 220);
  text(`  Can Walk: ${canWalk ? 'YES ✓' : 'NO ✗'}`, x, y);
  y += lineHeight;
  text(`  Animation: ${character.ani.name}`, x, y);
  y += lineHeight;
  
  // Jitter info
  if (stress > STRESS_WARNING_THRESHOLD) {
    fill(255, 180, 100);
    text(`  Jitter: ACTIVE`, x, y);
  }
  
  // Instructions
  y = height - 45;
  fill(150, 200, 255);
  textAlign(CENTER);
  text('Click to add stress (harmful!)', width/2, y);
  y += lineHeight;
  text('Press SPACE to toggle UI', width/2, y);
  
  pop();
}
