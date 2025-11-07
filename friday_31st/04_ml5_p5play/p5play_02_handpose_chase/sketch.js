/*
p5play + HandPose Chase Example

This example combines:
- ML5 HandPose tracking for finger detection
- p5play sprites for game mechanics
- p5-phone for camera integration

How it works:
- Index fingertip (keypoint 8) controls the leader sprite position
- Red chaser sprite follows the leader using moveTo()
- Statistics track total distance traveled and catches
- Sprite is always present even when no hand is detected

Key Concepts:
- Combining ML5 tracking with p5play sprites
- Using velocity-based movement for smooth control
- Using p5play's built-in collision detection
- PhoneCamera with coordinate mapping
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================

// Camera and ML5
let cam;                // PhoneCamera instance
let handpose;           // ML5 HandPose model
let hands = [];         // Detected hands
let showVideo = true;   // Toggle video display

// Hand tracking
let fingerIndex = 8;       // Index finger tip
let fingerData = null;     // Current finger position

// p5play sprites
let leader;   // Sprite controlled by finger position
let chaser;   // Sprite that chases the leader

// Chaser statistics
let totalPixelsTravelled = 0;  // Total distance the chaser has moved
let timesCaught = 0;            // Number of times chaser caught the leader

let isFirstFrame = true;        // Track first frame for initial teleport

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
  
  // Create the leader sprite (controlled by finger position)
  leader = new Sprite();
  leader.diameter = 40;
  leader.color = 'dodgerblue';
  leader.physics = 'kinematic';
  leader.collider = 'dynamic';  // Enable collision detection
  
  // Start leader at center of canvas
  leader.x = width / 2;
  leader.y = height / 2;
  
  // Create the chaser sprite (chases the leader)
  chaser = new Sprite();
  chaser.diameter = 35;
  chaser.color = 'tomato';
  chaser.physics = 'kinematic';
  chaser.collider = 'dynamic';  // Enable collision detection
  
  // Position chaser away from center
  chaser.x = 100;
  chaser.y = 100;
  
  // Set up collision relationship
  chaser.overlaps(leader);
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
  
  // Target position for leader (default to center if no hand)
  let targetX = width / 2;
  let targetY = height / 2;
  
  // Update finger position if hand is detected
  if (hands.length > 0) {
    fingerData = getKeypoint(fingerIndex, 0);
    
    // If finger is detected, use finger position as target
    if (fingerData) {
      targetX = fingerData.x;
      targetY = fingerData.y;
      
      // Draw finger point visualization
      push();
      fill(255, 255, 0, 150);
      noStroke();
      circle(fingerData.x, fingerData.y, 20);
      pop();
    }
  }
  
  // Move leader to target position using velocity
  if (isFirstFrame) {
    // On first frame, teleport leader to target
    leader.x = targetX;
    leader.y = targetY;
    isFirstFrame = false;
  } else {
    // Use velocity-based movement for smooth following
    let dx = targetX - leader.x;
    let dy = targetY - leader.y;
    
    // Set velocity directly for smooth movement
    leader.vel.x = dx * 0.3;
    leader.vel.y = dy * 0.3;
  }
  
  // Chaser always moves toward leader (whether controlled by finger or not)
  chaser.moveTo(leader.x, leader.y, 3);
  
  // Check if sprites are currently overlapping
  let isOverlapping = chaser.overlapping(leader);
  
  // Calculate distance travelled this frame using velocity
  // Only count when NOT overlapping with target
  if (!isOverlapping) {
    let distanceThisFrame = Math.sqrt(chaser.vel.x * chaser.vel.x + chaser.vel.y * chaser.vel.y);
    totalPixelsTravelled += distanceThisFrame;
  }
  
  // Use p5play's overlaps() method to detect first frame of overlap
  // overlaps() returns true on the FIRST FRAME of overlap
  if (chaser.overlaps(leader)) {
    timesCaught++;
    console.log('Caught! Total catches:', timesCaught);
  }
  
  // Draw connection line between sprites
  push();
  stroke(150);
  strokeWeight(2);
  line(leader.x, leader.y, chaser.x, chaser.y);
  pop();
  
  // Display UI
  drawUI();
}

// ==============================================
// UI - Display instructions and statistics
// ==============================================
function drawUI() {
  push();
  
  // Statistics at bottom
  fill(0, 0, 0, 150);
  rect(0, height - 80, width, 80);
  
  fill(255);
  textAlign(LEFT, TOP);
  textSize(16);
  text('Chaser Stats:', 20, height - 70);
  textSize(14);
  text(`Distance travelled: ${Math.round(totalPixelsTravelled)}px`, 20, height - 48);
  text(`Times caught: ${timesCaught}`, 20, height - 28);
  
  // Distance indicator
  let distanceBetween = dist(chaser.x, chaser.y, leader.x, leader.y);
  textAlign(RIGHT, TOP);
  text(`Distance: ${Math.round(distanceBetween)}px`, width - 20, height - 48);
  
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
function enableCameraTap() {
  // This function enables tapping the screen to toggle video
  // Already handled by p5-phone's built-in functionality
}

function mousePressed() {
  // Toggle video display when screen is tapped
  showVideo = !showVideo;
}
