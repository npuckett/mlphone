// ==============================================
// BASIC CIRCLE CLASS EXAMPLE
// ==============================================
// This sketch demonstrates how to use a class to create and manage
// multiple objects (circles) with shared behavior.
//
// WHAT YOU'LL LEARN:
// - How to create objects from a class
// - How to store multiple objects in an array
// - How to call methods on objects
// - How to remove objects from an array
//
// ==============================================

// ==============================================
// ARRAY TO HOLD ALL CIRCLES
// ==============================================
// An array is like a list that can hold multiple items
// We'll store all our circle objects in this array
let circles = [];

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  // Create portrait canvas (9:16 aspect ratio for mobile)
  createCanvas(405, 720);
  
  // Use HSB color mode for easier color manipulation
  // HSB = Hue, Saturation, Brightness
  colorMode(HSB, 360, 100, 100, 255);
  
  // ENABLE mobile sensors
  // This allows us to use gyroscope data and shake detection
  // User taps screen to grant permission
  enableGyroTap('Tap to enable motion sensors');
  
  // Lock mobile gestures to prevent accidental zoom/refresh
  lockGestures();
  
  // CREATE initial circles
  // Let's start with 15 circles randomly placed on screen
  for (let i = 0; i < 15; i++) {
    // Pick random position on screen
    let x = random(width);
    let y = random(height);
    
    // Create a new Circle object at that position
    let newCircle = new Circle(x, y);
    
    // Add it to our array of circles
    circles.push(newCircle);
  }
}

// ==============================================
// DRAW - Main loop, runs 60 times per second
// ==============================================
function draw() {
  // Dark background
  background(30, 30, 40);
  
  // UPDATE and DISPLAY all circles
  // We loop through the array and call methods on each circle
  for (let i = 0; i < circles.length; i++) {
    circles[i].update();   // Update position and fade
    circles[i].display();  // Draw the circle
  }
  
  // REMOVE dead circles
  // Loop backwards to safely remove items from array
  for (let i = circles.length - 1; i >= 0; i--) {
    if (circles[i].isDead()) {
      // Remove this circle from the array
      circles.splice(i, 1);
    }
  }
  
  // Draw instructions
  drawInstructions();
}

// ==============================================
// MOUSE PRESSED - Detect clicks on circles
// ==============================================
function mousePressed() {
  // Check each circle to see if it was clicked
  for (let i = 0; i < circles.length; i++) {
    circles[i].checkClick(mouseX, mouseY);
  }
  
  return false;  // Prevent default behavior
}

// ==============================================
// TOUCH STARTED - Same as mouse for mobile
// ==============================================
function touchStarted() {
  // Check each circle to see if it was touched
  for (let i = 0; i < circles.length; i++) {
    circles[i].checkClick(mouseX, mouseY);
  }
  
  return false;  // Prevent default behavior
}

// ==============================================
// DEVICE SHAKEN - Add circles when phone is shaken
// ==============================================
// This function is called automatically when the device is shaken
// It only works if window.sensorsEnabled is true
function deviceShaken() {
  // Add 3-5 new circles at random positions when shaken
  let numCircles = int(random(3, 6));
  
  for (let i = 0; i < numCircles; i++) {
    let x = random(width);
    let y = random(height);
    circles.push(new Circle(x, y));
  }
  
  console.log(`Shake detected! Added ${numCircles} circles. Total: ${circles.length}`);
}

// ==============================================
// KEY PRESSED - Add more circles with spacebar
// ==============================================
function keyPressed() {
  if (key === ' ') {
    // Add a new circle at random position
    let x = random(width);
    let y = random(height);
    circles.push(new Circle(x, y));
    
    console.log('Added new circle. Total:', circles.length);
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
  text(`Active circles: ${circles.length}`, width / 2, 680);
  
  pop();
}

// ==============================================
// HOW THIS WORKS - STEP BY STEP
// ==============================================
/*

STEP 1: CREATE THE CLASS (Circle.js)
-------------------------------------
The Circle class defines what a circle is and what it can do.
It's like a blueprint or template.


STEP 2: CREATE OBJECTS (in setup)
----------------------------------
We use the "new" keyword to create actual circle objects:
    let myCircle = new Circle(100, 200);

Each circle is independent with its own x, y, size, color, etc.


STEP 3: STORE IN ARRAY
-----------------------
We put all circles in an array so we can work with them as a group:
    circles.push(myCircle);


STEP 4: UPDATE ALL CIRCLES (in draw)
-------------------------------------
Loop through the array and call update() on each:
    for (let i = 0; i < circles.length; i++) {
      circles[i].update();
    }


STEP 5: DISPLAY ALL CIRCLES (in draw)
--------------------------------------
Loop through and call display() on each:
    for (let i = 0; i < circles.length; i++) {
      circles[i].display();
    }


STEP 6: INTERACT WITH CIRCLES (mousePressed)
---------------------------------------------
When clicked, check each circle to see if click is inside it:
    circles[i].checkClick(mouseX, mouseY);


STEP 7: REMOVE DEAD CIRCLES
----------------------------
Loop backwards through array and remove faded circles:
    for (let i = circles.length - 1; i >= 0; i--) {
      if (circles[i].isDead()) {
        circles.splice(i, 1);  // Remove from array
      }
    }


WHY LOOP BACKWARDS FOR REMOVAL?
--------------------------------
When you remove an item from an array, all items after it shift down.
Looping backwards prevents skipping items.

Example:
  Forward loop: Remove item 2 → item 3 becomes item 2 → loop skips it!
  Backward loop: Safe because we've already processed items after current


ARRAY METHODS USED:
-------------------
- circles.push(item)     → Add item to end of array
- circles.length         → Number of items in array
- circles[i]             → Get item at index i
- circles.splice(i, 1)   → Remove 1 item at index i


CREATING MORE CIRCLES:
----------------------
Press SPACE to add a new circle at random position:
    circles.push(new Circle(x, y));

You can create as many as you want!

*/
