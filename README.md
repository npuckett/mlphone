# ML Phone - Mobile Machine Learning Examples


---

## Live Demos

- **[Wednesday 29th - ML5 Camera Basics](https://npuckett.github.io/mlphone/wednesday_29th/)** - Foundation examples
- **[Friday 31st - ML5 + p5play Integration](https://npuckett.github.io/mlphone/friday_31st/)** - Advanced tracking & sprites
- **[Wednesday 5th - Character Animation](https://npuckett.github.io/mlphone/wednesday_5th/)** - Progressive animation examples
- **[Friday 7th - Character Controller Templates](https://npuckett.github.io/mlphone/friday_7th/)** - Parameter-driven character control

---

## Documentation

- **[Wednesday 29th README](wednesday_29th/README.md)** - ML5 camera setup and basic tracking
- **[Friday 31st README](friday_31st/README.md)** - Advanced tracking methods and p5play integration
- **[Wednesday 5th README](wednesday_5th/README.md)** - Character animation progression
- **[Friday 7th README](friday_7th/README.md)** - Parameter-driven character controller templates

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
| `00_template_simple` | Minimal template with basic pattern | [Demo](https://npuckett.github.io/exampleFix/friday_7th/characterController/00_template_simple/) |
| `01_parameter_health` | Resource decay system (positive input) | [Demo](https://npuckett.github.io/exampleFix/friday_7th/characterController/01_parameter_health/) |
| `02_parameter_momentum` | Physics-based accumulation | [Demo](https://npuckett.github.io/exampleFix/friday_7th/characterController/02_parameter_momentum/) |
| `03_parameter_stress` | Negative feedback (clicks increase stress) | [Demo](https://npuckett.github.io/exampleFix/friday_7th/characterController/03_parameter_stress/) |
| `04_parameter_stress_collision` | Autonomous AI with collision detection | [Demo](https://npuckett.github.io/exampleFix/friday_7th/characterController/04_parameter_stress_collision/) |
| `05_parameter_stress_shake` | Device sensor input (shake detection) | [Demo](https://npuckett.github.io/exampleFix/friday_7th/characterController/05_parameter_stress_shake/) |

**Key Topics:** Parameter-driven control, resource systems, momentum/physics, negative feedback, autonomous AI, device sensors, emergent behavior

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
- [Friday 31st](https://npuckett.github.io/mlphone/friday_31st/) - Advanced tracking
- [Wednesday 5th](https://npuckett.github.io/mlphone/wednesday_5th/) - Character animation
- [Friday 7th](https://npuckett.github.io/mlphone/friday_7th/) - Character controller templates

---

**Repository:** [github.com/npuckett/mlphone](https://github.com/npuckett/mlphone)

**Live Demos:** [npuckett.github.io/mlphone](https://npuckett.github.io/mlphone)