/*
==============================================
p5play Animated Character - Phone Simple Version
==============================================

DESCRIPTION:
A simple animated character that switches between idle and walk animations.
This is a basic example showing core p5play animation concepts before
adding dynamic systems like tiredness.

ANIMATIONS:
1. Idle (9 frames) - Plays when character is stationary, shows breathing
2. Walk (13 frames) - Plays when character is moving toward target

CONTROLS:
- Touch/Click anywhere to make the sprite move to that location
- Character automatically stops when reaching target

KEY p5play METHODS:
- loadAni(path, frames) - Load animation from numbered image sequence
- sprite.addAni(name, animation) - Add animation to sprite
- sprite.changeAni(name) - Switch between animations
- sprite.moveTo(x, y, speed) - Move sprite toward target
- sprite.ani.frameDelay - Control animation playback speed
- sprite.mirror.x - Flip sprite horizontally

KEY p5-phone METHODS:
- lockGestures() - Prevent mobile zoom/refresh gestures

LIBRARIES REQUIRED:
- p5.js v1.11.4
- p5play v3
- p5-phone v1.6.2
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================

// Sprite and Animations
let character;        // The animated sprite object
let idleAni;          // Idle animation (breathing)
let walkAni;          // Walk animation (locomotion)

// Movement System
let targetX, targetY; // Target position for character to move toward
let isMoving = false; // Track if sprite is currently moving
let moveSpeed = 2;    // Movement speed (pixels per frame)
let stopDistance = 5; // Distance threshold to stop at target (pixels)

// ==============================================
// PRELOAD - Load animations before setup
// ==============================================
function preload() {
  // Load idle animation sequence (9 frames)
  // loadAni automatically loads numbered images: idleAnim_1.png, idleAnim_2.png, etc.
  idleAni = loadAni('animations/idle/idleAnim_1.png', 9);
  idleAni.frameDelay = 8; // Slow, calm breathing (higher = slower)
  
  // Load walk animation sequence (13 frames)
  walkAni = loadAni('animations/walk/walkAnim_1.png', 13);
  walkAni.frameDelay = 4; // Normal walking speed
}

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  // Create portrait canvas matching phone proportions (9:16 aspect ratio)
  createCanvas(405, 720);
  
  // Prevent mobile zoom and pull-to-refresh gestures
  lockGestures();
  
  // Initialize character sprite at center of canvas
  character = new Sprite();
  character.x = width / 2;
  character.y = height / 2;
  character.scale = 0.2;  // Scale down sprite to fit canvas
  
  // Configure sprite physics
  // 'kinematic' = manual control, not affected by gravity or collisions
  character.physics = 'kinematic';
  
  // Add both animations to the sprite
  character.addAni('idle', idleAni);
  character.addAni('walk', walkAni);
  
  // Start with idle animation
  character.changeAni('idle');
  
  // Initialize movement target to current position (character starts still)
  targetX = character.x;
  targetY = character.y;
}

// ==============================================
// DRAW - Main game loop (runs continuously at 60fps)
// ==============================================
function draw() {
  // Clear background
  background(100, 150, 200);
  
  // Calculate distance to target position
  let distanceToTarget = dist(character.x, character.y, targetX, targetY);
  
  // Update movement and animation based on distance to target
  if (distanceToTarget > stopDistance) {
    // CHARACTER IS MOVING
    // Move character toward target at fixed speed
    character.moveTo(targetX, targetY, moveSpeed);
    isMoving = true;
    
    // Switch to walk animation if not already walking
    if (character.ani.name !== 'walk') {
      character.changeAni('walk');
    }
    
  } else {
    // CHARACTER HAS REACHED TARGET
    // Stop all movement
    character.vel.x = 0;
    character.vel.y = 0;
    isMoving = false;
    
    // Switch to idle animation if not already idle
    if (character.ani.name !== 'idle') {
      character.changeAni('idle');
    }
  }
  
  // Mirror sprite based on movement direction
  if (character.vel.x < -0.1) {
    character.mirror.x = true;   // Flip to face left
  } else if (character.vel.x > 0.1) {
    character.mirror.x = false;  // Face right (default)
  }
  
  // Draw visual indicators
  drawTarget();
  drawUI();
}

// ==============================================
// INPUT - Handle both mouse and touch
// ==============================================
function mousePressed() {
  // Set new target position where mouse/touch occurred
  targetX = mouseX;
  targetY = mouseY;
  return false; // Prevent default behavior
}

function touchStarted() {
  // Handle touch events (for mobile)
  if (touches.length > 0) {
    targetX = touches[0].x;
    targetY = touches[0].y;
  }
  return false; // Prevent default behavior
}

// ==============================================
// HELPER - Draw target indicator
// ==============================================
function drawTarget() {
  // Only show target indicator when moving
  if (isMoving) {
    push();
    noFill();
    stroke(255, 200, 0);
    strokeWeight(2);
    
    // Draw pulsing circle at target location
    let pulseSize = 20 + sin(frameCount * 0.1) * 5;
    circle(targetX, targetY, pulseSize);
    
    // Draw crosshair
    line(targetX - 10, targetY, targetX + 10, targetY);
    line(targetX, targetY - 10, targetX, targetY + 10);
    pop();
  }
}

// ==============================================
// HELPER - Draw UI information
// ==============================================
function drawUI() {
  push();
  fill(255);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  
  // Display instructions
  text('Touch anywhere to move', 10, 10);
  
  // Display current animation
  text(`Animation: ${character.ani.name}`, 10, 30);
  
  // Display movement status
  let status = isMoving ? 'Moving' : 'Idle';
  text(`Status: ${status}`, 10, 50);
  
  // Display current speed
  let speed = character.vel.mag().toFixed(2);
  text(`Speed: ${speed} px/frame`, 10, 70);
  
  // Display distance to target
  let distanceToTarget = dist(character.x, character.y, targetX, targetY).toFixed(1);
  text(`Distance: ${distanceToTarget} px`, 10, 90);
  
  pop();
}
