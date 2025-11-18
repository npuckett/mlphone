# ML Phone - Mobile Machine Learning Examples


---

## Live Demos

- **[Wednesday 29th - ML5 Camera Basics](https://npuckett.github.io/mlphone/wednesday_29th/)** - Foundation examples
- **[Wednesday 5th - Character Animation](https://npuckett.github.io/mlphone/wednesday_5th/)** - Progressive animation examples
- **[Friday 7th - Character Controller Templates](https://npuckett.github.io/mlphone/friday_7th/)** - Parameter-driven character control
- **[Wednesday 19th - Classes & localStorage](https://npuckett.github.io/mlphone/wednesday_19th/)** - Object-oriented programming & data persistence
- **[Friday 31st - ML5 + p5play Integration](https://npuckett.github.io/mlphone/friday_31st/)** - Advanced tracking & sprites

---

## Examples by Type

### Body Tracking (BodyPose)

**Start here:** The two-points examples below are the recommended starting point for body tracking.

| Example | Code | Description |
|---------|------|-------------|
| **BodyPose Two Points (p5.js)** | [Code](friday_31st/01_trackingDataMethods-simple/PHONE_BodyPose_two_points/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/01_trackingDataMethods-simple/PHONE_BodyPose_two_points/) | **Recommended starting point.** Two-variable method for tracking shoulders, wrists, nose. Calculates distances and angles between keypoints. |
| **BodyPose Two Points (THREE.js)** | [Code](friday_31st/01_trackingDataMethods-simple/THREE_BodyPose_two_points/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/01_trackingDataMethods-simple/THREE_BodyPose_two_points/) | Same tracking logic using THREE.js 3D graphics instead of p5.js canvas. |
| **BodyPoseTracker Class** | [Code](wednesday_19th/classes/05_bodypose_tracker_class/) · [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/05_bodypose_tracker_class/) | **Reusable wrapper class.** Setup reduced from 40+ lines to 1 line. Name-based point access, built-in measurements (distance, angle, velocity), automatic tracking. |

---

### Face Tracking (FaceMesh)

**Start here:** The two-points example is the recommended starting point for face tracking. Build up to gaze and gesture detection.

| Example | Code | Description |
|---------|------|-------------|
| **FaceMesh Two Points (p5.js)** | [Code](friday_31st/01_trackingDataMethods-simple/PHONE_FaceMesh_two_points/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/01_trackingDataMethods-simple/PHONE_FaceMesh_two_points/) | **Recommended starting point.** Tracks eyes, lips, nose tip. Demonstrates facial measurement calculations using two-variable method. |
| **FaceMesh Two Points (THREE.js)** | [Code](friday_31st/01_trackingDataMethods-simple/THREE_FaceMesh_two_points/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/01_trackingDataMethods-simple/THREE_FaceMesh_two_points/) | THREE.js version of face tracking with 3D visualization capabilities. |
| **Gaze Detection** | [Code](friday_31st/02_trackingData-adv/PHONE_FaceMesh_gaze_detection/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/02_trackingData-adv/PHONE_FaceMesh_gaze_detection/) | Advanced: 3D gaze tracking using face orientation and eye direction. Calculates where user is looking on screen. |
| **GazeDetector Class** | [Code](wednesday_19th/classes/06_gaze_detector_class/) · [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/06_gaze_detector_class/) | **Reusable wrapper class.** 1-line setup, returns gaze direction ("LEFT", "CENTER", "RIGHT") and position. Built-in smoothing, adjustable sensitivity, visualization methods. |
| **Gesture Detection** | [Code](friday_31st/02_trackingData-adv/PHONE_FaceMesh_gesture_detection/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/02_trackingData-adv/PHONE_FaceMesh_gesture_detection/) | Advanced: Head gesture recognition (nod, shake) from velocity history and directional movement patterns. |
| **Gaze Sprites (Character AI)** | [Code](wednesday_5th/p5Play/p5play_05_gaze_sprites/) · [Demo](https://npuckett.github.io/mlphone/wednesday_5th/p5Play/p5play_05_gaze_sprites/) | Application: Sprites that detect and flee from user's gaze. Combines FaceMesh gaze detection with sprite AI behaviors. |

---

### Hand Tracking (HandPose)

**Start here:** The two-points example is the recommended starting point for hand tracking. Progress to sprite integration examples.

| Example | Code | Description |
|---------|------|-------------|
| **HandPose Two Points (p5.js)** | [Code](friday_31st/01_trackingDataMethods-simple/PHONE_HandPose_two_points/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/01_trackingDataMethods-simple/PHONE_HandPose_two_points/) | **Recommended starting point.** Tracks fingertips and wrist. Measures hand spread and finger positions using two-variable method. |
| **HandPose Two Points (THREE.js)** | [Code](friday_31st/01_trackingDataMethods-simple/THREE_HandPose_two_points/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/01_trackingDataMethods-simple/THREE_HandPose_two_points/) | THREE.js version with 3D hand tracking visualization. |
| **HandPose Chase** | [Code](friday_31st/04_ml5_p5play/p5play_02_handpose_chase/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/04_ml5_p5play/p5play_02_handpose_chase/) | Application: Sprite follows hand position. Demonstrates ML5 to p5play sprite control integration. |
| **HandPose Ball** | [Code](friday_31st/04_ml5_p5play/p5play_04_handpose_ball/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/04_ml5_p5play/p5play_04_handpose_ball/) | Application: Hand-controlled bouncing ball with physics. Maps hand movement to sprite velocity. |

---

### p5play Sprite Basics

| Example | Code | Description |
|---------|------|-------------|
| **Basic Chase** | [Code](friday_31st/03_p5Play/p5play_01_basic_chase/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/03_p5Play/p5play_01_basic_chase/) | Sprite chasing mechanics with basic physics. Introduction to p5play sprite movement and collision. |
| **Bouncing Ball** | [Code](friday_31st/03_p5Play/p5play_03_bouncing_ball/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/03_p5Play/p5play_03_bouncing_ball/) | Ball physics with wall collision detection. Demonstrates gravity, velocity, and restitution. |
| **Gaze Sprites** | [Code](friday_31st/04_ml5_p5play/p5play_05_gaze_sprites/) · [Demo](https://npuckett.github.io/mlphone/friday_31st/04_ml5_p5play/p5play_05_gaze_sprites/) | Sprites interact based on gaze direction. Shows sprite-to-sprite awareness and avoidance behaviors. |

---

### Character Animation

| Example | Code | Description |
|---------|------|-------------|
| **Animation Controls** | [Code](wednesday_5th/p5Play/p5play_00_animation_controls/) · [Demo](https://npuckett.github.io/mlphone/wednesday_5th/p5Play/p5play_00_animation_controls/) | Basic animation UI with buttons and sliders. Control animation playback, speed, and frame selection. |
| **Simple Touch Movement** | [Code](wednesday_5th/p5Play/p5play_01_animated_character_phone_simple/) · [Demo](https://npuckett.github.io/mlphone/wednesday_5th/p5Play/p5play_01_animated_character_phone_simple/) | Touch-based character movement with walk/idle animations. Foundation for animated character control. |
| **Tiredness System** | [Code](wednesday_5th/p5Play/p5play_02_animated_character_phone/) · [Demo](https://npuckett.github.io/mlphone/wednesday_5th/p5Play/p5play_02_animated_character_phone/) | Complete resource management with tiredness parameter. Movement drains energy, rest recovers it. State-based animation switching. |

---

### Device Sensor Integration

| Example | Code | Description |
|---------|------|-------------|
| **Tilt Character** | [Code](wednesday_5th/p5Play/p5play_03_tilt_character/) · [Demo](https://npuckett.github.io/mlphone/wednesday_5th/p5Play/p5play_03_tilt_character/) | Gyroscope-controlled depth simulation. Device tilt controls character position with pseudo-3D parallax effect. |
| **Sound Introversion** | [Code](wednesday_5th/p5Play/p5play_04_sound_introversion/) · [Demo](https://npuckett.github.io/mlphone/wednesday_5th/p5Play/p5play_04_sound_introversion/) | Microphone-driven introverted behavior. Loud environments cause character to hide; quiet environments encourage exploration. |
| **Shake Detection** | [Code](friday_7th/characterController/05_parameter_stress_shake/) · [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/05_parameter_stress_shake/) | Device shake increases character stress. Demonstrates deviceShaken() event with parameter-driven visual responses. |

---

### Character Controller Templates (Input → Parameter → Output)

| Example | Code | Description |
|---------|------|-------------|
| **Simple Template** | [Code](friday_7th/characterController/00_template_simple/) · [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/00_template_simple/) | Minimal template demonstrating the input → parameter → output pattern. Foundation for all controller examples. |
| **Health Parameter** | [Code](friday_7th/characterController/01_parameter_health/) · [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/01_parameter_health/) | Resource decay system where clicks restore health. Shows positive feedback loop and visual state representation. |
| **Momentum Parameter** | [Code](friday_7th/characterController/02_parameter_momentum/) · [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/02_parameter_momentum/) | Physics-based momentum accumulation. Clicks build speed with natural decay and inertia. |
| **Stress Parameter** | [Code](friday_7th/characterController/03_parameter_stress/) · [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/03_parameter_stress/) | Negative feedback where clicks increase stress. Character becomes jittery and color-shifts under pressure. |
| **Stress + Collision** | [Code](friday_7th/characterController/04_parameter_stress_collision/) · [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/04_parameter_stress_collision/) | Autonomous AI with collision-based stress. Character wanders; wall collisions increase stress causing behavioral changes. |
| **Stress + Shake** | [Code](friday_7th/characterController/05_parameter_stress_shake/) · [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/05_parameter_stress_shake/) | Device shake sensor input affects stress parameter. Demonstrates mobile sensor integration with parameter systems. |
| **Multi-Character Class** | [Code](friday_7th/characterController/06_multi_character_class/) · [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/06_multi_character_class/) | Object-oriented system with 10 characters, each with randomized personality traits (stress sensitivity, recovery rate, speed). Demonstrates class-based architecture and emergent behavior from varied parameters. |

---

### Object-Oriented Programming & Data Persistence

| Example | Code | Description |
|---------|------|-------------|
| **localStorage Basic** | [Code](wednesday_19th/localStorage/01_localStorage_example/) · [Demo](https://npuckett.github.io/mlphone/wednesday_19th/localStorage/01_localStorage_example/) | Introduction to browser data persistence with save/load/clear operations. Foundation for stateful applications. |
| **Persistent Stress Character** | [Code](wednesday_19th/localStorage/02_stress_shake_persistent/) · [Demo](https://npuckett.github.io/mlphone/wednesday_19th/localStorage/02_stress_shake_persistent/) | Character stress persists between sessions. Shake phone to increase stress; data saves automatically to localStorage. |
| **Circle Class** | [Code](wednesday_19th/classes/01_basic_circle_class/) · [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/01_basic_circle_class/) | Introduction to classes with interactive circles. Click to fade, shake to add more. Separate Circle.js file demonstrates encapsulation. |
| **Functions Comparison** | [Code](wednesday_19th/classes/02_basic_circle_functions/) · [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/02_basic_circle_functions/) | Same circle behavior WITHOUT classes (10 parallel arrays). Direct comparison shows why classes are valuable. |
| **StressCharacter Class** | [Code](wednesday_19th/classes/03_stress_character_class/) · [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/03_stress_character_class/) | Complete refactor: 550-line function version → 280-line main + 320-line reusable class. Stress system with localStorage integration. |
| **Character Template Class** | [Code](wednesday_19th/classes/04_character_template_class/) · [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/04_character_template_class/) | Reusable template for parameter-driven characters (health, stress, energy, mood). Built-in localStorage, extension examples in README. |
| **BodyPoseTracker Class** | [Code](wednesday_19th/classes/05_bodypose_tracker_class/) · [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/05_bodypose_tracker_class/) | ML5 BodyPose wrapper class. 40+ lines of setup → 1 line. Name-based point access, built-in measurements, automatic velocity tracking. |
| **GazeDetector Class** | [Code](wednesday_19th/classes/06_gaze_detector_class/) · [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/06_gaze_detector_class/) | ML5 FaceMesh gaze wrapper. Returns direction ("LEFT", "CENTER", "RIGHT") and position. Adjustable sensitivity, built-in smoothing and visualization. |

---

## Documentation

- **[Wednesday 29th README](wednesday_29th/README.md)** - ML5 camera setup and basic tracking
- **[Wednesday 5th README](wednesday_5th/README.md)** - Character animation progression
- **[Friday 7th README](friday_7th/README.md)** - Parameter-driven character controller templates
- **[Wednesday 19th README](wednesday_19th/README.md)** - Classes, localStorage, and ML5 wrapper patterns
- **[Friday 31st README](friday_31st/README.md)** - Advanced tracking methods and p5play integration

---

## Repository Structure

### wednesday_29th/ - ML5 Camera Basics
**Foundation examples for ML5 pose tracking with p5-phone camera management**

| Example | Description | Live Demo |
|---------|-------------|-----------|
| `PHONE_01_camera-selector` | Basic camera setup with front/back toggle | [Demo](https://npuckett.github.io/mlphone/wednesday_29th/PHONE_01_camera-selector/) |
| `PHONE_02_facemesh` | ML5 FaceMesh tracking (468 keypoints) | [Demo](https://npuckett.github.io/mlphone/wednesday_29th/PHONE_02_facemesh/) |
| `PHONE_03_handpose` | ML5 HandPose tracking (21 keypoints) | [Demo](https://npuckett.github.io/mlphone/wednesday_29th/PHONE_03_handpose/) |
| `PHONE_04_bodypose` | ML5 BodyPose tracking (17 keypoints) | [Demo](https://npuckett.github.io/mlphone/wednesday_29th/PHONE_04_bodypose/) |

**Key Topics:** Camera initialization, ML5 model setup, keypoint visualization, coordinate mapping

---

### wednesday_5th/ - Character Animation Progression
**Progressive series exploring animated character behavior with sensors and AI**

| Example | Description | Live Demo |
|---------|-------------|-----------|
| `p5play_00_animation_controls` | Basic animation UI (buttons & slider) | [Demo](https://npuckett.github.io/mlphone/wednesday_5th/p5Play/p5play_00_animation_controls/) |
| `p5play_01_animated_character_phone_simple` | Simple touch-based movement | [Demo](https://npuckett.github.io/mlphone/wednesday_5th/p5Play/p5play_01_animated_character_phone_simple/) |
| `p5play_02_animated_character_phone` | Complete tiredness system | [Demo](https://npuckett.github.io/mlphone/wednesday_5th/p5Play/p5play_02_animated_character_phone/) |
| `p5play_03_tilt_character` | Gyroscope-controlled depth simulation | [Demo](https://npuckett.github.io/mlphone/wednesday_5th/p5Play/p5play_03_tilt_character/) |
| `p5play_04_sound_introversion` | Microphone-driven introverted behavior | [Demo](https://npuckett.github.io/mlphone/wednesday_5th/p5Play/p5play_04_sound_introversion/) |
| `p5play_05_gaze_sprites` | FaceMesh gaze detection with fleeing AI | [Demo](https://npuckett.github.io/mlphone/wednesday_5th/p5Play/p5play_05_gaze_sprites/) |

**Key Topics:** Sprite animation, tiredness system, state machines, device sensors (gyroscope, microphone), computer vision integration, complex AI behaviors

---

### friday_7th/ - Character Controller Templates
**Parameter-driven character control demonstrating input → parameter → output pattern**

| Example | Description | Live Demo |
|---------|-------------|-----------|
| `00_template_simple` | Minimal template with basic pattern | [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/00_template_simple/) |
| `01_parameter_health` | Resource decay system (positive input) | [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/01_parameter_health/) |
| `02_parameter_momentum` | Physics-based accumulation | [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/02_parameter_momentum/) |
| `03_parameter_stress` | Negative feedback (clicks increase stress) | [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/03_parameter_stress/) |
| `04_parameter_stress_collision` | Autonomous AI with collision detection | [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/04_parameter_stress_collision/) |
| `05_parameter_stress_shake` | Device sensor input (shake detection) | [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/05_parameter_stress_shake/) |
| `06_multi_character_class` | Multiple characters with class-based architecture | [Demo](https://npuckett.github.io/mlphone/friday_7th/characterController/06_multi_character_class/) |

**Key Topics:** Parameter-driven control, resource systems, momentum/physics, negative feedback, autonomous AI, device sensors, emergent behavior, class-based architecture

---

### wednesday_19th/ - Classes & localStorage
**Object-oriented programming patterns and data persistence with localStorage**

#### localStorage Examples
| Example | Description | Live Demo |
|---------|-------------|-----------|
| `01_localStorage_example` | Basic save/load/clear operations | [Demo](https://npuckett.github.io/mlphone/wednesday_19th/localStorage/01_localStorage_example/) |
| `02_stress_shake_persistent` | Character stress persists between sessions | [Demo](https://npuckett.github.io/mlphone/wednesday_19th/localStorage/02_stress_shake_persistent/) |

#### Class Examples - Introduction
| Example | Description | Live Demo |
|---------|-------------|-----------|
| `01_basic_circle_class` | Intro to classes with interactive circles | [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/01_basic_circle_class/) |
| `02_basic_circle_functions` | Same functionality WITHOUT classes (comparison) | [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/02_basic_circle_functions/) |

#### Class Examples - Character Controllers
| Example | Description | Live Demo |
|---------|-------------|-----------|
| `03_stress_character_class` | StressCharacter class with localStorage | [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/03_stress_character_class/) |
| `04_character_template_class` | Reusable character template | [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/04_character_template_class/) |

#### Class Examples - ML5 Wrappers
| Example | Description | Live Demo |
|---------|-------------|-----------|
| `05_bodypose_tracker_class` | BodyPose wrapper (40+ lines → 1 line) | [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/05_bodypose_tracker_class/) |
| `06_gaze_detector_class` | FaceMesh gaze wrapper with easy API | [Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/06_gaze_detector_class/) |

**Key Topics:** Classes (constructor, methods, encapsulation), localStorage API (setItem, getItem, removeItem), wrapper pattern, template pattern, code organization, reusability

---

---

### friday_31st/ - ML5 + p5play Integration
**Advanced tracking methods and sprite-based interactions**

#### 01 - Tracking Data Methods (Simple)
| Example | Description | Live Demo |
|---------|-------------|-----------|
| `PHONE_BodyPose_two_points` | Two-variable method for body tracking | [Demo](https://npuckett.github.io/mlphone/friday_31st/01_trackingDataMethods-simple/PHONE_BodyPose_two_points/) |
| `PHONE_FaceMesh_two_points` | Two-variable method for face tracking | [Demo](https://npuckett.github.io/mlphone/friday_31st/01_trackingDataMethods-simple/PHONE_FaceMesh_two_points/) |
| `PHONE_HandPose_two_points` | Two-variable method for hand tracking | [Demo](https://npuckett.github.io/mlphone/friday_31st/01_trackingDataMethods-simple/PHONE_HandPose_two_points/) |
| `THREE_BodyPose_two_points` | THREE.js version with body tracking | [Demo](https://npuckett.github.io/mlphone/friday_31st/01_trackingDataMethods-simple/THREE_BodyPose_two_points/) |
| `THREE_FaceMesh_two_points` | THREE.js version with face tracking | [Demo](https://npuckett.github.io/mlphone/friday_31st/01_trackingDataMethods-simple/THREE_FaceMesh_two_points/) |
| `THREE_HandPose_two_points` | THREE.js version with hand tracking | [Demo](https://npuckett.github.io/mlphone/friday_31st/01_trackingDataMethods-simple/THREE_HandPose_two_points/) |

#### 02 - Tracking Data (Advanced)
| Example | Description | Live Demo |
|---------|-------------|-----------|
| `PHONE_FaceMesh_gaze_detection` | 3D gaze tracking from face orientation | [Demo](https://npuckett.github.io/mlphone/friday_31st/02_trackingData-adv/PHONE_FaceMesh_gaze_detection/) |
| `PHONE_FaceMesh_gesture_detection` | Head gesture recognition from velocity | [Demo](https://npuckett.github.io/mlphone/friday_31st/02_trackingData-adv/PHONE_FaceMesh_gesture_detection/) |

#### 03 - p5play Basics
| Example | Description | Live Demo |
|---------|-------------|-----------|
| `p5play_01_basic_chase` | Sprite chasing with basic physics | [Demo](https://npuckett.github.io/mlphone/friday_31st/03_p5Play/p5play_01_basic_chase/) |
| `p5play_03_bouncing_ball` | Bouncing ball with collision | [Demo](https://npuckett.github.io/mlphone/friday_31st/03_p5Play/p5play_03_bouncing_ball/) |

#### 04 - ML5 + p5play Integration
| Example | Description | Live Demo |
|---------|-------------|-----------|
| `p5play_02_handpose_chase` | Hand-controlled sprite chasing | [Demo](https://npuckett.github.io/mlphone/friday_31st/04_ml5_p5play/p5play_02_handpose_chase/) |
| `p5play_04_handpose_ball` | Hand-controlled bouncing ball | [Demo](https://npuckett.github.io/mlphone/friday_31st/04_ml5_p5play/p5play_04_handpose_ball/) |
| `p5play_05_gaze_sprites` | Gaze-controlled sprite interaction | [Demo](https://npuckett.github.io/mlphone/friday_31st/04_ml5_p5play/p5play_05_gaze_sprites/) |

**Key Topics:** Two-variable tracking pattern, distance/angle/velocity measurement, gaze detection, gesture recognition, ML5-to-sprite integration

---

## Technologies

### Core Libraries
- **[p5.js v1.11.4](https://p5js.org/)** - Creative coding framework
- **[ml5.js v1.x](https://ml5js.org/)** - Machine learning library
- **[p5play v3](https://p5play.org/)** - Sprite animation and physics
- **[p5-phone v1.6.1](https://github.com/ml5js/p5-phone)** - Mobile sensors and camera management
- **[p5.sound](https://p5js.org/reference/#/libraries/p5.sound)** - Audio input (for microphone examples)
- **[THREE.js](https://threejs.org/)** - 3D graphics (for THREE examples)

### ML5 Models Used
- **FaceMesh** - 468 face keypoints, gaze detection, facial gestures
- **HandPose** - 21 hand keypoints per hand, gesture recognition
- **BodyPose** - 17 body keypoints (MoveNet), full-body tracking


---

## Key Concepts

### Camera Management (p5-phone)
```javascript
// Create front-facing camera, mirrored, fitted to height
cam = createPhoneCamera('user', true, 'fitHeight');
enableCameraTap();  // Tap to toggle camera

// Wait for camera ready before starting ML5
cam.onReady(() => {
  ml5Model.detectStart(cam.videoElement, callback);
});
```

### ML5 Tracking Pattern
```javascript
// 1. Configure model
let options = { maxFaces: 1, refineLandmarks: false };

// 2. Initialize model
faceMesh = ml5.faceMesh(options, modelLoaded);

// 3. Start detection (after camera ready)
faceMesh.detectStart(cam.videoElement, gotFaces);

// 4. Process results
function gotFaces(results) {
  faces = results;
}
```

### Coordinate Mapping
```javascript
// ML5 raw coordinates → Canvas coordinates
let mapped = cam.mapKeypoint(rawKeypoint);
circle(mapped.x, mapped.y, 10);
```

### Two-Variable Method
```javascript
// Separate index from data for clarity
let keypointIndex = 11;  // Left shoulder
let keypointData = getKeypoint(keypointIndex, 0);

if (keypointData) {
  circle(keypointData.x, keypointData.y, 20);
}
```

### Sprite Animation (p5play)
```javascript
// Load and configure animations
idleAni = loadAni('animations/idle/idleAnim_1.png', 9);
character.addAni('idle', idleAni);
character.changeAni('idle');
character.ani.frameDelay = 8;  // Speed control
```

### State Machine Pattern
```javascript
// Priority-based behavior
if (activeTimer > 0) {
  continueAction();
} else if (triggerCondition) {
  startNewAction();
} else {
  defaultBehavior();
}
```


### Documentation
- [p5.js Reference](https://p5js.org/reference/)
- [ml5.js Documentation](https://ml5js.org/)
- [p5play Learn](https://p5play.org/learn/)
- [p5-phone GitHub](https://github.com/ml5js/p5-phone)

### Example Collections
- [Wednesday 29th](https://npuckett.github.io/mlphone/wednesday_29th/) - Camera basics
- [Wednesday 5th](https://npuckett.github.io/mlphone/wednesday_5th/) - Character animation
- [Friday 7th](https://npuckett.github.io/mlphone/friday_7th/) - Character controller templates
- [Wednesday 19th](https://npuckett.github.io/mlphone/wednesday_19th/) - Classes & localStorage
- [Friday 31st](https://npuckett.github.io/mlphone/friday_31st/) - Advanced tracking

---

**Repository:** [github.com/npuckett/mlphone](https://github.com/npuckett/mlphone)

**Live Demos:** [npuckett.github.io/mlphone](https://npuckett.github.io/mlphone)