/*
GAZE-DRIVEN CHARACTER FLEEING
==============================

This example combines ML5 FaceMesh gaze detection with p5play sprite collision.
The character responds to where the user is looking - when the gaze "touches"
the character, they flee away and become tired. Low tiredness triggers a return home.

GAZE TRACKING SYSTEM:
- Uses ML5 FaceMesh to detect face keypoints (ears and nose)
- Calculates gaze position from face orientation
- Smoothing applied for stable tracking
- Visual gaze sphere shows where user is looking
- Gaze mapped to canvas coordinates for collision detection

FLEE BEHAVIOR:
- Gaze sphere collides with character → flee for 1 second
- Character moves away from gaze position at moveSpeed
- Flee timer prevents immediate re-collision
- Movement increases tiredness (tirednessBuildRate)
- Walk animation plays during fleeing

IDLE BEHAVIOR:
- When not colliding, character switches to idle animation
- Idle state decreases tiredness (tirednessRecoveryRate)
- Character stays in place while idle

RETURN-TO-CENTER BEHAVIOR:
- When tiredness drops below 25, character returns to center
- Return continues until reaching center (distance < 5 pixels)
- Walk animation plays during return
- Represents character "going home" when recharged

TIREDNESS SYSTEM:
- Tiredness: 0-100 scale tracking energy level
- Increases when walking (+0.3 per frame)
- Decreases when idle (-0.15 per frame)
- Affects animation speeds (tired = slower walk, faster breathing)
- Below 25 triggers return-to-center behavior

COLLISION DETECTION:
- Two sprites: character (visible) and gazeSphere (invisible)
- Both have collider = 'dynamic' for overlap detection
- Character diameter = 100px, gazeSphere diameter = 60px
- gazeSphere.overlaps(character) sets up collision relationship
- Collision checked every frame when fleeTimer = 0

VISUAL LAYERS:
1. Background and camera feed
2. Face tracking points (ears and nose)
3. Character sprite (automatic by p5play)
4. Debug collision visualizations
5. Gaze position circle
6. UI information overlay

INTERACTION:
- Tap anywhere to hide/show all UI except character
- Debug colliders toggle shows collision areas
- Camera and tracking points hidden with UI

KEY METHODS:
- ml5.faceMesh(): Face tracking with 468 keypoints
- cam.mapKeypoint(kp): Convert ML5 coords to canvas coords
- sprite.overlaps(other): Set up collision relationship
- sprite.overlapping(other): Check current collision state
- sprite.changeAni(name): Switch between idle/walk animations
- sprite.mirror.x: Flip sprite horizontally based on direction
- world.gravity.y = 0: Disable gravity for manual positioning

LIBRARIES REQUIRED:
- p5.js v1.11.4 (required for p5play v3 compatibility)
- ml5.js v1.x (FaceMesh face tracking)
- p5play v3 (sprite and collision system)
- p5-phone v1.6.2 (camera management and coordinate mapping)
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================

// Camera and Face Tracking
let cam;                     // PhoneCamera instance for front camera
let faceMesh;                // ML5 FaceMesh model instance
let faces = [];              // Array of detected faces
let showVideo = true;        // Toggle camera feed visibility

// Face Keypoint Indices (ML5 FaceMesh standard)
const LEFT_EAR_INDEX = 234;  // Left ear keypoint
const RIGHT_EAR_INDEX = 454; // Right ear keypoint
const NOSE_INDEX = 1;        // Nose tip keypoint

// Gaze Calculation Variables
let gazeX = 0;               // Calculated screen X position of gaze
let gazeY = 0;               // Calculated screen Y position of gaze
let gazeAngle = 0;           // Raw horizontal gaze angle
let smoothedGazeAngle = 0;   // Smoothed horizontal angle for stability
let gazeAngleY = 0;          // Raw vertical gaze angle
let smoothedGazeY = 0;       // Smoothed vertical position

// Gaze Calculation Parameters
const SMOOTHING_FACTOR = 0.4; // Gaze smoothing (0=none, 1=max)
const GAZE_RANGE_X = 1.5;     // Horizontal gaze range multiplier
const GAZE_RANGE_Y = 2.5;     // Vertical gaze range multiplier

// Sprite Objects
let character;               // Main animated character sprite
let gazeSphere;              // Invisible collision sprite at gaze position
let idleAni;                 // Idle animation sequence
let walkAni;                 // Walk animation sequence

// Tiredness System
let tiredness = 0;                    // Current tiredness level (0-100)
const TIREDNESS_BUILD_RATE = 0.3;     // Increase rate when moving
const TIREDNESS_RECOVERY_RATE = 0.15; // Decrease rate when idle
const RETURN_THRESHOLD = 25;          // Tiredness level to trigger return home

// Movement System
const BASE_MOVE_SPEED = 3.5;          // Base movement speed (pixels/frame)
let moveSpeed = BASE_MOVE_SPEED;      // Current movement speed (affected by tiredness)
const FLEE_DURATION = 60;             // Flee time in frames (1 sec at 60fps)
let fleeTimer = 0;                    // Current flee timer countdown
let isFleeingFromGaze = false;        // Flag: currently fleeing from gaze
let isReturningToCenter = false;      // Flag: returning to center position

// Animation Speed Controls
let walkFrameDelay = 4;      // Frames per walk animation frame
let idleFrameDelay = 8;      // Frames per idle animation frame

// Collision Parameters
const CHARACTER_DIAMETER = 100; // Character collision circle size
const GAZE_DIAMETER = 60;       // Gaze sphere collision circle size

// UI Controls
let showDebugColliders = false; // Show collision area visualizations
let hideUI = false;             // Hide all UI except character

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
// SETUP - Initialize everything once
// ==============================================
function setup() {
  // Create portrait canvas matching phone proportions (9:16 aspect ratio)
  createCanvas(405, 720);
  
  // Lock mobile gestures
  lockGestures();
  
  // Create front-facing camera, mirrored, fit to canvas height
  cam = createPhoneCamera('user', true, 'fitHeight');
  
  // Enable camera tap to toggle video
  enableCameraTap();
  
  // Initialize gaze position to center
  gazeX = width / 2;
  gazeY = height / 2;
  
  // Wait for camera to initialize, then create FaceMesh model
  cam.onReady(() => {
    // Configure ML5 FaceMesh
    let options = {
      maxFaces: 1,
      refineLandmarks: false,
      flipHorizontal: false  // PhoneCamera handles mirroring
    };
    
    // Create FaceMesh and start detection
    faceMesh = ml5.faceMesh(options, () => {
      faceMesh.detectStart(cam.videoElement, gotFaces);
    });
  });
  
  // Turn off gravity
  world.gravity.y = 0;
  
  // Initialize character sprite at center
  character = new Sprite(width / 2, height / 2);
  character.scale = 0.5;  // Smaller character
  
  // Configure sprite physics
  character.physics = 'kinematic';
  character.collider = 'dynamic';
  
  // Add animations to character
  character.addAni('idle', idleAni);
  character.addAni('walk', walkAni);
  
  // Set initial animation
  character.changeAni('idle');
  character.ani.frameDelay = idleFrameDelay;
  
  // Set collision diameter for character
  character.diameter = CHARACTER_DIAMETER;
  
  // Create invisible gaze sphere for collision detection
  gazeSphere = new Sprite(gazeX, gazeY, GAZE_DIAMETER);
  gazeSphere.physics = 'kinematic';
  gazeSphere.collider = 'dynamic';
  gazeSphere.visible = false;  // Don't show the sprite, just use for collision
  
  // Set up overlap relationship
  gazeSphere.overlaps(character);
}

// ==============================================
// DRAW - Main game loop
// ==============================================
function draw() {
  // LAYER 1: Background and camera
  background(220);
  
  // Display video feed if enabled and ready (hide if hideUI is true)
  if (!hideUI && showVideo && cam.ready) {
    image(cam, 0, 0);
  }
  
  // LAYER 2: Draw tracked points (ears and nose) - hide if hideUI is true
  if (!hideUI && faces.length > 0) {
    calculateGaze();
    drawTrackingPoints();
  } else if (hideUI && faces.length > 0) {
    // Still calculate gaze even when UI is hidden
    calculateGaze();
  }
  
  // Update gaze sphere position
  gazeSphere.x = gazeX;
  gazeSphere.y = gazeY;
  
  // Update tiredness based on movement (do this before behavior checks)
  updateTiredness();
  
  // Priority 1: Check if currently fleeing (timer active)
  if (fleeTimer > 0) {
    fleeTimer--;
    isReturningToCenter = false;
    // Continue fleeing until timer runs out
    fleeFromGaze();
  }
  // Priority 2: Check for new collision to start fleeing
  else if (gazeSphere.overlaps(character) || gazeSphere.overlapping(character)) {
    // Gaze is looking at character - start fleeing!
    isFleeingFromGaze = true;
    isReturningToCenter = false;
    fleeTimer = FLEE_DURATION;  // Reset timer
    fleeFromGaze();
  }
  // Priority 3: Continue returning to center if already started OR start if tiredness low
  else if (isReturningToCenter || tiredness < RETURN_THRESHOLD) {
    // Very low tiredness - return to center
    isFleeingFromGaze = false;
    returnToCenter();
  }
  // Priority 4: No collision, not returning - switch to idle
  else {
    // Gaze is not on character - switch to idle
    isFleeingFromGaze = false;
    isReturningToCenter = false;
    if (character.ani.name !== 'idle') {
      character.changeAni('idle');
    }
  }
  
  // Update animation speeds based on tiredness
  updateAnimationSpeeds();
  
  // LAYER 3: Sprites are drawn automatically by p5play here (always visible)
  
  // LAYER 4: Draw debug visualization on top of sprites (hide if hideUI is true)
  if (!hideUI && showDebugColliders) {
    drawDebugCollidersVisual();
  }
  
  // LAYER 5: Draw gaze circle on top (hide if hideUI is true)
  if (!hideUI) {
    drawGazeCircle();
  }
  
  // LAYER 6: Draw UI information (hide if hideUI is true)
  if (!hideUI) {
    drawUI();
  }
}

// ==============================================
// FACE DETECTION CALLBACK
// ==============================================
function gotFaces(results) {
  faces = results;
}

// ==============================================
// GAZE CALCULATION
// ==============================================
function calculateGaze() {
  // Get helper function to retrieve mapped keypoints
  let leftEarData = getKeypoint(LEFT_EAR_INDEX, 0);
  let rightEarData = getKeypoint(RIGHT_EAR_INDEX, 0);
  let noseData = getKeypoint(NOSE_INDEX, 0);
  
  // Skip if any points are invalid
  if (!leftEarData || !rightEarData || !noseData) return;
  
  // Get raw 3D keypoints (before mapping to canvas)
  let leftEarRaw = faces[0].keypoints[LEFT_EAR_INDEX];
  let rightEarRaw = faces[0].keypoints[RIGHT_EAR_INDEX];
  let noseRaw = faces[0].keypoints[NOSE_INDEX];
  
  // Calculate face width
  let faceWidth = abs(leftEarRaw.x - rightEarRaw.x);
  
  // Calculate center point between ears
  let earCenterX = (leftEarRaw.x + rightEarRaw.x) / 2;
  let earCenterY = (leftEarRaw.y + rightEarRaw.y) / 2;
  
  // Calculate nose offset from ear center
  let noseOffsetX = noseRaw.x - earCenterX;
  let noseOffsetY = noseRaw.y - earCenterY;
  
  // Normalize offsets by face width
  let normalizedOffsetX = noseOffsetX / faceWidth;
  
  // Calculate gaze angle
  gazeAngle = normalizedOffsetX;
  
  // Apply smoothing
  smoothedGazeAngle = lerp(smoothedGazeAngle, gazeAngle, 1 - SMOOTHING_FACTOR);
  
  // Calculate horizontal gaze position (invert for correct mirroring)
  gazeX = width / 2 - (smoothedGazeAngle * width * GAZE_RANGE_X);
  
  // Calculate vertical gaze
  gazeAngleY = noseOffsetY / faceWidth;
  smoothedGazeY = lerp(smoothedGazeY, gazeAngleY, 1 - SMOOTHING_FACTOR);
  gazeY = height / 2 + (smoothedGazeY * height * GAZE_RANGE_Y);
  
  // Constrain to screen bounds
  gazeX = constrain(gazeX, 0, width);
  gazeY = constrain(gazeY, 0, height);
}

// ==============================================
// HELPER - Get mapped keypoint
// ==============================================
function getKeypoint(index, faceIndex = 0) {
  if (faces.length === 0 || !faces[faceIndex]) return null;
  
  let kp = faces[faceIndex].keypoints[index];
  if (!kp) return null;
  
  // Use cam.mapKeypoint to handle mirroring and positioning
  return cam.mapKeypoint(kp);
}

// ==============================================
// CHARACTER BEHAVIOR
// ==============================================

/**
 * Flee From Gaze
 * 
 * Character moves away from gaze position when being looked at.
 * Direction is calculated as vector away from gaze sphere.
 */
