/*
==============================================
CHARACTER CONTROLLER 02 - MOMENTUM PARAMETER
==============================================

CONCEPT: RAW INPUTS → PARAMETERS → OUTPUTS

This example demonstrates a different parameter with unique characteristics:
1. RAW INPUT: Click/touch provides directional impulses
2. PARAMETER: "Momentum" builds up and decays differently than health
3. OUTPUT: Momentum drives movement, animation, and visual effects

KEY DIFFERENCES FROM EXAMPLE 01:
- Momentum builds gradually with repeated inputs (accumulation)
- Momentum has directional properties (vector-based)
- Momentum decays faster than health (different physics)
- High momentum enables different behaviors (speed boost mode)

MOMENTUM SYSTEM:
- Range: 0 (stationary) to 100 (maximum momentum)
- Increases when clicking in direction of movement (aligned input)
- Decreases when clicking against movement direction (friction)
- Decays naturally due to friction (environmental resistance)
- Has strong inertia - smooth acceleration/deceleration

MOMENTUM AFFECTS MULTIPLE OUTPUTS:
1. Movement Speed: Higher momentum = faster movement
2. Animation Speed: Momentum affects walk cycle speed
3. Special State: Very high momentum triggers "sprint" animation
4. Visual Feedback: Trail effects and color shift at high momentum

ENVIRONMENTAL FORCES:
- FRICTION: Momentum decreases over time (air resistance)
- DIRECTIONAL DECAY: Turning reduces momentum more than straight movement
- ACCELERATION: Multiple clicks in same direction build momentum faster
- DRAG: Movement itself reduces momentum (simulates effort)

CONTROLS:
- Click/Touch anywhere: Add momentum toward that direction
- Repeated clicks in same direction: Build up speed
- Click opposite direction: Brake/reverse direction
- Character responds with acceleration/deceleration

ANIMATION NAMING (p5play):
- sprite.addAni('idle', animation) - Stationary animation
- sprite.addAni('walk', animation) - Normal walking
- sprite.changeAni('walk') - Switch to named animation
- sprite.ani.frameDelay - Speed of animation playback

LIBRARIES REQUIRED:
- p5.js v1.11.4
- p5play v3
- p5-phone v1.6.1
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================

// Sprite and Animations
let character;          // The animated sprite
let idleAni;            // Idle animation
let walkAni;            // Walk animation

// PARAMETER: Momentum (The central state variable)
let momentum = 0;                   // Current momentum level (0-100)
let targetMomentum = 0;             // Target momentum (for inertia)
const MOMENTUM_MIN = 0;             // Minimum momentum
const MOMENTUM_MAX = 100;           // Maximum momentum

// MOMENTUM FORCES
const MOMENTUM_FRICTION = 0.3;      // Natural decay rate (environmental resistance)
const MOMENTUM_DRAG = 0.1;          // Decay while moving (effort cost)
const MOMENTUM_CLICK_BOOST = 8;     // Momentum gained per click
const MOMENTUM_INERTIA = 0.12;      // How quickly momentum changes (very smooth)

// MOMENTUM THRESHOLDS (Define behavior zones)
const MOMENTUM_WALK_THRESHOLD = 10;  // Momentum needed to start walking
const MOMENTUM_SPRINT_THRESHOLD = 75; // High momentum triggers special visual state

// Movement System
let targetX, targetY;               // Target position
let lastClickX, lastClickY;         // Track last click for direction consistency
let clickHistory = [];              // Store recent clicks for momentum building
const MAX_CLICK_HISTORY = 3;        // Track last 3 clicks
const STOP_DISTANCE = 10;           // Distance threshold to stop

// OUTPUTS: Momentum-Driven Speed Parameters
const SPEED_MIN = 0.3;              // Minimum movement speed
const SPEED_MAX = 6.0;              // Maximum movement speed (faster than health example)
let currentSpeed = SPEED_MIN;       // Current calculated speed

// OUTPUTS: Momentum-Driven Animation Parameters
const WALK_FRAME_DELAY_FAST = 2;    // Very fast walk (high momentum)
const WALK_FRAME_DELAY_SLOW = 12;   // Slow walk (low momentum)
const IDLE_FRAME_DELAY = 8;         // Idle breathing

// Visual Effects
let trailPositions = [];            // Store character positions for trail effect
const MAX_TRAIL_LENGTH = 15;        // Maximum trail particles

// UI Display
let showUI = true;                  // Toggle for debug/info display

// ==============================================
// PRELOAD - Load animations before setup
// ==============================================
function preload() {
  // Load idle animation (9 frames)
  idleAni = loadAni('animations/idle/idleAnim_1.png', 9);
  
  // Load walk animation (13 frames)
  walkAni = loadAni('animations/walk/walkAnim_1.png', 13);
}

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  // Create portrait canvas (9:16 aspect ratio for mobile)
  createCanvas(405, 720);
  
  // Lock mobile gestures (prevent zoom/refresh)
  lockGestures();
  
  // Turn off physics gravity
  world.gravity.y = 0;
  
  // Create character sprite at center
  character = new Sprite(width / 2, height / 2);
  character.scale = 0.2;
  character.physics = 'kinematic';
  character.collider = 'none';
  
  // Add named animations to sprite
  character.addAni('idle', idleAni);
  character.addAni('walk', walkAni);
  
  // Start with idle animation
  character.changeAni('idle');
  character.ani.frameDelay = IDLE_FRAME_DELAY;
  
  // Initialize movement target
  targetX = character.x;
  targetY = character.y;
  lastClickX = character.x;
  lastClickY = character.y;
}

// ==============================================
// DRAW - Main game loop
// ==============================================
function draw() {
  background(30, 40, 50);
  
  // ==========================================
  // STEP 1: APPLY ENVIRONMENTAL FORCES
  // ==========================================
  
  // Calculate distance to target
  let distanceToTarget = dist(character.x, character.y, targetX, targetY);
  
  if (distanceToTarget > STOP_DISTANCE) {
    // Moving: Apply drag (movement costs momentum)
    targetMomentum -= MOMENTUM_DRAG;
  } else {
    // Stopped: Apply stronger friction
    targetMomentum -= MOMENTUM_FRICTION;
  }
  
  // Analyze click history for directional consistency bonus
  if (clickHistory.length >= 2) {
    // If recent clicks are in similar direction, momentum builds faster
    let consistencyBonus = calculateDirectionalConsistency();
    if (consistencyBonus > 0.7) {
      // Consistent direction = less momentum loss
      targetMomentum -= MOMENTUM_FRICTION * 0.5; // Compensate some friction
    }
  }
  
  // Constrain target momentum
  targetMomentum = constrain(targetMomentum, MOMENTUM_MIN, MOMENTUM_MAX);
  
  // Apply inertia - very smooth momentum changes
  momentum = lerp(momentum, targetMomentum, MOMENTUM_INERTIA);
  
  // ==========================================
  // STEP 2: CONVERT PARAMETER TO OUTPUTS
  // ==========================================
  
  // OUTPUT 1: Calculate movement speed from momentum
  // Use exponential mapping for more dramatic speed changes
  currentSpeed = map(momentum, MOMENTUM_MIN, MOMENTUM_MAX, SPEED_MIN, SPEED_MAX);
  currentSpeed = pow(currentSpeed, 1.3); // Exponential curve for better feel
  
  // OUTPUT 2: Calculate animation speed from momentum
  let currentWalkFrameDelay = map(
    momentum,
    MOMENTUM_MIN,
    MOMENTUM_MAX,
    WALK_FRAME_DELAY_SLOW,
    WALK_FRAME_DELAY_FAST
  );
  
  // ==========================================
  // STEP 3: APPLY OUTPUTS TO CHARACTER
  // ==========================================
  
  if (distanceToTarget > STOP_DISTANCE && momentum > MOMENTUM_WALK_THRESHOLD) {
    // CHARACTER IS MOVING
    
    // Move toward target at momentum-based speed
    character.moveTo(targetX, targetY, currentSpeed);
    
    // Switch to walk animation
    if (character.ani.name !== 'walk') {
      character.changeAni('walk');
    }
    
    // Update animation speed based on momentum
    character.ani.frameDelay = currentWalkFrameDelay;
    
    // Add to trail effect if momentum is high
    if (momentum > MOMENTUM_SPRINT_THRESHOLD) {
      addTrailPosition();
    }
    
  } else {
    // CHARACTER IS IDLE
    
    character.vel.x = 0;
    character.vel.y = 0;
    
    if (character.ani.name !== 'idle') {
      character.changeAni('idle');
      character.ani.frameDelay = IDLE_FRAME_DELAY;
    }
  }
  
  // Mirror sprite based on direction
  if (character.vel.x < -0.1) {
    character.mirror.x = true;
  } else if (character.vel.x > 0.1) {
    character.mirror.x = false;
  }
  
  // OUTPUT 3: Visual feedback
  updateCharacterColor();
  drawTrail();
  drawTarget();
  drawMomentumBar();
  
  if (showUI) {
    drawUI();
  }
}

// ==============================================
// INPUT HANDLING
// ==============================================
function mousePressed() {
  // RAW INPUT: Click position
  targetX = mouseX;
  targetY = mouseY;
  
  // Calculate direction of click relative to current movement
  let clickAngle = atan2(targetY - character.y, targetX - character.x);
  
  // Add click to history
  clickHistory.push({
    x: mouseX,
    y: mouseY,
    angle: clickAngle,
    time: frameCount
  });
  
  // Keep only recent clicks
  if (clickHistory.length > MAX_CLICK_HISTORY) {
    clickHistory.shift();
  }
  
  // Add momentum boost
  targetMomentum += MOMENTUM_CLICK_BOOST;
  
  // BONUS: If clicking in consistent direction, add extra momentum
  if (clickHistory.length >= 2) {
    let consistency = calculateDirectionalConsistency();
    if (consistency > 0.8) {
      targetMomentum += MOMENTUM_CLICK_BOOST * 0.5; // 50% bonus
    }
  }
  
  // Constrain
  targetMomentum = constrain(targetMomentum, MOMENTUM_MIN, MOMENTUM_MAX);
  
  // Store last click
  lastClickX = mouseX;
  lastClickY = mouseY;
}

// Mobile touch support - mirrors mousePressed behavior
function touchStarted() {
  // Use same logic as mousePressed for touch input
  targetX = mouseX;
  targetY = mouseY;
  
  // Calculate direction
  let clickAngle = atan2(targetY - character.y, targetX - character.x);
  
  // Add to history
  clickHistory.push({
    x: mouseX,
    y: mouseY,
    angle: clickAngle,
    time: frameCount
  });
  
  if (clickHistory.length > MAX_CLICK_HISTORY) {
    clickHistory.shift();
  }
  
  // Add momentum
  targetMomentum += MOMENTUM_CLICK_BOOST;
  
  // Bonus for directional consistency
  if (clickHistory.length >= 2) {
    let consistency = calculateDirectionalConsistency();
    if (consistency > 0.8) {
      targetMomentum += MOMENTUM_CLICK_BOOST * 0.5;
    }
  }
  
  targetMomentum = constrain(targetMomentum, MOMENTUM_MIN, MOMENTUM_MAX);
  lastClickX = mouseX;
  lastClickY = mouseY;
  
  // Prevent default touch behavior
  return false;
}

// Toggle UI with keyboard
function keyPressed() {
  if (key === ' ') {
    showUI = !showUI;
  }
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================

function calculateDirectionalConsistency() {
  // Returns 0-1: how consistent are recent click directions?
  if (clickHistory.length < 2) return 0;
  
  let angles = clickHistory.map(c => c.angle);
  let avgAngle = angles.reduce((sum, a) => sum + a, 0) / angles.length;
  
  // Calculate variance
  let variance = 0;
  for (let a of angles) {
    let diff = abs(a - avgAngle);
    variance += diff;
  }
  variance /= angles.length;
  
  // Convert to 0-1 score (lower variance = higher consistency)
  return constrain(map(variance, 0, PI, 1, 0), 0, 1);
}

function addTrailPosition() {
  // Add current position to trail
  trailPositions.push({
    x: character.x,
    y: character.y,
    alpha: 255
  });
  
  // Limit trail length
  if (trailPositions.length > MAX_TRAIL_LENGTH) {
    trailPositions.shift();
  }
}

// ==============================================
// OUTPUT FUNCTION: Visual Feedback
// ==============================================
function updateCharacterColor() {
  // Change tint based on momentum level
  if (momentum > MOMENTUM_SPRINT_THRESHOLD) {
    // High momentum: Blue/cyan glow
    character.color = color(150, 200, 255);
  } else if (momentum > 50) {
    // Medium momentum: Light blue
    character.color = color(200, 220, 255);
  } else {
    // Low momentum: Normal colors
    character.color = 255; // White (normal)
  }
}

// ==============================================
// VISUAL ELEMENTS
// ==============================================

function drawTrail() {
  // Draw motion trail at high momentum
  for (let i = 0; i < trailPositions.length; i++) {
    let t = trailPositions[i];
    
    // Fade trail particles
    t.alpha -= 15;
    
    if (t.alpha > 0) {
      push();
      fill(150, 200, 255, t.alpha);
      noStroke();
      let size = map(i, 0, trailPositions.length, 5, 15);
      circle(t.x, t.y, size);
      pop();
    }
  }
  
  // Remove faded particles
  trailPositions = trailPositions.filter(t => t.alpha > 0);
}

function drawTarget() {
  // Draw target indicator
  push();
  noFill();
  stroke(100, 200, 255, 150);
  strokeWeight(2);
  circle(targetX, targetY, 30);
  line(targetX - 15, targetY, targetX + 15, targetY);
  line(targetX, targetY - 15, targetX, targetY + 15);
  pop();
}

function drawMomentumBar() {
  // Draw momentum bar at top
  let barWidth = width - 40;
  let barHeight = 20;
  let barX = 20;
  let barY = 20;
  
  push();
  // Background
  fill(50);
  stroke(100);
  strokeWeight(2);
  rect(barX, barY, barWidth, barHeight, 5);
  
  // Momentum fill
  let momentumWidth = map(momentum, 0, 100, 0, barWidth);
  noStroke();
  
  // Color based on momentum
  if (momentum > MOMENTUM_SPRINT_THRESHOLD) {
    fill(100, 150, 255); // High speed blue
  } else if (momentum > 50) {
    fill(150, 200, 255); // Medium blue
  } else if (momentum > MOMENTUM_WALK_THRESHOLD) {
    fill(200, 220, 255); // Light blue
  } else {
    fill(150, 150, 150); // Gray (not moving)
  }
  
  rect(barX, barY, momentumWidth, barHeight, 5);
  
  // Text
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(`Momentum: ${Math.round(momentum)}`, barX + barWidth/2, barY + barHeight/2);
  pop();
}

function drawUI() {
  // Information overlay
  push();
  fill(0, 150);
  noStroke();
  rect(10, height - 240, width - 20, 230, 5);
  
  fill(255);
  textAlign(LEFT, TOP);
  textSize(12);
  
  let x = 20;
  let y = height - 230;
  let lineHeight = 18;
  
  text('MOMENTUM-BASED CHARACTER CONTROLLER', x, y);
  y += lineHeight * 1.5;
  
  text(`PARAMETER: Momentum = ${Math.round(momentum)}`, x, y);
  y += lineHeight;
  
  let consistency = clickHistory.length >= 2 ? calculateDirectionalConsistency() : 0;
  text(`Direction Consistency: ${(consistency * 100).toFixed(0)}%`, x, y);
  y += lineHeight * 1.3;
  
  text(`FORCES:`, x, y);
  y += lineHeight;
  text(`  • Friction: -${MOMENTUM_FRICTION.toFixed(2)}/frame`, x, y);
  y += lineHeight;
  text(`  • Drag (moving): -${MOMENTUM_DRAG.toFixed(2)}/frame`, x, y);
  y += lineHeight;
  text(`  • Click: +${MOMENTUM_CLICK_BOOST} (+ bonus if aligned)`, x, y);
  y += lineHeight * 1.3;
  
  text(`OUTPUTS (Momentum → Actions):`, x, y);
  y += lineHeight;
  text(`  • Speed: ${currentSpeed.toFixed(2)} px/frame`, x, y);
  y += lineHeight;
  text(`  • Animation: ${character.ani.name}`, x, y);
  y += lineHeight;
  text(`  • Sprint Mode: ${momentum > MOMENTUM_SPRINT_THRESHOLD ? 'YES' : 'NO'}`, x, y);
  y += lineHeight * 1.3;
  
  text('Click repeatedly in same direction to build speed!', x, y);
  y += lineHeight;
  text('Space: Toggle UI', x, y);
  
  pop();
}
