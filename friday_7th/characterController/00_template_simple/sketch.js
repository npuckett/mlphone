// ==============================================
// SIMPLE CHARACTER CONTROLLER TEMPLATE
// ==============================================
// This is a minimal template showing the basic pattern:
// PARAMETER → THRESHOLD → BEHAVIOR
//
// PATTERN:
// 1. Calculate a parameter (health)
// 2. Check threshold to determine state
// 3. Execute appropriate behavior and animation
//
// ==============================================

// ==============================================
// PARAMETER
// ==============================================
let health = 50;  // Central parameter (0-100)

// ==============================================
// THRESHOLD
// ==============================================
const HEALTH_THRESHOLD = 50;  // Dividing line between behaviors

// ==============================================
// CHARACTER SYSTEM
// ==============================================
let character;
let animation1;  // Animation for high health (above threshold)
let animation2;  // Animation for low health (below threshold)

// ==============================================
// PRELOAD - Load animations
// ==============================================
function preload() {
  // Load two animations
  animation1 = loadAni('animations/idle/idleAnim_1.png', 9);
  animation2 = loadAni('animations/walk/walkAnim_1.png', 13);
}

// ==============================================
// SETUP - Initialize
// ==============================================
function setup() {
  // Create canvas (9:16 mobile aspect ratio)
  createCanvas(405, 720);
  
  // Lock mobile gestures
  lockGestures();
  
  // Disable physics gravity
  world.gravity.y = 0;
  
  // Create character sprite
  character = new Sprite(width / 2, height / 2);
  character.scale = 0.2;
  character.physics = 'kinematic';
  character.collider = 'none';
  
  // Add animations
  character.addAni('animation1', animation1);
  character.addAni('animation2', animation2);
  character.changeAni('animation1');
}

// ==============================================
// DRAW - Main loop
// ==============================================
function draw() {
  background(30, 30, 40);
  
  // 1. Calculate parameter
  health = calculateHealth();
  
  // 2. Check threshold and execute appropriate behavior
  if (health >= HEALTH_THRESHOLD) {
    // Above threshold: use behavior 1
    behaviour1();
  } else {
    // Below threshold: use behavior 2
    behaviour2();
  }
  
  // Draw UI
  drawUI();
}

// ==============================================
// PARAMETER CALCULATION
// ==============================================
function calculateHealth() {
  // This function calculates and returns the health parameter
  // 
  // EXAMPLES of what you could calculate here:
  // - Time-based decay: health -= 0.1
  // - Input-based: health += mouseIsPressed ? 1 : 0
  // - Sensor-based: health = map(rotationX, -90, 90, 0, 100)
  // - Distance-based: health = dist(mouseX, mouseY, width/2, height/2)
  // - Random variation: health += random(-1, 1)
  // - Combination: health = (clicks * 10) - (frameCount * 0.01)
  
  // For now, just return unchanged value
  return health;
}

// ==============================================
// BEHAVIOR 1: High Health (Above Threshold)
// ==============================================
function behaviour1() {
  // Switch to animation 1 if not already playing
  if (character.ani.name !== 'animation1') {
    character.changeAni('animation1');
  }
  
  // Define behavior for high health state
  // EXAMPLES:
  // - Fast movement
  // - Bright colors
  // - Active responses
  // - etc.
  
  character.color = color(100, 255, 100);  // Green = healthy
}

// ==============================================
// BEHAVIOR 2: Low Health (Below Threshold)
// ==============================================
function behaviour2() {
  // Switch to animation 2 if not already playing
  if (character.ani.name !== 'animation2') {
    character.changeAni('animation2');
  }
  
  // Define behavior for low health state
  // EXAMPLES:
  // - Slow movement
  // - Dark/red colors
  // - Reduced responses
  // - etc.
  
  character.color = color(255, 100, 100);  // Red = low health
}

// ==============================================
// INPUT HANDLING
// ==============================================
function mousePressed() {
  // Example: clicking increases health
  health += 10;
  health = constrain(health, 0, 100);
  return false;
}

function touchStarted() {
  // Mobile touch support
  health += 10;
  health = constrain(health, 0, 100);
  return false;
}

function keyPressed() {
  // Example: spacebar decreases health
  if (key === ' ') {
    health -= 10;
    health = constrain(health, 0, 100);
  }
}

// ==============================================
// UI DISPLAY
// ==============================================
function drawUI() {
  push();
  
  // Health bar background
  noStroke();
  fill(50, 50, 60);
  rect(20, 20, width - 40, 30, 5);
  
  // Health bar fill
  let barWidth = map(health, 0, 100, 0, width - 40);
  if (health >= HEALTH_THRESHOLD) {
    fill(100, 255, 100);  // Green when above threshold
  } else {
    fill(255, 100, 100);  // Red when below threshold
  }
  rect(20, 20, barWidth, 30, 5);
  
  // Health value text
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text(`Health: ${floor(health)}`, width / 2, 35);
  
  // Info panel
  let x = 20;
  let y = 70;
  let lineHeight = 20;
  
  fill(0, 0, 0, 180);
  rect(x - 10, y - 10, 280, 150, 5);
  
  fill(255, 200, 0);
  textAlign(LEFT, TOP);
  textSize(14);
  text('SIMPLE TEMPLATE', x, y);
  y += lineHeight * 1.5;
  
  fill(255);
  textSize(12);
  text(`Parameter: health = ${health.toFixed(1)}`, x, y);
  y += lineHeight;
  text(`Threshold: ${HEALTH_THRESHOLD}`, x, y);
  y += lineHeight * 1.5;
  
  if (health >= HEALTH_THRESHOLD) {
    fill(100, 255, 100);
    text('State: ABOVE threshold', x, y);
    y += lineHeight;
    fill(255);
    text(`Animation: ${character.ani.name}`, x, y);
    y += lineHeight;
    text('Behavior: behaviour1()', x, y);
  } else {
    fill(255, 100, 100);
    text('State: BELOW threshold', x, y);
    y += lineHeight;
    fill(255);
    text(`Animation: ${character.ani.name}`, x, y);
    y += lineHeight;
    text('Behavior: behaviour2()', x, y);
  }
  y += lineHeight * 1.5;
  
  fill(200);
  textSize(11);
  text('Click: +10 health', x, y);
  y += lineHeight;
  text('Space: -10 health', x, y);
  
  pop();
}