function fleeFromGaze() {
  // Calculate vector from gaze to character (flee direction)
  let fleeX = character.x - gazeX;
  let fleeY = character.y - gazeY;
  
  // Normalize the vector
  let distance = dist(character.x, character.y, gazeX, gazeY);
  if (distance > 0) {
    fleeX = (fleeX / distance) * moveSpeed;
    fleeY = (fleeY / distance) * moveSpeed;
  }
  
  // Move character away from gaze
  character.x += fleeX;
  character.y += fleeY;
  
  // Keep character on screen
  character.x = constrain(character.x, 40, width - 40);
  character.y = constrain(character.y, 40, height - 40);
  
  // Switch to walk animation
  if (character.ani.name !== 'walk') {
    character.changeAni('walk');
  }
  
  // Mirror character based on movement direction
  if (fleeX < 0) {
    character.mirror.x = true;  // Moving left
  } else if (fleeX > 0) {
    character.mirror.x = false; // Moving right
  }
}

/**
 * Return To Center
 * 
 * Character returns to center when tiredness is very low (< 25).
 * This represents the character feeling recharged and going back home.
 */
function returnToCenter() {
  let centerX = width / 2;
  let centerY = height / 2;
  
  let distanceToCenter = dist(character.x, character.y, centerX, centerY);
  
  // Only move if not already at center
  if (distanceToCenter > 5) {
    // Mark that we're returning (prevents switching to idle mid-journey)
    isReturningToCenter = true;
    
    // Switch to walk animation only once when starting to return
    if (character.ani.name !== 'walk') {
      character.changeAni('walk');
    }
    
    // Calculate direction to center
    let dirX = centerX - character.x;
    let dirY = centerY - character.y;
    
    // Normalize and apply movement speed
    dirX = (dirX / distanceToCenter) * moveSpeed;
    dirY = (dirY / distanceToCenter) * moveSpeed;
    
    // Move toward center
    character.x += dirX;
    character.y += dirY;
    
    // Mirror based on direction
    if (dirX < 0) {
      character.mirror.x = true;
    } else if (dirX > 0) {
      character.mirror.x = false;
    }
  } else {
    // At center - finished returning
    isReturningToCenter = false;
    
    // Switch to idle only once
    if (character.ani.name !== 'idle') {
      character.changeAni('idle');
    }
  }
}

