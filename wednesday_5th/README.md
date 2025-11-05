# Wednesday Examples - p5play Character Animation

**Live Demo Index:** https://npuckett.github.io/mlphone/wednesday_5th/

A progressive series of examples exploring animated character behavior with p5play, building from basic animation control to complex sensor-driven interactions.

---

## Table of Contents

1. [Overview](#overview)
2. [Example Progression](#example-progression)
3. [p5play_00 - Animation Controls](#p5play_00---animation-controls)
4. [p5play_01 - Simple Character](#p5play_01---simple-character)
5. [p5play_02 - Animated Character with Tiredness](#p5play_02---animated-character-with-tiredness)
6. [p5play_03 - Tilt Character with Depth](#p5play_03---tilt-character-with-depth)
7. [p5play_04 - Sound Introversion](#p5play_04---sound-introversion)
8. [p5play_05 - Gaze-Driven Fleeing](#p5play_05---gaze-driven-fleeing)
9. [Core Systems Reference](#core-systems-reference)
10. [Key Concepts](#key-concepts)

---

## Overview

This collection demonstrates a progression of increasingly sophisticated character animation techniques using **p5play v3**, building toward interactive behaviors driven by device sensors and computer vision.

**Core Technologies:**
- **p5.js v1.11.4** - Required for p5play v3 compatibility
- **p5play v3** - Sprite animation and physics engine
- **p5-phone v1.6.1** - Mobile sensors and camera management
- **p5.sound** - Audio input (required for microphone examples)
- **ml5.js v1.x** - Machine learning (FaceMesh for gaze tracking)

**Canvas:** All examples use 405×720 pixels (9:16 portrait aspect ratio) optimized for mobile screens.

---

## Example Progression

The examples build upon each other, introducing new concepts progressively:

| Example | Focus | Key Systems | Input Method |
|---------|-------|-------------|--------------|
| **00** | Basic Controls | Animation switching, manual controls | Buttons & slider |
| **01** | Simple Movement | Phone-based movement, basic animations | Touch/mouse |
| **02** | Tiredness System | Energy management, dynamic speeds | Touch/mouse |
| **03** | Depth Simulation | Device tilt, 3D perspective illusion | Gyroscope |
| **04** | Audio Response | Microphone input, introverted behavior | Microphone |
| **05** | Computer Vision | Face tracking, gaze collision, complex AI | Camera + ML5 |

Each example includes:
- Complete documentation in code comments
- Organized global variables section
- Reusable animation sequences (idle, walk, walkBack)
- Mobile-optimized UI and controls

---

## p5play_00 - Animation Controls

**Simple UI demonstration of p5play animation system.**

### What It Does
- Fixed character at screen center
- Two buttons: "Idle" and "Walk"
- Speed slider to control animation frameDelay (2-20)
- Direct animation control without gameplay logic

### Key Code Patterns

```javascript
// Animation switching
function setIdleAnimation() {
  character.changeAni('idle');
  character.ani.frameDelay = speedSlider.value();
}

// Slider updates animation speed in real-time
function draw() {
  character.ani.frameDelay = speedSlider.value();
}
```

### Purpose
Demonstrates the basic p5play animation API before adding movement or complex behaviors. Good starting point for understanding sprite animation control.

### Files
- `index.html` - Includes p5.js and p5play
- `sketch.js` - 220 lines, well-documented
- `animations/idle/` - 9 frames
- `animations/walk/` - 13 frames

---

## p5play_01 - Simple Character

**Phone-based character movement with basic animations.**

### What It Does
- Character follows touch/mouse input
- Moves directly to target position
- Switches between idle (stationary) and walk (moving)
- Simple mirroring based on direction

### Key Code Patterns

```javascript
// Touch movement
function touchStarted() {
  targetX = touchX;
  targetY = touchY;
  isMoving = true;
}

// Move toward target
if (isMoving) {
  character.moveTo(targetX, targetY, moveSpeed);
  if (character.ani.name !== 'walk') {
    character.changeAni('walk');
  }
}
```

### Purpose
Introduces basic character movement and animation switching logic. Foundation for more complex examples.

### Notable Features
- Simple state machine (idle vs moving)
- Direct control without physics
- Fixed animation speeds

---

## p5play_02 - Animated Character with Tiredness

**Complete energy management system with dynamic animation speeds.**

### What It Does
- Character becomes tired from moving
- Tiredness affects movement speed and animation timing
- More tired = slower walk, faster idle breathing
- Visual feedback through animation changes

### Tiredness System

```javascript
// Tiredness accumulates while moving
if (character.ani.name === 'walk') {
  tiredness += 0.3;  // Build rate
} else {
  tiredness -= 0.15; // Recovery rate
}

// Affects movement speed
moveSpeed = map(tiredness, 0, 100, 3.0, 0.9);

// Affects animation timing
walkFrameDelay = map(tiredness, 0, 100, 2, 12);   // Slower when tired
idleFrameDelay = map(tiredness, 0, 100, 12, 4);   // Faster breathing
```

### Key Features
- **Tiredness Range:** 0-100 scale
- **Build Rate:** +0.3 per frame when walking
- **Recovery Rate:** -0.15 per frame when idle
- **Speed Range:** 3.0 (fresh) to 0.9 (exhausted) pixels/frame
- **Dynamic Feedback:** Animation speeds reflect energy level

### Purpose
Demonstrates state-based behavior system with visual feedback. All subsequent examples build on this tiredness foundation.

### Files
- `sketch.js` - 253 lines, fully documented
- Organized into clear sections with headers

---

## p5play_03 - Tilt Character with Depth

**Device gyroscope controls depth simulation with 3D perspective.**

### What It Does
- Tilt phone forward/backward to move character
- Character scales with position (perspective illusion)
- Three animations: idle, walk (toward), walkBack (away)
- Perspective corridor creates 3D space feeling

### Depth System

```javascript
// Device tilt controls Y position
if (abs(rotationX) > tiltThreshold) {
  targetY += rotationX * sensitivity;
}

// Y position maps to depth scale
depthScale = map(character.y, 0, height, 0.05, 1.5);
character.scale = depthScale;

// Top = far (small), Bottom = close (large)
```

### Parameters
- **Tilt Threshold:** 5 degrees minimum tilt
- **Sensitivity:** 2.0 pixels per degree
- **Move Speed:** 0.3 pixels/frame (slow, deliberate)
- **Scale Range:** 0.05 (far) to 1.5 (close)

### Visual Elements
- **Perspective Lines:** 4 lines creating corridor effect
- **Scale Animation:** Character grows when approaching
- **Animation Selection:** walkBack when moving away

### Purpose
Introduces sensor input (gyroscope) and simulates 3D depth in 2D space. Demonstrates how Y position can represent depth with proper scaling.

### Files
- `sketch.js` - 334 lines, comprehensive documentation
- `animations/walkBack/` - Additional backward walking sequence

---

## p5play_04 - Sound Introversion

**Microphone-driven introverted character behavior.**

### What It Does
- Character wants to stay at bottom (close to viewer)
- Loud sounds push character away (retreat to top)
- Quiet environment lets character return
- Introversion score tracks comfort level

### Introversion System

```javascript
// Sound detection
let micLevel = mic.getLevel() * micMultiplier;
let isLoud = micLevel > soundThreshold;

// Introversion changes based on noise
if (isLoud) {
  introversion -= 1.0;  // Noise reduces comfort
} else {
  introversion += 0.2;  // Quiet increases comfort
}

// Behavior states
if (introversion < panicThreshold) {
  // Flee to top (far from viewer)
} else if (introversion > comfortThreshold) {
  // Return to bottom (close to viewer)
}
```

### Parameters
- **Introversion Range:** 0-100
- **Sound Threshold:** 0.01 (very sensitive)
- **Mic Multiplier:** 3.0 (amplify quiet sounds)
- **Panic Threshold:** 30 (start fleeing)
- **Comfort Threshold:** 70 (start approaching)

### Behavior States
1. **Panic (< 30):** Flee toward top, walk animation
2. **Cautious (30-70):** Pause in place, idle animation
3. **Comfortable (> 70):** Approach bottom, walk animation

### Microphone Setup

```javascript
// p5-phone microphone management
function setup() {
  enableMicTap();  // Request permissions with tap
}

function draw() {
  if (mic.enabled) {
    let level = mic.getLevel();  // 0.0 to 1.0
  }
}
```

### Purpose
Demonstrates audio input integration with personality-based AI. Character exhibits believable introverted behavior responding to sound environment.

### UI Features
- Tap to toggle debug info (microphone level, state, position)
- Visual indicators for sound activity
- Real-time introversion display

### Files
- `sketch.js` - 469 lines
- Requires p5.sound library
- Uses p5-phone for microphone management

---

## p5play_05 - Gaze-Driven Fleeing

**ML5 FaceMesh gaze tracking with sprite collision and complex AI behavior.**

### What It Does
- Tracks where user is looking using face keypoints
- Character flees when gaze "touches" them
- Returns to center when tiredness drops below threshold
- Complete state machine with multiple behaviors

### Gaze Tracking System

```javascript
// Calculate gaze from face orientation
let leftEar = faces[0].keypoints[234];
let rightEar = faces[0].keypoints[454];
let nose = faces[0].keypoints[1];

// Face width and nose offset determine gaze direction
let faceWidth = abs(leftEar.x - rightEar.x);
let noseOffset = nose.x - earCenterX;
let gazeAngle = noseOffset / faceWidth;

// Smooth for stability
smoothedGazeAngle = lerp(smoothedGazeAngle, gazeAngle, 0.6);

// Map to screen coordinates
gazeX = width/2 - (smoothedGazeAngle * width * GAZE_RANGE_X);
gazeY = height/2 + (smoothedGazeY * height * GAZE_RANGE_Y);
```

### Collision System

```javascript
// Two sprites for collision detection
character.collider = 'dynamic';
character.diameter = 100;  // Collision circle

gazeSphere = new Sprite(gazeX, gazeY, 60);
gazeSphere.collider = 'dynamic';
gazeSphere.visible = false;  // Invisible collision sprite

// Set up collision relationship
gazeSphere.overlaps(character);

// Check collision every frame
if (gazeSphere.overlapping(character)) {
  fleeFromGaze();
}
```

### Behavior State Machine

**Priority order determines current behavior:**

1. **Continue Active Flee** (fleeTimer > 0)
   - Character fleeing from gaze
   - Timer counts down (60 frames = 1 second)
   - Prevents immediate re-collision
   - Walk animation, tiredness increases

2. **Start New Flee** (collision detected)
   - Gaze sphere overlaps character
   - Reset flee timer
   - Calculate vector away from gaze
   - Move at current speed (affected by tiredness)

3. **Return to Center** (tiredness < 25 OR already returning)
   - Low energy triggers return home
   - Continues until reaching center (distance < 5px)
   - Walk animation, tiredness still increases
   - Flag prevents switching mid-journey

4. **Idle** (default state)
   - No collision, not returning
   - Character stays in place
   - Idle animation, tiredness decreases

### Flee Behavior

```javascript
function fleeFromGaze() {
  // Vector from gaze to character
  let fleeX = character.x - gazeX;
  let fleeY = character.y - gazeY;
  
  // Normalize and apply speed
  let distance = dist(character.x, character.y, gazeX, gazeY);
  fleeX = (fleeX / distance) * moveSpeed;
  fleeY = (fleeY / distance) * moveSpeed;
  
  // Move away
  character.x += fleeX;
  character.y += fleeY;
  
  // Keep on screen
  character.x = constrain(character.x, 40, width - 40);
  character.y = constrain(character.y, 40, height - 40);
}
```

### Parameters

**Gaze Tracking:**
- `SMOOTHING_FACTOR = 0.4` - Gaze smoothing (0=none, 1=max)
- `GAZE_RANGE_X = 1.5` - Horizontal gaze range multiplier
- `GAZE_RANGE_Y = 2.5` - Vertical gaze range multiplier

**Movement:**
- `BASE_MOVE_SPEED = 3.5` - Pixels per frame
- `FLEE_DURATION = 60` - Frames to flee (1 second)

**Tiredness:**
- `TIREDNESS_BUILD_RATE = 0.3` - Increase when moving
- `TIREDNESS_RECOVERY_RATE = 0.15` - Decrease when idle
- `RETURN_THRESHOLD = 25` - Trigger return to center

**Collision:**
- `CHARACTER_DIAMETER = 100` - Character collision circle
- `GAZE_DIAMETER = 60` - Gaze sphere collision circle

### Visual Layers

Drawing order ensures proper visibility:

1. **Background & Camera** - Gray or live camera feed
2. **Tracking Points** - Ears (red) and nose (green) dots
3. **Sprites** - Character (automatic by p5play)
4. **Debug Colliders** - Yellow circle showing gaze collision area
5. **Gaze Circle** - Blue circle at calculated gaze position
6. **UI Information** - Tiredness, state, positions

### Interaction

- **Tap anywhere** - Hide/show all UI except character
- **Look at character** - Triggers flee behavior
- **Look away** - Character idles or returns home
- **Camera toggle** - Via p5-phone enableCameraTap()

### Key Features

- **Collision Timer:** Prevents jittery flee/stop behavior
- **State Flags:** `isFleeingFromGaze`, `isReturningToCenter`
- **Coordinate Mapping:** `cam.mapKeypoint()` for accurate positioning
- **Smooth Tracking:** Lerp smoothing prevents jittery gaze
- **Tiredness Integration:** All behaviors affect/respect energy

### Purpose

Demonstrates complete integration of:
- Computer vision (ML5 FaceMesh)
- Collision detection (p5play)
- Complex AI state machine
- Sensor fusion (camera + tracking)
- Visual feedback systems

This is the most advanced example, combining all previous concepts into a sophisticated interactive experience.

### Files
- `index.html` - Includes ML5, p5play, p5-phone
- `sketch.js` - 650 lines, comprehensively documented
- `animations/idle/` - 9 frames
- `animations/walk/` - 13 frames

---

## Core Systems Reference

### Tiredness System

Used in examples 02, 03, 04, 05.

```javascript
// Configuration
const TIREDNESS_BUILD_RATE = 0.3;      // Increase when moving
const TIREDNESS_RECOVERY_RATE = 0.15;  // Decrease when idle

// Update every frame
function updateTiredness() {
  if (character.ani.name === 'walk') {
    tiredness += TIREDNESS_BUILD_RATE;
  } else {
    tiredness -= TIREDNESS_RECOVERY_RATE;
  }
  tiredness = constrain(tiredness, 0, 100);
}

// Apply to movement
moveSpeed = map(tiredness, 0, 100, 3.0, 0.9);

// Apply to animations
walkFrameDelay = map(tiredness, 0, 100, 2, 12);   // Slower when tired
idleFrameDelay = map(tiredness, 0, 100, 12, 4);   // Faster breathing
```

**Purpose:** Creates believable character fatigue that affects both movement and visual presentation.

### Animation System

```javascript
// Preload animations
function preload() {
  idleAni = loadAni('animations/idle/idleAnim_1.png', 9);
  walkAni = loadAni('animations/walk/walkAnim_1.png', 13);
  walkBackAni = loadAni('animations/walkBack/walkBackAnim_1.png', 13);
}

// Add to sprite
character.addAni('idle', idleAni);
character.addAni('walk', walkAni);
character.addAni('walkBack', walkBackAni);

// Switch animations
character.changeAni('walk');

// Control speed
character.ani.frameDelay = 4;  // Lower = faster
```

**Frame Sequences:**
- **Idle:** 9 frames - Breathing cycle
- **Walk:** 13 frames - Forward walking
- **WalkBack:** 13 frames - Backward walking

### Device Sensors (p5-phone)

```javascript
// Gyroscope (example 03)
enableGyroTap();  // Request permissions
let tilt = rotationX;  // Tilt forward/backward

// Microphone (example 04)
enableMicTap();  // Request permissions
if (mic.enabled) {
  let level = mic.getLevel();  // 0.0 to 1.0
}

// Camera (example 05)
enableCameraTap();  // Toggle camera on/off
cam = createPhoneCamera('user', true, 'fitHeight');
```

### Sprite Mirroring

```javascript
// Mirror based on horizontal direction
if (directionX < 0) {
  character.mirror.x = true;   // Moving left
} else if (directionX > 0) {
  character.mirror.x = false;  // Moving right
}
```

### Collision Detection (p5play)

```javascript
// Disable gravity for manual positioning
world.gravity.y = 0;

// Set up sprites
sprite1.collider = 'dynamic';
sprite2.collider = 'dynamic';

// Define collision area
sprite1.diameter = 100;  // Circular collider

// Set up relationship
sprite1.overlaps(sprite2);

// Check collision
if (sprite1.overlapping(sprite2)) {
  // Handle collision
}
```

---

## Key Concepts

### State Machine Pattern

Many examples use a priority-based state machine:

```javascript
// Priority 1: Active timed behavior
if (timer > 0) {
  continueTimedAction();
}
// Priority 2: New triggered behavior
else if (triggerCondition) {
  startNewAction();
}
// Priority 3: Background behavior
else if (backgroundCondition) {
  performBackgroundAction();
}
// Priority 4: Default/idle state
else {
  defaultBehavior();
}
```

**Benefits:**
- Clear behavior hierarchy
- Prevents conflicting actions
- Easy to debug and extend

### Dynamic Parameter Mapping

Using `map()` to scale parameters dynamically:

```javascript
// Map tiredness (0-100) to speed (3.0-0.9)
moveSpeed = map(tiredness, 0, 100, 3.0, 0.9);

// Map position to scale (depth illusion)
scale = map(y, 0, height, 0.05, 1.5);

// Map sound to behavior
panic = map(introversion, 0, 100, true, false);
```

### Smoothing with Lerp

Preventing jittery sensor readings:

```javascript
// Linear interpolation
// lerp(current, target, amount)
// amount: 0 = no change, 1 = instant

smoothValue = lerp(smoothValue, rawValue, 0.3);

// Common amounts:
// 0.1-0.3 = heavy smoothing
// 0.4-0.6 = moderate smoothing  
// 0.7-0.9 = light smoothing
```

### Coordinate Mapping

Converting between coordinate systems:

```javascript
// ML5 coordinates → Canvas coordinates
let mappedPoint = cam.mapKeypoint(rawKeypoint);

// Normalized coordinates (0-1) → Pixel coordinates
let pixelX = normalizedX * width;
let pixelY = normalizedY * height;

// Mirrored coordinates (front camera)
let mirroredX = width - rawX;
```

### Animation Speed Control

```javascript
// frameDelay = frames to hold each image
character.ani.frameDelay = 4;

// Lower = faster animation
frameDelay = 2;  // Fast walk

// Higher = slower animation  
frameDelay = 12; // Tired slow walk

// Map to parameter
frameDelay = map(tiredness, 0, 100, 2, 12);
```

### Timer Pattern

Managing timed behaviors:

```javascript
// Set timer when starting action
if (startAction) {
  actionTimer = DURATION;  // 60 frames = 1 second at 60fps
}

// Count down each frame
if (actionTimer > 0) {
  actionTimer--;
  performAction();
}

// Timer expired
else {
  checkForNewAction();
}
```

---

## Development Tips

### Mobile Testing
- Examples designed for 405×720 portrait
- Use actual device for sensor testing (gyroscope, microphone)
- Chrome DevTools mobile emulation doesn't support sensors fully

### Performance
- All examples run at 60fps on modern phones
- Collision detection is fast with p5play v3
- ML5 FaceMesh runs at ~30fps (adequate for gaze tracking)

### Common Patterns
1. **Preload animations** before setup
2. **Initialize sensors** in setup (enableMicTap, enableGyroTap)
3. **Update state** before drawing
4. **Layer drawing** carefully for proper visibility
5. **Use constants** for tunable parameters

### Extending Examples
- Adjust parameters (speed, thresholds, ranges)
- Add new animations (jump, crouch, dance)
- Combine behaviors (sound + tilt, gaze + movement)
- Create multiple characters with different personalities

---

## Library Documentation

- **p5.js:** https://p5js.org/reference/
- **p5play:** https://p5play.org/learn/
- **p5-phone:** https://github.com/ml5js/p5-phone
- **ml5.js:** https://ml5js.org/

---

## Credits

Examples developed for mobile machine learning workshop exploring character animation, sensor integration, and computer vision interaction patterns.

**Animation Assets:** Idle, Walk, and WalkBack sprite sequences included in each example's `animations/` folder.
