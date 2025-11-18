// ==============================================
// FUNCTIONS APPROACH - NO CLASSES
// ==============================================
// This sketch does the EXACT same thing as the class version,
// but without using classes. Instead, we use:
// - Separate arrays for each property
// - Functions to operate on all circles
//
// COMPARE THIS to the class version to see the differences!
// ==============================================

// ==============================================
// ARRAYS TO HOLD CIRCLE PROPERTIES
// ==============================================
// Instead of one array of Circle objects,
// we need separate arrays for EACH property.
// Each index represents one circle.
//
// For example:
// Circle 0: x[0], y[0], speedX[0], speedY[0], size[0], etc.
// Circle 1: x[1], y[1], speedX[1], speedY[1], size[1], etc.

let x = [];           // X positions
let y = [];           // Y positions
let speedX = [];      // Horizontal speeds
let speedY = [];      // Vertical speeds
let size = [];        // Circle sizes
let hue = [];         // Color hues
let saturation = [];  // Color saturations
let brightness = [];  // Color brightness
let alpha = [];       // Opacity levels
let isClicked = [];   // Click states

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  // Create portrait canvas (9:16 aspect ratio for mobile)
  createCanvas(405, 720);
  
  // Use HSB color mode for easier color manipulation
  colorMode(HSB, 360, 100, 100, 255);
  
  // ENABLE mobile sensors
  enableGyroTap('Tap to enable motion sensors');
  
  // Lock mobile gestures to prevent accidental zoom/refresh
  lockGestures();
  
  // CREATE initial circles
  // Add 15 circles at random positions
  for (let i = 0; i < 15; i++) {
    addCircle(random(width), random(height));
  }
}

// ==============================================
// DRAW - Main loop, runs 60 times per second
// ==============================================
function draw() {
  // Dark background
  background(30, 30, 40);
  
  // UPDATE all circles
  updateCircles();
  
  // DISPLAY all circles
  displayCircles();
  
  // REMOVE dead circles
  removeDeadCircles();
  
  // Draw instructions
  drawInstructions();
}

// ==============================================
// ADD CIRCLE - Create a new circle
// ==============================================
// This function adds values to each array to create a new circle
// Notice how we have to manage 10 different arrays!
function addCircle(xPos, yPos) {
  // Add position
  x.push(xPos);
  y.push(yPos);
  
  // Add movement
  speedX.push(random(-0.5, 0.5));
  speedY.push(random(-0.5, 0.5));
  
  // Add size
  size.push(random(30, 80));
  
  // Add color
  hue.push(random(360));
  saturation.push(random(60, 100));
  brightness.push(random(70, 100));
  
  // Add opacity
  alpha.push(255);
  
  // Add state
  isClicked.push(false);
}

// ==============================================
// UPDATE CIRCLES - Move and fade all circles
// ==============================================
// Loop through all circles and update their positions and opacity
// We have to access each array by index [i]
function updateCircles() {
  // Loop through all circles
  for (let i = 0; i < x.length; i++) {
    // MOVE the circle
    x[i] += speedX[i];
    y[i] += speedY[i];
    
    // FADE OUT if clicked
    if (isClicked[i]) {
      alpha[i] -= 5;
      
      // Make sure alpha doesn't go below 0
      if (alpha[i] < 0) {
        alpha[i] = 0;
      }
    }
  }
}

// ==============================================
// DISPLAY CIRCLES - Draw all circles
// ==============================================
// Loop through all circles and draw them
function displayCircles() {
  for (let i = 0; i < x.length; i++) {
    // Only draw if circle is still visible
    if (alpha[i] > 0) {
      push();
      
      // Set fill color with transparency
      fill(hue[i], saturation[i], brightness[i], alpha[i]);
      noStroke();
      
      // Draw the circle
      circle(x[i], y[i], size[i]);
      
      pop();
    }
  }
}

// ==============================================
// CHECK CIRCLE CLICK - See if a point is inside a specific circle
// ==============================================
// Check if click point (mx, my) is inside circle at index i
// Returns true if inside, false if outside
function checkCircleClick(i, mx, my) {
  // Calculate distance from click point to circle center
  let distance = dist(mx, my, x[i], y[i]);
  
  // If distance is less than radius, click is inside circle
  if (distance < size[i] / 2) {
    isClicked[i] = true;  // Mark this circle as clicked
    return true;
  }
  
  return false;
}

// ==============================================
// CHECK ALL CLICKS - Test all circles for clicks
// ==============================================
// Loop through all circles and check if any were clicked
function checkAllClicks(mx, my) {
  for (let i = 0; i < x.length; i++) {
    checkCircleClick(i, mx, my);
  }
}

// ==============================================
// IS CIRCLE DEAD - Check if a circle should be removed
// ==============================================
// Returns true if circle at index i is completely faded
function isCircleDead(i) {
  return alpha[i] <= 0;
}

// ==============================================
// REMOVE DEAD CIRCLES - Delete faded circles
// ==============================================
// Loop backwards through arrays and remove faded circles
// THIS IS THE HARD PART - we have to remove from ALL arrays!
function removeDeadCircles() {
  for (let i = x.length - 1; i >= 0; i--) {
    if (isCircleDead(i)) {
      // Remove this circle from EVERY array
      // splice(i, 1) removes 1 item at index i
      x.splice(i, 1);
      y.splice(i, 1);
      speedX.splice(i, 1);
      speedY.splice(i, 1);
      size.splice(i, 1);
      hue.splice(i, 1);
      saturation.splice(i, 1);
      brightness.splice(i, 1);
      alpha.splice(i, 1);
      isClicked.splice(i, 1);
    }
  }
}