/**
 * Update Tiredness
 * 
 * Tiredness increases when character is moving (fleeing or returning).
 * Tiredness decreases when character is idle at center.
 */
function updateTiredness() {
  if (character.ani.name === 'walk') {
    // Moving - tiredness increases
    tiredness += TIREDNESS_BUILD_RATE;
  } else {
    // Idle - tiredness decreases
    tiredness -= TIREDNESS_RECOVERY_RATE;
  }
  
  // Keep tiredness in valid range
  tiredness = constrain(tiredness, 0, 100);
}

/**
 * Update Animation Speeds
 * 
 * Animation speed changes based on tiredness level.
 * More tired = slower walk, faster breathing
 */
function updateAnimationSpeeds() {
  // Walk animation: tired character walks slower
  walkFrameDelay = int(map(tiredness, 0, 100, 2, 12));
  
  // Idle animation: tired character breathes faster
  idleFrameDelay = int(map(tiredness, 0, 100, 12, 4));
  
  // Apply frame delay to current animation
  if (character.ani.name === 'walk') {
    character.ani.frameDelay = walkFrameDelay;
  } else {
    character.ani.frameDelay = idleFrameDelay;
  }
  
  // Update movement speed based on tiredness
  moveSpeed = map(tiredness, 0, 100, 3.0, 0.9);
}

