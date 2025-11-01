/*
p5play Basic Chase Example

This example demonstrates:
- Creating sprites in p5play
- Attaching a sprite to mouse position
- Using moveTo() to make a sprite chase another sprite
- Basic sprite properties (color, diameter)

Two sprites:
1. Leader (blue) - follows the mouse cursor
2. Chaser (red) - uses moveTo() to chase the leader

Key Concepts:
- Sprites are physics-enabled objects
- moveTo(x, y, speed) moves a sprite toward a position
- Sprites have properties like x, y, diameter, color
- Setting physics to 'kinematic' allows manual position control without physics forces
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================
let leader;   // Blue sprite that follows mouse
let chaser;   // Red sprite that chases the leader

// Chaser statistics
let totalPixelsTravelled = 0;  // Total distance the chaser has moved
let timesCaught = 0;            // Number of times chaser caught the leader
let wasTouching = false;        // Track if sprites were touching in previous frame

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  createCanvas(800, 600);
  
  // Create the leader sprite (follows mouse)
  leader = new Sprite();
  leader.diameter = 50;
  leader.color = 'dodgerblue';
  leader.physics = 'kinematic';  // Kinematic = can move without physics forces
  
  // Create the chaser sprite (chases the leader)
  chaser = new Sprite();
  chaser.diameter = 40;
  chaser.color = 'tomato';
  chaser.physics = 'kinematic';  // Kinematic = manual movement control
  
  // Set up overlap relationship for detection (kinematic sprites need this)
  chaser.overlaps(leader);
  
  // Position chaser away from center
  chaser.x = 100;
  chaser.y = 100;
}

// ==============================================
// DRAW - Runs continuously (60fps)
// ==============================================
function draw() {
  background(240);
  
  // Leader follows mouse position
  leader.x = mouse.x;
  leader.y = mouse.y;
  
  // Chaser moves toward leader using moveTo()
  // moveTo(x, y, speed)
  // - speed parameter controls how fast the sprite moves
  // - higher speed = faster movement
  chaser.moveTo(leader.x, leader.y, 3);
  
  // Add pulsing/breathing animation using sine wave
  let pulse = sin(frameCount * 0.15) * 0.4 + 1; // Oscillates between 0.6 and 1.4 scale
  chaser.scale = pulse;
  
  // Calculate distance travelled this frame using velocity
  // p5play automatically calculates velocity based on position changes
  let distanceThisFrame = Math.sqrt(chaser.vel.x * chaser.vel.x + chaser.vel.y * chaser.vel.y);
  totalPixelsTravelled += distanceThisFrame;
  
  // Calculate actual distance between sprite centers
  let distanceBetween = dist(chaser.x, chaser.y, leader.x, leader.y);
  let touchingDistance = (chaser.diameter/2) + (leader.diameter/2);
  
  // Check if sprites are currently touching
  let isTouching = distanceBetween < touchingDistance;
  
  // Only count a new catch if we just started touching (weren't touching before)
  if (isTouching && !wasTouching) {
    timesCaught++;
    console.log('Caught! Distance:', distanceBetween.toFixed(2), 'Touching threshold:', touchingDistance);
    background(255, 200, 200);  // Flash background red when caught
  }
  
  // Update tracking variable for next frame
  wasTouching = isTouching;
  
  // Draw connection line between sprites
  stroke(150);
  strokeWeight(2);
  line(leader.x, leader.y, chaser.x, chaser.y);
  
  // Display instructions
  drawUI();
}

// ==============================================
// UI - Display instructions
// ==============================================
function drawUI() {
  push();
  fill(50);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Move your mouse - the red circle will chase the blue circle!', width/2, 20);
  
  // Display distance between sprites
  let distance = Math.round(leader.distanceTo(chaser));
  textSize(16);
  text(`Distance: ${distance}px`, width/2, 50);
  
  // Display sprite info
  textAlign(LEFT, TOP);
  textSize(14);
  fill('dodgerblue');
  text('● Leader (follows mouse)', 20, 20);
  fill('tomato');
  text('● Chaser (uses moveTo)', 20, 45);
  
  // Display chaser statistics
  fill(50);
  textSize(16);
  text(`Chaser Stats:`, 20, 85);
  textSize(14);
  text(`  Total pixels travelled: ${Math.round(totalPixelsTravelled)}`, 20, 110);
  text(`  Times caught: ${timesCaught}`, 20, 130);
  pop();
}
