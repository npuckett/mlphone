/*
==============================================
p5play Animated Character with Tiredness System
Phone-Adapted Example
==============================================

DESCRIPTION:
This example demonstrates an animated character that gets tired from movement
and recovers when resting. The tiredness level affects both movement speed and
animation playback speed, creating realistic fatigue behavior.

TIREDNESS SYSTEM:
- Increases when moving (physical activity is tiring)
- Decreases when idle/resting (standing still recovers energy)
- Range: 0 (fully rested) to 100 (exhausted)
- Affects movement speed: tired character moves slower
- Affects animation speed: 
  * Walk animation plays slower when tired
  * Idle breathing plays faster when tired (panting/out of breath)

ANIMATIONS:
1. Idle (9 frames) - Plays when character is stationary, shows breathing
2. Walk (13 frames) - Plays when character is moving toward target

CONTROLS:
- Touch/Click anywhere to make the sprite move to that location
- Character automatically stops when reaching target
- Debug panel shows real-time stats (hidden by default)

KEY p5play METHODS USED:
- loadAni(path, frames) - Load animation from numbered image sequence
- new Sprite() - Create a sprite object
- sprite.addAni(name, animation) - Add animation to sprite
- sprite.changeAni(name) - Switch to different animation
- sprite.moveTo(x, y, speed) - Move sprite toward target position
- sprite.ani.frameDelay - Control animation playback speed (lower = faster)
- sprite.ani.name - Get current animation name
- sprite.mirror.x - Flip sprite horizontally
- sprite.physics - Set physics mode ('kinematic' for manual control)

KEY p5-phone METHODS USED:
- showDebug() - Display debug panel with custom text
- hideDebug() - Hide debug panel
- debug(text) - Add text line to debug panel
- lockGestures() - Prevent mobile zoom/refresh gestures

LIBRARIES REQUIRED:
- p5.js v1.11.4 (p5play requires this specific version)
- p5play v3
- p5-phone v1.6.1
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
let stopDistance = 5; // Distance threshold to stop at target (pixels)

// Tiredness System
let tiredness = 0;              // Current tiredness level (0 = rested, 100 = exhausted)
let tirednessMin = 0;           // Minimum tiredness (fully rested)
let tirednessMax = 100;         // Maximum tiredness (completely exhausted)
let tirednessRecoveryRate = 0.15; // How fast tiredness decreases when idle (per frame)
let tirednessBuildRate = 0.3;     // How fast tiredness increases when moving (per frame)

// Movement Speed Controls
let baseMoveSpeed = 3;          // Movement speed when fully rested (pixels/frame)
let tiredMoveSpeed = 0.9;       // Movement speed when exhausted (pixels/frame)

// Animation Speed Controls (frameDelay = frames to wait between animation frames)
let walkFrameDelayRested = 2;   // Walk animation speed when rested (lower = faster)
let walkFrameDelayTired = 12;   // Walk animation speed when tired (higher = slower)
let idleFrameDelayRested = 12;  // Idle breathing speed when rested (slow breathing)
let idleFrameDelayTired = 4;    // Idle breathing speed when tired (fast panting)

// ==============================================
// PRELOAD - Load animations before setup
// ==============================================
function preload() {
  // Load idle animation sequence (9 frames)
  // Using local animations folder
  idleAni = loadAni('animations/idle/idleAnim_1.png', 9);
  
  // Load walk animation sequence (13 frames)
  walkAni = loadAni('animations/walk/walkAnim_1.png', 13);
}

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  // Enable debug panel to view real-time stats (uncomment to show on startup)
  // showDebug();
  
  // Create portrait canvas matching phone proportions (9:16 aspect ratio)
  createCanvas(405, 720);
  
  // Prevent mobile zoom and pull-to-refresh gestures
  lockGestures();
  
  // Initialize character sprite
  character = new Sprite();
  character.x = width / 2;
  character.y = height / 2;
  character.scale = 0.2;  // Scale down sprite to fit canvas
  
  // Configure sprite physics
  // 'kinematic' = manual control, sprite not affected by gravity or collisions
  character.physics = 'kinematic';
  
  // Add both animations to the sprite
  character.addAni('idle', idleAni);
  character.addAni('walk', walkAni);
  
  // Set initial animation state
  character.changeAni('idle');
  character.ani.loop();  // Ensure animation loops continuously
  
  // Initialize movement target to current position (character starts still)
  targetX = character.x;
  targetY = character.y;
  
  // Start with moderate tiredness level
  tiredness = 30;
}

// ==============================================
// DRAW - Main game loop (runs continuously at 60fps)
// ==============================================
function draw() {
  // Clear background
  background(100, 150, 200);
  
  // Step 1: Calculate distance to target position
  let distanceToTarget = dist(character.x, character.y, targetX, targetY);
  
  // Step 2: Update tiredness and movement based on current state
  if (distanceToTarget > stopDistance) {
    // CHARACTER IS MOVING
    // Increase tiredness (physical activity is tiring!)
    tiredness += tirednessBuildRate;
    tiredness = constrain(tiredness, tirednessMin, tirednessMax);
    
    // Calculate current movement speed based on tiredness level
    // Low tiredness = fast movement, High tiredness = slow movement
    let currentSpeed = map(tiredness, 0, 100, baseMoveSpeed, tiredMoveSpeed);
    
    // Move character toward target at calculated speed
    character.moveTo(targetX, targetY, currentSpeed);
    isMoving = true;
    
    // Switch to walk animation if not already walking
    if (character.ani.name !== 'walk') {
      character.changeAni('walk');
    }
    
    // Update walk animation speed based on tiredness
    updateAnimationSpeed('walk');
    
  } else {
    // CHARACTER IS IDLE (at target)
    // Decrease tiredness (resting recovers energy!)
    tiredness -= tirednessRecoveryRate;
    tiredness = constrain(tiredness, tirednessMin, tirednessMax);
    
    // Stop all movement
    character.vel.x = 0;
    character.vel.y = 0;
    isMoving = false;
    
    // Switch to idle animation if not already idle
    if (character.ani.name !== 'idle') {
      character.changeAni('idle');
    }
    
    // Update idle animation speed based on tiredness
    updateAnimationSpeed('idle');
  }
  
  // Step 3: Mirror sprite based on movement direction
  if (character.vel.x < -0.1) {
    character.mirror.x = true;   // Flip to face left
  } else if (character.vel.x > 0.1) {
    character.mirror.x = false;  // Face right (default)
  }
  
  // Step 4: Draw visual indicators
  drawTarget();
  drawTirednessDisplay();
  
  // Step 5: Update debug panel with current stats
  updateDebugPanel();
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
// HELPER - Update animation playback speed based on tiredness
// ==============================================
function updateAnimationSpeed(animationName) {
  // Note: frameDelay controls how many frames to wait before advancing animation
  // Lower frameDelay = faster animation playback
  // frameDelay must be an integer value
  
  if (animationName === 'walk') {
    // WALK ANIMATION LOGIC:
    // Rested (tiredness 0) → frameDelay 2 (fast walk)
    // Tired (tiredness 100) → frameDelay 12 (slow, sluggish walk)
    character.ani.frameDelay = Math.floor(
      map(tiredness, tirednessMin, tirednessMax, walkFrameDelayRested, walkFrameDelayTired)
    );
    
  } else if (animationName === 'idle') {
    // IDLE BREATHING LOGIC:
    // Rested (tiredness 0) → frameDelay 12 (slow, calm breathing)
    // Tired (tiredness 100) → frameDelay 4 (fast, heavy breathing/panting)
    character.ani.frameDelay = Math.floor(
      map(tiredness, tirednessMin, tirednessMax, idleFrameDelayRested, idleFrameDelayTired)
    );
  }
}

// ==============================================
// HELPER - Draw target indicator
// ==============================================
function drawTarget() {
  if (isMoving) {
    push();
    noFill();
    stroke(255, 200, 0);
    strokeWeight(2);
    
    // Draw pulsing circle at target
    let pulseSize = 20 + sin(frameCount * 0.1) * 5;
    circle(targetX, targetY, pulseSize);
    
    // Draw crosshair
    line(targetX - 10, targetY, targetX + 10, targetY);
    line(targetX, targetY - 10, targetX, targetY + 10);
    pop();
  }
}

// ==============================================
// HELPER - Draw tiredness display on screen
// ==============================================
function drawTirednessDisplay() {
  push();
  
  // Draw tiredness bar at top of screen
  let barWidth = 200;
  let barHeight = 20;
  let barX = (width - barWidth) / 2;
  let barY = 20;
  
  // Background bar
  fill(50);
  noStroke();
  rect(barX, barY, barWidth, barHeight, 5);
  
  // Filled portion based on tiredness
  let fillWidth = map(tiredness, 0, 100, 0, barWidth);
  
  // Color changes based on tiredness level
  if (tiredness < 33) {
    fill(100, 200, 100); // Green when rested
  } else if (tiredness < 66) {
    fill(255, 200, 50);  // Yellow when moderately tired
  } else {
    fill(255, 100, 100); // Red when exhausted
  }
  
  rect(barX, barY, fillWidth, barHeight, 5);
  
  // Label text
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(`Tiredness: ${Math.floor(tiredness)}%`, width / 2, barY + barHeight + 15);
  
  pop();
}

// ==============================================
// HELPER - Update debug panel with current statistics
// ==============================================
function updateDebugPanel() {
  // Update debug display every 30 frames (twice per second)
  // This keeps the display readable and reduces overhead
  if (frameCount % 30 === 0) {
    
    // Show current animation state
    debug(`Animation: ${character.ani.name}`);
    
    // Show movement status
    let status = isMoving ? 'Moving' : 'Idle';
    debug(`Status: ${status}`);
    
    // Show tiredness with visual bar indicator
    let tirednessPercent = (tiredness / tirednessMax * 100).toFixed(0);
    let barLength = Math.floor(tiredness / 5); // Scale to 20 character bar
    let filledBar = '█'.repeat(barLength);
    let emptyBar = '░'.repeat(20 - barLength);
    debug(`Tiredness: [${filledBar}${emptyBar}] ${tirednessPercent}%`);
    
    // Show current movement speed
    let currentSpeed = map(tiredness, 0, 100, baseMoveSpeed, tiredMoveSpeed).toFixed(2);
    debug(`Move Speed: ${currentSpeed} px/frame`);
    
    // Show current animation frame delay
    let currentFrameDelay = character.ani.frameDelay;
    debug(`Anim Delay: ${currentFrameDelay} frames`);
    
    // Show distance to target (useful for debugging movement)
    let distanceToTarget = dist(character.x, character.y, targetX, targetY).toFixed(1);
    debug(`Distance: ${distanceToTarget} px`);
  }
}