// ==============================================
// VISUALIZATION
// ==============================================

/**
 * Draw Tracking Points
 * 
 * Draws ear and nose tracking points from face detection
 */
function drawTrackingPoints() {
  let leftEarData = getKeypoint(LEFT_EAR_INDEX, 0);
  let rightEarData = getKeypoint(RIGHT_EAR_INDEX, 0);
  let noseData = getKeypoint(NOSE_INDEX, 0);
  
  if (!leftEarData || !rightEarData || !noseData) return;
  
  push();
  
  // Draw ear points (red)
  fill(255, 0, 0);
  noStroke();
  circle(leftEarData.x, leftEarData.y, 15);
  circle(rightEarData.x, rightEarData.y, 15);
  
  // Draw nose point (green)
  fill(100, 255, 100);
  circle(noseData.x, noseData.y, 20);
  
  pop();
}

/**
 * Draw Gaze Circle
 * 
 * Draws the gaze position sphere and crosshair
 */
function drawGazeCircle() {
  push();
  
  // Draw gaze position sphere
  // Color changes if colliding with character
  if (gazeSphere.overlaps(character) || gazeSphere.overlapping(character)) {
    fill(255, 100, 100, 150);  // Red when colliding
  } else {
    fill(100, 200, 255, 150);  // Blue when not colliding
  }
  stroke(255, 200);
  strokeWeight(3);
  circle(gazeX, gazeY, 60);
  
  // Draw crosshair at gaze position
  stroke(255, 150);
  strokeWeight(2);
  line(gazeX - 15, gazeY, gazeX + 15, gazeY);
  line(gazeX, gazeY - 15, gazeX, gazeY + 15);
  
  pop();
}

