# Classes 03 - Stress Character Class

## Overview
This example demonstrates the **exact same functionality** as `localStorage/02_stress_shake_persistent`, but refactored to use a class-based architecture. It shows how complex behavior can be organized into a reusable class.

**Purpose:** To demonstrate how classes help organize complex interactive systems with multiple interconnected features (stress parameter, localStorage, shake detection, autonomous movement, visual feedback).

## What It Does
- **Character wanders autonomously** around the screen
- **Shake your phone** to increase the character's stress level
- **Stress persists** across page refreshes using localStorage
- **Visual feedback** - color changes from green (calm) to red (stressed)
- **Position jitter** increases with stress level
- **Movement speed** increases when stressed
- **Reset button** clears saved stress and resets to 0

## Live Demo
[Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/03_stress_character_class/)

## File Structure

### Class-Based Architecture
```
03_stress_character_class/
├── index.html          → HTML template with all libraries
├── StressCharacter.js  → Complete character class
├── sketch.js           → Main program (setup, draw, UI)
├── README.md           → This documentation
└── animations/         → Sprite animations
    ├── idle/           → Idle animation frames
    └── walk/           → Walk animation frames
```

**Key Difference:** Behavior is encapsulated in `StressCharacter` class instead of scattered global functions.

## StressCharacter Class Structure

### Properties (Internal State)
```javascript
// Sprite
this.sprite              // p5play Sprite object

// Stress System
this.stress              // Current stress (0-100)
this.displayStress       // Smoothed stress for visuals
this.shakeIntensity      // Current shake intensity

// Configuration
this.STRESS_SHAKE_INCREASE
this.STRESS_RECOVERY
this.STRESS_PANIC_THRESHOLD
this.STRESS_WARNING_THRESHOLD

// Movement
this.currentSpeed        // Walk speed (affected by stress)
this.targetX, targetY    // Wandering destination
this.wanderTimer         // Time until new destination

// Jitter
this.jitterX, jitterY    // Position offset when stressed
```

### Public Methods (External Interface)
```javascript
constructor(x, y, idleAni, walkAni)  // Initialize character
update()                              // Main update loop
display()                             // Draw character
onShake()                             // Handle shake events
resetStress()                         // Reset and clear storage

// Getters (safe state access)
getStress()
getDisplayStress()
getShakeIntensity()
getCurrentSpeed()
getJitterAmount()
getSavedStress()
```

### Private Methods (Internal Logic)
```javascript
loadStressFromStorage()
saveStressToStorage()
updateShakeIntensity()
updateStressParameter()
updateWandering()
chooseNewWanderTarget()
updateCharacterColor()
updateStressJitter()
updateMovementSpeed()
moveToTarget()
```

## Comparison to Function-Based Version

### Code Organization

#### Function Version (`02_stress_shake_persistent`)
```
sketch.js (550 lines)
├─ Global variables (stress, shakeIntensity, etc.)
├─ updateShakeIntensity() function
├─ updateStressParameter() function
├─ updateWandering() function
├─ updateCharacterColor() function
├─ updateStressJitter() function
├─ updateMovementSpeed() function
├─ moveCharacterToTarget() function
├─ loadStressFromStorage() function
├─ saveStressToStorage() function
└─ resetStress() function
```
**Everything mixed together in one file**

#### Class Version (`03_stress_character_class`)
```
StressCharacter.js (320 lines)
├─ StressCharacter class
│   ├─ Properties (encapsulated state)
│   ├─ Constructor (initialization)
│   ├─ Public methods (external interface)
│   └─ Private methods (internal logic)

sketch.js (280 lines)
├─ Setup and initialization
├─ Main draw loop
├─ UI and visual feedback
└─ Event handlers
```
**Clear separation: character logic vs application logic**

### Creating a Character

#### Function Version
```javascript
// In setup()
stress = 0;
displayStress = 0;
shakeIntensity = 0;
loadStressFromStorage();
character = new Sprite(width / 2, height / 2);
character.scale = 0.2;
character.physics = 'kinematic';
character.collider = 'none';
character.addAni('idle', idleAnimation);
character.addAni('walk', walkAnimation);
character.changeAni('walk');
targetX = random(80, width - 80);
targetY = random(100, height - 100);
// ... many more lines
```

#### Class Version
```javascript
// In setup()
character = new StressCharacter(width / 2, height / 2, idleAnimation, walkAnimation);
```
**One line does everything!**

### Updating Each Frame

#### Function Version
```javascript
// In draw()
updateShakeIntensity();
updateStressParameter();
updateWandering();
updateCharacterColor();
updateStressJitter();
updateMovementSpeed();
moveCharacterToTarget();
saveStressToStorage();
```
**8 function calls to remember**

#### Class Version
```javascript
// In draw()
character.update();
```
**One method call**

### Handling Shake Events

#### Function Version
```javascript
function deviceShaken() {
  if (window.sensorsEnabled) {
    shakeIntensity += 1.0;
    shakeIntensity = constrain(shakeIntensity, 0, 10);
    stress += STRESS_SHAKE_INCREASE;
    stress = constrain(stress, 0, 100);
    console.log('🔔 SHAKE DETECTED!');
  }
}
```

#### Class Version
```javascript
function deviceShaken() {
  if (window.sensorsEnabled) {
    character.onShake();  // Delegate to character
  }
}
```

### Accessing State

#### Function Version
```javascript
// Direct global variable access
let currentStress = stress;
let savedValue = localStorage.getItem('characterStress');
// Anyone can modify: stress = 50;  (dangerous!)
```

