# Friday 7th - Character Controller Templates

**Live Demo Index:** https://npuckett.github.io/mlphone/friday_7th/

A focused collection demonstrating the fundamental pattern of **parameter-driven character control** - how raw inputs become parameters, and how those parameters drive movement and animation.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Concept: Input → Parameter → Output](#core-concept-input--parameter--output)
3. [Example Progression](#example-progression)
4. [00_template_simple - Minimal Template](#00_template_simple---minimal-template)
5. [01_parameter_health - Resource System](#01_parameter_health---resource-system)
6. [02_parameter_momentum - Physics System](#02_parameter_momentum---physics-system)
7. [03_parameter_stress - Negative Feedback](#03_parameter_stress---negative-feedback)
8. [04_parameter_stress_collision - Autonomous AI](#04_parameter_stress_collision---autonomous-ai)
9. [05_parameter_stress_shake - Device Sensors](#05_parameter_stress_shake---device-sensors)
10. [Parameter Types Comparison](#parameter-types-comparison)
11. [Animation Control Patterns](#animation-control-patterns)
12. [Adapting These Templates](#adapting-these-templates)

---

## Overview

This collection demonstrates a fundamental game development pattern that creates more organic, game-like character behavior. Instead of direct control, these examples use **intermediate parameters** that respond to both user inputs AND environmental forces.

**Core Technologies:**
- **p5.js v1.11.4** - Required for p5play v3 compatibility
- **p5play v3** - Sprite animation and movement system
- **Planck.js v1.0.5** - Physics engine (p5play dependency)
- **p5-phone v1.6.1** - Mobile touch support and device sensors

**Canvas:** All examples use 405×720 pixels (9:16 portrait aspect ratio) optimized for mobile screens.

---

## Core Concept: Input → Parameter → Output

Unlike directly controlling a character with inputs, these examples use an intermediate **parameter** that creates emergent behavior.

### The Pattern

```
RAW INPUT (click/touch/shake)
         ↓
    PARAMETER (health, momentum, stress)
         ← influenced by environmental forces
         ← has inertia and state
         ↓
    OUTPUTS (speed, animation, visuals)
```

### Why Use Parameters?

1. **Environmental Forces**: Parameters can be affected by multiple forces (input, decay, friction, etc.)
2. **Inertia/Smoothing**: Creates organic acceleration/deceleration
3. **State Persistence**: Character state exists beyond individual inputs
4. **Multiple Outputs**: One parameter can drive speed, animation, visuals simultaneously
5. **Emergent Behavior**: Interactions between forces create complex, game-like feel

---

## Example Progression

The examples demonstrate different parameter types and complexity levels:

| Example | Parameter Type | Input Nature | Key Systems | Device Input |
|---------|---------------|--------------|-------------|--------------|
| **00** | Health (simple) | Template only | Basic threshold switching | Touch/click |
| **01** | Health | Positive (helpful) | Resource decay, boost | Touch/click |
| **02** | Momentum | Accumulative | Directional consistency, friction | Touch/click |
| **03** | Stress | Negative (harmful) | Click increases stress | Touch/click |
| **04** | Stress | Collision-based | Autonomous wandering AI | Touch/click |
| **05** | Stress | Sensor input | Shake detection, wandering | deviceShaken() |

Each example includes:
- Complete inline documentation
- Organized global variables
- Mobile touch support
- Reusable character animations
- Clear parameter → output mapping

---

## 00_template_simple - Minimal Template

**Minimal starting template showing the core pattern with 2 animations.**

### What It Does
- Character moves to clicked position
- Health parameter changes based on interaction
- Two animations switch at health threshold (50)
- Demonstrates basic INPUT → PARAMETER → OUTPUT flow

### Key Code Patterns

```javascript
// PARAMETER CALCULATION
function calculateHealth() {
  // Environmental force: health decays over time
  health -= HEALTH_DECAY_RATE;
  
  // Apply constraints
  health = constrain(health, 0, 100);
}

// BEHAVIOR 1: High health (> 50)
function behaviour1() {
  if (character.ani.name !== 'walk') {
    character.changeAni('walk');
  }
}

// BEHAVIOR 2: Low health (≤ 50)
function behaviour2() {
  if (character.ani.name !== 'idle') {
    character.changeAni('idle');
  }
}
```

### Purpose
Demonstrates the simplest possible implementation of the parameter pattern. Good starting point for creating your own character controllers.

### Files
- `index.html` - Basic setup with p5.js, p5play, p5-phone
- `sketch.js` - ~150 lines, heavily commented
- `animations/idle/` - 9 frames
- `animations/walk/` - 13 frames

---

## 01_parameter_health - Resource System

**Resource-based parameter where clicks provide positive influence, while environmental decay creates constant pressure.**

### What It Does
- Health constantly decays (environmental force)
- Clicks boost health (positive input)
- Health affects movement speed
- Animation switches based on health threshold
- Visual feedback through character tinting

### Health System

```javascript
// CONSTANTS
const HEALTH_DECAY = 0.1;      // Decay per frame
const HEALTH_BOOST = 15;       // Boost per click
const HEALTH_THRESHOLD = 50;   // Animation switch point

// Health affects multiple outputs
function updateCharacter() {
  // OUTPUT 1: Speed scales with health (0-3 pixels/frame)
  moveSpeed = map(health, 0, 100, 0, 3);
  
  // OUTPUT 2: Animation switches at threshold
  if (health > HEALTH_THRESHOLD) {
    character.changeAni('walk');
  } else {
    character.changeAni('idle');
  }
  
  // OUTPUT 3: Visual tint shows health level
  let tintAmount = map(health, 0, 100, 255, 0);
  character.color = color(255, 255 - tintAmount, 255 - tintAmount);
}
```

### Movement Pattern

```javascript
// Smooth inertia-based movement
if (isMoving) {
  character.moveTo(targetX, targetY, moveSpeed);
  
  // Stop when close to target
  let distance = dist(character.x, character.y, targetX, targetY);
  if (distance < 5) {
    isMoving = false;
  }
}
```

### Input Handling

```javascript
function touchStarted() {
  targetX = touchX;
  targetY = touchY;
  isMoving = true;
  
  // Input boosts health parameter
  health += HEALTH_BOOST;
  health = constrain(health, 0, 100);
  
  return false;  // Prevent default touch behavior
}
```

### Notable Features
- Constant environmental pressure (decay)
- Multiple outputs from single parameter
- Smooth movement with inertia
- Visual feedback system

### Use Cases
- Stamina/energy systems
- Vitality mechanics
- Resource management gameplay

---

## 02_parameter_momentum - Physics System

**Physics-based parameter where repeated clicks in the same direction build up speed, with friction and drag creating decay.**

### What It Does
- Rapid clicks build momentum
- Directional consistency detection
- Momentum decays through friction
- Exponential speed scaling
- Sprint mode at high momentum
- Motion trail visual effects

### Momentum System

```javascript
// CONSTANTS
const MOMENTUM_INCREMENT = 15;      // Gain per click
const MOMENTUM_DECAY = 0.5;         // Friction per frame
const MOMENTUM_SPRINT = 70;         // Sprint threshold
const CONSISTENCY_BONUS = 10;       // Directional bonus
const CLICK_HISTORY_LENGTH = 5;     // For consistency check

// Momentum drives multiple outputs
function updateMomentum() {
  // OUTPUT 1: Exponential speed scaling
  if (momentum < 30) {
    moveSpeed = map(momentum, 0, 30, 0, 1);  // Slow start
  } else if (momentum < MOMENTUM_SPRINT) {
    moveSpeed = map(momentum, 30, MOMENTUM_SPRINT, 1, 3);
  } else {
    moveSpeed = map(momentum, MOMENTUM_SPRINT, 100, 3, 6);  // Sprint!
  }
  
  // OUTPUT 2: Animation switches
  if (momentum > MOMENTUM_SPRINT) {
    character.changeAni('walk');
    character.ani.frameDelay = 2;  // Fast animation
  } else if (momentum > 30) {
    character.changeAni('walk');
    character.ani.frameDelay = 4;
  } else {
    character.changeAni('idle');
  }
}
```

### Directional Consistency Detection

```javascript
// Store click history for pattern detection
let clickHistory = [];

function touchStarted() {
  // Calculate direction of this click
  let angle = atan2(touchY - character.y, touchX - character.x);
  
  // Add to history
  clickHistory.push(angle);
  if (clickHistory.length > CLICK_HISTORY_LENGTH) {
    clickHistory.shift();
  }
  
  // Check if clicks are in consistent direction
  if (clickHistory.length >= 3) {
    let isConsistent = checkDirectionalConsistency();
    if (isConsistent) {
      momentum += CONSISTENCY_BONUS;  // Reward skill!
    }
  }
}

function checkDirectionalConsistency() {
  // Compare recent clicks - are they going the same way?
  let avgAngle = clickHistory.reduce((a, b) => a + b) / clickHistory.length;
  let variance = 0;
  
  for (let angle of clickHistory) {
    variance += abs(angle - avgAngle);
  }
  
  return variance < 1.0;  // Low variance = consistent
}
```

### Motion Trail Effect

```javascript
// Visual feedback for high momentum
function drawMotionTrail() {
  if (momentum > 50) {
    let trailLength = floor(map(momentum, 50, 100, 3, 10));
    
    for (let i = 0; i < trailLength; i++) {
      let alpha = map(i, 0, trailLength, 100, 0);
      fill(255, 255, 255, alpha);
      circle(character.x, character.y, 30 - i * 2);
    }
  }
}
```

### Notable Features
- Accumulative building system
- Input history analysis
- Skill-based bonuses
- Dynamic visual feedback
- Exponential scaling

### Use Cases
- Speed building mechanics
- Combo systems
- Skill-based movement
- Racing/runner games

---

## 03_parameter_stress - Negative Feedback

**Negative feedback system where user clicks INCREASE stress, creating inverse relationship between input and character state.**

### What It Does
- Clicks INCREASE stress (harmful input)
- Stress naturally decreases over time (recovery)
- Visual jitter at high stress
- Panic threshold disables walking
- Inverse relationship: less input = better state

### Stress System

```javascript
// CONSTANTS
const STRESS_CLICK_INCREASE = 12;   // Harm per click
const STRESS_RECOVERY = 0.2;        // Recovery per frame
const STRESS_JITTER_THRESHOLD = 60; // Jitter starts
const STRESS_PANIC_THRESHOLD = 85;  // Movement disabled

function updateStress() {
  // Environmental force: natural recovery
  stress -= STRESS_RECOVERY;
  stress = constrain(stress, 0, 100);
  
  // OUTPUT 1: Visual jitter
  if (stress > STRESS_JITTER_THRESHOLD) {
    let jitterAmount = map(stress, STRESS_JITTER_THRESHOLD, 100, 0, 10);
    character.x += random(-jitterAmount, jitterAmount);
    character.y += random(-jitterAmount, jitterAmount);
  }
  
  // OUTPUT 2: Panic state disables movement
  if (stress > STRESS_PANIC_THRESHOLD) {
    isMoving = false;
    character.changeAni('idle');
    character.ani.frameDelay = 2;  // Rapid breathing
  }
}
```

### Negative Input Pattern

```javascript
function touchStarted() {
  // Click is HARMFUL, not helpful
  stress += STRESS_CLICK_INCREASE;
  stress = constrain(stress, 0, 100);
  
  // Can still set movement target if not panicked
  if (stress < STRESS_PANIC_THRESHOLD) {
    targetX = touchX;
    targetY = touchY;
    isMoving = true;
  }
  
  return false;
}
```

### Visual Distortion

```javascript
function applyStressVisuals() {
  push();
  translate(character.x, character.y);
  
  // Stress creates visual distortion
  if (stress > 50) {
    let distortion = map(stress, 50, 100, 0, 0.2);
    scale(1 + random(-distortion, distortion), 
          1 + random(-distortion, distortion));
  }
  
  pop();
}
```

### Notable Features
- Negative input system
- Overstimulation mechanics
- Restraint-based gameplay
- Visual distortion effects
- Panic state transitions

### Use Cases
- Stealth mechanics (noise = bad)
- Anxiety/pressure systems
- Overstimulation gameplay
- "Don't press the button" mechanics

---

## 04_parameter_stress_collision - Autonomous AI

**Collision-based stress system where character wanders autonomously and stress only increases when you touch/click ON the character.**

### What It Does
- Character wanders autonomously (AI behavior)
- Stress only increases on character collision
- Touch empty space = no effect
- Uses 3 animations: idle, walk, walkBack
- Speed increases when stressed

### Autonomous Wandering

```javascript
// CONSTANTS
const WANDER_INTERVAL = 120;  // Frames between target changes
const WANDER_MIN_DIST = 100;  // Minimum distance to travel

let wanderTimer = 0;
let wanderTargetX, wanderTargetY;

function updateWandering() {
  wanderTimer++;
  
  // Choose new random target periodically
  if (wanderTimer >= WANDER_INTERVAL) {
    chooseNewWanderTarget();
    wanderTimer = 0;
  }
  
  // Move toward current wander target
  moveCharacterToTarget(wanderTargetX, wanderTargetY);
}

function chooseNewWanderTarget() {
  // Pick random point far enough away
  let angle = random(TWO_PI);
  let distance = random(WANDER_MIN_DIST, 200);
  
  wanderTargetX = character.x + cos(angle) * distance;
  wanderTargetY = character.y + sin(angle) * distance;
  
  // Keep in bounds
  wanderTargetX = constrain(wanderTargetX, 50, width - 50);
  wanderTargetY = constrain(wanderTargetY, 50, height - 50);
}
```

### Collision Detection

```javascript
// Larger hitbox for easier touch detection
character.collider = 'kinematic';
character.width = 200;   // Before scale
character.height = 200;  // After 0.2 scale = 40×40 pixels

function touchStarted() {
  // Check if touch is on character
  if (character.mouse.pressing()) {
    stress += STRESS_COLLISION_INCREASE;
    stress = constrain(stress, 0, 100);
  }
  // Touching empty space does nothing
  
  return false;
}
```

### Direction-Based Animation

```javascript
function moveCharacterToTarget(tx, ty) {
  let dx = tx - character.x;
  
  // Choose animation based on direction
  if (abs(dx) > 5) {
    if (dx > 0) {
      character.changeAni('walk');
      character.mirror.x = false;
    } else {
      character.changeAni('walkBack');
      character.mirror.x = true;
    }
  } else {
    character.changeAni('idle');
  }
  
  // Move with stress-affected speed
  let speed = map(stress, 0, 100, 1, 3);
  character.moveTo(tx, ty, speed);
}
```

### Notable Features
- Autonomous character AI
- Collision-based input detection
- Multi-animation state machine
- Direction-aware animation switching
- Independent character behavior

### Use Cases
- NPC stress/mood systems
- "Don't touch" mechanics
- Pet/creature interactions
- Avoidance gameplay

---

## 05_parameter_stress_shake - Device Sensors

**Mobile sensor input using deviceShaken() to increase stress, with autonomous wandering behavior.**

### What It Does
- Device shake increases stress (sensor input)
- Character wanders autonomously
- Combines physical device motion with on-screen behavior
- Mobile-first interaction pattern

### Device Shake Detection

```javascript
// p5-phone provides deviceShaken() callback
function deviceShaken() {
  // Only works if sensors are enabled
  if (window.sensorsEnabled) {
    stress += STRESS_SHAKE_INCREASE;
    stress = constrain(stress, 0, 100);
    
    console.log('Shake detected! Stress:', stress);
  }
}
```

### Sensor Setup

```javascript
function setup() {
  // Enable device sensors in p5-phone
  enableGyroTap();  // Enables accelerometer/gyro
  
  // Note: User must grant permission on first interaction
}
```

### Autonomous Wandering

```javascript
// Character moves independently, not controlled by touch
function updateWandering() {
  wanderTimer++;
  
  if (wanderTimer >= WANDER_INTERVAL) {
    chooseNewWanderTarget();
    wanderTimer = 0;
  }
  
  // Always moving toward wander target
  moveCharacterToTarget(wanderTargetX, wanderTargetY);
  
  // When reached, pick new target immediately
  let dist = dist(character.x, character.y, wanderTargetX, wanderTargetY);
  if (dist < 10) {
    chooseNewWanderTarget();
  }
}
```

### Stress Affects Speed

```javascript
function moveCharacterToTarget(tx, ty) {
  // Higher stress = faster movement
  let speed = map(stress, 0, 100, 0.5, 3);
  character.moveTo(tx, ty, speed);
  
  // Animation speed also affected
  if (stress > 70) {
    character.ani.frameDelay = 2;  // Fast animation
  } else {
    character.ani.frameDelay = 4;  // Normal
  }
}
```

### Notable Features
- Device sensor integration
- Shake event callback
- Autonomous wandering
- Physical + digital interaction
- Mobile-specific mechanics

### Use Cases
- Physical activity games
- Gesture-based controls
- Environmental interaction (shake to affect world)
- Accessibility alternatives

---

## Parameter Types Comparison

### Health (Positive Input)

**Nature:** Resource/capacity  
**Input Effect:** Helpful (boosts health)  
**Decay:** Slow, constant  
**Feel:** Encourages periodic input  

```javascript
// Input HELPS parameter
health += HEALTH_BOOST;  // Click increases health

// Environmental force
health -= HEALTH_DECAY;  // Constant pressure
```

**Use Cases:**
- Stamina systems
- Energy management
- Vitality mechanics
- Resource gathering

---

### Momentum (Positive Input)

**Nature:** Physical/velocity  
**Input Effect:** Accumulative impulse  
**Decay:** Fast, directional  
**Feel:** Rewards rapid, consistent input  

```javascript
// Input BUILDS parameter
momentum += MOMENTUM_INCREMENT;

// Multiple decay forces
momentum -= MOMENTUM_DECAY;        // Friction
momentum -= drag * momentum;       // Velocity-based drag
```

**Use Cases:**
- Speed building
- Combo systems
- Acceleration mechanics
- Skill-based movement

---

### Stress (Negative Input)

**Nature:** Mental/psychological  
**Input Effect:** Harmful (increases stress)  
**Decay:** Slow recovery  
**Feel:** Punishes excessive input  

```javascript
// Input HARMS parameter
stress += STRESS_INCREASE;  // Click increases stress

// Environmental force
stress -= STRESS_RECOVERY;  // Slow natural recovery
```

**Use Cases:**
- Panic systems
- Overstimulation mechanics
- Pressure gameplay
- Stealth (noise detection)

---

## Animation Control Patterns

All examples use p5play's **named animation system** for clean state management:

### Basic Setup

```javascript
function preload() {
  // Load animation frames
  idleAni = loadAni('animations/idle/idle_0001.png', 9);
  walkAni = loadAni('animations/walk/walk_0001.png', 13);
}

function setup() {
  character = new Sprite(width/2, height/2);
  character.scale = 0.2;
  
  // Assign names to animations
  character.addAni('idle', idleAni);
  character.addAni('walk', walkAni);
  
  // Start with idle
  character.changeAni('idle');
}
```

### Switching Animations

```javascript
// Check before switching to avoid restarting
if (character.ani.name !== 'walk') {
  character.changeAni('walk');
}

// Control playback speed
character.ani.frameDelay = 4;  // Lower = faster
```

### State Machine Pattern

```javascript
// Parameter drives animation state
if (parameter > THRESHOLD_HIGH) {
  character.changeAni('walk');
  character.ani.frameDelay = 2;
} else if (parameter > THRESHOLD_LOW) {
  character.changeAni('walk');
  character.ani.frameDelay = 4;
} else {
  character.changeAni('idle');
}
```

### Direction-Based Animation

```javascript
// Use mirror for left/right
if (targetX > character.x) {
  character.mirror.x = false;  // Face right
} else {
  character.mirror.x = true;   // Face left
}

// Or use separate animations
if (targetX > character.x) {
  character.changeAni('walk');
} else {
  character.changeAni('walkBack');
}
```

---

## Adapting These Templates

These examples are designed as **templates** you can modify for various game mechanics.

### Other Parameter Ideas

| Parameter | Input Effect | Environmental Force | Use Case |
|-----------|-------------|---------------------|----------|
| **Courage** | Increases facing enemies | Decreases when fleeing | Combat confidence |
| **Temperature** | Affected by actions | Environmental heat/cold | Survival mechanics |
| **Attention** | Builds looking at objects | Natural decay | Focus/concentration |
| **Stability** | Sudden movements reduce | Gradual recovery | Balance mechanics |
| **Combo** | Rhythmic inputs build | Resets on mistakes | Timing-based gameplay |
| **Hunger** | Eating increases | Constant decay | Survival/pet sim |
| **Stealth** | Movement increases | Stillness decreases | Stealth gameplay |
| **Rage** | Taking damage builds | Time-based decay | Berserker mechanics |

### Adaptation Steps

1. **Choose Parameter Type**
   - Positive (input helps) vs Negative (input harms)
   - Resource vs Physics vs Mental
   - Fast vs Slow decay

2. **Define Constants**
   - Increment/boost amount
   - Decay/recovery rate
   - Thresholds for behavior changes

3. **Map Outputs**
   - Speed scaling
   - Animation switching
   - Visual effects
   - Sound effects

4. **Add Environmental Forces**
   - Constant decay/recovery
   - Friction/drag
   - External influences

5. **Test and Tune**
   - Adjust rates for feel
   - Balance input vs environment
   - Fine-tune thresholds

### Combining Parameters

```javascript
// Multiple parameters affecting character
let health = 100;
let momentum = 0;
let courage = 50;

// Combined output calculation
function calculateSpeed() {
  let healthSpeed = map(health, 0, 100, 0, 2);
  let momentumSpeed = map(momentum, 0, 100, 0, 3);
  let courageBonus = courage > 70 ? 1.5 : 1.0;
  
  return (healthSpeed + momentumSpeed) * courageBonus;
}
```

---

## File Structure

```
friday_7th/
├── index.html                              # Landing page
├── README.md                               # This file
└── characterController/
    ├── 00_template_simple/
    │   ├── index.html
    │   ├── sketch.js                       # ~150 lines
    │   └── animations/
    │       ├── idle/                       # 9 frames
    │       └── walk/                       # 13 frames
    ├── 01_parameter_health/
    │   ├── index.html
    │   ├── sketch.js                       # ~250 lines
    │   └── animations/
    ├── 02_parameter_momentum/
    │   ├── index.html
    │   ├── sketch.js                       # ~300 lines
    │   └── animations/
    ├── 03_parameter_stress/
    │   ├── index.html
    │   ├── sketch.js                       # ~220 lines
    │   └── animations/
    ├── 04_parameter_stress_collision/
    │   ├── index.html
    │   ├── sketch.js                       # ~280 lines
    │   └── animations/
    │       ├── idle/
    │       ├── walk/
    │       └── walkBack/                   # 3 animations
    └── 05_parameter_stress_shake/
        ├── index.html
        ├── sketch.js                       # ~290 lines
        └── animations/
```

---

## Related Examples

- **[Friday 31st - ML5 + p5play Integration](../friday_31st/)** - Advanced tracking and sprite interactions
- **[Wednesday 5th - Progressive Character Animation](../wednesday_5th/)** - Builds from basic to complex systems
- **[Wednesday 29th - ML5 Basics](../wednesday_29th/)** - Foundation camera and tracking setup

---

## Key Takeaways

1. **Parameters create emergent behavior** - The interaction between input and environmental forces creates complex, game-like feel
2. **One parameter, multiple outputs** - Drive speed, animation, visuals from single source
3. **State persistence** - Character behavior exists beyond individual inputs
4. **Templates are adaptable** - These patterns work for many different game mechanics
5. **Tuning is crucial** - Small changes to constants dramatically affect feel

**Moving from direct control to parameter-driven control is fundamental to creating engaging game mechanics.**
