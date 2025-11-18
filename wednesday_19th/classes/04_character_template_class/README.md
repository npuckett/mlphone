# Classes 04 - Character Template Class

## Overview
This example demonstrates the same functionality as `friday_7th/characterController/00_template_simple`, but refactored into a class structure with **localStorage persistence** added.

**Purpose:** Provides a clean, reusable template for creating parameter-driven characters using object-oriented programming with automatic state persistence.

## What It Does
- **Character** with a health parameter (0-100)
- **Threshold-based behavior** - switches between two states at health = 50
- **Visual feedback** - color changes (green = healthy, red = low health)
- **Animation switching** based on health level
- **Click/Touch** to increase health (+10)
- **Spacebar** to decrease health (-10)
- **localStorage persistence** - health value saved and restored on refresh
- **Reset button** to clear saved data

## Live Demo
[Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/04_character_template_class/)

## File Structure

### Class-Based Template
```
04_character_template_class/
├── index.html           → HTML template with all libraries
├── HealthCharacter.js   → Reusable character class
├── sketch.js            → Main program (minimal setup/draw)
├── README.md            → This documentation
└── animations/          → Sprite animations
    ├── idle/            → Animation 1 (high health)
    └── walk/            → Animation 2 (low health)
```

## HealthCharacter Class

### Core Pattern

```
PARAMETER → THRESHOLD → BEHAVIOR + STORAGE
    ↓           ↓           ↓         ↓
  health  →  threshold → behavior1  → localStorage
  (0-100)      (50)     or behavior2
```

### Class Structure

#### Properties
```javascript
this.sprite              // p5play Sprite object
this.health              // Parameter (0-100)
this.HEALTH_THRESHOLD    // Behavior switch point (50)
```

#### Public Methods
```javascript
constructor(x, y, anim1, anim2)  // Initialize character
update()                          // Main update loop
display()                         // Draw character
increaseHealth(amount)            // Add to health
decreaseHealth(amount)            // Subtract from health
setHealth(value)                  // Set specific value
resetHealth()                     // Reset to 50 & clear storage
```

#### Getters (Safe State Access)
```javascript
getHealth()              // Current health value
getThreshold()           // Threshold value
isHealthy()              // Boolean: health >= threshold
getCurrentAnimation()    // Name of current animation
getSavedHealth()         // Value from localStorage
```

#### Internal Methods
```javascript
calculateHealth()        // Override this for custom behavior
behaviour1()             // High health behavior
behaviour2()             // Low health behavior
loadHealthFromStorage()  // Load from localStorage
saveHealthToStorage()    // Save to localStorage
```

## Usage Pattern

### Basic Setup
```javascript
let character;
let anim1, anim2;

function preload() {
  anim1 = loadAni('animations/idle/idleAnim_1.png', 9);
  anim2 = loadAni('animations/walk/walkAnim_1.png', 13);
}

function setup() {
  createCanvas(405, 720);
  character = new HealthCharacter(width/2, height/2, anim1, anim2);
}

function draw() {
  background(30);
  character.update();  // Does everything!
}
```

### Input Handling
```javascript
function mousePressed() {
  character.increaseHealth(10);
}

function keyPressed() {
  if (key === ' ') {
    character.decreaseHealth(10);
  }
}
```

## Comparison to Function Version

### Code Comparison Table

| Task | Function Version | Class Version |
|------|------------------|---------------|
| Create character | 8+ lines of setup | 1 line |
| Update logic | Multiple function calls | `character.update()` |
| Modify health | Direct variable access | Method calls |
| localStorage | Not included | Built-in |
| Organization | All in one file | Separated concerns |
| Reusability | Copy/paste code | Instantiate class |
| Lines of code | 242 (one file) | 280 + 180 (two files) |

### Creating a Character

#### Function Version (`00_template_simple`)
```javascript
let health = 50;
let character;
let HEALTH_THRESHOLD = 50;

function setup() {
  character = new Sprite(width / 2, height / 2);
  character.scale = 0.2;
  character.physics = 'kinematic';
  character.collider = 'none';
  character.addAni('animation1', animation1);
  character.addAni('animation2', animation2);
  character.changeAni('animation1');
}
```

#### Class Version (`04_character_template_class`)
```javascript
let character;

function setup() {
  character = new HealthCharacter(width / 2, height / 2, animation1, animation2);
  // Also automatically loads health from localStorage!
}
```

### Updating Each Frame

#### Function Version
```javascript
function draw() {
  health = calculateHealth();
  
  if (health >= HEALTH_THRESHOLD) {
    behaviour1();
  } else {
    behaviour2();
  }
  
  drawUI();
}
```

#### Class Version
```javascript
function draw() {
  character.update();  // Handles all logic internally
  drawUI();
}
```

### Modifying Health

#### Function Version
```javascript
function mousePressed() {
  health += 10;
  health = constrain(health, 0, 100);
}
```

#### Class Version
```javascript
function mousePressed() {
  character.increaseHealth(10);  // Constraining built-in
}
```

## localStorage Integration

### How It Works

1. **Load on Creation** - Constructor calls `loadHealthFromStorage()`
2. **Save Every Frame** - `update()` calls `saveHealthToStorage()`
3. **Reset on Demand** - `resetHealth()` clears storage