// ==============================================
// MOUSE PRESSED - Detect clicks on circles
// ==============================================
function mousePressed() {
  checkAllClicks(mouseX, mouseY);
  return false;
}

// ==============================================
// TOUCH STARTED - Same as mouse for mobile
// ==============================================
function touchStarted() {
  checkAllClicks(mouseX, mouseY);
  return false;
}

// ==============================================
// DEVICE SHAKEN - Add circles when phone is shaken
// ==============================================
function deviceShaken() {
  // Add 3-5 new circles at random positions when shaken
  let numCircles = int(random(3, 6));
  
  for (let i = 0; i < numCircles; i++) {
    addCircle(random(width), random(height));
  }
  
  console.log(`Shake detected! Added ${numCircles} circles. Total: ${x.length}`);
}

// ==============================================
// KEY PRESSED - Add more circles with spacebar
// ==============================================
function keyPressed() {
  if (key === ' ') {
    addCircle(random(width), random(height));
    console.log('Added new circle. Total:', x.length);
  }
}

// ==============================================
// DRAW INSTRUCTIONS
// ==============================================
function drawInstructions() {
  push();
  fill(255, 200);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text('Click/Touch circles to fade them out', width / 2, 20);
  
  textSize(14);
  text('Shake phone to add more circles', width / 2, 45);
  
  // Show sensor status
  textSize(12);
  if (window.sensorsEnabled) {
    fill(0, 255, 0, 200);
    text('✓ Sensors enabled', width / 2, 70);
  } else {
    fill(255, 200, 0, 200);
    text('Tap to enable sensors', width / 2, 70);
  }
  
  // Show count
  fill(255, 200);
  textSize(12);
  text(`Active circles: ${x.length}`, width / 2, 680);
  
  pop();
}

// ==============================================
// COMPARISON: CLASSES vs FUNCTIONS
// ==============================================
/*

ADDING A NEW CIRCLE:

With Classes:
  circles.push(new Circle(x, y));
  ✓ Simple - one line
  ✓ Can't forget any properties
  ✓ Constructor ensures consistency

With Functions:
  x.push(xPos);
  y.push(yPos);
  speedX.push(random(-0.5, 0.5));
  speedY.push(random(-0.5, 0.5));
  size.push(random(30, 80));
  hue.push(random(360));
  saturation.push(random(60, 100));
  brightness.push(random(70, 100));
  alpha.push(255);
  isClicked.push(false);
  ✗ 10 lines of code
  ✗ Easy to forget a property
  ✗ No consistency checking


REMOVING A CIRCLE:

With Classes:
  circles.splice(i, 1);
  ✓ One line removes entire object
  ✓ All data removed together

With Functions:
  x.splice(i, 1);
  y.splice(i, 1);
  speedX.splice(i, 1);
  speedY.splice(i, 1);
  size.splice(i, 1);
  hue.splice(i, 1);
  saturation.splice(i, 1);
  brightness.splice(i, 1);
  alpha.splice(i, 1);
  isClicked.splice(i, 1);
  ✗ 10 lines of code
  ✗ Easy to miss an array
  ✗ Can create bugs if arrays get out of sync


UPDATING A CIRCLE:

With Classes:
  circles[i].update();
  ✓ Clear what's happening
  ✓ Logic encapsulated in the object

With Functions:
  x[i] += speedX[i];
  y[i] += speedY[i];
  if (isClicked[i]) {
    alpha[i] -= 5;
  }
  ✓ Same logic, but scattered
  ✗ Harder to organize


DRAWING A CIRCLE:

With Classes:
  circles[i].display();
  ✓ Clean and simple
  ✓ Drawing logic in one place

With Functions:
  if (alpha[i] > 0) {
    fill(hue[i], saturation[i], brightness[i], alpha[i]);
    circle(x[i], y[i], size[i]);
  }
  ✓ Same result
  ✗ More verbose


ADDING NEW PROPERTIES:

With Classes:
  1. Add to constructor
  2. Add to methods that use it
  ✓ Organized in one place
  ✓ Clear scope

With Functions:
  1. Create new array
  2. Add to addCircle()
  3. Add to removeDeadCircles()
  4. Remember to update everywhere
  ✗ Easy to miss a spot
  ✗ More prone to bugs


SCALABILITY:

With Classes:
  - Easy to add 100s of circles
  - Each object self-contained
  - Methods ensure correct behavior
  ✓ Scales well

With Functions:
  - Can add 100s of circles
  - Must manage many arrays
  - Easy for arrays to get out of sync
  ✗ Harder to maintain at scale


READABILITY:

With Classes:
  circles[i].update();
  circles[i].display();
  ✓ Very clear what's happening
  ✓ Self-documenting code

With Functions:
  updateCircles();
  displayCircles();
  ✓ Still clear at high level
  ✗ Implementation is more complex


WHY USE FUNCTIONS APPROACH?

- Simpler for very basic programs
- No OOP knowledge needed
- Slightly more memory efficient (debatable)
- Good for learning fundamentals

WHY USE CLASS APPROACH?

- Much better for complex programs
- Easier to maintain and debug
- Scales better
- Industry standard
- Less error-prone
- More organized
- Easier to extend


BOTTOM LINE:

The class version is almost always better once you have more than
a few properties per object. The functions approach becomes messy
and error-prone very quickly.

The only advantage of the functions approach is that it's slightly
easier to understand if you're completely new to programming.

*/
