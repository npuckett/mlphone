# ML Phone - Mobile Machine Learning Examples

A comprehensive collection of mobile-first machine learning examples using p5.js, ml5.js, p5play, and p5-phone. These examples demonstrate pose tracking, character animation, sensor integration, and interactive ML experiences optimized for mobile devices.

---

## 📱 Live Demos

- **[Wednesday 29th - ML5 Camera Basics](https://npuckett.github.io/mlphone/wednesday_29th/)** - Foundation examples
- **[Friday - ML5 + p5play Integration](https://npuckett.github.io/mlphone/friday/)** - Advanced tracking & sprites
- **[Wednesday 5th - Character Animation](https://npuckett.github.io/mlphone/wednesday_5th/)** - Progressive animation examples

---

## 📚 Documentation

- **[Wednesday 29th README](wednesday_29th/README.md)** - ML5 camera setup and basic tracking
- **[Friday README](friday/README.md)** - Advanced tracking methods and p5play integration
- **[Wednesday 5th README](wednesday_5th/README.md)** - Character animation progression

---

## 🗂️ Repository Structure

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

### friday/ - ML5 + p5play Integration
**Advanced tracking methods and sprite-based interactions**

#### 01 - Tracking Data Methods (Simple)
| Example | Description | Live Demo |
|---------|-------------|-----------|
| `PHONE_BodyPose_two_points` | Two-variable method for body tracking | [Demo](https://npuckett.github.io/mlphone/friday/01_trackingDataMethods-simple/PHONE_BodyPose_two_points/) |
| `PHONE_FaceMesh_two_points` | Two-variable method for face tracking | [Demo](https://npuckett.github.io/mlphone/friday/01_trackingDataMethods-simple/PHONE_FaceMesh_two_points/) |
| `PHONE_HandPose_two_points` | Two-variable method for hand tracking | [Demo](https://npuckett.github.io/mlphone/friday/01_trackingDataMethods-simple/PHONE_HandPose_two_points/) |
| `THREE_BodyPose_two_points` | THREE.js version with body tracking | [Demo](https://npuckett.github.io/mlphone/friday/01_trackingDataMethods-simple/THREE_BodyPose_two_points/) |
| `THREE_FaceMesh_two_points` | THREE.js version with face tracking | [Demo](https://npuckett.github.io/mlphone/friday/01_trackingDataMethods-simple/THREE_FaceMesh_two_points/) |
| `THREE_HandPose_two_points` | THREE.js version with hand tracking | [Demo](https://npuckett.github.io/mlphone/friday/01_trackingDataMethods-simple/THREE_HandPose_two_points/) |

#### 02 - Tracking Data (Advanced)
| Example | Description | Live Demo |
|---------|-------------|-----------|
| `PHONE_FaceMesh_gaze_detection` | 3D gaze tracking from face orientation | [Demo](https://npuckett.github.io/mlphone/friday/02_trackingData-adv/PHONE_FaceMesh_gaze_detection/) |
| `PHONE_FaceMesh_gesture_detection` | Head gesture recognition from velocity | [Demo](https://npuckett.github.io/mlphone/friday/02_trackingData-adv/PHONE_FaceMesh_gesture_detection/) |

#### 03 - p5play Basics
| Example | Description | Live Demo |
|---------|-------------|-----------|
| `p5play_01_basic_chase` | Sprite chasing with basic physics | [Demo](https://npuckett.github.io/mlphone/friday/03_p5Play/p5play_01_basic_chase/) |
| `p5play_03_bouncing_ball` | Bouncing ball with collision | [Demo](https://npuckett.github.io/mlphone/friday/03_p5Play/p5play_03_bouncing_ball/) |

#### 04 - ML5 + p5play Integration
| Example | Description | Live Demo |
|---------|-------------|-----------|
| `p5play_02_handpose_chase` | Hand-controlled sprite chasing | [Demo](https://npuckett.github.io/mlphone/friday/04_ml5_p5play/p5play_02_handpose_chase/) |
| `p5play_04_handpose_ball` | Hand-controlled bouncing ball | [Demo](https://npuckett.github.io/mlphone/friday/04_ml5_p5play/p5play_04_handpose_ball/) |
| `p5play_05_gaze_sprites` | Gaze-controlled sprite interaction | [Demo](https://npuckett.github.io/mlphone/friday/04_ml5_p5play/p5play_05_gaze_sprites/) |

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

## 🛠️ Technologies

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

## 📖 Learning Path

### Beginner Track
1. **Start:** [wednesday_29th](wednesday_29th/) - Learn camera setup and basic ML5 models
2. **Practice:** Try each model (FaceMesh, HandPose, BodyPose)
3. **Experiment:** Modify keypoint visualization and thresholds

### Intermediate Track
1. **Start:** [friday/01_trackingDataMethods-simple](friday/01_trackingDataMethods-simple/) - Learn two-variable tracking pattern
2. **Practice:** Calculate distances, angles, velocities between keypoints
3. **Experiment:** [friday/02_trackingData-adv](friday/02_trackingData-adv/) - Implement gaze and gesture detection

### Advanced Track
1. **Start:** [friday/03_p5Play](friday/03_p5Play/) - Learn p5play sprite basics
2. **Progress:** [friday/04_ml5_p5play](friday/04_ml5_p5play/) - Connect ML5 tracking to sprites
3. **Master:** [wednesday_5th](wednesday_5th/) - Build complex character AI with sensors

---

## 🎯 Key Concepts

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

---

## 💡 Common Use Cases

### Gesture Recognition
- Head nods/shakes (FaceMesh velocity history)
- Hand gestures (HandPose finger positions)
- Body poses (BodyPose keypoint relationships)

### Interactive Characters
- Touch/gaze-controlled movement
- Sensor-driven behaviors (tilt, sound, camera)
- AI personality systems (tiredness, introversion)

### Game Mechanics
- Hand-controlled sprites
- Body-controlled avatars
- Gaze-based targeting

### Creative Installations
- Face-responsive visuals
- Movement-triggered animations
- Multi-modal interactions

---

## 🚀 Getting Started

### Local Development
```bash
# Clone repository
git clone https://github.com/npuckett/mlphone.git
cd mlphone

# Serve with local server (required for camera access)
python -m http.server 8000
# or
npx http-server

# Open in browser
# Navigate to http://localhost:8000/wednesday_29th/
```

### Mobile Testing
1. Ensure HTTPS (required for camera/sensors)
2. Use GitHub Pages or similar hosting
3. Scan QR codes from index pages for quick mobile access
4. Test on actual device (DevTools emulation has limitations)

---

## 📱 Mobile Optimization

All examples optimized for mobile:
- **Canvas:** 405×720 (9:16 portrait)
- **Touch Controls:** Tap-based interactions
- **Sensor Access:** Gyroscope, microphone, camera
- **Performance:** 30-60 FPS on modern phones
- **UI:** Large touch targets, clear feedback

---

## 🤝 Contributing

These examples are designed for educational purposes. Feel free to:
- Fork and experiment
- Create variations
- Submit improvements
- Share your creations

---

## 📄 License

Educational examples for mobile machine learning workshop.

---

## 🔗 Quick Links

### Documentation
- [p5.js Reference](https://p5js.org/reference/)
- [ml5.js Documentation](https://ml5js.org/)
- [p5play Learn](https://p5play.org/learn/)
- [p5-phone GitHub](https://github.com/ml5js/p5-phone)

### Example Collections
- [Wednesday 29th](https://npuckett.github.io/mlphone/wednesday_29th/) - Camera basics
- [Friday](https://npuckett.github.io/mlphone/friday/) - Advanced tracking
- [Wednesday 5th](https://npuckett.github.io/mlphone/wednesday_5th/) - Character animation

---

**Repository:** [github.com/npuckett/mlphone](https://github.com/npuckett/mlphone)

**Live Demos:** [npuckett.github.io/mlphone](https://npuckett.github.io/mlphone)