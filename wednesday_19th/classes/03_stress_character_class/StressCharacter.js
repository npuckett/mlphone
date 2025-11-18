// ==============================================
// STRESS CHARACTER CLASS
// ==============================================
// A class that encapsulates all character behavior including:
// - Stress parameter with localStorage persistence
// - Shake detection response
// - Autonomous wandering movement
// - Visual feedback (color, jitter, speed)
// - Animation management
//
// This demonstrates how to use a class to organize complex behavior
// that was previously scattered across many functions.
// ==============================================

class StressCharacter {
  // ==============================================
  // CONSTRUCTOR - Create a new stress character
  // ==============================================
  constructor(x, y, idleAni, walkAni) {
    // SPRITE - Create the visual character
    this.sprite = new Sprite(x, y);
    this.sprite.scale = 0.2;
    this.sprite.physics = 'kinematic';
    this.sprite.collider = 'none';
    
    // Add animations to sprite
    this.sprite.addAni('idle', idleAni);
    this.sprite.addAni('walk', walkAni);
    this.sprite.changeAni('walk');
    
    // STRESS PARAMETER - Core state
    this.stress = 0;              // Current stress level (0-100)
    this.displayStress = 0;       // Smoothed stress for visuals
    this.shakeIntensity = 0;      // Current shake intensity
    
    // STRESS CONFIGURATION
    this.STRESS_SHAKE_INCREASE = 8;
    this.STRESS_RECOVERY = 0.15;
    this.STRESS_PANIC_THRESHOLD = 70;
    this.STRESS_WARNING_THRESHOLD = 40;
    this.SHAKE_DECAY = 0.92;
    this.STRESS_VISUAL_INERTIA = 0.12;
    
    // MOVEMENT - Autonomous wandering
    this.BASE_WALK_SPEED = 2.5;
    this.currentSpeed = this.BASE_WALK_SPEED;
    this.targetX = random(80, width - 80);
    this.targetY = random(100, height - 100);
    this.wanderTimer = 0;
    this.WANDER_INTERVAL = 120;  // Frames between new destinations
    
    // JITTER EFFECT
    this.jitterX = 0;
    this.jitterY = 0;
    
    // LOAD stress from localStorage
    this.loadStressFromStorage();
  }
  
  // ==============================================
  // UPDATE - Called every frame
  // ==============================================
  update() {
    this.updateShakeIntensity();
    this.updateStressParameter();
    this.updateWandering();
    this.updateCharacterColor();
    this.updateStressJitter();
    this.updateMovementSpeed();
    this.moveToTarget();
    
    // SAVE stress to localStorage every frame
    this.saveStressToStorage();
  }
  
  // ==============================================
  // DISPLAY - Called every frame after update
  // ==============================================
  display() {
    // p5play sprites are drawn automatically
    // This method is here for consistency with other examples
    // and in case you want to add extra drawing
  }
  
  // ==============================================
  // SHAKE DETECTION - Called when device is shaken
  // ==============================================
  onShake() {
    // Increase shake intensity
    this.shakeIntensity += 1.0;
    this.shakeIntensity = constrain(this.shakeIntensity, 0, 10);
    
    // Add stress
    this.stress += this.STRESS_SHAKE_INCREASE;
    this.stress = constrain(this.stress, 0, 100);
    
    console.log('🔔 SHAKE! Intensity:', this.shakeIntensity.toFixed(2), 'Stress:', this.stress.toFixed(1));
  }
  
  // ==============================================
  // LOCAL STORAGE - Load stress from storage
  // ==============================================
  loadStressFromStorage() {
    let savedStress = localStorage.getItem('characterStress');
    
    if (savedStress !== null) {
      this.stress = Number(savedStress);
      this.displayStress = this.stress;
      console.log('📦 Loaded stress from storage:', this.stress.toFixed(1));
    } else {
      console.log('🆕 First visit - stress starts at 0');
    }
  }
  
  // ==============================================
  // LOCAL STORAGE - Save stress to storage
  // ==============================================
  saveStressToStorage() {
    localStorage.setItem('characterStress', this.stress);
  }
  
  // ==============================================
  // LOCAL STORAGE - Reset stress and clear storage
  // ==============================================
  resetStress() {
    localStorage.removeItem('characterStress');
    this.stress = 0;
    this.displayStress = 0;
    console.log('🔄 Stress reset to 0 and storage cleared!');
  }
  
  // ==============================================
  // PRIVATE METHODS - Internal update logic
  // ==============================================
  
  updateShakeIntensity() {
    // Shake intensity decays over time
    this.shakeIntensity *= this.SHAKE_DECAY;
    
    if (this.shakeIntensity < 0.01) {
      this.shakeIntensity = 0;
    }
  }
  
  updateStressParameter() {
    // Natural stress recovery
    this.stress -= this.STRESS_RECOVERY;
    this.stress = constrain(this.stress, 0, 100);
    
    // Smooth display value
    this.displayStress = lerp(this.displayStress, this.stress, this.STRESS_VISUAL_INERTIA);
  }
  
