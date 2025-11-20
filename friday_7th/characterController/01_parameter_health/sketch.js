/*
==============================================
CHARACTER CONTROLLER 01 - HEALTH PARAMETER
==============================================

CONCEPT: RAW INPUTS → PARAMETERS → OUTPUTS

This example demonstrates a fundamental character controller pattern:
1. RAW INPUT: Touch/click provides positive influence
2. PARAMETER: "Health" is affected by inputs AND environmental forces
3. OUTPUT: Health drives movement speed and animation switching

KEY LEARNING POINTS:
- Inputs don't directly control movement - they influence a parameter
- Parameters are subject to multiple forces (input + environment + inertia)
- Parameters then drive multiple outputs (speed, animation, visual feedback)
- This creates more organic, dynamic character behavior

HEALTH SYSTEM:
- Range: 0 (critical) to 100 (maximum health)
- Increases when you click/touch (positive input influence)
- Decreases constantly due to "environmental decay" (negative force)
- Has "inertia" - changes are smoothed over time

HEALTH AFFECTS MULTIPLE OUTPUTS:
1. Movement Speed: Higher health = faster movement to target
2. Animation: Health thresholds switch between idle/walk
3. Animation Speed: Health affects walk animation frameDelay
4. Visual Feedback: Character color shifts based on health level

ENVIRONMENTAL FORCES:
- DECAY: Health constantly decreases (simulates hunger, fatigue, etc.)
- INERTIA: Health changes are smoothed using lerp() for organic feel
- BOUNDARIES: Health is constrained to 0-100 range

CONTROLS:
- Click/Touch anywhere: Increase health and set movement target
- Character automatically moves toward clicked position
- Health depletes over time even without movement

ANIMATION NAMING (p5play):
- sprite.addAni('name', animation) - Assigns a name to an animation
- sprite.changeAni('name') - Switches to named animation
- sprite.ani.name - Current animation name (for checking state)

LIBRARIES REQUIRED:
- p5.js v1.11.4
- p5play v3
- p5-phone v1.6.2
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================

// Sprite and Animations
let character;          // The animated sprite
let idleAni;            // Idle animation
let walkAni;            // Walk animation

// PARAMETER: Health (The central state variable)
let health = 50;                // Current health level (0-100)
let targetHealth = 50;          // Target health (for inertia/smoothing)
const HEALTH_MIN = 0;           // Minimum health value
const HEALTH_MAX = 100;         // Maximum health value

// HEALTH FORCES (Environmental + Input)
const HEALTH_DECAY_RATE = 0.08;     // How fast health depletes over time (negative force)
const HEALTH_CLICK_BOOST = 15;      // Health gained per click/touch (positive input)
const HEALTH_INERTIA = 0.15;        // How quickly health changes (0-1, lower = more sluggish)

// HEALTH THRESHOLDS (Define behavior zones)
const HEALTH_WALK_THRESHOLD = 30;   // Health needed to walk (below this = idle only)
const HEALTH_CRITICAL = 20;         // Critical health warning level

// Movement System
let targetX, targetY;               // Target position to move toward
const STOP_DISTANCE = 5;            // Distance threshold to stop at target

// OUTPUTS: Health-Driven Speed Parameters
const SPEED_MIN = 0.5;              // Minimum movement speed (low health)
const SPEED_MAX = 4.0;              // Maximum movement speed (high health)
let currentSpeed = SPEED_MIN;       // Current calculated speed

// OUTPUTS: Health-Driven Animation Parameters
const WALK_FRAME_DELAY_FAST = 3;    // Fast walk animation (high health)
const WALK_FRAME_DELAY_SLOW = 10;   // Slow walk animation (low health)
const IDLE_FRAME_DELAY = 8;         // Idle breathing animation speed

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
  
  // Turn off physics gravity (we're using kinematic movement)
  world.gravity.y = 0;
  
  // Create character sprite at center
  character = new Sprite(width / 2, height / 2);
  character.scale = 0.2;           // Scale down sprite to fit canvas
  character.physics = 'kinematic'; // Manual control, no physics simulation
  character.collider = 'none';     // No collision detection needed
  
  // Add named animations to sprite
  character.addAni('idle', idleAni);
  character.addAni('walk', walkAni);
  
  // Start with idle animation
  character.changeAni('idle');
  character.ani.frameDelay = IDLE_FRAME_DELAY;
  
  // Initialize movement target to current position
  targetX = character.x;
  targetY = character.y;
}

// ==============================================
// DRAW - Main game loop
// ==============================================
function draw() {
  background(30, 40, 50);
  
  // ==========================================
  // STEP 1: APPLY ENVIRONMENTAL FORCES
  // ==========================================
  // Health constantly decays (negative environmental force)
  targetHealth -= HEALTH_DECAY_RATE;
  
  // Constrain target health to valid range
  targetHealth = constrain(targetHealth, HEALTH_MIN, HEALTH_MAX);
  
  // Apply inertia - smooth transition to target health
  // This creates organic, gradual changes instead of instant jumps
  health = lerp(health, targetHealth, HEALTH_INERTIA);
  
  // ==========================================
  // STEP 2: CONVERT PARAMETER TO OUTPUTS
  // ==========================================
  
  // OUTPUT 1: Calculate movement speed from health
  // Map health (0-100) to speed range (SPEED_MIN - SPEED_MAX)
  currentSpeed = map(health, HEALTH_MIN, HEALTH_MAX, SPEED_MIN, SPEED_MAX);
  
  // OUTPUT 2: Calculate animation speed from health
  // Higher health = faster walk animation
  let currentWalkFrameDelay = map(
    health, 
    HEALTH_MIN, 
    HEALTH_MAX, 
    WALK_FRAME_DELAY_SLOW, 
    WALK_FRAME_DELAY_FAST
  );
  
  // ==========================================
  // STEP 3: APPLY OUTPUTS TO CHARACTER
  // ==========================================
  
  // Calculate distance to target position
  let distanceToTarget = dist(character.x, character.y, targetX, targetY);
  
  // Determine if character should move or be idle
  if (distanceToTarget > STOP_DISTANCE && health > HEALTH_WALK_THRESHOLD) {
    // CHARACTER IS MOVING (has enough health and target is far)
    
    // Move character toward target at health-based speed
    character.moveTo(targetX, targetY, currentSpeed);
    
    // Switch to walk animation if not already walking
    if (character.ani.name !== 'walk') {
      character.changeAni('walk');
    }
    
    // Update walk animation speed based on health
    character.ani.frameDelay = currentWalkFrameDelay;
    
  } else {
    // CHARACTER IS IDLE (reached target OR health too low)
    
    // Stop movement
    character.vel.x = 0;
    character.vel.y = 0;
    
    // Switch to idle animation if not already idle
    if (character.ani.name !== 'idle') {
      character.changeAni('idle');
      character.ani.frameDelay = IDLE_FRAME_DELAY;
    }
  }
  
  // Mirror sprite based on movement direction
  if (character.vel.x < -0.1) {
    character.mirror.x = true;   // Face left
  } else if (character.vel.x > 0.1) {
    character.mirror.x = false;  // Face right
  }
  
  // OUTPUT 3: Visual feedback - character color based on health
  updateCharacterColor();
  
  // Draw visual elements
  drawTarget();
  drawHealthBar();
  if (showUI) {
    drawUI();
  }
}

// ==============================================
// INPUT HANDLING
// ==============================================
function mousePressed() {
  // RAW INPUT: Click/touch position becomes movement target
  targetX = mouseX;
  targetY = mouseY;
  
  // RAW INPUT: Click/touch provides positive force to health parameter
  targetHealth += HEALTH_CLICK_BOOST;
  
  // Constrain to maximum health
  targetHealth = constrain(targetHealth, HEALTH_MIN, HEALTH_MAX);
}

// Mobile touch support - mirrors mousePressed behavior
function touchStarted() {
  // Use same logic as mousePressed for touch input
  targetX = mouseX;
  targetY = mouseY;
  targetHealth += HEALTH_CLICK_BOOST;
  targetHealth = constrain(targetHealth, HEALTH_MIN, HEALTH_MAX);
  
  // Prevent default touch behavior (scrolling, zooming, etc.)
  return false;
}

// Toggle UI display with keyboard
function keyPressed() {
  if (key === ' ') {
    showUI = !showUI;
  }
}

// ==============================================
// OUTPUT FUNCTION: Visual Feedback
// ==============================================
function updateCharacterColor() {
  // Change character color based on health level
  // This is a visual OUTPUT driven by the health PARAMETER
  
  if (health < HEALTH_CRITICAL) {
    // Critical health: Red tint
    character.color = color(255, 100, 100);
  } else if (health < HEALTH_WALK_THRESHOLD) {
    // Low health: Orange tint
    character.color = color(255, 180, 100);
  } else if (health < 60) {
    // Medium health: Yellow tint
    character.color = color(255, 255, 150);
  } else {
    // Good health: No tint (normal colors)
    character.color = 255;
  }
}

// ==============================================
// VISUAL ELEMENTS
// ==============================================

function drawTarget() {
  // Draw target position indicator
  push();
  noFill();
  stroke(100, 200, 255, 150);
  strokeWeight(2);
  circle(targetX, targetY, 30);
  
  // Draw crosshair
  line(targetX - 15, targetY, targetX + 15, targetY);
  line(targetX, targetY - 15, targetX, targetY + 15);
  pop();
}

function drawHealthBar() {
  // Draw health bar at top of screen
  let barWidth = width - 40;
  let barHeight = 20;
  let barX = 20;
  let barY = 20;
  
  push();
  // Background bar
  fill(50);
  stroke(100);
  strokeWeight(2);
  rect(barX, barY, barWidth, barHeight, 5);
  
  // Health fill
  let healthWidth = map(health, 0, 100, 0, barWidth);
  noStroke();
  
  // Color based on health level
  if (health < HEALTH_CRITICAL) {
    fill(255, 50, 50);
  } else if (health < HEALTH_WALK_THRESHOLD) {
    fill(255, 150, 50);
  } else if (health < 60) {
    fill(255, 220, 50);
  } else {
    fill(50, 255, 100);
  }
  
  rect(barX, barY, healthWidth, barHeight, 5);
  
  // Health text
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text(`Health: ${Math.round(health)}`, barX + barWidth/2, barY + barHeight/2);
  pop();
}

function drawUI() {
  // Information overlay
  push();
  fill(0, 150);
  noStroke();
  rect(10, height - 220, width - 20, 210, 5);
  
  fill(255);
  textAlign(LEFT, TOP);
  textSize(12);
  
  let x = 20;
  let y = height - 210;
  let lineHeight = 18;
  
  text('PARAMETER-DRIVEN CHARACTER CONTROLLER', x, y);
  y += lineHeight * 1.5;
  
  text(`PARAMETER: Health = ${Math.round(health)}`, x, y);
  y += lineHeight;
  
  text(`FORCES:`, x, y);
  y += lineHeight;
  text(`  • Decay: -${HEALTH_DECAY_RATE.toFixed(2)}/frame (environment)`, x, y);
  y += lineHeight;
  text(`  • Click: +${HEALTH_CLICK_BOOST} (input)`, x, y);
  y += lineHeight;
  text(`  • Inertia: ${HEALTH_INERTIA} smoothing`, x, y);
  y += lineHeight * 1.3;
  
  text(`OUTPUTS (Health → Actions):`, x, y);
  y += lineHeight;
  text(`  • Speed: ${currentSpeed.toFixed(2)} px/frame`, x, y);
  y += lineHeight;
  text(`  • Animation: ${character.ani.name}`, x, y);
  y += lineHeight;
  text(`  • Can Walk: ${health > HEALTH_WALK_THRESHOLD ? 'YES' : 'NO'}`, x, y);
  y += lineHeight * 1.3;
  
  text('Click/Touch: Set target + boost health', x, y);
  y += lineHeight;
  text('Space: Toggle UI', x, y);
  
  pop();
}
