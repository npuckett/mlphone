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

3. [04 - ML5 + p5play Integration](#overview-of-04_ml5_p5play-examples)
   - [Example 1: Handpose Chase](#example-1-handpose-chase-p5play_02_handpose_chase)
   - [Example 2: Handpose Ball](#example-2-handpose-ball-p5play_04_handpose_ball)
   - [Example 3: Gaze Sprites](#example-3-gaze-sprites-p5play_05_gaze_sprites)
   - [Essential p5play Methods](#essential-p5play-methods-summary)
   - [Integration Pattern: ML5 → p5play](#integration-pattern-ml5--p5play)

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

## Building on These Patterns

The advanced examples show how to:

1. **Access raw data** when needed (for Z-axis)
2. **Store history** for pattern analysis
3. **Smooth output** for stable interactions
4. **Convert continuous data to discrete states** (CENTER/LEFT/RIGHT)
5. **Analyze motion patterns** (vertical vs horizontal dominance)
6. **Create confidence metrics** for reliability
7. **Expose tunable parameters** for customization

These techniques can be combined with the simple measurement functions to create:
- Gesture-controlled games
- Gaze-based UI navigation
- Accessible input methods
- Interactive art installations
- And more!

---

## Recommended Learning Path

1. **Start with 01_trackingDataMethods-simple**
   - Understand two-variable method
   - Learn measurement functions
   - Get comfortable with keypoint indices

2. **Move to 02_trackingData-adv**
   - See how measurements become interactions
   - Learn velocity history and smoothing
   - Understand state machines and thresholds

3. **Experiment with parameters**
   - Adjust thresholds and see effects
   - Try different smoothing values
   - Modify history length

4. **Build your own**
   - Combine patterns from both folders
   - Create new gesture types
   - Design novel interactions