/**
 * Draw Debug Colliders Visual
 * 
 * Visualizes collision area for gaze sphere only
 * Character collider is not shown (sprite rendering issue)
 */
function drawDebugCollidersVisual() {
  push();
  
  // Draw gaze sphere collision circle (bright yellow with semi-transparent fill)
  fill(255, 255, 0, 30);  // Semi-transparent yellow fill
  stroke(255, 255, 0);
  strokeWeight(5);
  circle(gazeSphere.x, gazeSphere.y, gazeSphere.diameter);
  
  // Add label for gaze collider
  fill(255, 255, 0);
  stroke(0);
  strokeWeight(3);
  textAlign(CENTER);
  textSize(14);
  text(`Gaze: ${gazeSphere.diameter}px`, gazeSphere.x, gazeSphere.y + gazeSphere.diameter/2 + 25);
  
  pop();
}

/**
 * Draw UI Information
 * 
 * Displays debug information about character state
 */
function drawUI() {
  push();
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  
  // Display tiredness
  text(`Tiredness: ${nf(tiredness, 1, 1)}`, 10, 10);
  
  // Display state
  let state = isFleeingFromGaze ? "FLEEING!" : "CALM";
  text(`State: ${state}`, 10, 30);
  
  // Display position
  text(`Char: (${int(character.x)}, ${int(character.y)})`, 10, 50);
  text(`Gaze: (${int(gazeX)}, ${int(gazeY)})`, 10, 70);
  
  // Instructions
  textSize(14);
  fill(255, 220);
  text('Look at character to make them flee', 10, height - 40);
  text('Tap anywhere to hide UI', 10, height - 20);
  
  pop();
}

// ==============================================
// INPUT HANDLERS
// ==============================================

/**
 * Touch Started Handler
 * 
 * Toggle hideUI - tap anywhere to hide/show all UI elements except character
 */
function touchStarted() {
  // Toggle hideUI on any tap
  hideUI = !hideUI;
  
  return false;  // Prevent default behavior
}

/**
 * Touch Ended Handler
 */
function touchEnded() {
  return false;
}

/**
 * Mouse Pressed Handler (for desktop testing)
 * 
 * Toggle hideUI on any click
 */
function mousePressed() {
  hideUI = !hideUI;
}
