/*
p5play + HandPose Bouncing Ball

This example combines:
- ML5 HandPose tracking for finger detection
- p5play sprites with physics
- Bouncing ball that collides with finger-controlled paddle

How it works:
- Index fingertip controls the paddle position
- Ball bounces around with gravity and physics
- Paddle can hit and bounce the ball
- Paddle is always present even when no hand is detected

Key Concepts:
- Combining ML5 tracking with p5play physics
- Using velocity-based movement for smooth paddle control
- Dynamic ball physics with kinematic paddle
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================

// Camera and ML5
let cam;                // PhoneCamera instance
let handpose;           // ML5 HandPose model
let hands = [];         // Detected hands
let showVideo = true;   // Toggle video display

// Hand tracking - track 4 fingertips
let fingerIndices = [8, 12, 16, 20];  // Index, Middle, Ring, Pinky tips
let fingerData = [null, null, null, null];  // Current finger positions

// p5play sprites
let balls;     // Group of dynamic bouncing balls
let paddles;   // Group of kinematic paddles controlled by fingers
let walls;     // Group of static wall sprites

let isFirstFrame = true;  // Track first frame for initial teleport

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
    // Configure ML5 HandPose AFTER camera is ready
    let options = {
      maxHands: 1,           // Only detect 1 hand
      runtime: 'mediapipe',  // Use MediaPipe runtime
      flipHorizontal: false  // Don't flip in ML5 - cam.mapKeypoint() handles mirroring
    };
    
    // Create HandPose model and start detection when ready
    handpose = ml5.handPose(options, () => {
      handpose.detectStart(cam.videoElement, gotHands);
    });
  });
  
  // Set up world physics
  world.gravity.y = 10;  // Gravity pulls down
  
  // Create multiple bouncing balls
  balls = new Group();
  balls.diameter = 25;
  balls.bounciness = 0.8;  // Ball bounces when hitting surfaces
  balls.friction = 0.01;    // Low friction for smooth rolling
  
  // Create 5 balls at different positions
  let ballColors = ['yellow', 'orange', 'lime', 'cyan', 'magenta'];
  for (let i = 0; i < 5; i++) {
    let b = new balls.Sprite();
    b.x = 50 + i * 80;
    b.y = 50 + i * 30;
    b.color = ballColors[i];
  }
  
  // Create 4 paddles (one for each fingertip)
  paddles = new Group();
  paddles.width = 80;
  paddles.height = 15;
  paddles.physics = 'kinematic';  // Kinematic = manual control but still collides
  
  let paddleColors = ['red', 'blue', 'green', 'purple'];
  let paddlePositions = [
    { x: width * 0.25, y: height - 150 },
    { x: width * 0.4, y: height - 150 },
    { x: width * 0.6, y: height - 150 },
    { x: width * 0.75, y: height - 150 }
  ];
  
  for (let i = 0; i < 4; i++) {
    let p = new paddles.Sprite();
    p.x = paddlePositions[i].x;
    p.y = paddlePositions[i].y;
    p.color = paddleColors[i];
  }
  
  // Create walls around the canvas
  walls = new Group();
  walls.color = 'gray';
  walls.physics = 'static';  // Static = doesn't move
  
  // Top wall
  new walls.Sprite(width/2, -5, width, 10);
  
  // Bottom wall
  new walls.Sprite(width/2, height + 5, width, 10);
  
  // Left wall
  new walls.Sprite(-5, height/2, 10, height);
  
  // Right wall
  new walls.Sprite(width + 5, height/2, 10, height);
}

// ==============================================
// DRAW - Runs continuously
// ==============================================
function draw() {
  background(40);
  
  // Display the video feed
  if (showVideo && cam.ready) {
    image(cam, 0, 0);  // PhoneCamera handles positioning and mirroring
  }
  
  // Default target positions for paddles (when no hand detected)
  let defaultPositions = [
    { x: width * 0.25, y: height - 150 },
    { x: width * 0.4, y: height - 150 },
    { x: width * 0.6, y: height - 150 },
    { x: width * 0.75, y: height - 150 }
  ];
  
  // Update each paddle based on corresponding finger
  for (let i = 0; i < 4; i++) {
    let targetX = defaultPositions[i].x;
    let targetY = defaultPositions[i].y;
    
    // Update finger position if hand is detected
    if (hands.length > 0) {
      fingerData[i] = getKeypoint(fingerIndices[i], 0);
      
      // If finger is detected, use finger position as target
      if (fingerData[i]) {
        targetX = fingerData[i].x;
        targetY = fingerData[i].y;
        
        // Draw finger point visualization
        push();
        fill(255, 255, 0, 150);
        noStroke();
        circle(fingerData[i].x, fingerData[i].y, 15);
        pop();
      }
    }
    
    // Get the corresponding paddle
    let paddle = paddles[i];
    
    // Move paddle to target position
    if (isFirstFrame) {
      // On first frame, teleport paddle to target
      paddle.x = targetX;
      paddle.y = targetY;
    } else {
      // Use velocity-based movement for smooth following
      let dx = targetX - paddle.x;
      let dy = targetY - paddle.y;
      
      // Set velocity directly for smooth movement
      paddle.vel.x = dx * 0.3;
      paddle.vel.y = dy * 0.3;
    }
  }
  
  if (isFirstFrame) {
    isFirstFrame = false;
  }
  
  // Display UI
  drawUI();
}

// ==============================================
// UI - Display instructions
// ==============================================
function drawUI() {
  push();
  
  // Statistics at bottom
  fill(0, 0, 0, 150);
  noStroke();
  rect(0, height - 60, width, 60);
  
  fill(255);
  textAlign(LEFT, TOP);
  textSize(14);
  text('Show your hand with 4 fingers', 20, height - 50);
  text('Move fingers to control paddles!', 20, height - 30);
  
  // Hand detection status
  textAlign(RIGHT, TOP);
  if (hands.length > 0) {
    fill(0, 255, 0);
    text('✓ Hand detected', width - 20, height - 50);
  } else {
    fill(255, 100, 100);
    text('✗ No hand detected', width - 20, height - 50);
  }
  
  pop();
}

// ==============================================
// CALLBACK - When hands are detected
// ==============================================
function gotHands(results) {
  hands = results;
}

// ==============================================
// HELPER FUNCTION - Get keypoint with error checking
// ==============================================
function getKeypoint(index, handNumber = 0) {
  // Check if we have hands detected
  if (!hands || hands.length === 0) return null;
  
  // Check if the requested hand exists
  if (handNumber >= hands.length) return null;
  
  // Check if keypoints exist for this hand
  if (!hands[handNumber].keypoints) return null;
  
  // Check if the requested keypoint index exists
  if (index >= hands[handNumber].keypoints.length) return null;
  
  // Get the keypoint data
  let keypoint = hands[handNumber].keypoints[index];
  
  // Map the coordinates using PhoneCamera
  // This handles mirroring and scaling automatically
  let mapped = cam.mapKeypoint(keypoint);
  
  return mapped;
}

// ==============================================
// INTERACTION - Toggle video with tap
// ==============================================
function mousePressed() {
  // Toggle video display when screen is tapped
  showVideo = !showVideo;
}
