/*
ML5 FaceMesh Gesture Detection - Head Gestures (Phone Adapted)

This script uses ML5 FaceMesh with nose velocity tracking to detect head gestures.
It recognizes three states based on head movement:
- YES: Vertical head nod (up and down motion)
- NO: Horizontal head shake (side to side motion)
- NOT SURE: No significant movement or mixed motion

Works on both phone and desktop with portrait orientation.

Key Variables:
- cam: PhoneCamera instance for video feed
- faceMesh: ML5 FaceMesh detection model
- faces: Array to store detected faces
- noseIndex: Index of nose point (4)
- noseData, noseDataPrev: Current and previous nose position
- velocity: Nose velocity (x, y, speed)
- gestureState: Current detected gesture ("Yes", "No", "Not Sure")

Gesture Detection Logic:
- YES: Strong vertical motion (vy) with minimal horizontal motion (vx)
- NO: Strong horizontal motion (vx) with minimal vertical motion (vy)
- NOT SURE: Low speed or mixed motion patterns

Key Functions:
- setup(): Initializes canvas and PhoneCamera
- gotFaces(): Callback function when faces are detected
- getKeypoint(): Helper function to safely get keypoint data
- measureVelocity(): Calculates velocity in x, y directions and speed
- detectGesture(): Analyzes velocity patterns to determine gesture state
- drawGestureUI(): Displays current gesture state with visual feedback

Controls:
- Touch screen: Toggle video visibility
- Change showData variable (true/false) to toggle measurement visualization
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================
let cam;                // PhoneCamera instance
let faceMesh;           // ML5 FaceMesh model
let faces = [];         // Detected faces
let showVideo = true;   // Toggle video display
let showData = false;   // Toggle measurement visualization (simplified for gesture focus)

// Nose tracking (two-variable method)
let noseIndex = 4;          // Nose tip
let noseData = null;        // Current nose position
let noseDataPrev = null;    // Previous nose position

// Velocity tracking
let velocity = { x: 0, y: 0, speed: 0 };

// Gesture detection
let gestureState = "Not Sure";  // Current gesture: "Yes", "No", "Not Sure"
let gestureHistory = [];        // Store recent velocities for pattern detection
let gestureConfidence = 0;      // Confidence level (0-1)

// Gesture detection thresholds
const SPEED_THRESHOLD_YES = 2;      // Minimum speed to detect Yes gesture (lower = easier)
const SPEED_THRESHOLD_NO = 3;       // Minimum speed to detect No gesture
const VERTICAL_RATIO = 2.0;         // Ratio for vertical dominance (Yes)
const HORIZONTAL_RATIO = 2.0;       // Ratio for horizontal dominance (No)
const HISTORY_LENGTH = 10;          // Number of frames to analyze

// Gesture counter
let gestureCounter = 0;             // Goes up with Yes, down with No, stays same with Not Sure

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
      refineLandmarks: false,// Skip detailed landmarks (faster)
      runtime: 'mediapipe',  // Use MediaPipe runtime
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
  background(255);
  
  // Display the video feed
  if (showVideo && cam.ready) {
    image(cam, 0, 0);  // PhoneCamera handles positioning and mirroring
  }
  
  // Update nose tracking and gesture detection
  if (faces.length > 0) {
    // Store previous nose position
    noseDataPrev = noseData;
    noseData = getKeypoint(noseIndex, 0);
    
    // Calculate velocity
    velocity = measureVelocity(noseData, noseDataPrev);
    
    // Detect gesture based on velocity patterns
    detectGesture();
    
    // Show the nose point
    if (noseData) {
      showPoint(noseData, color(255, 255, 0));  // Yellow
    }
  } else {
    // No face detected - reset to Not Sure
    gestureState = "Not Sure";
    gestureConfidence = 0;
    gestureHistory = [];  // Clear history
  }
  
  // Draw gesture state UI
  drawGestureUI();
  
  // Draw instructions
  drawUI();
}

// ==============================================
// CALLBACK - When faces are detected
// ==============================================
function gotFaces(results) {
  faces = results || [];
}

// ==============================================
// HELPER - Get keypoint with mapped coordinates
// ==============================================
function getKeypoint(index, faceNumber = 0) {
  if (!faces || faces.length <= faceNumber) return null;
  
  const face = faces[faceNumber];
  if (!face || !face.keypoints) return null;
  
  const point = face.keypoints[index];
  if (!point) return null;
  
  // Map the keypoint using PhoneCamera for coordinate transformation
  return cam.mapKeypoint(point);
}

// ==============================================
// DISPLAY - Show a point with its coordinates
// ==============================================
function showPoint(point, pointColor) {
  if (!isValidPoint(point)) return;

  // Draw point circle at screen coordinates
  fill(pointColor);
  noStroke();
  circle(point.x, point.y, 20);
  
  // Draw point index number
  if (point.index != null) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(10);
    text(point.index, point.x, point.y);
  }
  
  // Draw point coordinates only if showData is true
  if (showData) {
    fill(255, 255, 0);
    textAlign(CENTER, TOP);
    textSize(8);
    let displayText = `(${Math.round(point.x)}, ${Math.round(point.y)})`;
    text(displayText, point.x, point.y + 15);
  }
}

// ==============================================
// MEASURE - Velocity in x and y directions
// ==============================================
function measureVelocity(currentPoint, previousPoint) {
  // Return zero velocity if either point is missing
  if (!currentPoint || !previousPoint) {
    return { x: 0, y: 0, speed: 0 };
  }
  
  // Calculate velocity components
  const vx = currentPoint.x - previousPoint.x;
  const vy = currentPoint.y - previousPoint.y;
  const speed = Math.sqrt(vx * vx + vy * vy);
  
  // Draw visualization only if showData is true
  if (showData) {
    // Draw velocity vector from current point
    if (speed > 1) {
      stroke(255, 255, 0);
      strokeWeight(3);
      
      // Draw velocity arrow (scaled for visibility)
      const scale = 2;
      const endX = currentPoint.x + vx * scale;
      const endY = currentPoint.y + vy * scale;
      
      // Arrow line
      line(currentPoint.x, currentPoint.y, endX, endY);
      
      // Arrow head
      push();
      translate(endX, endY);
      rotate(atan2(vy, vx));
      fill(255, 255, 0);
      noStroke();
      triangle(-10, -5, -10, 5, 0, 0);
      pop();
    }
    
    // Show velocity text
    noStroke();
    fill(255, 255, 0);
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text(`vx: ${vx.toFixed(1)} vy: ${vy.toFixed(1)} speed: ${speed.toFixed(1)}`, 
         currentPoint.x, currentPoint.y - 20);
  }
  
  return { x: vx, y: vy, speed: speed };
}

// ==============================================
// GESTURE - Detect gesture from velocity patterns
// ==============================================
function detectGesture() {
  // Add current velocity to history
  gestureHistory.push({ 
    x: velocity.x, 
    y: velocity.y, 
    speed: velocity.speed 
  });
  
  // Keep only recent history
  if (gestureHistory.length > HISTORY_LENGTH) {
    gestureHistory.shift();
  }
  
  // Need enough history to analyze
  if (gestureHistory.length < HISTORY_LENGTH) {
    gestureState = "Not Sure";
    gestureConfidence = 0;
    return;
  }
  
  // Analyze velocity patterns for Yes and No separately
  let totalVx = 0;
  let totalVy = 0;
  let totalSpeed = 0;
  let activeFramesYes = 0;
  let activeFramesNo = 0;
  
  for (let v of gestureHistory) {
    // Check for Yes gesture (vertical motion with lower threshold)
    if (v.speed > SPEED_THRESHOLD_YES && Math.abs(v.y) > Math.abs(v.x) * VERTICAL_RATIO) {
      totalVy += Math.abs(v.y);
      activeFramesYes++;
    }
    // Check for No gesture (horizontal motion)
    if (v.speed > SPEED_THRESHOLD_NO && Math.abs(v.x) > Math.abs(v.y) * HORIZONTAL_RATIO) {
      totalVx += Math.abs(v.x);
      activeFramesNo++;
    }
    totalSpeed += v.speed;
  }
  
  // Calculate average motion
  const avgVy = activeFramesYes > 0 ? totalVy / activeFramesYes : 0;
  const avgVx = activeFramesNo > 0 ? totalVx / activeFramesNo : 0;
  const avgSpeed = totalSpeed / gestureHistory.length;
  
  // Determine gesture based on which motion is stronger
  if (activeFramesYes > HISTORY_LENGTH * 0.4 && avgVy > avgVx) {
    // Strong vertical motion = YES (nodding)
    gestureState = "Yes";
    gestureConfidence = Math.min(1, avgSpeed / 15);
    gestureCounter++;  // Count up
  } else if (activeFramesNo > HISTORY_LENGTH * 0.4 && avgVx > avgVy) {
    // Strong horizontal motion = NO (shaking)
    gestureState = "No";
    gestureConfidence = Math.min(1, avgSpeed / 15);
    gestureCounter--;  // Count down
  } else {
    // Mixed or low motion = NOT SURE
    gestureState = "Not Sure";
    gestureConfidence = 0;
    // gestureCounter stays the same (no change)
  }
}

// ==============================================
// UI - Display gesture state
// ==============================================
function drawGestureUI() {
  push();
  
  // Determine colors based on gesture
  let bgColor, textColor, emoji;
  if (gestureState === "Yes") {
    bgColor = color(100, 200, 100, 200);  // Green
    textColor = color(0, 100, 0);
    emoji = "👍";
  } else if (gestureState === "No") {
    bgColor = color(200, 100, 100, 200);  // Red
    textColor = color(100, 0, 0);
    emoji = "👎";
  } else {
    bgColor = color(150, 150, 150, 200);  // Gray
    textColor = color(50, 50, 50);
    emoji = "🤔";
  }
  
  // Draw gesture state box
  fill(bgColor);
  noStroke();
  rectMode(CENTER);
  rect(width/2, height/2, 300, 200, 20);
  
  // Draw emoji
  textAlign(CENTER, CENTER);
  textSize(80);
  text(emoji, width/2, height/2 - 40);
  
  // Draw gesture text
  fill(textColor);
  textSize(48);
  textStyle(BOLD);
  text(gestureState, width/2, height/2 + 40);
  
  // Draw confidence bar if active gesture
  if (gestureConfidence > 0) {
    fill(255, 255, 255, 150);
    rect(width/2, height/2 + 80, 250, 15, 10);
    
    fill(textColor);
    rect(width/2 - 125 + (gestureConfidence * 125), height/2 + 80, 
         gestureConfidence * 250, 10, 10);
  }
  
  // Draw gesture counter
  fill(255);
  stroke(0);
  strokeWeight(2);
  textSize(24);
  textStyle(NORMAL);
  text(`Counter: ${gestureCounter}`, width/2, height/2 + 120);
  
  pop();
}

// ==============================================
// HELPER - Check if point has valid coordinates
// ==============================================
function isValidPoint(point) {
  return point && 
         typeof point.x === 'number' && 
         typeof point.y === 'number';
}

// ==============================================
// UI - Display status and instructions
// ==============================================
function drawUI() {
  push();
  fill(255);
  stroke(0);
  strokeWeight(3);
  textAlign(CENTER, TOP);
  textSize(16);
  
  // Show status at top of screen
  if (!cam.ready) {
    text('Starting camera...', width/2, 20);
  } else if (faces.length === 0) {
    text('Show your face to start', width/2, 20);
  } else {
    text('Move your head!', width/2, 20);
  }
  
  // Instructions at bottom
  textSize(12);
  textAlign(CENTER, BOTTOM);
  fill(255);
  stroke(0);
  strokeWeight(2);
  text('Nod up/down for YES', width/2, height - 80);
  text('Shake left/right for NO', width/2, height - 60);
  text('Stay still for NOT SURE', width/2, height - 40);
  
  textSize(10);
  text('Tap screen to toggle video', width/2, height - 20);
  pop();
}

// ==============================================
// INTERACTION - Toggle video on touch
// ==============================================
function mousePressed() {
  showVideo = !showVideo;
}