### Code Pattern
```javascript
// In constructor
loadHealthFromStorage() {
  let saved = localStorage.getItem('characterHealth');
  if (saved !== null) {
    this.health = Number(saved);
  }
}

// In update()
saveHealthToStorage() {
  localStorage.setItem('characterHealth', this.health);
}

// On button click
resetHealth() {
  localStorage.removeItem('characterHealth');
  this.health = 50;
}
```

### Testing Persistence
1. Click/touch to change health
2. Refresh the page
3. Health value persists!
4. Click "Reset Health" to clear

## Extending the Template

### Custom Health Calculation

Override `calculateHealth()` for different behaviors:

#### Time-Based Decay
```javascript
class DecayingCharacter extends HealthCharacter {
  calculateHealth() {
    this.health -= 0.1;  // Slow decay
    this.health = constrain(this.health, 0, 100);
  }
}
```

#### Sensor-Based (Gyroscope)
```javascript
class TiltCharacter extends HealthCharacter {
  calculateHealth() {
    if (window.sensorsEnabled) {
      // Health based on device tilt
      this.health = map(rotationX, -90, 90, 0, 100);
    }
  }
}
```

#### Distance-Based
```javascript
class ProximityCharacter extends HealthCharacter {
  calculateHealth() {
    let distance = dist(mouseX, mouseY, width/2, height/2);
    this.health = map(distance, 0, width/2, 100, 0);
  }
}
```

#### Random Fluctuation
```javascript
class NervousCharacter extends HealthCharacter {
  calculateHealth() {
    this.health += random(-0.5, 0.5);
    this.health = constrain(this.health, 0, 100);
  }
}
```

### Custom Behaviors

Modify `behaviour1()` and `behaviour2()`:

```javascript
class SpeedCharacter extends HealthCharacter {
  behaviour1() {
    super.behaviour1();  // Keep color change
    this.sprite.vel.x = 3;  // Fast movement
  }
  
  behaviour2() {
    super.behaviour2();  // Keep color change
    this.sprite.vel.x = 0.5;  // Slow movement
  }
}
```

### Multiple Thresholds

Add more complex state system:

```javascript
class MultiStateCharacter extends HealthCharacter {
  update() {
    this.calculateHealth();
    
    if (this.health >= 70) {
      this.behaviourExcellent();
    } else if (this.health >= 50) {
      this.behaviourGood();
    } else if (this.health >= 30) {
      this.behaviourWarning();
    } else {
      this.behaviourCritical();
    }
    
    this.saveHealthToStorage();
  }
}
```

## Multiple Characters

Easy to create multiple independent characters:

```javascript
let characters = [];

function setup() {
  for (let i = 0; i < 5; i++) {
    let x = random(100, width - 100);
    let y = random(100, height - 100);
    characters.push(new HealthCharacter(x, y, anim1, anim2));
  }
}

function draw() {
  for (let char of characters) {
    char.update();
  }
}
```

**Note:** Current localStorage saves one global health value. For multiple characters, modify to save array or use unique keys.

## Benefits of Class Approach

### 1. **Encapsulation**
- All health logic in one class
- Clear boundaries
- Can't accidentally modify internal state

### 2. **Reusability**
- Create unlimited characters
- Use in different projects
- Share class file with others

### 3. **Maintainability**
- Easy to find code
- Modify once, affects all instances
- Clear organization

### 4. **Extensibility**
- Override methods for custom behavior
- Extend with inheritance
- Add features without breaking existing code

### 5. **Professional Structure**
- Industry standard
- Team-friendly
- Scales well

## Use Cases for This Template

### Direct Use
- Simple health-based games
- Character state systems
- Interactive demonstrations

### Modify Parameter
Change `health` to:
- `stress` (increases with activity, decreases with rest)
- `energy` (depletes with action, regenerates over time)
- `mood` (changes based on interactions)
- `temperature` (affected by environment)
- `hunger` (decreases over time, increases with "food")

### Modify Input
Change how parameter is calculated:
- Device shake detection
- Gyroscope tilt
- Microphone volume
- Touch/click frequency
- Time elapsed
- Distance from point

### Modify Output
Change what behaviors do:
- Movement patterns
- Visual effects
- Sound triggers
- Particle systems
- Camera effects

## Summary

This template provides a **clean, professional foundation** for parameter-driven characters with persistence.

**Key Features:**
- ✓ Object-oriented structure
- ✓ localStorage integration
- ✓ Easy to customize
- ✓ Well-commented code
- ✓ Extensible through inheritance
- ✓ Production-ready pattern

**Use this as a starting point** for any character that needs:
1. A parameter (0-100 value)
2. Threshold-based behaviors
3. State persistence
4. Clean organization

## Files
- `index.html` - HTML template with p5.js, p5play, p5-phone
- `HealthCharacter.js` - Reusable character class (280 lines)
- `sketch.js` - Main program (180 lines)
- `animations/` - Sprite animation frames
- `README.md` - This documentation

## Related Examples
- `00_template_simple` - Function-based version (compare!)
- `03_stress_character_class` - More complex example with shake detection
- `01_basic_circle_class` - Introduction to classes
- `02_basic_circle_functions` - Class vs function comparison
