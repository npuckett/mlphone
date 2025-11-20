# Wednesday 29th - ML5 Phone Camera Basics

Foundation examples demonstrating ML5 pose tracking with p5-phone camera management. These examples establish the core patterns for camera setup and basic ML5 model integration.

---

## Table of Contents

1. [Overview](#overview)
2. [Example 01 - Camera Selector](#example-01---camera-selector)
3. [Example 02 - FaceMesh](#example-02---facemesh)
4. [Example 03 - HandPose](#example-03---handpose)
5. [Example 04 - BodyPose](#example-04---bodypose)
6. [Core Concepts](#core-concepts)
7. [Common Patterns](#common-patterns)

---

## Overview

This collection demonstrates the foundational setup for ML5 machine learning models on mobile devices. Each example shows how to integrate a specific ML5 tracking model with p5-phone's camera management system.

**Core Technologies:**
- **p5.js** - Creative coding framework
- **ml5.js v1.x** - Machine learning library
- **p5-phone v1.6.3** - Mobile camera and sensor management

**Canvas:** All examples use 405×720 pixels (9:16 portrait aspect ratio).

**Purpose:** These examples serve as starting points, demonstrating:
- Camera initialization with p5-phone
- ML5 model setup and configuration
- Basic keypoint visualization
- Camera feed toggling

---

## Example 01 - Camera Selector

**Basic p5-phone camera setup with front/back camera switching.**

### What It Does
- Initializes front-facing camera by default
- Displays live camera feed
- Tap anywhere to toggle between front and back camera
- Shows camera state in UI

### Key Code

```javascript
// Create camera in setup
cam = createPhoneCamera('user');  // 'user' = front, 'environment' = back

// Enable tap to toggle camera
enableCameraTap();

// Draw camera feed
function draw() {
  if (cam.ready) {
    image(cam, 0, 0);
  }
}
```

### Camera Management

```javascript
// p5-phone handles camera permissions automatically
cam = createPhoneCamera(facingMode, mirror, fitMode);

// Parameters:
// - facingMode: 'user' (front) or 'environment' (back)
// - mirror: true/false (flip horizontally)
// - fitMode: 'cover', 'contain', 'fitWidth', 'fitHeight'

// Default call:
cam = createPhoneCamera('user', true, 'fitHeight');
```

### UI Features
- Real-time camera display
- Tap-to-toggle functionality
- Camera state indicator

### Purpose
Demonstrates the simplest p5-phone camera setup. Foundation for all ML5 tracking examples.

### Files
- `index.html` - Basic HTML with p5.js and p5-phone
- `sketch.js` - Minimal camera setup code

---

## Example 02 - FaceMesh

**ML5 FaceMesh face tracking with keypoint visualization.**

### What It Does
- Tracks face using ML5 FaceMesh (468 keypoints)
- Draws all detected keypoints as small circles
- Shows camera feed with overlay
- Real-time face detection

### Key Code

```javascript
// Initialize FaceMesh
let options = {
  maxFaces: 1,              // Track one face
  refineLandmarks: false,   // Faster without iris/lips detail
  flipHorizontal: false     // Camera handles mirroring
};

faceMesh = ml5.faceMesh(options, modelLoaded);

// Start detection when camera ready
cam.onReady(() => {
  faceMesh.detectStart(cam.videoElement, gotFaces);
});

// Callback receives face data
function gotFaces(results) {
  faces = results;  // Array of detected faces
}
```

### Drawing Keypoints

```javascript
// Loop through detected faces
for (let face of faces) {
  // Each face has 468 keypoints
  for (let keypoint of face.keypoints) {
    // Map from camera coords to canvas coords
    let mapped = cam.mapKeypoint(keypoint);
    
    // Draw keypoint
    circle(mapped.x, mapped.y, 2);
  }
}
```

### FaceMesh Keypoints

**468 total keypoints covering:**
- Face outline (oval)
- Eyes (left and right)
- Eyebrows
- Nose
- Mouth (lips and inner mouth)
- Ears (approximate)

**Common keypoint indices:**
- `0` - Nose tip
- `234` - Left ear
- `454` - Right ear
- `33, 133` - Left eye
- `362, 263` - Right eye
- `61, 291` - Mouth corners

### Configuration

```javascript
// FaceMesh options
{
  maxFaces: 1-4,           // Number of faces to track
  refineLandmarks: false,  // true = iris/lips detail (slower)
  flipHorizontal: false,   // Match camera mirroring
  runtime: 'mediapipe'     // Default, can use 'tfjs'
}
```

### Purpose
Demonstrates ML5 FaceMesh integration with visual feedback for all tracked points. Foundation for gaze detection and facial gesture recognition.

### Performance
- Runs at ~30fps on modern phones
- Single face tracking recommended for performance
- refineLandmarks = false is faster

### Files
- `index.html` - Includes ml5.js library
- `sketch.js` - FaceMesh setup and keypoint drawing

---

## Example 03 - HandPose

**ML5 HandPose hand tracking with keypoint visualization.**

### What It Does
- Tracks hands using ML5 HandPose (21 keypoints per hand)
- Draws all detected keypoints as circles
- Shows camera feed with overlay
- Real-time hand detection

### Key Code

```javascript
// Initialize HandPose
let options = {
  maxHands: 2,              // Track up to 2 hands
  runtime: 'mediapipe',     // Detection engine
  modelType: 'full',        // 'full' or 'lite'
  flipHorizontal: false     // Camera handles mirroring
};

handPose = ml5.handPose(options, modelLoaded);

// Start detection when camera ready
cam.onReady(() => {
  handPose.detectStart(cam.videoElement, gotHands);
});

// Callback receives hand data
function gotHands(results) {
  hands = results;  // Array of detected hands
}
```

### Drawing Keypoints

```javascript
// Loop through detected hands
for (let hand of hands) {
  // Each hand has 21 keypoints
  for (let keypoint of hand.keypoints) {
    // Map from camera coords to canvas coords
    let mapped = cam.mapKeypoint(keypoint);
    
    // Draw keypoint
    circle(mapped.x, mapped.y, 5);
  }
}
```

### HandPose Keypoints

**21 keypoints per hand:**
- `0` - Wrist
- `1-4` - Thumb (base to tip)
- `5-8` - Index finger
- `9-12` - Middle finger
- `13-16` - Ring finger
- `17-20` - Pinky finger

**Each keypoint includes:**
- `x, y, z` - 3D position
- `name` - Descriptive name (e.g., "index_finger_tip")

### Configuration

```javascript
// HandPose options
{
  maxHands: 1-2,           // Number of hands to track
  runtime: 'mediapipe',    // Detection engine
  modelType: 'full',       // 'full' = accurate, 'lite' = faster
  flipHorizontal: false,   // Match camera mirroring
  detectorModelUrl: null   // Custom model URL (optional)
}
```

### Hand Properties

```javascript
// Each detected hand includes:
{
  keypoints: [...],        // 21 keypoint objects
  handedness: "Left/Right",// Which hand
  score: 0.0-1.0          // Confidence score
}
```

### Purpose
Demonstrates ML5 HandPose integration for gesture-based interaction. Foundation for hand-controlled interfaces and gesture recognition.

### Performance
- Runs at ~30fps on modern phones
- Single hand tracking recommended for performance
- 'lite' model is faster but less accurate

### Files
- `index.html` - Includes ml5.js library
- `sketch.js` - HandPose setup and keypoint drawing

---

## Example 04 - BodyPose

**ML5 BodyPose full-body tracking with keypoint visualization.**

### What It Does
- Tracks body using ML5 BodyPose (17 keypoints)
- Draws all detected keypoints as circles
- Shows camera feed with overlay
- Real-time pose detection

### Key Code

```javascript
// Initialize BodyPose
let options = {
  modelType: 'MoveNet',     // 'MoveNet' or 'BlazePose'
  enableSmoothing: true,    // Smooth keypoint positions
  flipHorizontal: false     // Camera handles mirroring
};

bodyPose = ml5.bodyPose(options, modelLoaded);

// Start detection when camera ready
cam.onReady(() => {
  bodyPose.detectStart(cam.videoElement, gotPoses);
});

// Callback receives pose data
function gotPoses(results) {
  poses = results;  // Array of detected poses
}
```

### Drawing Keypoints

```javascript
// Loop through detected poses
for (let pose of poses) {
  // Each pose has 17 keypoints
  for (let keypoint of pose.keypoints) {
    // Only draw if confidence is high enough
    if (keypoint.confidence > 0.1) {
      // Map from camera coords to canvas coords
      let mapped = cam.mapKeypoint(keypoint);
      
      // Draw keypoint
      circle(mapped.x, mapped.y, 10);
    }
  }
}
```

### BodyPose Keypoints

**17 keypoints for MoveNet:**
- `0` - Nose
- `1, 2` - Left/Right eye
- `3, 4` - Left/Right ear
- `5, 6` - Left/Right shoulder
- `7, 8` - Left/Right elbow
- `9, 10` - Left/Right wrist
- `11, 12` - Left/Right hip
- `13, 14` - Left/Right knee
- `15, 16` - Left/Right ankle

**Each keypoint includes:**
- `x, y` - 2D position
- `confidence` - Detection confidence (0.0-1.0)
- `name` - Body part name

### Configuration

```javascript
// BodyPose options
{
  modelType: 'MoveNet',    // 'MoveNet' or 'BlazePose'
  enableSmoothing: true,   // Smooth tracking
  minPoseScore: 0.25,      // Minimum confidence threshold
  multiPoseMaxDimension: 256, // Detection resolution
  enableTracking: true,    // Track poses across frames
  trackerType: 'boundingBox', // Tracking method
  flipHorizontal: false    // Match camera mirroring
}
```

### Model Types

**MoveNet:**
- Fast and efficient
- 17 keypoints
- Good for real-time mobile
- Recommended for most use cases

**BlazePose:**
- More detailed (33 keypoints)
- Slower but more accurate
- Better for precise pose estimation

### Purpose
Demonstrates ML5 BodyPose integration for full-body tracking. Foundation for movement-based interactions and pose analysis.

### Performance
- MoveNet runs at ~30fps on modern phones
- Single person tracking recommended
- enableSmoothing helps reduce jitter

### Files
- `index.html` - Includes ml5.js library
- `sketch.js` - BodyPose setup and keypoint drawing

---

## Core Concepts

### p5-phone Camera Setup

```javascript
// Standard camera initialization pattern
function setup() {
  createCanvas(405, 720);
  
  // Create camera (front, mirrored, fit height)
  cam = createPhoneCamera('user', true, 'fitHeight');
  
  // Enable tap-to-toggle
  enableCameraTap();
  
  // Wait for camera ready
  cam.onReady(() => {
    // Initialize ML5 models here
  });
}
```

### ML5 Model Pattern

All ML5 models follow a similar pattern:

```javascript
// 1. Configure options
let options = {
  // Model-specific options
};

// 2. Create model instance
model = ml5.modelName(options, modelLoadedCallback);

// 3. Start detection after camera ready
cam.onReady(() => {
  model.detectStart(cam.videoElement, resultsCallback);
});

// 4. Process results
function resultsCallback(results) {
  // Store results for drawing
}
```

### Coordinate Mapping

```javascript
// ML5 gives raw camera coordinates
let rawKeypoint = face.keypoints[0];

// Map to canvas coordinates (handles mirroring)
let mapped = cam.mapKeypoint(rawKeypoint);

// Use mapped coordinates for drawing
circle(mapped.x, mapped.y, 5);
```

**Why map?**
- Camera resolution ≠ canvas resolution
- Front camera is mirrored
- ML5 coords need transformation

### Confidence Filtering

```javascript
// Only use keypoints above confidence threshold
if (keypoint.confidence > 0.5) {
  // Draw or use this keypoint
}

// Common thresholds:
// 0.1 - Very permissive (may show noise)
// 0.5 - Balanced (recommended)
// 0.8 - Very strict (only high-confidence points)
```

---

## Common Patterns

### Camera Ready Check

```javascript
function draw() {
  background(220);
  
  // Always check if camera is ready
  if (cam.ready) {
    image(cam, 0, 0);
  } else {
    // Show loading message
    text('Loading camera...', width/2, height/2);
  }
}
```

### Model Loading

```javascript
let modelReady = false;

function modelLoaded() {
  console.log('Model loaded!');
  modelReady = true;
}

function draw() {
  if (!modelReady) {
    text('Loading model...', width/2, height/2);
    return;
  }
  // ... rest of draw code
}
```

### Drawing All Keypoints

```javascript
function drawKeypoints(results, size, color) {
  for (let result of results) {
    for (let keypoint of result.keypoints) {
      // Map coordinates
      let mapped = cam.mapKeypoint(keypoint);
      
      // Set color
      fill(color);
      noStroke();
      
      // Draw circle
      circle(mapped.x, mapped.y, size);
    }
  }
}
```

### Error Handling

```javascript
// Check for empty results
if (!faces || faces.length === 0) {
  text('No face detected', 10, 30);
  return;
}

// Check for valid keypoints
if (!keypoint || !keypoint.x || !keypoint.y) {
  return;  // Skip invalid keypoint
}
```

---

## Development Tips

### Mobile Testing
- Use actual device for camera testing
- Chrome DevTools mobile emulation has limited camera support
- Test both front and back cameras

### Performance
- Start with single face/hand/pose tracking
- Use confidence thresholds to reduce processing
- Consider 'lite' model types for faster performance

### Debugging
- Log results to console: `console.log(faces[0])`
- Draw keypoint indices for reference
- Check confidence values if tracking is unreliable

### Camera Permissions
- p5-phone handles permissions automatically
- Users must approve camera access on first load
- Test on HTTPS (required for camera access)

---

## Progression

These examples are designed to be:
1. **Simple** - Minimal code, clear patterns
2. **Foundational** - Building blocks for complex projects
3. **Documented** - Easy to understand and modify

### Next Steps

After mastering these basics:
- Combine multiple models (face + hands)
- Add tracking data calculations (distances, angles)
- Implement gesture recognition
- Create interactive responses to detected poses

See **friday_31st/** folder for advanced tracking examples and **wednesday_5th/** for character animation integration.

---

## Library Documentation

- **p5.js:** https://p5js.org/reference/
- **p5-phone:** https://github.com/ml5js/p5-phone
- **ml5.js:** https://ml5js.org/
- **ML5 FaceMesh:** https://docs.ml5js.org/#/reference/facemesh
- **ML5 HandPose:** https://docs.ml5js.org/#/reference/handpose
- **ML5 BodyPose:** https://docs.ml5js.org/#/reference/bodypose

---

## Credits

Foundation examples for mobile machine learning workshop demonstrating basic ML5 model integration with p5-phone camera management.
