# Friday Examples - ML5 + p5play

**Live Demo:** [https://npuckett.github.io/mlphone/friday/](https://npuckett.github.io/mlphone/friday/)

---

## Table of Contents

1. [01 - Tracking Data Methods (Simple)](#01---tracking-data-methods-simple)
   - [Core Pattern: Two-Variable Method](#core-pattern-two-variable-method)
   - [Methods for Accessing Tracking Data](#methods-for-accessing-tracking-data)
   - [Coordinate Mapping with PhoneCamera](#coordinate-mapping-with-phonecamera)
   - [Keypoint Indices Reference](#keypoint-indices-reference)

2. [02 - Tracking Data (Advanced)](#02---tracking-data-advanced)
   - [Pattern 1: 3D Gaze Detection](#pattern-1-3d-gaze-detection)
   - [Pattern 2: Gesture Detection from Velocity History](#pattern-2-gesture-detection-from-velocity-history)
   - [Key Differences: Simple vs Advanced](#key-differences-simple-vs-advanced)
   - [Tunable Parameters](#tunable-parameters-in-advanced-examples)

3. [03 - p5play Basics](#03---p5play-basics)
   - [Example 1: Basic Chase](#example-1-basic-chase-p5play_01_basic_chase)
   - [Example 2: Bouncing Ball](#example-2-bouncing-ball-p5play_03_bouncing_ball)
   - [Essential p5play Concepts](#essential-p5play-concepts)
   - [Sprite Properties Reference](#sprite-properties-reference)

4. [04 - ML5 + p5play Integration](#04---ml5--p5play-integration)
   - [Example 1: Handpose Chase](#example-1-handpose-chase-p5play_02_handpose_chase)
   - [Example 2: Handpose Ball](#example-2-handpose-ball-p5play_04_handpose_ball)
   - [Example 3: Gaze Sprites](#example-3-gaze-sprites-p5play_05_gaze_sprites)
   - [Integration Pattern: ML5 → p5play](#integration-pattern-ml5--p5play)
   - [Key Integration Techniques](#key-integration-techniques)

---

# 01 - Tracking Data Methods (Simple)

This folder contains three examples that demonstrate the **two-variable method** for accessing and working with ML5 pose tracking data. Each example tracks multiple points and calculates measurements between them.

## Examples

1. **PHONE_BodyPose_two_points** - Tracks body keypoints (shoulders, wrists, nose)
2. **PHONE_FaceMesh_two_points** - Tracks face keypoints (eyes, lips, nose)
3. **PHONE_HandPose_two_points** - Tracks hand keypoints (fingertips, wrist)

---

## Core Pattern: Two-Variable Method

The **two-variable method** separates the keypoint index from the keypoint data, making it easy to track specific points and perform calculations with them.

### Structure

```javascript
// 1. Declare index variable (which point to track)
let bodyPointIndex1 = 11;   // Left shoulder

// 2. Declare data variable (stores the point's coordinates)
let bodyPointData1 = null;  // Will store {x, y, confidence}

// 3. In draw(), update the data variable
bodyPointData1 = getKeypoint(bodyPointIndex1, 0);

// 4. Use the data for drawing or calculations
if (bodyPointData1) {
  circle(bodyPointData1.x, bodyPointData1.y, 20);
}
```

---

## Methods for Accessing Tracking Data

### 1. **Getting a Single Keypoint**

```javascript
// getKeypoint(index, poseNumber)
// - index: Which keypoint to get (e.g., 0 for nose, 11 for left shoulder)
// - poseNumber: Which detected pose/face/hand (default: 0 for first one)

let pointData = getKeypoint(11, 0);  // Get left shoulder from first pose

// Returns: {x, y, confidence} or null if not found
if (pointData) {
  console.log(pointData.x, pointData.y);
}
```

**The `getKeypoint()` function:**
- Safely checks if the pose/face/hand exists
- Retrieves the specific keypoint by index
- **Uses `cam.mapKeypoint()`** to transform coordinates from camera space to canvas space
- Handles mirroring automatically (for front-facing camera)
- Returns `null` if the point isn't available

### 2. **Measuring Distance Between Two Points**

```javascript
// measureDistance(point1, point2)
// Calculates pixel distance between two points

let distance1_2 = measureDistance(bodyPointData1, bodyPointData2);

// Returns: distance in pixels (e.g., 150.5)
// Also draws a line between points if showData is true
```

**What it does:**
- Uses Pythagorean theorem: `sqrt((x2-x1)² + (y2-y1)²)`
- Visualizes with a white line connecting the points
- Displays the distance value as text

### 3. **Measuring Angle Between Two Points**

```javascript
// measureAngle(basePoint, endPoint)
// Calculates angle from horizontal in degrees

let angle1_2 = measureAngle(bodyPointData1, bodyPointData2);

// Returns: angle in degrees (0-360)
// Also draws an arc showing the angle if showData is true
```

**What it does:**
- Uses `atan2()` to calculate angle from horizontal
- Converts from radians to degrees
- Visualizes with an arc from the base point
- Displays the angle value as text

### 4. **Measuring Velocity (Motion)**

```javascript
// measureVelocity(currentPoint, previousPoint)
// Calculates movement between frames

// Store previous frame's position
bodyPointData5Prev = bodyPointData5;
bodyPointData5 = getKeypoint(bodyPointIndex5, 0);

// Calculate velocity
let velocity5 = measureVelocity(bodyPointData5, bodyPointData5Prev);

// Returns: {x, y, speed}
// - x: horizontal velocity (pixels/frame)
// - y: vertical velocity (pixels/frame)
// - speed: total speed (pixels/frame)
```

**What it does:**
- Calculates change in position: `dx = current.x - previous.x`
- Computes speed: `sqrt(dx² + dy²)`
- Visualizes with an arrow showing direction and magnitude
- Displays x, y, and speed values as text

---

## Coordinate Mapping with PhoneCamera

All examples use **`cam.mapKeypoint()`** to transform coordinates:

```javascript
// Inside getKeypoint()
return cam.mapKeypoint(point);
```

### Why this matters:
- **Camera space** ≠ **Canvas space**
  - Camera might be 1920×1080
  - Canvas might be 405×720
- `mapKeypoint()` handles:
  - Scaling coordinates to match canvas
  - Mirroring (for front camera)
  - Aspect ratio adjustments
  - fitHeight/fitWidth/cover modes

---

## Global Variable Pattern

Each example follows this structure:

```javascript
// GLOBAL VARIABLES
let bodyPointIndex1 = 11;   // Which point to track
let bodyPointData1 = null;  // Stores the point data

let bodyPointIndex2 = 12;
let bodyPointData2 = null;

let distance1_2 = 0;  // Measurement between points
let angle1_2 = 0;     // Angle between points

// IN DRAW()
function draw() {
  // Update point data
  bodyPointData1 = getKeypoint(bodyPointIndex1, 0);
  bodyPointData2 = getKeypoint(bodyPointIndex2, 0);
  
  // Calculate measurements
  distance1_2 = measureDistance(bodyPointData1, bodyPointData2);
  angle1_2 = measureAngle(bodyPointData1, bodyPointData2);
  
  // Use the data
  if (bodyPointData1 && bodyPointData2) {
    showPoint(bodyPointData1, color(255, 0, 0));
    showPoint(bodyPointData2, color(0, 0, 255));
  }
}
```

---

## Keypoint Indices Reference

### BodyPose (33 points)
- **Nose:** 0
- **Eyes:** 1-6
- **Ears:** 7-8
- **Mouth:** 9-10
- **Shoulders:** 11 (left), 12 (right)
- **Elbows:** 13 (left), 14 (right)
- **Wrists:** 15 (left), 16 (right)
- **Hands:** 17-22
- **Hips:** 23 (left), 24 (right)
- **Knees:** 25 (left), 26 (right)
- **Ankles:** 27 (left), 28 (right)
- **Feet:** 29-32

### FaceMesh (468 points)
Key landmarks:
- **Nose tip:** 4
- **Eyes:** 234 (left outer), 454 (right outer), 1 (right inner)
- **Lips:** 13 (upper center), 14 (lower center)
- **Chin:** 152

### HandPose (21 points per hand)
- **Wrist:** 0
- **Thumb:** 1, 2, 3, 4 (tip)
- **Index:** 5, 6, 7, 8 (tip)
- **Middle:** 9, 10, 11, 12 (tip)
- **Ring:** 13, 14, 15, 16 (tip)
- **Pinky:** 17, 18, 19, 20 (tip)

---

## Key Takeaways

1. **Two-variable method** = Index variable + Data variable
2. **`getKeypoint()`** safely retrieves and maps coordinates
3. **`cam.mapKeypoint()`** transforms camera coordinates to canvas coordinates
4. **Measurement functions** calculate distance, angle, and velocity
5. **Global variables** store both indices and data for easy access
6. **Null checking** ensures code doesn't crash when points aren't detected

---

## Usage Pattern

```javascript
// Step 1: Declare at top
let pointIndex1 = 11;
let pointData1 = null;

// Step 2: Update in draw()
pointData1 = getKeypoint(pointIndex1, 0);

// Step 3: Check and use
if (pointData1) {
  circle(pointData1.x, pointData1.y, 20);
}
```

This pattern makes it easy to:
- Switch which points you're tracking (change the index)
- Reuse measurement functions
- Keep code organized and readable
- Handle missing data gracefully

---

# 02 - Tracking Data (Advanced)

This folder builds on the **two-variable method** from `01_trackingDataMethods-simple` to create more sophisticated applications that interpret tracking data as meaningful interactions.

## Examples

1. **PHONE_FaceMesh_gaze_detection** - Detects where the user is looking on screen
2. **PHONE_FaceMesh_gesture_detection** - Recognizes head gestures (Yes/No nods)

---

## How These Build on Simple Patterns

The advanced examples use **the same core methods** from the simple examples:
- `getKeypoint()` - Get individual points
- `measureVelocity()` - Track motion over time
- Two-variable method (index + data)

**What's new:**
- **3D keypoint data** (x, y, z coordinates)
- **Velocity history** (analyzing patterns over multiple frames)
- **State machines** (interpreting data as gestures/directions)
- **Smoothing algorithms** (reducing jitter for stable output)
- **Threshold tuning** (adjustable parameters for different use cases)

---

## Pattern 1: 3D Gaze Detection

**File:** `PHONE_FaceMesh_gaze_detection`

### What it does:
Determines where the user is looking on screen by analyzing the 3D position of facial features (nose and ears).

### New Concepts:

#### 1. **Accessing 3D Data (Z-axis)**

Unlike the simple examples that only use x and y, this accesses the **raw keypoint data** before mapping to get Z values:

```javascript
// Get the MAPPED keypoint (for screen position)
leftEarData = getKeypoint(leftEarIndex, 0);  // Returns {x, y, confidence}

// Get the RAW keypoint (for Z-axis depth)
let leftEarRaw = faces[0].keypoints[leftEarIndex];  // Returns {x, y, z}

// Now we have both:
// - leftEarData.x, leftEarData.y for screen drawing
// - leftEarRaw.z for depth information
```

**Why both?**
- **Mapped data** (from `getKeypoint()`) is scaled to canvas for visualization
- **Raw data** contains the Z-axis depth that gets lost in mapping

#### 2. **Normalizing by Face Size**

To make gaze detection work at different distances from camera:

```javascript
// Calculate face width (distance between ears)
let faceWidth = abs(leftEarRaw.x - rightEarRaw.x);

// Normalize nose offset by face width
let normalizedOffsetX = noseOffsetX / faceWidth;

// Now the offset is relative (0.5 = 50% of face width)
// Works whether user is near or far from camera
```

#### 3. **Smoothing with lerp()**

Raw tracking data can be jittery. Smoothing creates stable output:

```javascript
// SMOOTHING_FACTOR controls how much smoothing (0-1)
// 0 = no smoothing (instant response, jittery)
// 1 = max smoothing (very smooth, slow response)
smoothedGazeAngle = lerp(smoothedGazeAngle, gazeAngle, 1 - SMOOTHING_FACTOR);
```

**How lerp() works:**
- `lerp(start, end, amount)` interpolates between two values
- `amount = 0` returns start value
- `amount = 1` returns end value
- `amount = 0.6` means move 60% toward end value
- Creates gradual transitions instead of instant jumps

#### 4. **Threshold-Based State Detection**

Converting continuous data to discrete states:

```javascript
// Define threshold
let GAZE_X_THRESHOLD = 0.15;  // Adjustable sensitivity

// Classify into states
if (smoothedGazeAngle < -GAZE_X_THRESHOLD) {
  gazeDirection = "LEFT";
} else if (smoothedGazeAngle > GAZE_X_THRESHOLD) {
  gazeDirection = "RIGHT";
} else {
  gazeDirection = "CENTER";
}
```

**Dead zone:** The CENTER state creates a "dead zone" preventing constant flickering between states.

#### 5. **Mapping to Screen Space**

Translating gaze angle to screen coordinates:

```javascript
// Map gaze angle (-1 to 1) to screen width (0 to width)
// GAZE_RANGE_X controls how far gaze extends (multiplier)
gazeX = width / 2 - (smoothedGazeAngle * width * GAZE_RANGE_X);

// Constrain to keep on screen
gazeX = constrain(gazeX, 0, width);
```

### Complete Flow:

```javascript
// 1. Get raw 3D data
let leftEarRaw = faces[0].keypoints[leftEarIndex];
let noseRaw = faces[0].keypoints[noseIndex];

// 2. Calculate face dimensions
let faceWidth = abs(leftEarRaw.x - rightEarRaw.x);

// 3. Calculate normalized offset
let noseOffsetX = noseRaw.x - earCenterX;
let normalizedOffsetX = noseOffsetX / faceWidth;

// 4. Apply smoothing
smoothedGazeAngle = lerp(smoothedGazeAngle, normalizedOffsetX, 0.6);

// 5. Classify state
if (smoothedGazeAngle < -0.15) gazeDirection = "LEFT";

// 6. Map to screen
gazeX = width / 2 - (smoothedGazeAngle * width * 1.5);
```

---

## Pattern 2: Gesture Detection from Velocity History

**File:** `PHONE_FaceMesh_gesture_detection`

### What it does:
Recognizes head gestures (nodding Yes, shaking No) by analyzing nose velocity patterns over time.

### New Concepts:

#### 1. **Velocity History Array**

Store recent velocity data to analyze patterns:

```javascript
let gestureHistory = [];        // Stores recent velocities
const HISTORY_LENGTH = 10;      // Number of frames to analyze

// In draw(), add current velocity to history
gestureHistory.push({ 
  x: velocity.x, 
  y: velocity.y, 
  speed: velocity.speed 
});

// Keep only recent history
if (gestureHistory.length > HISTORY_LENGTH) {
  gestureHistory.shift();  // Remove oldest
}
```

**Why?**
- Single frame velocity is noisy
- Gestures are patterns over time
- Analyzing 10 frames reveals intent

#### 2. **Pattern Analysis with Ratios**

Detect dominant direction of motion:

```javascript
// Thresholds
const SPEED_THRESHOLD_YES = 2;      // Minimum speed
const VERTICAL_RATIO = 2.0;          // Vy must be 2x larger than Vx

// Analyze each frame
for (let v of gestureHistory) {
  // YES = Strong vertical motion
  if (v.speed > SPEED_THRESHOLD_YES && 
      Math.abs(v.y) > Math.abs(v.x) * VERTICAL_RATIO) {
    activeFramesYes++;
    totalVy += Math.abs(v.y);
  }
  
  // NO = Strong horizontal motion
  if (v.speed > SPEED_THRESHOLD_NO && 
      Math.abs(v.x) > Math.abs(v.y) * HORIZONTAL_RATIO) {
    activeFramesNo++;
    totalVx += Math.abs(v.x);
  }
}
```

**Ratios ensure clear direction:**
- `abs(vy) > abs(vx) * 2.0` means vertical is at least 2x horizontal
- Prevents diagonal motion from triggering gestures

#### 3. **Confidence Calculation**

How sure are we about the detected gesture?

```javascript
// Count percentage of frames showing the gesture
let confidenceYes = activeFramesYes / HISTORY_LENGTH;  // 0-1

// Or use average speed
let confidenceFromSpeed = Math.min(1, avgSpeed / 15);  // Cap at 1.0

// Use confidence to:
// - Require minimum confidence before triggering
// - Scale visual feedback
// - Weight multiple gesture inputs
```

#### 4. **State Machine Pattern**

```javascript
let gestureState = "Not Sure";  // Current state

// Update state based on analysis
if (activeFramesYes > HISTORY_LENGTH * 0.4 && avgVy > avgVx) {
  gestureState = "Yes";
} else if (activeFramesNo > HISTORY_LENGTH * 0.4 && avgVx > avgVy) {
  gestureState = "No";
} else {
  gestureState = "Not Sure";
}

// External code can check state
if (gestureState === "Yes") {
  // Do something
}
```

#### 5. **Gesture Counter/Accumulator**

Track cumulative gestures over time:

```javascript
let gestureCounter = 0;  // Accumulates over time

// In detectGesture()
if (gestureState === "Yes") {
  gestureCounter++;      // Nod up = increase
} else if (gestureState === "No") {
  gestureCounter--;      // Shake = decrease
}
// "Not Sure" leaves counter unchanged

// Use counter for:
// - Scrolling (counter = scroll position)
// - Volume control
// - Navigation through menu items
```

### Complete Flow:

```javascript
// 1. Calculate velocity (from simple method)
noseDataPrev = noseData;
noseData = getKeypoint(noseIndex, 0);
velocity = measureVelocity(noseData, noseDataPrev);

// 2. Store in history
gestureHistory.push(velocity);
if (gestureHistory.length > 10) gestureHistory.shift();

// 3. Analyze pattern
let activeFramesYes = 0;
for (let v of gestureHistory) {
  if (v.speed > 2 && abs(v.y) > abs(v.x) * 2.0) {
    activeFramesYes++;
  }
}

// 4. Determine state
if (activeFramesYes > 4) {  // 40% of frames
  gestureState = "Yes";
  gestureCounter++;
}

// 5. Use state
if (gestureState === "Yes") {
  background(0, 255, 0);  // Green background
}
```

---

## Key Differences: Simple vs Advanced

| Aspect | Simple (01) | Advanced (02) |
|--------|-------------|---------------|
| **Data type** | 2D (x, y) | 3D (x, y, z) |
| **Time window** | Single frame | Multiple frames (history) |
| **Output** | Raw measurements | Interpreted states |
| **Smoothing** | None | lerp() smoothing |
| **Analysis** | Direct values | Pattern recognition |
| **Use case** | See the data | Interact with data |

---

## Tunable Parameters in Advanced Examples

Both advanced examples expose parameters for customization:

### Gaze Detection
```javascript
let GAZE_Z_THRESHOLD = 15;     // Z-axis depth sensitivity (5-30)
let GAZE_X_THRESHOLD = 0.15;   // Horizontal threshold (0.1-0.3)
let SMOOTHING_FACTOR = 0.4;    // Smoothing amount (0-1)
let GAZE_RANGE_X = 1.5;        // Horizontal range multiplier
let GAZE_RANGE_Y = 2.5;        // Vertical range multiplier
```

### Gesture Detection
```javascript
const SPEED_THRESHOLD_YES = 2;      // Min speed for Yes
const SPEED_THRESHOLD_NO = 3;       // Min speed for No
const VERTICAL_RATIO = 2.0;         // Vertical dominance
const HORIZONTAL_RATIO = 2.0;       // Horizontal dominance
const HISTORY_LENGTH = 10;          // Frames to analyze
```

**Why adjustable?**
- Different users move at different speeds
- Different cameras have different sensitivities
- Different applications need different responsiveness
- Experimentation leads to better interactions

---

# 03 - p5play Basics

This folder introduces **p5play**, a game and interactive physics library for p5.js. These examples demonstrate core p5play concepts that will be used in the next section (04_ml5_p5play) to connect ML5 tracking data with interactive sprites.

## Examples

1. **p5play_01_basic_chase** - Mouse-controlled sprites with chase behavior
2. **p5play_03_bouncing_ball** - Physics simulation with paddle interaction

---

## Why Learn p5play?

p5play provides:
- **Sprites** - Interactive objects with built-in physics
- **Movement methods** - `moveTo()`, `moveTowards()`, `attractTo()`
- **Collision detection** - `overlaps()`, `collides()`
- **Physics simulation** - Gravity, velocity, bounciness
- **Easy animations** - Scale, rotation, color changes

**The connection to ML5:**
- ML5 gives you **tracking data** (x, y positions)
- p5play gives you **interactive objects** (sprites)
- Combine them: tracking data → sprite movement

---

## Example 1: Basic Chase (p5play_01_basic_chase)

### What it demonstrates:
- Creating sprites with `new Sprite()`
- Kinematic physics (manual control)
- `moveTo()` for smooth chasing behavior
- `distanceTo()` for distance calculations
- Sprite properties: `x`, `y`, `diameter`, `color`, `scale`
- Animation using `scale` property

### Key Code Patterns:

#### 1. **Creating Sprites**

```javascript
// Create a sprite
leader = new Sprite();
leader.diameter = 50;
leader.color = 'dodgerblue';
leader.physics = 'kinematic';  // Manual control, no physics forces

// Position the sprite
leader.x = width / 2;
leader.y = height / 2;
```

**Physics types:**
- `'kinematic'` - Manual control (set x/y directly), no gravity
- `'dynamic'` - Full physics simulation (affected by gravity, forces)
- `'static'` - Doesn't move, but other sprites collide with it
- `'none'` - No physics body at all

#### 2. **Direct Position Control**

```javascript
// In draw() loop - sprite follows mouse
leader.x = mouse.x;
leader.y = mouse.y;
```

**Why kinematic?** Setting `x` and `y` directly only works smoothly with kinematic physics.

#### 3. **Chase Behavior with moveTo()**

```javascript
// chaser automatically moves toward leader's position
chaser.moveTo(leader.x, leader.y, 3);
// Arguments: (targetX, targetY, speed)
```

**What moveTo() does:**
- Calculates direction to target
- Sets sprite's velocity to move toward target
- Speed parameter controls how fast (pixels per frame)
- Automatically stops at destination
- Updates sprite's `direction` property

#### 4. **Distance Calculations**

```javascript
// p5play provides built-in distance method
let distance = leader.distanceTo(chaser);

// Alternative using p5.js dist()
let distance = dist(leader.x, leader.y, chaser.x, chaser.y);
```

#### 5. **Collision/Overlap Detection**

```javascript
// Set up overlap relationship (for kinematic sprites)
chaser.overlaps(leader);

// Manual distance-based detection
let distanceBetween = dist(chaser.x, chaser.y, leader.x, leader.y);
let touchingDistance = (chaser.diameter/2) + (leader.diameter/2);
let isTouching = distanceBetween < touchingDistance;
```

#### 6. **Sprite Animation - Scale Property**

```javascript
// Pulsing/breathing animation
let pulse = sin(frameCount * 0.15) * 0.4 + 1;  // Oscillates 0.6 to 1.4
chaser.scale = pulse;
```

**Why scale instead of diameter?**
- `scale` is a visual multiplier (1.0 = 100% size)
- Works better with physics bodies
- Animates smoothly without changing collider
- Can scale x and y independently: `sprite.scale.x`, `sprite.scale.y`

#### 7. **Accessing Sprite Velocity**

```javascript
// p5play automatically calculates velocity based on movement
let speed = Math.sqrt(chaser.vel.x * chaser.vel.x + chaser.vel.y * chaser.vel.y);

// Or use the built-in speed property
let speed = chaser.speed;
```

---

## Example 2: Bouncing Ball (p5play_03_bouncing_ball)

### What it demonstrates:
- Dynamic physics with gravity
- Sprite groups for walls
- Velocity-based movement
- Ball-paddle collisions
- Static physics (immovable walls)

### Key Code Patterns:

#### 1. **Setting Up World Physics**

```javascript
function setup() {
  // Enable gravity
  world.gravity.y = 10;  // Positive = down
  
  // world.gravity.x = 0;  // Horizontal gravity (optional)
}
```

#### 2. **Dynamic Sprite (Ball)**

```javascript
ball = new Sprite();
ball.diameter = 30;
ball.color = 'yellow';
ball.bounciness = 0.8;   // 0 = no bounce, 1 = perfect bounce
ball.friction = 0.01;    // Surface friction (0 = slippery)

// physics defaults to 'dynamic'
// Dynamic sprites are affected by gravity and forces
```

**Dynamic physics properties:**
- `bounciness` (0-1) - Energy retained after collision
- `friction` (0-1) - Resistance when sliding
- `mass` - Affects collisions (auto-calculated from size)
- `drag` - Air resistance
- `gravityScale` - Multiplier for gravity effect (default 1)

#### 3. **Kinematic Sprite (Paddle)**

```javascript
paddle = new Sprite();
paddle.width = 100;
paddle.height = 20;
paddle.physics = 'kinematic';  // Manual control but still collides
```

**Kinematic + Collisions:** Kinematic sprites can collide with dynamic sprites but won't be pushed by them.

#### 4. **Velocity-Based Movement**

```javascript
// Calculate direction to mouse
let dx = mouse.x - paddle.x;
let dy = mouse.y - paddle.y;

// Set velocity directly for smooth following
paddle.vel.x = dx * 0.3;  // 0.3 = responsiveness factor
paddle.vel.y = dy * 0.3;
```

**Why velocity instead of moveTo()?**
- More responsive control
- Better for physics interactions
- Maintains collision detection
- Smoother for fast movement

**Comparison:**
```javascript
// moveTo() - moves toward target at constant speed
sprite.moveTo(x, y, speed);

// velocity - sets movement rate, recalculated each frame
sprite.vel.x = dx * factor;
sprite.vel.y = dy * factor;
```

#### 5. **Static Sprites (Walls)**

```javascript
walls = new Group();
walls.color = 'gray';
walls.physics = 'static';  // Never moves

// Create walls using the group as a constructor
new walls.Sprite(width/2, -5, width, 10);  // Top wall
new walls.Sprite(width/2, height + 5, width, 10);  // Bottom
new walls.Sprite(-5, height/2, 10, height);  // Left
new walls.Sprite(width + 5, height/2, 10, height);  // Right
```

**Static sprites:**
- Completely immovable
- Other sprites collide and bounce off them
- Perfect for walls, floors, platforms
- No computational cost for physics (don't move)

#### 6. **Sprite Groups**

```javascript
// Create a group
walls = new Group();

// Set properties for all sprites in group
walls.color = 'gray';
walls.physics = 'static';

// Create sprites in the group
new walls.Sprite(x, y, w, h);
```

**Group benefits:**
- Apply properties to multiple sprites at once
- Collision detection with entire group: `ball.collides(walls)`
- Organize related sprites
- Iterate through group: `for (let wall of walls)`

---

## Essential p5play Concepts

### Sprite Creation Patterns

```javascript
// Basic sprite (50x50 box at center)
let sprite = new Sprite();

// Sprite at position (x, y)
let sprite = new Sprite(x, y);

// Box sprite with dimensions
let sprite = new Sprite(x, y, width, height);

// Circle sprite (if only 3 params)
let sprite = new Sprite(x, y, diameter);
```

### Movement Methods Summary

| Method | Use Case | Control Type |
|--------|----------|--------------|
| `sprite.x = value` | Direct teleport | Immediate |
| `sprite.vel.x = value` | Set velocity | Physics-based |
| `moveTo(x, y, speed)` | Move toward point | Automatic |
| `moveTowards(x, y, tracking)` | Gradual approach | Percentage-based |
| `attractTo(x, y, force)` | Apply force toward | Physics force |

### Distance and Collision

```javascript
// Distance between sprites
let dist = sprite1.distanceTo(sprite2);

// Set up collision relationship
sprite1.collides(sprite2, callback);
sprite1.overlaps(sprite2, callback);

// Check in draw()
if (sprite1.colliding(sprite2)) {
  // Collision is happening
}
```

---

## Sprite Properties Reference

### Position
```javascript
sprite.x, sprite.y        // Position
sprite.vel.x, sprite.vel.y  // Velocity (pixels per frame)
sprite.direction          // Angle of movement (degrees)
sprite.speed              // Movement speed
```

### Appearance
```javascript
sprite.color              // Fill color
sprite.diameter           // For circles
sprite.width, sprite.height  // For boxes
sprite.scale              // Size multiplier (1.0 = normal)
sprite.rotation           // Rotation angle (degrees)
sprite.opacity            // Transparency (0-1)
```

### Physics
```javascript
sprite.physics            // 'dynamic', 'kinematic', 'static', 'none'
sprite.bounciness         // 0-1 (default 0.2)
sprite.friction           // 0-1 (default 0.5)
sprite.mass               // Calculated from size and density
sprite.gravityScale       // Gravity multiplier (default 1)
```

### Animation
```javascript
sprite.scale              // Visual size multiplier
sprite.rotation           // Rotation angle
sprite.rotationSpeed      // Auto-rotation per frame
sprite.opacity            // Fade in/out
```

---

## Key Takeaways

1. **Three physics types:**
   - `kinematic` - Manual control (for tracking data)
   - `dynamic` - Full physics (for game objects)
   - `static` - Immovable (for boundaries)

2. **Movement approaches:**
   - Direct: `sprite.x = value` (kinematic only)
   - Velocity: `sprite.vel.x = value` (smooth physics)
   - Methods: `moveTo()`, `attractTo()` (automated)

3. **Collision detection:**
   - Set relationship: `sprite.overlaps(target)`
   - Check state: `sprite.overlapping(target)`
   - Works with groups: `sprite.collides(group)`

4. **Animation:**
   - Use `scale` for size animation
   - Use `rotation` for spin animation
   - Use `sin(frameCount)` for oscillation

5. **Next step:** Connect ML5 tracking data to sprite movement!

---

# 04 - ML5 + p5play Integration

This folder brings together everything from sections 01-03, combining **ML5 tracking data** with **p5play sprites** to create interactive experiences. These examples demonstrate the key pattern: **tracking data controls sprite positions**.

## Examples

1. **p5play_02_handpose_chase** - Hand tracking controls leader sprite, chaser follows
2. **p5play_04_handpose_ball** - Four fingertips control paddles, balls bounce with physics
3. **p5play_05_gaze_sprites** - Gaze detection controls sprite, interacts with targets

---

## Integration Pattern: ML5 → p5play

The core pattern used in all three examples:

```javascript
// 1. GET tracking data (from ML5)
fingerData = getKeypoint(fingerIndex, 0);

// 2. SET sprite position (p5play)
if (fingerData) {
  sprite.x = fingerData.x;
  sprite.y = fingerData.y;
}
```

**Why this works:**
- ML5 gives you `{x, y}` coordinates from tracking
- p5play sprites have `x` and `y` properties
- Simply assign one to the other!

---

## Example 1: Handpose Chase (p5play_02_handpose_chase)

### What it demonstrates:
- **ML5 HandPose** tracking index fingertip (keypoint 8)
- **p5play kinematic sprite** controlled by finger position
- **Chase behavior** using `moveTo()`
- **Velocity-based movement** for smooth finger control
- **Collision detection** with `overlaps()`
- **Statistics tracking** (distance, catches)

### Key Integration Code:

#### 1. **Setup: Camera + ML5 + p5play**

```javascript
function setup() {
  createCanvas(405, 720);
  
  // Camera setup
  cam = createPhoneCamera('user', true, 'fitHeight');
  
  // ML5 HandPose setup (after camera ready)
  cam.onReady(() => {
    let options = {
      maxHands: 1,
      runtime: 'mediapipe',
      flipHorizontal: false  // cam.mapKeypoint() handles mirroring
    };
    handpose = ml5.handPose(options, () => {
      handpose.detectStart(cam.videoElement, gotHands);
    });
  });
  
  // p5play sprites
  leader = new Sprite();
  leader.physics = 'kinematic';  // Manual control
  
  chaser = new Sprite();
  chaser.physics = 'kinematic';
  chaser.overlaps(leader);  // Set up collision detection
}
```

**Key setup pattern:**
1. Create camera first
2. Wait for `cam.onReady()` before creating ML5 model
3. Create sprites with `kinematic` physics for manual control

#### 2. **Draw: Connect Tracking to Sprites**

```javascript
function draw() {
  // Default position (when no hand detected)
  let targetX = width / 2;
  let targetY = height / 2;
  
  // Get tracking data
  if (hands.length > 0) {
    fingerData = getKeypoint(8, 0);  // Index finger tip
    
    if (fingerData) {
      targetX = fingerData.x;
      targetY = fingerData.y;
    }
  }
  
  // Move leader using velocity (smooth following)
  let dx = targetX - leader.x;
  let dy = targetY - leader.y;
  leader.vel.x = dx * 0.3;  // 0.3 = responsiveness factor
  leader.vel.y = dy * 0.3;
  
  // Chaser automatically follows leader
  chaser.moveTo(leader.x, leader.y, 3);
}
```

**Why velocity instead of direct position?**
```javascript
// OPTION A: Direct position (can be jumpy)
leader.x = fingerData.x;
leader.y = fingerData.y;

// OPTION B: Velocity-based (smooth, responsive)
let dx = targetX - leader.x;
leader.vel.x = dx * 0.3;  // Move 30% of distance per frame
```

**Velocity benefits:**
- Smooths out tracking jitter
- Creates natural-feeling movement
- Maintains physics collision detection
- Adjustable responsiveness (0.1 = slow, 0.5 = fast)

#### 3. **Collision Detection**

```javascript
// Method 1: p5play's overlaps() (first frame only)
if (chaser.overlaps(leader)) {
  timesCaught++;
  console.log('Caught!');
}

// Method 2: overlapping() (continuous check)
if (chaser.overlapping(leader)) {
  // This is true while sprites are touching
  chaser.color = 'green';
}
```

**Difference:**
- `overlaps()` - Returns `true` on **first frame** of overlap
- `overlapping()` - Returns frame count **while** overlapping

#### 4. **Helper Function: getKeypoint()**

```javascript
function getKeypoint(index, handNumber = 0) {
  // Check if we have hands detected
  if (!hands || hands.length === 0) return null;
  if (handNumber >= hands.length) return null;
  if (!hands[handNumber].keypoints) return null;
  if (index >= hands[handNumber].keypoints.length) return null;
  
  // Get the keypoint data
  let keypoint = hands[handNumber].keypoints[index];
  
  // Map coordinates using PhoneCamera
  // Handles mirroring and scaling automatically
  let mapped = cam.mapKeypoint(keypoint);
  
  return mapped;  // {x, y, confidence}
}
```

**Critical:** Always use `cam.mapKeypoint()` to transform ML5 coordinates to canvas coordinates.

---

## Example 2: Handpose Ball (p5play_04_handpose_ball)

### What it demonstrates:
- **Multiple sprites** controlled by multiple keypoints
- **Four fingertips** (8, 12, 16, 20) control four paddles
- **Dynamic ball physics** with gravity
- **Kinematic paddles** that collide with dynamic balls
- **Sprite groups** for organization

### Key Integration Code:

#### 1. **Multiple Tracking Points**

```javascript
// Track 4 fingertips
let fingerIndices = [8, 12, 16, 20];  // Index, Middle, Ring, Pinky
let fingerData = [null, null, null, null];

// Create 4 paddles
paddles = new Group();
paddles.width = 80;
paddles.height = 15;
paddles.physics = 'kinematic';

for (let i = 0; i < 4; i++) {
  let p = new paddles.Sprite();
  p.color = ['red', 'blue', 'green', 'purple'][i];
}
```

#### 2. **Update Multiple Sprites from Tracking**

```javascript
function draw() {
  // Loop through each fingertip and corresponding paddle
  for (let i = 0; i < 4; i++) {
    // Default position
    let targetX = defaultPositions[i].x;
    let targetY = defaultPositions[i].y;
    
    // Get tracking data for this finger
    if (hands.length > 0) {
      fingerData[i] = getKeypoint(fingerIndices[i], 0);
      
      if (fingerData[i]) {
        targetX = fingerData[i].x;
        targetY = fingerData[i].y;
      }
    }
    
    // Get the corresponding paddle from the group
    let paddle = paddles[i];
    
    // Move paddle to target position
    let dx = targetX - paddle.x;
    let dy = targetY - paddle.y;
    paddle.vel.x = dx * 0.3;
    paddle.vel.y = dy * 0.3;
  }
}
```

**Pattern:** Arrays for tracking data, sprite groups for game objects, loop to connect them.

#### 3. **Physics Interaction**

```javascript
// Set up world physics
world.gravity.y = 10;  // Gravity pulls down

// Create dynamic balls (affected by physics)
balls = new Group();
balls.diameter = 25;
balls.bounciness = 0.8;
balls.friction = 0.01;

for (let i = 0; i < 5; i++) {
  let b = new balls.Sprite();
  b.x = 50 + i * 80;
  b.y = 50 + i * 30;
}

// Paddles are kinematic (manual control but still collide)
paddles.physics = 'kinematic';
```

**Physics interaction:**
- `dynamic` balls fall with gravity and bounce
- `kinematic` paddles controlled by hands
- Collisions work automatically between them
- No need to explicitly set up collision relationships

#### 4. **Sprite Groups Benefits**

```javascript
// Create group
balls = new Group();

// Set properties for all sprites in group
balls.diameter = 25;
balls.bounciness = 0.8;

// Create individual sprites in the group
for (let i = 0; i < 5; i++) {
  let b = new balls.Sprite();  // Automatically inherits group properties
  b.color = colors[i];          // Individual customization
}

// Access sprites by index
let firstBall = balls[0];
let secondBall = balls[1];
```

---

## Example 3: Gaze Sprites (p5play_05_gaze_sprites)

### What it demonstrates:
- **ML5 FaceMesh** gaze detection (from section 02)
- **p5play sprite** controlled by gaze position
- **Overlap interactions** with multiple target sprites
- **Visual feedback** (color/scale changes on overlap)
- **Advanced tracking** (3D data, normalization, smoothing)

### Key Integration Code:

#### 1. **Gaze Detection → Sprite Position**

```javascript
function draw() {
  // Default position
  let targetX = width / 2;
  let targetY = height / 2;
  
  // Calculate gaze if face detected
  if (faces.length > 0) {
    calculateGaze();  // Updates gazeX, gazeY (from section 02)
    targetX = gazeX;
    targetY = gazeY;
  }
  
  // Move sprite to gaze position
  let dx = targetX - gazeSprite.x;
  let dy = targetY - gazeSprite.y;
  gazeSprite.vel.x = dx * 0.3;
  gazeSprite.vel.y = dy * 0.3;
}
```

**Integration:** The advanced gaze calculation (section 02) produces `gazeX, gazeY` coordinates that directly control the sprite.

#### 2. **Sprite Interactions**

```javascript
// Create gaze-controlled sprite
gazeSprite = new Sprite();
gazeSprite.diameter = 50;
gazeSprite.color = 'yellow';
gazeSprite.physics = 'kinematic';

// Create target sprites
targetSprites = new Group();
targetSprites.diameter = 40;
targetSprites.physics = 'kinematic';

for (let i = 0; i < 12; i++) {
  let target = new targetSprites.Sprite();
  target.x = random(50, width - 50);
  target.y = random(100, height - 100);
  target.originalColor = target.color;  // Store for resetting
}

// Set up overlap detection
gazeSprite.overlaps(targetSprites);
```

#### 3. **Overlap-Based Interactions**

```javascript
for (let target of targetSprites) {
  if (gazeSprite.overlaps(target)) {
    // First frame of overlap - trigger event
    target.color = 'white';
    target.scale = 1.5;
    
  } else if (gazeSprite.overlapping(target)) {
    // Continue while overlapping
    target.color = 'white';
    target.scale = 1.5;
    
  } else {
    // Not overlapping - return to normal
    target.color = target.originalColor;
    target.scale = lerp(target.scale, 1.0, 0.1);  // Smooth transition
  }
}
```

**Interaction states:**
1. `overlaps()` - First frame of contact
2. `overlapping()` - While in contact
3. Neither - Not in contact

**Visual feedback:**
- Color change shows active interaction
- Scale change adds emphasis
- `lerp()` smooths transitions back to normal

#### 4. **Advanced Tracking Integration**

```javascript
function calculateGaze() {
  // Get raw 3D keypoints (from section 02 pattern)
  let leftEarRaw = faces[0].keypoints[leftEarIndex];
  let rightEarRaw = faces[0].keypoints[rightEarIndex];
  let noseRaw = faces[0].keypoints[noseIndex];
  
  // Calculate face width for normalization
  let faceWidth = abs(leftEarRaw.x - rightEarRaw.x);
  
  // Calculate normalized offset
  let earCenterX = (leftEarRaw.x + rightEarRaw.x) / 2;
  let noseOffsetX = noseRaw.x - earCenterX;
  let normalizedOffsetX = noseOffsetX / faceWidth;
  
  // Map to screen coordinates with smoothing
  gazeX = lerp(gazeX, 
    width / 2 - (normalizedOffsetX * width * GAZE_RANGE_X), 
    1 - SMOOTHING_FACTOR);
    
  gazeX = constrain(gazeX, 0, width);
}
```

**This connects:**
- Section 02's advanced gaze detection algorithm
- Section 03's sprite movement techniques
- Creates smooth, responsive gaze-controlled sprite

---

## Key Integration Techniques

### 1. **Always Use Default Positions**

```javascript
// Good pattern: Sprite always has a position
let targetX = width / 2;  // Default
let targetY = height / 2;

if (trackingData) {
  targetX = trackingData.x;  // Override with tracking
  targetY = trackingData.y;
}

sprite.x = targetX;  // Sprite always has valid position
```

**Why?** When tracking fails (hand leaves view, face turns away), sprite doesn't disappear or freeze.

### 2. **Velocity-Based Movement**

```javascript
// Calculate distance to target
let dx = targetX - sprite.x;
let dy = targetY - sprite.y;

// Set velocity (fraction of distance)
sprite.vel.x = dx * 0.3;  // Move 30% of distance per frame
sprite.vel.y = dy * 0.3;
```

**Benefits:**
- Smooths tracking jitter
- Creates natural acceleration/deceleration
- Maintains collision detection
- Adjustable responsiveness (0.1-0.5 typical range)

**Responsiveness scale:**
- `0.1` - Very smooth, slow response
- `0.3` - Balanced (most common)
- `0.5` - Fast, responsive
- `1.0` - Instant (no smoothing)

### 3. **First Frame Teleport**

```javascript
let isFirstFrame = true;

function draw() {
  if (isFirstFrame) {
    sprite.x = targetX;  // Teleport on first frame
    sprite.y = targetY;
    isFirstFrame = false;
  } else {
    sprite.vel.x = dx * 0.3;  // Use velocity after first frame
    sprite.vel.y = dy * 0.3;
  }
}
```

**Why?** Prevents sprite from slowly moving from center to hand position on startup.

### 4. **Coordinate Mapping**

```javascript
// ALWAYS map ML5 coordinates to canvas coordinates
function getKeypoint(index, handNumber = 0) {
  // ... error checking ...
  
  let keypoint = hands[handNumber].keypoints[index];
  
  // Critical: Transform coordinates
  let mapped = cam.mapKeypoint(keypoint);
  
  return mapped;  // {x, y, confidence}
}
```

**What `cam.mapKeypoint()` does:**
- Scales from camera resolution to canvas resolution
- Handles mirroring for front-facing camera
- Adjusts for `fitHeight`, `fitWidth`, or `cover` mode
- Returns coordinates ready for canvas drawing

### 5. **Physics Types for Interaction**

```javascript
// Tracking-controlled sprites: kinematic
leader.physics = 'kinematic';
paddle.physics = 'kinematic';

// Game physics objects: dynamic
ball.physics = 'dynamic';
ball.bounciness = 0.8;

// Boundaries: static
walls.physics = 'static';
```

**Why kinematic for tracking?**
- You control position directly
- Still collides with other sprites
- Not affected by gravity or forces
- Perfect for hand/gaze control

### 6. **Group-Based Organization**

```javascript
// Create groups for different types of objects
let trackingSprites = new Group();  // Controlled by ML5
trackingSprites.physics = 'kinematic';

let gameObjects = new Group();      // Physics simulation
gameObjects.physics = 'dynamic';

let boundaries = new Group();        // Static walls
boundaries.physics = 'static';
```

**Benefits:**
- Apply properties to multiple sprites at once
- Organize code by object type
- Collision detection with groups: `sprite.collides(group)`
- Easy iteration: `for (let s of group)`

---

## Complete Integration Workflow

### Setup Phase

```javascript
function setup() {
  // 1. Canvas
  createCanvas(405, 720);
  
  // 2. Camera
  cam = createPhoneCamera('user', true, 'fitHeight');
  
  // 3. ML5 (after camera ready)
  cam.onReady(() => {
    let options = { /* ... */ };
    model = ml5.handPose(options, () => {
      model.detectStart(cam.videoElement, callback);
    });
  });
  
  // 4. p5play sprites
  sprite = new Sprite();
  sprite.physics = 'kinematic';
  
  // 5. Physics setup (if needed)
  world.gravity.y = 10;
}
```

### Draw Phase

```javascript
function draw() {
  // 1. Draw camera (optional)
  if (showVideo) image(cam, 0, 0);
  
  // 2. Get tracking data
  let trackingData = getKeypoint(index, 0);
  
  // 3. Calculate target position
  let targetX = width / 2;  // Default
  let targetY = height / 2;
  
  if (trackingData) {
    targetX = trackingData.x;
    targetY = trackingData.y;
  }
  
  // 4. Move sprite
  let dx = targetX - sprite.x;
  let dy = targetY - sprite.y;
  sprite.vel.x = dx * 0.3;
  sprite.vel.y = dy * 0.3;
  
  // 5. Check interactions
  if (sprite.overlaps(target)) {
    // Do something
  }
}
```

### Helper Functions

```javascript
// Callback for ML5 results
function gotHands(results) {
  hands = results;
}

// Get mapped keypoint
function getKeypoint(index, num = 0) {
  if (!hands || hands.length === 0) return null;
  if (num >= hands.length) return null;
  
  let keypoint = hands[num].keypoints[index];
  return cam.mapKeypoint(keypoint);
}
```

---

## Key Takeaways

1. **The core pattern is simple:**
   ```javascript
   trackingData = getKeypoint(index, 0);
   if (trackingData) {
     sprite.x = trackingData.x;
     sprite.y = trackingData.y;
   }
   ```

2. **Use velocity for smooth movement:**
   - Reduces jitter from tracking
   - Creates natural-feeling motion
   - Factor of 0.3 is a good starting point

3. **Always provide default positions:**
   - Sprites work even when tracking fails
   - Better user experience
   - Prevents null errors

4. **Use kinematic physics for tracking:**
   - Manual position control
   - Still collides with other sprites
   - Not affected by gravity

5. **Coordinate mapping is critical:**
   - Always use `cam.mapKeypoint()`
   - Handles mirroring and scaling
   - Camera space ≠ Canvas space

6. **Sprite groups organize code:**
   - Group by function (tracking, physics, static)
   - Apply properties to multiple sprites
   - Collision detection with groups

7. **p5play + ML5 = Interactive experiences:**
   - ML5 provides tracking data (input)
   - p5play provides game mechanics (interaction)
   - Combining them creates responsive experiences

---

