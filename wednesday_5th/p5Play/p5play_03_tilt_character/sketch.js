/*
==============================================
p5play Tilt Character - Depth Simulation
==============================================

DESCRIPTION:
Control a character using device tilt to create an illusion of 3D depth.
The character moves forward and backward in space, growing larger as it
approaches (bottom of screen) and smaller as it moves away (top of screen).

TILT CONTROLS:
- Tilt forward (phone tilted toward you): Character walks closer (toward bottom)
- Neutral position: Character stands idle
- Tilt backward (phone tilted away): Character walks away (toward top)

DEPTH SIMULATION:
- Character starts tiny at top of screen (far away in distance)
- Character scales dynamically based on Y position
- Character becomes very large at bottom (right in front of you)
- Perspective lines create visual depth cues
- Reaches idle state when arriving at bottom boundary

VISUAL ELEMENTS:
- 3D perspective corridor with converging lines
- Dynamic character scaling (0.05x to 1.5x)
- Automatic animation switching (walk/idle)
- Character mirrors when walking backward

KEY p5-phone METHODS:
- rotationX: Device tilt forward/backward (-180° to 180°)
- enableGyroTap(message): Tap anywhere to enable motion sensors
- window.sensorsEnabled: Boolean status of sensor permissions

KEY p5play METHODS:
- sprite.changeAni(name): Switch between animations
- sprite.mirror.x: Flip sprite horizontally
- sprite.scale: Control sprite size
- sprite.ani.frameDelay: Control animation speed

LIBRARIES REQUIRED:
- p5.js v1.11.4
- p5play v3
- p5-phone v1.6.1
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================

// Sprite and Animations
let character;               // The animated sprite object
let idleAni;                 // Idle animation (breathing, stationary)
let walkAni;                 // Walk forward animation (toward viewer)
let walkBackAni;             // Walk backward animation (away from viewer)

// Motion Sensor Controls
let tiltThreshold = 15;      // Tilt angle threshold in degrees (>15° triggers movement)
let moveSpeed = 0.3;         // Vertical movement speed in pixels per frame

// Depth Simulation System
let minScale = 0.05;         // Character scale at top (far away, tiny)
let maxScale = 1.5;          // Character scale at bottom (close up, large)
let minY = 100;              // Top boundary - farthest distance
let maxY;                    // Bottom boundary - closest distance (set in setup)

// Animation Speed Controls
let walkFrameDelay = 4;      // Walk animation frame delay (lower = faster)
let idleFrameDelay = 8;      // Idle animation frame delay (slow breathing)

// ==============================================
// PRELOAD - Load animations before setup
// ==============================================
function preload() {
  // Load idle animation sequence (9 frames)
  idleAni = loadAni('animations/idle/idleAnim_1.png', 9);
  
  // Load walk forward animation sequence (13 frames)
  walkAni = loadAni('animations/walk/walkAnim_1.png', 13);
  
  // Load walk backward animation sequence (13 frames)
  walkBackAni = loadAni('animations/walkBack/walkAnimBack_1.png', 13);
}

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  // Enable debug panel to view errors on mobile (uncomment if needed)
  // showDebug();
  
  // Create portrait canvas matching phone proportions (9:16 aspect ratio)
  createCanvas(405, 720);
  
  // Set bottom boundary (character's closest position)
  maxY = height - 150;
  
  // Enable device motion sensors with tap-to-start prompt
  // User must tap screen to grant sensor permissions
  enableGyroTap('Tap to enable motion sensors');
  
  // Initialize character sprite at top center (far away position)
  character = new Sprite(width / 2, minY);
  character.scale = minScale;  // Start tiny (simulates distance)
  
  // Configure sprite physics
  // 'kinematic' = manual position control, no gravity or physics simulation
  character.physics = 'kinematic';
  
  // Add all three animations to the sprite with names for switching
  character.addAni('idle', idleAni);
  character.addAni('walk', walkAni);
  character.addAni('walkBack', walkBackAni);
  
  // Set initial animation state
  character.changeAni('idle');
  character.ani.frameDelay = idleFrameDelay;
}

// ==============================================
// DRAW - Main game loop (runs continuously at 60fps)
// ==============================================
function draw() {
  // Clear background with sky blue color
  background(100, 150, 200);
  
  // Step 1: Check if motion sensors are active and have permissions
  if (window.sensorsEnabled) {
    // Get current device tilt angle (forward/backward motion)
    let tilt = rotationX;
    
    // Step 2: Determine character movement based on tilt angle
    if (tilt > tiltThreshold) {
      // DEVICE TILTED FORWARD
      // Character walks toward viewer (down screen, getting larger)
      moveCharacterDown();
      
    } else if (tilt < -tiltThreshold) {
      // DEVICE TILTED BACKWARD
      // Character walks away from viewer (up screen, getting smaller)
      moveCharacterUp();
      
    } else {
      // DEVICE NEUTRAL (within threshold range)
      // Character stands idle
      stopCharacter();
    }
    
  } else {
    // Sensors not yet enabled - keep character idle
    stopCharacter();
  }
  
  // Step 3: Update character scale to simulate depth
  updateDepthScale();
  
  // Step 4: Keep character within defined boundaries
  character.y = constrain(character.y, minY, maxY);
  
  // Step 5: Draw perspective lines and visual elements
  drawPerspective();
}

// ==============================================
// MOVEMENT FUNCTIONS
// ==============================================

/**
 * Move Character Toward Bottom (Walking Forward)
 * 
 * This function makes the character walk DOWN the screen toward the viewer.
 * As Y increases, the character appears to get closer (simulated by scale).
 * Character faces forward (mirror.x = false means no flip).
 * Stops automatically when reaching the bottom boundary (maxY).
 */
