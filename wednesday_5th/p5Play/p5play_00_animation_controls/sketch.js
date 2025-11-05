/*
==============================================
p5play Animation Controls - Interactive Demo
==============================================

DESCRIPTION:
A simple interactive demo to explore p5play animations.
Character stays in the center while you control the animation
and speed with buttons and a slider.

CONTROLS:
- Idle Button: Switch to idle (breathing) animation
- Walk Button: Switch to walk animation
- Speed Slider: Adjust animation playback speed (frameDelay)

KEY CONCEPTS:
- frameDelay controls animation speed (lower = faster)
- changeAni() switches between different animations
- Animations loop automatically by default

LIBRARIES REQUIRED:
- p5.js v1.11.4
- p5play v3
- p5-phone v1.6.1
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================

// Sprite and Animations
let character;        // The animated sprite
let idleAni;          // Idle animation (breathing)
let walkAni;          // Walk animation (locomotion)

// UI Controls
let idleButton;       // Button to switch to idle animation
let walkButton;       // Button to switch to walk animation
let speedSlider;      // Slider to control animation speed
let speedLabel;       // Label for slider

// Animation Speed Settings
let minFrameDelay = 1;   // Fastest animation speed
let maxFrameDelay = 20;  // Slowest animation speed
let defaultFrameDelay = 8; // Default starting speed

// ==============================================
// PRELOAD - Load animations before setup
// ==============================================
function preload() {
  // Load idle animation sequence (9 frames)
  idleAni = loadAni('animations/idle/idleAnim_1.png', 9);
  
  // Load walk animation sequence (13 frames)
  walkAni = loadAni('animations/walk/walkAnim_1.png', 13);
}

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  // Create portrait canvas matching phone proportions (9:16 aspect ratio)
  createCanvas(405, 720);
  
  // Note: NOT using lockGestures() so slider can work properly
  
  // Create character sprite at center of canvas (position slightly higher)
  character = new Sprite(width / 2, height / 2 - 50);
  character.scale = 0.5;  // Make character larger
  
  // Configure sprite physics
  // 'kinematic' = manual control, not affected by gravity
  character.physics = 'kinematic';
  
  // Add both animations to the sprite
  character.addAni('idle', idleAni);
  character.addAni('walk', walkAni);
  
  // Start with idle animation
  character.changeAni('idle');
  character.ani.frameDelay = defaultFrameDelay;
  
  // Create UI controls
  createControls();
}

// ==============================================
// CREATE UI CONTROLS
// ==============================================
function createControls() {
  // Position controls below the canvas
  let canvasX = (windowWidth - width) / 2; // Calculate canvas offset
  let controlY = height + 20; // Position below canvas (20px gap)
  let buttonWidth = 100;
  let buttonHeight = 40;
  let buttonSpacing = 20;
  
  // Create Idle button (left side)
  idleButton = createButton('Idle');
  idleButton.position(canvasX + (width / 2) - buttonWidth - (buttonSpacing / 2), controlY);
  idleButton.size(buttonWidth, buttonHeight);
  idleButton.mousePressed(switchToIdle);
  styleButton(idleButton);
  
  // Create Walk button (right side)
  walkButton = createButton('Walk');
  walkButton.position(canvasX + (width / 2) + (buttonSpacing / 2), controlY);
  walkButton.size(buttonWidth, buttonHeight);
  walkButton.mousePressed(switchToWalk);
  styleButton(walkButton);
  
  // Create Speed label
  speedLabel = createP('Frame Delay');
  speedLabel.position(canvasX + width / 2 - 60, controlY + 55);
  speedLabel.style('color', 'white');
  speedLabel.style('font-size', '14px');
  speedLabel.style('font-family', 'Arial');
  speedLabel.style('margin', '5px 0');
  
  // Create Speed slider
  speedSlider = createSlider(minFrameDelay, maxFrameDelay, defaultFrameDelay, 1);
  speedSlider.position(canvasX + width / 2 - 100, controlY + 95);
  speedSlider.size(200);
}

// ==============================================
// STYLE BUTTON HELPER
// ==============================================
function styleButton(button) {
  button.style('background-color', '#3498db');
  button.style('color', 'white');
  button.style('border', 'none');
  button.style('border-radius', '5px');
  button.style('font-size', '16px');
  button.style('font-weight', 'bold');
  button.style('cursor', 'pointer');
  button.style('font-family', 'Arial');
  
  // Hover effect
  button.mouseOver(() => button.style('background-color', '#2980b9'));
  button.mouseOut(() => button.style('background-color', '#3498db'));
}

// ==============================================
// BUTTON CALLBACKS
// ==============================================
function switchToIdle() {
  // Switch to idle animation
  character.changeAni('idle');
}

function switchToWalk() {
  // Switch to walk animation
  character.changeAni('walk');
}

// ==============================================
// DRAW - Main game loop (runs continuously at 60fps)
// ==============================================
function draw() {
  // Clear background
  background(100, 150, 200);
  
  // Keep character centered (in case it somehow moves)
  character.x = width / 2;
  character.y = height / 2 - 50; // Keep character positioned higher
  character.vel.x = 0;
  character.vel.y = 0;
  
  // Update animation speed from slider every frame
  // This ensures the slider works continuously
  character.ani.frameDelay = speedSlider.value();
  
  // Draw UI information
  drawUI();
}

// ==============================================
// HELPER - Draw UI information
// ==============================================
function drawUI() {
  push();
  fill(255);
  noStroke();
  textSize(18);
  textAlign(CENTER, TOP);
  
  // Title
  text('Animation Controller', width / 2, 20);
  
  // Current animation display
  textSize(16);
  text(`Current: ${character.ani.name}`, width / 2, 50);
  
  // Frame delay display
  text(`Speed: ${character.ani.frameDelay} frames/delay`, width / 2, 75);
  
  // Instructions
  textSize(14);
  text('Lower speed = Faster animation', width / 2, 100);
  text('Higher speed = Slower animation', width / 2, 120);
  
  pop();
}