  updateWandering() {
    // Timer for choosing new destinations
    this.wanderTimer++;
    
    if (this.wanderTimer >= this.WANDER_INTERVAL) {
      this.chooseNewWanderTarget();
      this.wanderTimer = 0;
    }
  }
  
  chooseNewWanderTarget() {
    this.targetX = random(80, width - 80);
    this.targetY = random(100, height - 100);
  }
  
  updateCharacterColor() {
    // Map stress to color: Green (calm) → Yellow → Red (stressed)
    let r = map(this.displayStress, 0, 100, 100, 255);
    let g = map(this.displayStress, 0, 100, 255, 50);
    let b = 100;
    
    this.sprite.color = color(r, g, b);
  }
  
  updateStressJitter() {
    // High stress causes position jitter
    let jitterAmount = 0;
    
    if (this.stress >= this.STRESS_PANIC_THRESHOLD) {
      // Panic level - extreme jitter
      jitterAmount = map(this.stress, this.STRESS_PANIC_THRESHOLD, 100, 3, 8);
      jitterAmount += this.shakeIntensity * 0.5;
    } else if (this.stress >= this.STRESS_WARNING_THRESHOLD) {
      // Warning level - mild jitter
      jitterAmount = map(this.stress, this.STRESS_WARNING_THRESHOLD, this.STRESS_PANIC_THRESHOLD, 0, 3);
      jitterAmount += this.shakeIntensity * 0.3;
    }
    
    this.jitterX = random(-jitterAmount, jitterAmount);
    this.jitterY = random(-jitterAmount, jitterAmount);
  }
  
  updateMovementSpeed() {
    // Stress affects movement speed
    if (this.stress >= this.STRESS_PANIC_THRESHOLD) {
      this.currentSpeed = this.BASE_WALK_SPEED * 1.8;
    } else if (this.stress >= this.STRESS_WARNING_THRESHOLD) {
      this.currentSpeed = this.BASE_WALK_SPEED * 1.2;
    } else {
      this.currentSpeed = this.BASE_WALK_SPEED;
    }
  }
  
  moveToTarget() {
    // Calculate distance to target
    let distance = dist(this.sprite.x, this.sprite.y, this.targetX, this.targetY);
    
    if (distance > 10) {
      // Move toward target
      this.sprite.moveTo(this.targetX, this.targetY, this.currentSpeed);
      
      // Apply jitter
      if (this.jitterX !== 0 || this.jitterY !== 0) {
        this.sprite.x += this.jitterX;
        this.sprite.y += this.jitterY;
      }
      
      // Use walk animation
      if (this.sprite.ani.name !== 'walk') {
        this.sprite.changeAni('walk');
      }
    } else {
      // Reached target - choose new one
      this.chooseNewWanderTarget();
    }
  }
  
  // ==============================================
  // GETTERS - Access internal state
  // ==============================================
  
  getStress() {
    return this.stress;
  }
  
  getDisplayStress() {
    return this.displayStress;
  }
  
  getShakeIntensity() {
    return this.shakeIntensity;
  }
  
  getCurrentSpeed() {
    return this.currentSpeed;
  }
  
  getJitterAmount() {
    return abs(this.jitterX) + abs(this.jitterY);
  }
  
  getSavedStress() {
    let saved = localStorage.getItem('characterStress');
    return saved !== null ? Number(saved) : null;
  }
}

// ==============================================
// KEY CONCEPTS ABOUT THIS CLASS
// ==============================================
/*

ENCAPSULATION:
--------------
All stress-related code is now in ONE place (this class).
Before: Functions scattered throughout sketch.js
After: Everything organized in StressCharacter class


DATA PRIVACY:
-------------
Internal state (stress, jitter, targets) is contained within the object.
Before: Global variables anyone could accidentally modify
After: Only this object's methods can modify its own data


REUSABILITY:
------------
You could easily create MULTIPLE stress characters:
  let char1 = new StressCharacter(100, 200, idle, walk);
  let char2 = new StressCharacter(300, 400, idle, walk);
  
Each would have independent stress levels, movements, etc.


ORGANIZATION:
-------------
Related code is grouped together:
- Constructor: Initialization
- update(): All per-frame updates
- onShake(): Shake response
- loadStressFromStorage/saveStressToStorage: Persistence
- Private methods: Internal logic
- Getters: Safe access to internal state


COMPARISON TO FUNCTION VERSION:
-------------------------------
Function version: 550 lines, everything in one file
Class version: Split into StressCharacter.js + sketch.js
               - More organized
               - Easier to find specific functionality
               - Could reuse class in other projects


BEST PRACTICES DEMONSTRATED:
----------------------------
1. Constructor handles initialization
2. update() called every frame
3. Private methods (helper functions) grouped together
4. Getters provide controlled access to state
5. Clear separation of concerns
6. Comments explain what each section does

*/