function moveCharacterDown() {
  // Boundary check: Stop movement if character reached bottom
  if (character.y >= maxY) {
    // At bottom - switch to idle even if device still tilted
    stopCharacter();
    return;
  }
  
  // Move character down screen (increasing Y position)
  character.y += moveSpeed;
  
  // Optimization: Only switch animation if not already walking
  if (character.ani.name !== 'walk') {
    character.changeAni('walk');
    character.ani.frameDelay = walkFrameDelay;
  }
  
  // Set direction: Face forward (toward viewer)
  character.mirror.x = false;
}

/**
 * Move Character Toward Top (Walking Away)
 * 
 * This function makes the character walk UP the screen away from the viewer.
 * As Y decreases, the character appears to get farther (simulated by scale).
 * Uses dedicated walkBack animation showing back-facing view.
 */
function moveCharacterUp() {
  // Move character up screen (decreasing Y position)
  character.y -= moveSpeed;
  
  // Optimization: Only switch animation if not already walking backward
  if (character.ani.name !== 'walkBack') {
    character.changeAni('walkBack');
    character.ani.frameDelay = walkFrameDelay;
  }
  
  // No mirroring needed - walkBack animation shows proper back-facing view
  character.mirror.x = false;
}

/**
 * Stop Character (Idle State)
 * 
 * This function switches the character to idle/standing animation.
 * Used when device is neutral (not tilted) or when hitting boundaries.
 */
function stopCharacter() {
  // Clear any velocity (safety measure for kinematic physics)
  character.vel.x = 0;
  character.vel.y = 0;
  
  // Optimization: Only switch animation if not already idle
  if (character.ani.name !== 'idle') {
    character.changeAni('idle');
    character.ani.frameDelay = idleFrameDelay;
  }
  
  // Reset direction: Face forward
  character.mirror.x = false;
}

// ==============================================
// DEPTH SCALE SYSTEM
// ==============================================

/**
 * Update Depth Scale
 * 
 * This function creates the illusion of 3D depth by changing the character's
 * size based on vertical position. Objects farther away (top) appear smaller,
 * while objects closer (bottom) appear larger.
 * 
 * The scale ranges from 0.05 (tiny/far) to 1.5 (large/close).
 */
function updateDepthScale() {
  // Calculate scale based on Y position using linear mapping
  // minY (top) → minScale (0.05 = tiny, far away)
  // maxY (bottom) → maxScale (1.5 = large, close up)
  let newScale = map(character.y, minY, maxY, minScale, maxScale);
  
  // Apply calculated scale to character sprite
  character.scale = newScale;
}

// ==============================================
// VISUAL ELEMENTS - Draw perspective corridor
// ==============================================

/**
 * Draw Perspective Corridor
 * 
 * Creates a simple 3D corridor effect using 4 lines that form walls
 * and a back boundary. This helps reinforce the depth illusion.
 * 
 * Visual Structure:
 * - 2 angled lines from bottom corners converge toward top center
 * - 1 horizontal line at back connects the converging lines
 * - 2 vertical lines extend from back to top of canvas (walls)
 */
function drawPerspective() {
  // Start drawing context with semi-transparent white lines
  push();
  stroke(255, 150);  // White with 150 alpha (semi-transparent)
  strokeWeight(2);
  
  // LEFT GROUND/WALL LINE
  // Starts at bottom-left corner, angles toward upper-center (40% width)
  // Creates converging perspective effect
  line(0, height, width * 0.4, minY);
  
  // RIGHT GROUND/WALL LINE
  // Starts at bottom-right corner, angles toward upper-center (60% width)
  // Mirrors left line to complete perspective convergence
  line(width, height, width * 0.6, minY);
  
  // BACK WALL HORIZONTAL LINE
  // Connects the two angled lines at minY (back boundary)
  // Forms the "back wall" of the corridor
  line(width * 0.4, minY, width * 0.6, minY);
  
  // LEFT VERTICAL WALL
  // Extends from back wall connection point to top of canvas
  // Forms left side of corridor
  line(width * 0.4, minY, width * 0.4, 0);
  
  // RIGHT VERTICAL WALL
  // Extends from back wall connection point to top of canvas
  // Forms right side of corridor
  line(width * 0.6, minY, width * 0.6, 0);
  
  pop();  // Restore drawing context
}

// ==============================================
// TOUCH EVENT HANDLERS - Prevent default browser behavior
// ==============================================

/**
 * Touch Started Handler
 * 
 * Prevents default mobile browser behavior like scrolling, zooming, or
 * refresh gestures. This ensures the canvas responds only to intentional
 * interactions and sensor input.
 */
function touchStarted() {
  return false;  // Returning false prevents default behavior
}

/**
 * Touch Ended Handler
 * 
 * Prevents default mobile browser behavior when touch is released.
 * Ensures consistent interaction experience across devices.
 */
function touchEnded() {
  return false;  // Returning false prevents default behavior
}
