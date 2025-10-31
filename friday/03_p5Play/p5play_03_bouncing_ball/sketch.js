/*
p5play Bouncing Ball with Paddle

This example demonstrates:
- Dynamic sprite with gravity and physics (bouncing ball)
- Kinematic sprite following mouse cursor (paddle)
- Using moveTo() with fast speed to maintain physics collisions
- Ball-paddle collision interactions

How it works:
- Ball starts at top and bounces around with gravity
- Paddle follows mouse cursor using moveTo()
- Ball can collide with paddle and bounce off
- Initial teleport to mouse position, then moveTo() for smooth physics

Key Concepts:
- Dynamic physics: Ball affected by gravity and bounces
- Kinematic physics: Paddle moves manually but can still collide
- moveTo() with high speed maintains collision detection
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================
let ball;      // Dynamic sprite that bounces
let paddle;    // Kinematic sprite controlled by mouse
let walls;     // Group of static wall sprites
let isFirstFrame = true;  // Track first frame for initial teleport

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  createCanvas(800, 600);
  
  // Set up world physics
  world.gravity.y = 10;  // Gravity pulls down
  
  // Create the bouncing ball
  ball = new Sprite();
  ball.diameter = 30;
  ball.color = 'yellow';
  ball.bounciness = 0.8;  // Ball bounces when hitting surfaces
  ball.friction = 0.01;    // Low friction for smooth rolling
  
  // Start ball at top center
  ball.x = width / 2;
  ball.y = 100;
  
  // Create the paddle (follows mouse)
  paddle = new Sprite();
  paddle.width = 100;
  paddle.height = 20;
  paddle.color = 'dodgerblue';
  paddle.physics = 'kinematic';  // Kinematic = manual control but still collides
  
  // Start paddle at center
  paddle.x = width / 2;
  paddle.y = height - 100;
  
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
  
  // On first frame, teleport paddle to mouse position
  if (isFirstFrame) {
    paddle.x = mouse.x;
    paddle.y = mouse.y;
    isFirstFrame = false;
  } else {
    // Use velocity-based movement instead of moveTo()
    // Calculate direction to mouse
    let dx = mouse.x - paddle.x;
    let dy = mouse.y - paddle.y;
    
    // Set velocity directly for smooth following
    // Multiply by a factor to control responsiveness
    paddle.vel.x = dx * 0.3;
    paddle.vel.y = dy * 0.3;
  }
  
  // Display UI
  drawUI();
}

// ==============================================
// UI - Display instructions
// ==============================================
function drawUI() {
  push();
  
  // Instructions
  fill(255);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Move your mouse to control the paddle', width/2, 20);
  textSize(14);
  text('Keep the ball bouncing!', width/2, 45);
  
  pop();
}
