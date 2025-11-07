/*
ML5 FaceMesh Gaze Detection (3D)

This script uses ML5 FaceMesh 3D keypoints to detect gaze direction.
It uses the Z-axis (depth) values of the nose and ears to determine
which direction the person is facing.

Gaze Detection Method:
- Use 3D keypoints with x, y, z coordinates
- Compare nose Z value to ears Z values
- If nose Z is significantly different from ears → head is turned
- Calculate horizontal angle using nose X position and ear center

Key Variables:
- GAZE_Z_THRESHOLD: Z-axis difference threshold for depth-based detection
- GAZE_X_THRESHOLD: X-axis threshold for horizontal gaze
- SMOOTHING_FACTOR: Smoothing for stability (0-1)

Tunable Parameters:
- GAZE_Z_THRESHOLD: Adjust Z-axis sensitivity (5-30)
- GAZE_X_THRESHOLD: Adjust X-axis sensitivity (10-50)
- SMOOTHING_FACTOR: Adjust responsiveness (0.1-0.7)
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================
let cam;                // PhoneCamera instance
let faceMesh;           // ML5 FaceMesh model
let faces = [];         // Detected faces
let showVideo = true;   // Toggle video display

// Face tracking points (using 3D keypoints)
let leftEarIndex = 234;    // Left ear keypoint
let rightEarIndex = 454;   // Right ear keypoint
let noseIndex = 1;         // Nose bridge (more stable than tip)

let leftEarData = null;
let rightEarData = null;
let noseData = null;

// Gaze detection variables
let gazeDirection = "CENTER";  // Current gaze direction: "LEFT", "CENTER", "RIGHT"
let gazeAngle = 0;             // Calculated gaze angle
let smoothedGazeAngle = 0;     // Smoothed version for stability

// Gaze position on screen
let gazeX = 0;                 // Screen X position where user is looking
let gazeY = 0;                 // Screen Y position where user is looking
let gazeAngleY = 0;            // Vertical gaze angle
let smoothedGazeY = 0;         // Smoothed Y position

// TUNABLE PARAMETERS
let GAZE_Z_THRESHOLD = 15;     // Z-axis threshold for depth detection (adjust 5-30)
let GAZE_X_THRESHOLD = 0.15;   // X-axis threshold as ratio of face width (adjust 0.1-0.3)
let SMOOTHING_FACTOR = 0.4;    // Smoothing amount 0-1 (0=no smooth, 1=max smooth)
let GAZE_RANGE_X = 1.5;        // How far gaze extends horizontally (adjust 1.0-3.0)
let GAZE_RANGE_Y = 2.5;        // How far gaze extends vertically (adjust 1.0-4.0)

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
}

// ==============================================
// DRAW - Runs continuously
// ==============================================
function draw() {
  background(220);
  
  // Display the video feed
  if (showVideo && cam.ready) {
    image(cam, 0, 0);  // PhoneCamera handles positioning and mirroring
  }
  
  // Process face data if detected
  if (faces.length > 0) {
    // Get keypoint data
    leftEarData = getKeypoint(leftEarIndex, 0);
    rightEarData = getKeypoint(rightEarIndex, 0);
    noseData = getKeypoint(noseIndex, 0);
    
    // If all points are valid, calculate gaze
    if (leftEarData && rightEarData && noseData) {
      calculateGaze();
      visualizeGaze();
    }
  } else {
    // Reset when no face detected
    gazeDirection = "CENTER";
    smoothedGazeOffset = 0;
  }
  
  // Display UI
  drawUI();
}

// ==============================================
// GAZE CALCULATION
// ==============================================
function calculateGaze() {
  // Get the raw 3D keypoints (before mapping)
  let leftEarRaw = faces[0].keypoints[leftEarIndex];
  let rightEarRaw = faces[0].keypoints[rightEarIndex];
  let noseRaw = faces[0].keypoints[noseIndex];
  
  // Calculate face width (distance between ears)
  let faceWidth = abs(leftEarRaw.x - rightEarRaw.x);
  
  // Calculate center point between ears (in 3D space)
  let earCenterX = (leftEarRaw.x + rightEarRaw.x) / 2;
  let earCenterY = (leftEarRaw.y + rightEarRaw.y) / 2;
  let earCenterZ = (leftEarRaw.z + rightEarRaw.z) / 2;
  
  // Calculate nose offset from ear center
  let noseOffsetX = noseRaw.x - earCenterX;
  let noseOffsetZ = noseRaw.z - earCenterZ;
  
  // Normalize X offset by face width
  let normalizedOffsetX = noseOffsetX / faceWidth;
  
  // Calculate gaze angle using both X and Z
  // Z offset indicates head rotation depth
  gazeAngle = normalizedOffsetX;
  
  // Apply smoothing to reduce jitter
  smoothedGazeAngle = lerp(smoothedGazeAngle, gazeAngle, 1 - SMOOTHING_FACTOR);
  
  // Determine gaze direction based on threshold
  if (smoothedGazeAngle < -GAZE_X_THRESHOLD) {
    gazeDirection = "LEFT";
  } else if (smoothedGazeAngle > GAZE_X_THRESHOLD) {
    gazeDirection = "RIGHT";
  } else {
    gazeDirection = "CENTER";
  }
  
  // Calculate gaze position on screen
  
  // HORIZONTAL (X): Map smoothed gaze angle to screen coordinates
  // Invert the direction to fix mirroring (negate the angle)
  gazeX = width / 2 - (smoothedGazeAngle * width * GAZE_RANGE_X);
  
  // VERTICAL (Y): Calculate based on nose position relative to ear center
  let noseOffsetY = noseRaw.y - earCenterY;
  let faceHeight = abs(noseRaw.y - earCenterY); // Approximate face height
  
  // Normalize Y offset and apply to screen space
  gazeAngleY = noseOffsetY / faceWidth; // Normalize by face width for consistency
  smoothedGazeY = lerp(smoothedGazeY, gazeAngleY, 1 - SMOOTHING_FACTOR);
  
  // Map to screen coordinates (invert Y since canvas Y increases downward)
  gazeY = height / 2 + (smoothedGazeY * height * GAZE_RANGE_Y);
  
  // Constrain to screen bounds
  gazeX = constrain(gazeX, 0, width);
  gazeY = constrain(gazeY, 0, height);
}

// ==============================================
// VISUALIZATION
// ==============================================
function visualizeGaze() {
  push();
  
  // Draw ear points (red)
  fill(255, 0, 0);
  noStroke();
  circle(leftEarData.x, leftEarData.y, 20);
  circle(rightEarData.x, rightEarData.y, 20);
  
  // Draw nose point (color based on gaze direction)
  if (gazeDirection === "LEFT") {
    fill(255, 100, 100);
  } else if (gazeDirection === "RIGHT") {
    fill(100, 100, 255);
  } else {
    fill(100, 255, 100);
  }
  circle(noseData.x, noseData.y, 25);
  
  // Draw gaze position circle
  // Color based on direction with transparency
  if (gazeDirection === "LEFT") {
    fill(255, 100, 100, 150);
  } else if (gazeDirection === "RIGHT") {
    fill(100, 100, 255, 150);
  } else {
    fill(100, 255, 100, 150);
  }
  stroke(255, 200);
  strokeWeight(3);
  circle(gazeX, gazeY, 60);
  
  // Draw crosshair at gaze position
  stroke(255, 255, 0, 200);
  strokeWeight(2);
  line(gazeX - 15, gazeY, gazeX + 15, gazeY);
  line(gazeX, gazeY - 15, gazeX, gazeY + 15);
  
  pop();
}

// ==============================================
// UI - Minimal display
// ==============================================
function drawUI() {
  // No UI elements - only the keypoints are drawn
}

// ==============================================
// CALLBACK - When faces are detected
// ==============================================
function gotFaces(results) {
  faces = results;
}

// ==============================================
// HELPER FUNCTION - Get keypoint with error checking
// ==============================================
function getKeypoint(index, faceNumber = 0) {
  // Check if we have faces detected
  if (!faces || faces.length === 0) return null;
  
  // Check if the requested face exists
  if (faceNumber >= faces.length) return null;
  
  // Check if keypoints exist for this face
  if (!faces[faceNumber].keypoints) return null;
  
  // Check if the requested keypoint index exists
  if (index >= faces[faceNumber].keypoints.length) return null;
  
  // Get the keypoint data
  let keypoint = faces[faceNumber].keypoints[index];
  
  // Map the coordinates using PhoneCamera
  // This handles mirroring and scaling automatically
  let mapped = cam.mapKeypoint(keypoint);
  
  return mapped;
}

// ==============================================
// EXPOSE GAZE DATA - Global variables for external use
// ==============================================
// External code can access these variables:
// - gazeDirection: "LEFT", "CENTER", "RIGHT"
// - smoothedGazeAngle: normalized gaze angle (-1 to 1)
// - GAZE_X_THRESHOLD: adjust sensitivity
// - SMOOTHING_FACTOR: adjust responsiveness

// ==============================================
// INTERACTION - Toggle video with tap
// ==============================================
function mousePressed() {
  // Toggle video display when screen is tapped
  showVideo = !showVideo;
}
