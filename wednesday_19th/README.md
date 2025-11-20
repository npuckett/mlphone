# Wednesday 19th - Classes & localStorage

**Live Demo Index:** https://npuckett.github.io/mlphone/wednesday_19th/

A progressive series of examples exploring object-oriented programming with classes and data persistence with localStorage, building from simple concepts to complex ML5 wrapper systems.

---

## Table of Contents

1. [Overview](#overview)
2. [Example Progression](#example-progression)
3. [localStorage Examples](#localstorage-examples)
4. [Class Examples - Introduction](#class-examples---introduction-to-oop)
5. [Class Examples - Character Controllers](#class-examples---character-controllers)
6. [Class Examples - ML5 Wrappers](#class-examples---ml5-tracking-wrappers)
7. [Core Concepts Reference](#core-concepts-reference)
8. [Key Patterns](#key-patterns)

---

## Overview

This collection demonstrates two fundamental programming concepts that transform how we write interactive code:

**Object-Oriented Programming (Classes):**
- Organize related data and behavior into reusable components
- Encapsulate complexity behind clean APIs
- Create maintainable, scalable code architecture
- Professional code organization patterns

**Data Persistence (localStorage):**
- Save application state between browser sessions
- Create "memory" in sketches and games
- Track cumulative interactions over time
- Build save/load systems

**Core Technologies:**
- **p5.js v1.11.10** - Canvas graphics framework
- **p5play v3** - Sprite animation system (character examples)
- **p5-phone v1.6.2** - Mobile sensors and camera management
- **ML5.js v1.x** - Machine learning models (BodyPose, FaceMesh)
- **localStorage API** - Browser data persistence

**Canvas:** All examples use 405×720 pixels (9:16 portrait aspect ratio) optimized for mobile screens.

---

## Example Progression

The examples build upon each other, introducing concepts progressively:

| Category | Example | Focus | Key Concepts |
|----------|---------|-------|--------------|
| **localStorage** | 01 | Basic Usage | setItem, getItem, removeItem, JSON |
| **localStorage** | 02 | Applied | Persistent stress system with shake detection |
| **Classes - Intro** | 01 | Circle Class | Constructor, methods, properties, separate file |
| **Classes - Intro** | 02 | Functions Version | Same functionality WITHOUT classes (comparison) |
| **Classes - Character** | 03 | StressCharacter | Complex class with localStorage integration |
| **Classes - Character** | 04 | Template | Reusable character pattern for extensions |
| **Classes - ML5** | 05 | BodyPose | Wrapper simplifying ML5 BodyPose tracking |
| **Classes - ML5** | 06 | Gaze Detection | Wrapper simplifying ML5 FaceMesh gaze tracking |

---

## localStorage Examples


### Why localStorage?

localStorage allows web apps to save data in the browser, persisting between sessions. This enables:
- Saving user progress or state
- Creating "memory" in your sketches
- Building games with save systems
- Tracking cumulative interactions over time

---

### 01_localStorage_example

**Basic localStorage demonstration.**

**What It Does:**
- Save simple data to browser storage
- Load saved data on page refresh
- Clear stored data with reset button
- Visual feedback showing storage state

**Key Code Patterns:**

```javascript
// Save data
localStorage.setItem('key', 'value');

// Load data
let data = localStorage.getItem('key');

// Clear data
localStorage.removeItem('key');

// JSON for complex data
let obj = { health: 100, level: 5 };
localStorage.setItem('gameData', JSON.stringify(obj));
let loaded = JSON.parse(localStorage.getItem('gameData'));
```

**Purpose:**
Introduction to localStorage API before applying it to complex systems. Demonstrates basic save/load/clear operations.

**Files:**
- `index.html` - Standard p5.js template
- `sketch.js` - 180 lines, well-documented
- `README.md` - Complete API reference

---

### 02_stress_shake_persistent

**Character with persistent stress system.**

**What It Does:**
- Shake phone to increase character stress
- Stress level saved automatically
- Persists between browser sessions
- Visual feedback (color, jitter, animation speed)
- Reset button to clear stored stress

**Stress System:**

```javascript
// Shake detection (p5-phone)
function deviceShaken(event) {
  stress += event.intensity * stressMultiplier;
  stress = constrain(stress, 0, 100);
  saveStressToStorage();  // Auto-save
}

// Save to localStorage
function saveStressToStorage() {
  localStorage.setItem('characterStress', stress);
}

// Load on startup
function setup() {
  let savedStress = localStorage.getItem('characterStress');
  if (savedStress !== null) {
    stress = parseFloat(savedStress);
  }
}
```

**Visual Feedback:**
- **Low Stress (0-30):** Blue/green tones, slow breathing, stable position
- **Medium Stress (30-70):** Yellow/orange tones, faster breathing, slight jitter
- **High Stress (70-100):** Red tones, rapid breathing, heavy jitter

**Parameters:**
- **Stress Range:** 0-100
- **Shake Multiplier:** 2.0 (sensitivity)
- **Decay Rate:** -0.05 per frame when not shaking
- **Jitter Range:** 0-15 pixels based on stress

**Purpose:**
Demonstrates practical localStorage application with sensor input. Shows how state persistence creates long-term character "memory."

**Files:**
- `index.html` - Includes p5play and p5-phone
- `sketch.js` - 550 lines, comprehensive documentation
- `animations/idle/` - 9 frames
- `animations/walk/` - 13 frames
- `README.md` - Detailed system documentation

---

## Class Examples - Introduction to OOP


### Why Classes?

Classes organize related data and behavior into reusable components. Benefits include:
- **Encapsulation** - Hide complexity, expose clean APIs
- **Reusability** - Use the same class in multiple projects
- **Maintainability** - Easier to find, modify, and debug
- **Scalability** - Create many instances from one definition

---

### 01_basic_circle_class

**Introduction to classes with interactive circles.**

**What It Does:**
- 15 circles with independent drift behavior
- Click circle to make it fade out
- Circles "die" when fully transparent
- Shake phone to add 5 new circles
- All circle logic in separate Circle.js file

**Key Code Patterns:**

```javascript
// Circle.js - Separate file
class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
    this.size = random(30, 80);
    this.hue = random(0, 360);
    this.alpha = 255;
    this.isClicked = false;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.isClicked) {
      this.alpha -= 5;
    }
  }
  
  display() {
    fill(this.hue, 100, 100, this.alpha);
    circle(this.x, this.y, this.size);
  }
  
  checkClick(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    if (d < this.size / 2) {
      this.isClicked = true;
    }
  }
  
  isDead() {
    return this.alpha <= 0;
  }
}

// sketch.js - Using the class
let circles = [];

function setup() {
  for (let i = 0; i < 15; i++) {
    circles.push(new Circle(random(width), random(height)));
  }
}

function draw() {
  // .forEach() loops through the array
  // The => is an "arrow function" - a shorter way to write a function
  // For each circle in the array, we call it 'c' and run update() and display()
  circles.forEach(c => {
    c.update();
    c.display();
  });
  
  // Remove dead circles
  circles = circles.filter(c => !c.isDead());
}
```

**Understanding Arrow Functions:**

The `.forEach()` method with an arrow function `=>` is a modern, concise way to loop through arrays. Here's the same code written in different ways:

```javascript
// Modern way (using arrow function):
circles.forEach(c => {
  c.update();
  c.display();
});

// Traditional way (using regular function):
circles.forEach(function(c) {
  c.update();
  c.display();
});

// Classic way (using for loop):
for (let i = 0; i < circles.length; i++) {
  circles[i].update();
  circles[i].display();
}
```

All three versions do exactly the same thing - they loop through each circle and call its `update()` and `display()` methods. The arrow function syntax `=>` is just shorter and cleaner.

**Purpose:**
First exposure to classes. Circle class demonstrates constructor, properties, methods, and instance management.

**Files:**
- `Circle.js` - 150 lines, extensively commented class definition
- `sketch.js` - 130 lines, simple usage
- `index.html` - Loads Circle.js before sketch.js
- `README.md` - Complete class tutorial

---

### 02_basic_circle_functions

**Same functionality WITHOUT classes (comparison).**

**What It Does:**
- Identical behavior to 01_basic_circle_class
- Uses 10 parallel arrays instead of Circle objects
- Manual synchronization required
- Shows pain points that classes solve

**Key Code Patterns:**

```javascript
// 10 parallel arrays for 10 properties
let x = [];
let y = [];
let speedX = [];
let speedY = [];
let size = [];
let hue = [];
let alpha = [];
let isClicked = [];

// Adding a circle requires 10 push operations
function addCircle(posX, posY) {
  x.push(posX);
  y.push(posY);
  speedX.push(random(-1, 1));
  speedY.push(random(-1, 1));
  size.push(random(30, 80));
  hue.push(random(0, 360));
  alpha.push(255);
  isClicked.push(false);
}

// Updating requires index-based access
function updateCircle(i) {
  x[i] += speedX[i];
  y[i] += speedY[i];
  if (isClicked[i]) {
    alpha[i] -= 5;
  }
}

// Removing dead circles requires synchronized splicing
function removeDeadCircles() {
  for (let i = x.length - 1; i >= 0; i--) {
    if (alpha[i] <= 0) {
      x.splice(i, 1);
      y.splice(i, 1);
      speedX.splice(i, 1);
      speedY.splice(i, 1);
      size.splice(i, 1);
      hue.splice(i, 1);
      alpha.splice(i, 1);
      isClicked.splice(i, 1);
    }
  }
}
```

**Problems This Approach Has:**
- Arrays can get out of sync if you forget one
- Adding new properties requires updating many functions
- Code duplication for array management
- Harder to understand relationships between data
- Difficult to reuse in other projects

**Purpose:**
Shows exactly why classes are valuable through direct comparison. Same functionality, dramatically different code organization.

**Files:**
- `sketch.js` - 220 lines, all code in one file
- `index.html` - Only loads sketch.js
- `README.md` - Detailed comparison with 01_basic_circle_class

---

## Class Examples - Character Controllers


---

### 03_stress_character_class

**StressCharacter class with localStorage integration.**

**What It Does:**
- Complete stress management system as reusable class
- Shake phone to increase stress
- Stress affects color, jitter, animation speed
- Automatic localStorage save/load
- Visual feedback through sprite behavior

**Refactoring Achievement:**
- **Function version:** 550 lines in one file (see localStorage/02_stress_shake_persistent)
- **Class version:** 280-line main program + 320-line reusable class
- Same functionality, dramatically better organization

**Key Code Patterns:**

```javascript
// StressCharacter.js - Separate file
class StressCharacter {
  constructor(x, y, idleAni, walkAni) {
    this.sprite = new Sprite(x, y);
    this.sprite.addAni('idle', idleAni);
    this.sprite.addAni('walk', walkAni);
    
    this.stress = 0;
    this.shakeIntensity = 0;
    this.jitter = 0;
    this.wandering = false;
    
    this.loadStressFromStorage();  // Auto-load on creation
  }
  
  onShake(intensity) {
    this.stress += intensity * 2.0;
    this.stress = constrain(this.stress, 0, 100);
    this.shakeIntensity = intensity * 50;
    this.saveStressToStorage();  // Auto-save
  }
  
  update() {
    this.updateStressDecay();
    this.updateShakeIntensity();
    this.updateCharacterColor();
    this.updateStressJitter();
    this.updateWandering();
    this.updateAnimationSpeed();
  }
  
  saveStressToStorage() {
    localStorage.setItem('characterStress', this.stress);
  }
  
  loadStressFromStorage() {
    let saved = localStorage.getItem('characterStress');
    if (saved !== null) {
      this.stress = parseFloat(saved);
    }
  }
  
  resetStress() {
    this.stress = 0;
    localStorage.removeItem('characterStress');
  }
}

// sketch.js - Simple usage
let character;

function setup() {
  createCanvas(405, 720);
  character = new StressCharacter(width/2, height/2, idleAni, walkAni);
}

function draw() {
  character.update();
}

function deviceShaken(event) {
  character.onShake(event.intensity);
}
```

**Stress System:**
- **Range:** 0-100
- **Shake Multiplier:** 2.0
- **Decay Rate:** -0.05 per frame
- **Jitter Range:** 0-15 pixels
- **Color Map:** Blue (calm) → Red (stressed)

**Benefits of Class Version:**
- All stress logic in one place
- Easy to create multiple characters
- Reusable in other projects
- Main sketch stays clean and focused
- localStorage encapsulated in class

**Purpose:**
Demonstrates refactoring complex function-based code into clean class architecture. Shows how classes organize related behavior.

**Files:**
- `StressCharacter.js` - 320 lines, complete stress system
- `sketch.js` - 280 lines, simplified main program
- `index.html` - Loads StressCharacter.js before sketch.js
- `animations/idle/` - 9 frames
- `animations/walk/` - 13 frames
- `README.md` - Architecture comparison

---

### 04_character_template_class

**Reusable character template for rapid development.**

**What It Does:**
- HealthCharacter class as starting template
- Easy to modify for different parameters (stress, energy, mood, temperature)
- Built-in localStorage support
- Extension examples in README
- Template pattern for creating new character systems

**Key Code Patterns:**

```javascript
// HealthCharacter.js - Template class
class HealthCharacter {
  constructor(x, y, idleAni, walkAni) {
    this.sprite = new Sprite(x, y);
    this.sprite.addAni('idle', idleAni);
    this.sprite.addAni('walk', walkAni);
    
    // Main parameter - easily change to stress, energy, etc.
    this.health = 50;
    
    this.loadFromStorage();
  }
  
  // Calculate health from inputs
  calculateHealth() {
    // CUSTOMIZE THIS: Add your parameter logic
    // Example: stress increases from shaking
    // Example: energy decreases from moving
  }
  
  // Behavior 1 - customize for your parameter
  behaviour1() {
    // What happens when parameter is high?
  }
  
  // Behavior 2 - customize for your parameter  
  behaviour2() {
    // What happens when parameter is low?
  }
  
  update() {
    this.calculateHealth();
    this.behaviour1();
    this.behaviour2();
    this.updateVisuals();
  }
  
  // Built-in localStorage
  saveToStorage() {
    localStorage.setItem('characterHealth', this.health);
  }
  
  loadFromStorage() {
    let saved = localStorage.getItem('characterHealth');
    if (saved !== null) {
      this.health = parseFloat(saved);
    }
  }
}
```

**Extension Examples (from README):**

1. **Energy System:** 
   - Walking decreases energy
   - Stopping recovers energy
   - Low energy = slower movement

2. **Mood System:**
   - Microphone noise affects mood
   - High mood = bright colors, fast animation
   - Low mood = dark colors, slow animation

3. **Temperature System:**
   - Gyroscope tilt controls temperature
   - Hot = red, fast breathing
   - Cold = blue, slow breathing

**Purpose:**
Provides a starting point for creating new character systems. Change one parameter name and add your logic. All infrastructure (localStorage, sprite management, update loop) already built.

**Files:**
- `HealthCharacter.js` - 250 lines, template with comments
- `sketch.js` - 150 lines, minimal usage example
- `index.html` - Standard template
- `animations/idle/` - 9 frames
- `animations/walk/` - 13 frames
- `README.md` - Extension patterns and examples

---

## Class Examples - ML5 Tracking Wrappers


These classes wrap complex ML5 functionality into simple, reusable tools that dramatically simplify adding body and face tracking to projects.

---

### 05_bodypose_tracker_class

**BodyPoseTracker class - simplified body tracking.**

**What It Does:**
- Full body tracking using ML5 BodyPose (BlazePose model)
- 33 keypoints tracked (nose, eyes, shoulders, elbows, wrists, hips, knees, ankles, etc.)
- Name-based point access instead of index numbers
- Built-in measurements (distance, angle, velocity)
- Automatic velocity tracking across frames
- Optional visualization methods

**Simplification Achievement:**
- **Function version:** 40+ lines of camera and model setup, manual coordinate mapping, custom measurement functions
- **Class version:** 1 line setup, built-in everything

**Key Code Patterns:**

```javascript
// Setup (function version - 40+ lines)
let cam;
let bodypose;
let poses = [];
let bodyPointIndex1 = 11;  // What is 11?
let bodyPointData1 = null;

function setup() {
  createCanvas(405, 720);
  lockGestures();
  
  cam = createPhoneCamera('user', true, 'fitHeight');
  enableCameraTap();
  
  cam.onReady(() => {
    let options = {
      runtime: 'mediapipe',
      modelType: 'MULTIPOSE_LIGHTNING',
      enableSmoothing: true,
      minPoseScore: 0.25,
      multiPoseMaxDimension: 256,
      flipped: false
    };
    
    bodypose = ml5.bodyPose('BlazePose', options, () => {
      bodypose.detectStart(cam.videoElement, gotPoses);
    });
  });
}

// Setup (class version - 1 line!)
let tracker;

function setup() {
  createCanvas(405, 720);
  tracker = new BodyPoseTracker();
}
```

**Using the Tracker:**

```javascript
function draw() {
  tracker.update();
  
  if (tracker.isPoseDetected()) {
    // Get any body point by NAME
    let nose = tracker.getPoint('nose');
    let leftWrist = tracker.getPoint('leftWrist');
    let rightShoulder = tracker.getPoint('rightShoulder');
    
    // Built-in measurements
    let shoulderWidth = tracker.getDistance('leftShoulder', 'rightShoulder');
    let armAngle = tracker.getAngle('leftShoulder', 'leftWrist');
    let noseVelocity = tracker.getVelocity('nose');
    
    // Optional visualization
    tracker.drawPoint('nose', color(255, 0, 0));
    tracker.drawDistance('leftShoulder', 'rightShoulder');
    tracker.drawAll();  // Everything at once
  }
}
```

**Available Keypoints (by name):**
- **Head:** nose, leftEye, rightEye, leftEar, rightEar, leftMouth, rightMouth
- **Arms:** leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist
- **Hands:** leftPinky, rightPinky, leftIndex, rightIndex, leftThumb, rightThumb
- **Torso:** leftHip, rightHip
- **Legs:** leftKnee, rightKnee, leftAnkle, rightAnkle
- **Feet:** leftHeel, rightHeel, leftFootIndex, rightFootIndex

**API Methods:**
- `tracker.update()` - Call every frame
- `tracker.isPoseDetected()` - Check if body is detected
- `tracker.getPoint('name')` - Get keypoint by name
- `tracker.getDistance(p1, p2)` - Calculate distance between points
- `tracker.getAngle(p1, p2)` - Calculate angle between points
- `tracker.getVelocity('name')` - Get movement velocity (automatic previous frame tracking)
- `tracker.drawPoint(name, color)` - Visualize keypoint
- `tracker.drawDistance(p1, p2)` - Visualize measurement
- `tracker.drawAll()` - Visualize everything

**Purpose:**
Demonstrates how classes can wrap complex APIs to make them trivial to use. Drop BodyPoseTracker.js into any project for instant body tracking.

**Files:**
- `BodyPoseTracker.js` - 520 lines, complete wrapper class
- `sketch.js` - 180 lines, simple usage example
- `index.html` - Includes ML5, p5-phone
- `README.md` - Complete API reference, usage examples

---

### 06_gaze_detector_class

**GazeDetector class - simplified gaze tracking.**

**What It Does:**
- Face tracking using ML5 FaceMesh (3D landmarks)
- Gaze direction detection: "LEFT", "CENTER", "RIGHT"
- Gaze position as screen coordinates (X, Y)
- Automatic smoothing for stable tracking
- Adjustable sensitivity and range
- Built-in visualization and info display

**Key Code Patterns:**

```javascript
// Setup (1 line!)
let gazeDetector;

function setup() {
  createCanvas(405, 720);
  gazeDetector = new GazeDetector();
}

// Using the detector
function draw() {
  gazeDetector.update();
  
  if (gazeDetector.isFaceDetected()) {
    // Get gaze data multiple ways
    let direction = gazeDetector.getDirection();      // "LEFT", "CENTER", "RIGHT"
    let position = gazeDetector.getGazePosition();    // {x, y}
    let angle = gazeDetector.getGazeAngle();          // -1 to 1
    let verticalAngle = gazeDetector.getVerticalAngle(); // -1 to 1
    
    // Built-in visualization
    gazeDetector.drawKeypoints();      // Ears and nose
    gazeDetector.drawGazeIndicator();  // Gaze position circle
    gazeDetector.drawGazeInfo();       // Text overlay
    gazeDetector.drawAll();            // Everything
  }
}
```

**How Gaze Detection Works:**

The class tracks 3 face keypoints in 3D space:
1. Left ear (index 234)
2. Right ear (index 454)
3. Nose bridge (index 1)

Then calculates:
- Face center (midpoint between ears)
- Nose horizontal offset from center
- Normalize by face width
- Apply smoothing (reduces jitter)
- Map to screen coordinates

**Tunable Parameters:**

```javascript
// Constructor options
gazeDetector = new GazeDetector({
  gazeXThreshold: 0.15,      // X sensitivity (0.1-0.3, lower = more sensitive)
  smoothingFactor: 0.4,      // Smoothing (0-1, higher = smoother but slower)
  gazeRangeX: 1.5,           // Horizontal gaze range (1.0-3.0)
  gazeRangeY: 2.5,           // Vertical gaze range (1.0-4.0)
  showVideo: true,           // Show camera feed
  mirror: true               // Mirror for natural interaction
});

// Or adjust dynamically
gazeDetector.setXThreshold(0.12);
gazeDetector.setSmoothingFactor(0.6);
gazeDetector.setGazeRange(2.0, 3.0);
```

**API Methods:**
- `gazeDetector.update()` - Call every frame
- `gazeDetector.isFaceDetected()` - Check if face is detected
- `gazeDetector.getDirection()` - Returns "LEFT", "CENTER", or "RIGHT"
- `gazeDetector.getGazePosition()` - Returns {x, y}
- `gazeDetector.getGazeAngle()` - Returns -1 to 1 (horizontal)
- `gazeDetector.getVerticalAngle()` - Returns -1 to 1 (vertical)
- `gazeDetector.getKeypoints()` - Returns {leftEar, rightEar, nose}
- `gazeDetector.drawKeypoints()` - Visualize tracked points
- `gazeDetector.drawGazeIndicator(size)` - Visualize gaze position
- `gazeDetector.drawGazeInfo()` - Show direction, position, angle
- `gazeDetector.toggleVideo()` - Show/hide camera
- `gazeDetector.setXThreshold(value)` - Adjust sensitivity
- `gazeDetector.setSmoothingFactor(value)` - Adjust responsiveness

**Use Cases:**
- Menu navigation (look to select)
- Game control (gaze-controlled player)
- Attention tracking (measure focus)
- Interactive art (gaze-based drawing)
- Accessibility interfaces

**Purpose:**
Shows how classes can make complex computer vision trivial to integrate. Compare to function version (285 lines with manual gaze calculation) vs class version (1-line setup, clean API).

**Files:**
- `GazeDetector.js` - 430 lines, complete wrapper class
- `sketch.js` - 180 lines, usage examples
- `index.html` - Includes ML5, p5-phone
- `README.md` - Complete API reference, usage examples

---

## Core Concepts Reference


### Classes

**Constructor Pattern:**
```javascript
class MyClass {
  constructor(param1, param2) {
    this.property1 = param1;
    this.property2 = param2;
    this.init();  // Optional initialization
  }
  
  // Public method
  update() {
    this._privateMethod();
  }
  
  // Private method (convention: underscore prefix)
  _privateMethod() {
    // Internal logic
  }
  
  // Getter
  getValue() {
    return this.property1;
  }
}

// Usage
let instance = new MyClass(10, 20);
instance.update();
let value = instance.getValue();
```

**Encapsulation:**
- Keep related data and behavior together
- Hide complexity behind clean methods
- Expose only what users need

**Separation of Concerns:**
- Class file handles internal logic
- Main sketch handles program flow
- Clear responsibility boundaries

---

### localStorage

**Basic Operations:**
```javascript
// Save (string)
localStorage.setItem('key', 'value');

// Load (string)
let data = localStorage.getItem('key');

// Clear
localStorage.removeItem('key');

// Save (object - requires JSON)
let obj = { health: 100, level: 5 };
localStorage.setItem('gameData', JSON.stringify(obj));

// Load (object - requires parse)
let saved = localStorage.getItem('gameData');
if (saved !== null) {
  let obj = JSON.parse(saved);
}

// Check existence
if (localStorage.getItem('key') !== null) {
  // Key exists
}
```

**Common Patterns:**

```javascript
// Save on change
function updateHealth(newHealth) {
  health = newHealth;
  localStorage.setItem('health', health);
}

// Load on startup
function setup() {
  let savedHealth = localStorage.getItem('health');
  if (savedHealth !== null) {
    health = parseFloat(savedHealth);
  } else {
    health = 100;  // Default
  }
}

// Reset button
function resetData() {
  localStorage.removeItem('health');
  health = 100;
}
```

---

### Design Patterns

**Template Pattern (04_character_template_class):**
```javascript
class TemplateCharacter {
  constructor() {
    this.parameter = 50;
  }
  
  // Override these in your version
  calculateParameter() {
    // Add your logic here
  }
  
  behaviour1() {
    // What happens when parameter is high?
  }
  
  behaviour2() {
    // What happens when parameter is low?
  }
  
  // Don't modify this
  update() {
    this.calculateParameter();
    this.behaviour1();
    this.behaviour2();
  }
}
```

**Wrapper Pattern (05, 06 - ML5 wrappers):**
```javascript
class Wrapper {
  constructor() {
    this._complexAPI = null;
    this._init();  // Hide complex setup
  }
  
  _init() {
    // All the complex initialization code
    // User never sees this
  }
  
  // Provide simple public methods
  getSimpleData() {
    // Transform complex API to simple output
    return this._complexAPI.getData();
  }
}

// User experience
let wrapper = new Wrapper();  // One line!
let data = wrapper.getSimpleData();  // Clean!
```

**Composition (using multiple classes together):**
```javascript
let tracker = new BodyPoseTracker();
let character = new StressCharacter(x, y, anim1, anim2);

function draw() {
  tracker.update();
  
  if (tracker.isPoseDetected()) {
    let noseVel = tracker.getVelocity('nose');
    
    // Use tracking to affect character
    if (noseVel.speed > 10) {
      character.onShake(noseVel.speed / 10);
    }
  }
  
  character.update();
}
```

---

## Key Patterns

### Code Organization

**Separate Class Files:**
```
project/
├── index.html          → Loads libraries and scripts
├── MyClass.js          → Class definition with comments
└── sketch.js           → Main program using the class
```

**index.html loading order:**
```html
<!-- Libraries first -->
<script src="p5.js"></script>
<script src="ml5.js"></script>

<!-- Classes before sketch -->
<script src="MyClass.js"></script>

<!-- Main sketch last -->
<script src="sketch.js"></script>
```

**Class File Structure:**
```javascript
/**
 * MyClass - Brief description
 * 
 * Purpose: What it does
 * Usage: How to use it
 * Dependencies: What it needs
 */

class MyClass {
  /**
   * Constructor - Initialize instance
   * @param {type} param - Description
   */
  constructor(param) {
    // Properties
    this.property = param;
    
    // Initialization
    this._init();
  }
  
  // ============================================
  // PUBLIC API - Methods users call
  // ============================================
  
  /**
   * Update - Call every frame
   */
  update() {
    this._privateUpdate();
  }
  
  /**
   * Get data - Access internal state
   * @returns {type} Description
   */
  getData() {
    return this._data;
  }
  
  // ============================================
  // PRIVATE METHODS - Internal use only
  // ============================================
  
  _init() {
    // Setup logic
  }
  
  _privateUpdate() {
    // Internal update logic
  }
}
```

---

### State Management

**Flags for Complex Behavior:**
```javascript
class Character {
  constructor() {
    // State flags
    this.isMoving = false;
    this.isReturning = false;
    this.isFleeing = false;
    
    // Timers
    this.fleeTimer = 0;
    this.returnTimer = 0;
  }
  
  update() {
    // Priority-based state machine
    if (this.fleeTimer > 0) {
      this.fleeTimer--;
      this.continueFleeing();
    }
    else if (this.shouldFlee()) {
      this.startFleeing();
    }
    else if (this.shouldReturn()) {
      this.returnHome();
    }
    else {
      this.idle();
    }
  }
}
```

**Parameter Mapping:**
```javascript
// Map one range to another
moveSpeed = map(tiredness, 0, 100, 3.0, 0.9);
//          map(input, inputMin, inputMax, outputMin, outputMax)

// Map with constrain
moveSpeed = constrain(map(tiredness, 0, 100, 3.0, 0.9), 0.9, 3.0);

// Inverse mapping (high input → low output)
animSpeed = map(tiredness, 0, 100, 2, 12);  // Tired = slow animation
```

**Smoothing with Lerp:**
```javascript
// Smooth values to reduce jitter
// lerp(current, target, amount)
smoothValue = lerp(smoothValue, rawValue, 0.3);

// Common smoothing amounts:
// 0.1-0.3 = heavy smoothing (very smooth, slow response)
// 0.4-0.6 = moderate smoothing (balanced)
// 0.7-0.9 = light smoothing (responsive, some jitter)
```

---

### Reusability Patterns

**Creating Multiple Instances:**
```javascript
// Create many from one class definition
let circles = [];

for (let i = 0; i < 20; i++) {
  circles.push(new Circle(random(width), random(height)));
}

// Update all
circles.forEach(c => c.update());

// Filter dead instances
circles = circles.filter(c => !c.isDead());
```

**Class Composition:**
```javascript
// Combine classes for complex behavior
class Game {
  constructor() {
    this.tracker = new BodyPoseTracker();
    this.player = new StressCharacter(x, y, anim1, anim2);
    this.enemies = [];
    
    for (let i = 0; i < 5; i++) {
      this.enemies.push(new Enemy(random(width), random(height)));
    }
  }
  
  update() {
    this.tracker.update();
    this.player.update();
    this.enemies.forEach(e => e.update());
    
    // Interaction between systems
    if (this.tracker.isPoseDetected()) {
      let handPos = this.tracker.getPoint('rightWrist');
      this.checkEnemyCollisions(handPos);
    }
  }
}
```

**Extending Classes:**
```javascript
// Base class
class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.health = 100;
  }
  
  update() {
    // Basic update
  }
}

// Extended class
class StressCharacter extends Character {
  constructor(x, y) {
    super(x, y);  // Call parent constructor
    this.stress = 0;  // Add new properties
  }
  
  update() {
    super.update();  // Call parent update
    this.updateStress();  // Add new behavior
  }
  
  updateStress() {
    // Stress-specific logic
  }
}
```

---

## Development Tips

### Mobile Testing
- Examples designed for 405×720 portrait
- Use actual device for sensor testing (shake, gyroscope, microphone)
- Chrome DevTools mobile emulation doesn't support all sensors

### Using These Classes in Projects

**Step 1:** Copy the class file (e.g., `BodyPoseTracker.js`) into your project folder

**Step 2:** Link it in HTML before sketch.js
```html
<script src="BodyPoseTracker.js"></script>
<script src="sketch.js"></script>
```

**Step 3:** Create instance in setup()
```javascript
let tracker;

function setup() {
  createCanvas(405, 720);
  tracker = new BodyPoseTracker();
}
```

**Step 4:** Use the API in draw()
```javascript
function draw() {
  tracker.update();
  
  if (tracker.isPoseDetected()) {
    let nose = tracker.getPoint('nose');
    circle(nose.x, nose.y, 50);
  }
}
```

### Creating Your Own Classes

**Follow this pattern:**

1. **Identify related data and behavior**
   - What properties belong together?
   - What methods operate on those properties?

2. **Group into a class**
   - Constructor initializes properties
   - Methods provide behavior
   - Getters/setters for controlled access

3. **Separate file for reusability**
   - One class per file (usually)
   - Extensive comments
   - Clear public API

4. **Document with comments**
   - Class purpose
   - Constructor parameters
   - Method descriptions
   - Usage examples

---

## Library Documentation

- **p5.js:** https://p5js.org/reference/
- **p5play:** https://p5play.org/learn/
- **p5-phone:** https://github.com/ml5js/p5-phone
- **ml5.js:** https://ml5js.org/
- **localStorage:** https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

## Related Sessions

- **[Friday 7th](../friday_7th/)** - Character controllers with parameter systems
- **[Friday 31st](../friday_31st/)** - ML5 tracking methods (function-based versions)
- **[Wednesday 29th](../wednesday_29th/)** - ML5 basics (camera, FaceMesh, HandPose, BodyPose)
- **[Wednesday 5th](../wednesday_5th/)** - p5play character animation

---

## Credits

Examples developed for mobile machine learning workshop exploring object-oriented programming, data persistence, and API wrapper patterns.

**Purpose:** Demonstrate how classes and localStorage transform code organization and enable sophisticated interactive systems.