#### Class Version
```javascript
// Controlled access through getters
let currentStress = character.getStress();
let savedValue = character.getSavedStress();
// Can't modify directly - must use methods
```

## Key Benefits of Class Approach

### 1. **Encapsulation**
All stress-related code in one place:
- ✓ Easy to find and modify
- ✓ Can't accidentally affect other code
- ✓ Clear boundaries and responsibilities

### 2. **Reusability**
Easy to create multiple characters:
```javascript
let char1 = new StressCharacter(100, 200, idle, walk);
let char2 = new StressCharacter(300, 400, idle, walk);
// Each has independent stress, movement, etc.
```

### 3. **Maintainability**
Clear structure makes changes easier:
- Want to modify stress behavior? → Edit StressCharacter class
- Want to change UI? → Edit sketch.js
- Want to add new feature? → Add method to class or extend it

### 4. **Scalability**
Easy to extend with inheritance:
```javascript
class AnxiousCharacter extends StressCharacter {
  constructor(x, y, idle, walk) {
    super(x, y, idle, walk);
    this.STRESS_RECOVERY = 0.05;  // Slower recovery
    this.STRESS_SHAKE_INCREASE = 12;  // More sensitive
  }
}
```

### 5. **Professional Practice**
This is how real applications are built:
- Industry standard
- Team collaboration friendly
- Modular architecture
- Easy to test and debug

## Data Flow

### Input → Parameter → Output + Storage

```
DEVICE SHAKE (Input)
        ↓
   onShake() method
        ↓
   stress += 8 (Parameter)
        ↓
   ┌──────────┬──────────┬──────────┐
   ↓          ↓          ↓          ↓
Color      Jitter     Speed    localStorage
(Output)   (Output)   (Output)  (Storage)
```

### Persistence Loop

```
PAGE LOAD
   ↓
loadStressFromStorage() ← localStorage
   ↓
stress = savedValue
   ↓
CREATE CHARACTER (uses loaded stress for initial color)
   ↓
GAME LOOP (every frame)
   ↓
update() → modify stress
   ↓
saveStressToStorage() → localStorage
   ↓
REFRESH PAGE → loop continues
```

## localStorage Integration

### How It Works
1. **Load in Constructor** - `loadStressFromStorage()` called during initialization
2. **Save Every Frame** - `saveStressToStorage()` called in `update()`
3. **Reset on Button** - `resetStress()` clears storage and resets value

### Key Pattern
```javascript
// Constructor
loadStressFromStorage() {
  let saved = localStorage.getItem('characterStress');
  if (saved !== null) {
    this.stress = Number(saved);
  }
}

// Every frame in update()
saveStressToStorage() {
  localStorage.setItem('characterStress', this.stress);
}

// Reset button
resetStress() {
  localStorage.removeItem('characterStress');
  this.stress = 0;
}
```

## Code Size Comparison

| Version | Total Lines | sketch.js | Other Files |
|---------|-------------|-----------|-------------|
| Function-based | ~550 | 550 | 0 |
| Class-based | ~600 | 280 | 320 (StressCharacter.js) |

**Class version is slightly longer total, but much better organized!**

## When to Use Class Approach

### Use Classes When:
- ✓ Object has multiple related properties
- ✓ Object has complex behavior
- ✓ Need to create multiple instances
- ✓ Want to extend/inherit behavior
- ✓ Working on team projects
- ✓ Building reusable components

### This Example Uses Classes Because:
1. Character has 10+ properties
2. Complex stress system with persistence
3. Multiple interconnected behaviors
4. Could easily want multiple characters
5. Demonstrates professional patterns

## Extension Ideas

### Multiple Characters
```javascript
let characters = [];

function setup() {
  for (let i = 0; i < 5; i++) {
    let x = random(100, width - 100);
    let y = random(100, height - 100);
    characters.push(new StressCharacter(x, y, idle, walk));
  }
}

function draw() {
  for (let char of characters) {
    char.update();
  }
}
```

### Character Variants
```javascript
class CalmCharacter extends StressCharacter {
  constructor(x, y, idle, walk) {
    super(x, y, idle, walk);
    this.STRESS_RECOVERY = 0.5;  // Much calmer
  }
}

class NervousCharacter extends StressCharacter {
  constructor(x, y, idle, walk) {
    super(x, y, idle, walk);
    this.STRESS_SHAKE_INCREASE = 15;  // Very sensitive
    this.STRESS_WARNING_THRESHOLD = 20;  // Jitters earlier
  }
}
```

## Summary

Both versions produce **identical visual results**, but the class version:

**Advantages:**
- ✓ Better organized
- ✓ More maintainable
- ✓ Easier to extend
- ✓ Scalable to multiple characters
- ✓ Industry standard approach
- ✓ Clear separation of concerns

**Trade-offs:**
- Slightly more total code
- Need to understand classes
- Extra file to manage

**Bottom Line:** For complex interactive systems like this, classes are the right choice. The improved organization is worth the small increase in code.

## Files
- `index.html` - HTML template with p5.js, p5play, p5-phone
- `StressCharacter.js` - Complete character class
- `sketch.js` - Main program with UI
- `animations/` - Sprite animation frames
- `README.md` - This documentation

## Related Examples
- `02_stress_shake_persistent` - Same functionality, function-based approach (compare!)
- `01_basic_circle_class` - Simpler class introduction
- `02_basic_circle_functions` - Function vs class comparison
