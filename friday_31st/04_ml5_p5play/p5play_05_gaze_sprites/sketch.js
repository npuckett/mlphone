/*
p5play + FaceMesh Gaze Interaction

This example combines:
- ML5 FaceMesh gaze detection (based on PHONE_FaceMesh_gesture_detection)
- p5play sprite that follows gaze position

How it works:
- Tracks ears and nose to calculate gaze position
- Single sprite follows the gaze smoothly
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================

// Camera and ML5
let cam;                // PhoneCamera instance
let faceMesh;           // ML5 FaceMesh model
let faces = [];         // Detected faces
let showVideo = true;   // Toggle video display

// Face tracking points
let leftEarIndex = 234;    // Left ear keypoint
let rightEarIndex = 454;   // Right ear keypoint
let noseIndex = 1;         // Nose bridge

let leftEarData = null;
let rightEarData = null;
let noseData = null;

// Gaze position
let gazeX = 0;
let gazeY = 0;

// TUNABLE PARAMETERS
let SMOOTHING_FACTOR = 0.4;
let GAZE_RANGE_X = 1.5;
let GAZE_RANGE_Y = 2.5;

// p5play sprites
let gazeSprite;      // Sprite controlled by gaze
let targetSprites;   // Group of interactive sprites

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  // Create portrait canvas (typical phone proportions: 9:16)
  createCanvas(405, 720);
  lockGestures();  // Prevent phone gestures (zoom, refresh)
  
  // Create camera: front camera, mirrored, fit to canvas height
  cam = createPhoneCamera('user', true, 'fitHeight');
  
  // Enable camera tap to toggle video
  enableCameraTap();
  
  // Wait for camera to initialize, then create model and start detection
  cam.onReady(() => {
    // Configure ML5 FaceMesh AFTER camera is ready
    let options = {
      maxFaces: 1,           // Only detect 1 face
      refineLandmarks: false, // Faster without refinement
      flipHorizontal: false  // Don't flip in ML5 - cam.mapKeypoint() handles mirroring
    };
    
    // Create FaceMesh model and start detection when ready
    faceMesh = ml5.faceMesh(options, () => {
      faceMesh.detectStart(cam.videoElement, gotFaces);
    });
  });
  
  // Turn off gravity
  world.gravity.y = 0;
  
  // Create gaze sprite
  gazeSprite = new Sprite();
  gazeSprite.diameter = 50;
  gazeSprite.color = 'yellow';
  gazeSprite.physics = 'kinematic';
  gazeSprite.collider = 'dynamic';
  gazeSprite.x = width / 2;
  gazeSprite.y = height / 2;
  
  // Create target sprites scattered around screen
  targetSprites = new Group();
  targetSprites.diameter = 40;
  targetSprites.physics = 'kinematic';
  targetSprites.collider = 'dynamic';
  
  let colors = ['red', 'blue', 'green', 'purple', 'orange', 'cyan', 'magenta', 'lime'];
  
  // Create 12 target sprites at random positions
  for (let i = 0; i < 12; i++) {
    let target = new targetSprites.Sprite();
    target.x = random(50, width - 50);
    target.y = random(100, height - 100);
    target.color = colors[i % colors.length];
    target.originalColor = target.color;
    target.scale = 1.0;
  }
  
  // Set up overlap relationship
  gazeSprite.overlaps(targetSprites);
}

// ==============================================
// DRAW - Runs continuously
// ==============================================
function draw() {
  background(220);
  
  // Display video feed
  if (showVideo && cam.ready) {
    image(cam, 0, 0);  // PhoneCamera handles positioning and mirroring
  }
  
  // Default gaze position (center)
  let targetX = width / 2;
  let targetY = height / 2;
  
  // Process face data if detected
  if (faces.length > 0) {
    leftEarData = getKeypoint(leftEarIndex, 0);
    rightEarData = getKeypoint(rightEarIndex, 0);
    noseData = getKeypoint(noseIndex, 0);
    
    if (leftEarData && rightEarData && noseData) {
      calculateGaze();
      targetX = gazeX;
      targetY = gazeY;
      
      // Draw tracking points
      push();
      noStroke();
      fill(255, 0, 0, 150);
      circle(leftEarData.x, leftEarData.y, 15);
      circle(rightEarData.x, rightEarData.y, 15);
      fill(0, 255, 0, 150);
      circle(noseData.x, noseData.y, 18);
      pop();
    }
  }
  
  // Move gaze sprite to target position using velocity
  let dx = targetX - gazeSprite.x;
  let dy = targetY - gazeSprite.y;
  gazeSprite.vel.x = dx * 0.3;
  gazeSprite.vel.y = dy * 0.3;
  
  // Check for overlaps with target sprites
  for (let target of targetSprites) {
    if (gazeSprite.overlaps(target)) {
      // React to gaze: change color and scale
      target.color = 'white';
      target.scale = 1.5;
    } else if (gazeSprite.overlapping(target)) {
      // Continue reaction while overlapping
      target.color = 'white';
      target.scale = 1.5;
    } else {
      // Return to original state
      target.color = target.originalColor;
      target.scale = lerp(target.scale, 1.0, 0.1);
    }
  }
}

// ==============================================
// GAZE CALCULATION
// ==============================================
function calculateGaze() {
  // Get raw 3D keypoints
  let leftEarRaw = faces[0].keypoints[leftEarIndex];
  let rightEarRaw = faces[0].keypoints[rightEarIndex];
  let noseRaw = faces[0].keypoints[noseIndex];
  
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
  let normalizedOffsetY = noseOffsetY / faceWidth;
  
  // Apply smoothing
  let smoothedX = lerp(gazeX, width / 2 - (normalizedOffsetX * width * GAZE_RANGE_X), 1 - SMOOTHING_FACTOR);
  let smoothedY = lerp(gazeY, height / 2 + (normalizedOffsetY * height * GAZE_RANGE_Y), 1 - SMOOTHING_FACTOR);
  
  // Set gaze position
  gazeX = constrain(smoothedX, 0, width);
  gazeY = constrain(smoothedY, 0, height);
}

// ==============================================
// CALLBACK - When faces are detected
// ==============================================
function gotFaces(results) {
  faces = results;
  if (faces.length > 0) {
    console.log('Face detected! Keypoints:', faces[0].keypoints.length);
  }
}

// ==============================================
// HELPER FUNCTION - Get keypoint with error checking
// ==============================================
function getKeypoint(index, faceNumber = 0) {
  if (!faces || faces.length === 0) return null;
  if (faceNumber >= faces.length) return null;
  if (!faces[faceNumber].keypoints) return null;
  if (index >= faces[faceNumber].keypoints.length) return null;
  
  let keypoint = faces[faceNumber].keypoints[index];
  let mapped = cam.mapKeypoint(keypoint);
  
  return mapped;
}

// ==============================================
// INTERACTION - Toggle video with tap
// ==============================================
function mousePressed() {
  showVideo = !showVideo;
}
