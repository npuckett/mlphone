// ==============================================
// HEALTH CHARACTER CLASS
// ==============================================
// A simple character class demonstrating the core pattern:
// PARAMETER → THRESHOLD → BEHAVIOR + PERSISTENCE
//
// This class shows:
// - How to encapsulate a parameter-driven character
// - How to use thresholds to switch behaviors
// - How to persist state with localStorage
// - Clear organization of character logic
//
// PATTERN:
// 1. Calculate parameter (health)
// 2. Check threshold to determine state
// 3. Execute appropriate behavior and animation
// 4. Save state to localStorage
// ==============================================

class HealthCharacter {
  // ==============================================
  // CONSTRUCTOR - Create a new health character
  // ==============================================
  constructor(x, y, animation1, animation2) {
    // SPRITE - Create the visual character
    this.sprite = new Sprite(x, y);
    this.sprite.scale = 0.2;
    this.sprite.physics = 'kinematic';
    this.sprite.collider = 'none';
    
    // Add animations
    this.sprite.addAni('animation1', animation1);
    this.sprite.addAni('animation2', animation2);
    this.sprite.changeAni('animation1');
    
    // PARAMETER - Core state
    this.health = 50;  // Default health (0-100)
    
    // THRESHOLD - Behavior switch point
    this.HEALTH_THRESHOLD = 50;
    
    // LOAD health from localStorage
    this.loadHealthFromStorage();
  }
  
  // ==============================================
  // UPDATE - Called every frame
  // ==============================================
  update() {
    // 1. Calculate parameter
    this.calculateHealth();
    
    // 2. Check threshold and execute behavior
    if (this.health >= this.HEALTH_THRESHOLD) {
      this.behaviour1();  // High health behavior
    } else {
      this.behaviour2();  // Low health behavior
    }
    
    // 3. Save state to localStorage
    this.saveHealthToStorage();
  }
  
  // ==============================================
  // DISPLAY - Called every frame after update
  // ==============================================
  display() {
    // p5play sprites are drawn automatically
    // This method is here for consistency
  }
  
  // ==============================================
  // PARAMETER CALCULATION
  // ==============================================
  calculateHealth() {
    // This method calculates/updates the health parameter
    // 
    // OVERRIDE THIS METHOD to implement different behaviors:
    // 
    // Example 1: Time-based decay
    //   this.health -= 0.1;
    //   this.health = constrain(this.health, 0, 100);
    //
    // Example 2: Sensor-based (tilt)
    //   if (window.sensorsEnabled) {
    //     this.health = map(rotationX, -90, 90, 0, 100);
    //   }
    //
    // Example 3: Distance-based
    //   let distance = dist(mouseX, mouseY, width/2, height/2);
    //   this.health = map(distance, 0, width/2, 100, 0);
    //
    // Example 4: Random fluctuation
    //   this.health += random(-0.5, 0.5);
    //   this.health = constrain(this.health, 0, 100);
    
    // Default: health stays constant unless modified by input
    // (See increaseHealth() and decreaseHealth() methods)
  }
  
  // ==============================================
  // BEHAVIOR 1: High Health (Above Threshold)
  // ==============================================
  behaviour1() {
    // Switch to animation 1 if not already playing
    if (this.sprite.ani.name !== 'animation1') {
      this.sprite.changeAni('animation1');
    }
    
    // Set visual feedback for high health state
    this.sprite.color = color(100, 255, 100);  // Green = healthy
    
    // ADD YOUR BEHAVIOR HERE:
    // - Fast movement
    // - Bright effects
    // - Active responses
    // - etc.
  }
  
  // ==============================================
  // BEHAVIOR 2: Low Health (Below Threshold)
  // ==============================================
  behaviour2() {
    // Switch to animation 2 if not already playing
    if (this.sprite.ani.name !== 'animation2') {
      this.sprite.changeAni('animation2');
    }
    
    // Set visual feedback for low health state
    this.sprite.color = color(255, 100, 100);  // Red = low health
    
    // ADD YOUR BEHAVIOR HERE:
    // - Slow movement
    // - Dark/dimmed effects
    // - Reduced responses
    // - etc.
  }
  
  // ==============================================
  // INPUT METHODS - Modify health
  // ==============================================
  
  increaseHealth(amount = 10) {
    this.health += amount;
    this.health = constrain(this.health, 0, 100);
  }
  
  decreaseHealth(amount = 10) {
    this.health -= amount;
    this.health = constrain(this.health, 0, 100);
  }
  
  setHealth(value) {
    this.health = constrain(value, 0, 100);
  }
  
  // ==============================================
  // LOCAL STORAGE - Load health from storage
  // ==============================================
  loadHealthFromStorage() {
    let savedHealth = localStorage.getItem('characterHealth');
    
    if (savedHealth !== null) {
      this.health = Number(savedHealth);
      console.log('📦 Loaded health from storage:', this.health.toFixed(1));
    } else {
      console.log('🆕 First visit - health starts at 50');
    }
  }
  
  // ==============================================
  // LOCAL STORAGE - Save health to storage
  // ==============================================
  saveHealthToStorage() {
    localStorage.setItem('characterHealth', this.health);
  }
  
  // ==============================================
  // LOCAL STORAGE - Reset health and clear storage
  // ==============================================
  resetHealth() {
    localStorage.removeItem('characterHealth');
    this.health = 50;  // Reset to default
    console.log('🔄 Health reset to 50 and storage cleared!');
  }
  
  // ==============================================
  // GETTERS - Access internal state
  // ==============================================
  
  getHealth() {
    return this.health;
  }
  
  getThreshold() {
    return this.HEALTH_THRESHOLD;
  }
  
  isHealthy() {
    return this.health >= this.HEALTH_THRESHOLD;
  }
  
  getCurrentAnimation() {
    return this.sprite.ani.name;
  }
  
  getSavedHealth() {
    let saved = localStorage.getItem('characterHealth');
    return saved !== null ? Number(saved) : null;
  }
}

// ==============================================
// KEY CONCEPTS DEMONSTRATED
// ==============================================
/*

SIMPLE PARAMETER SYSTEM:
-----------------------
This class shows the fundamental pattern for parameter-driven characters:
1. One parameter (health)
2. One threshold (50)
3. Two behaviors (above/below threshold)


CLASS BENEFITS:
---------------
1. ENCAPSULATION
   - All health logic in one place
   - Clear boundaries
   - Easy to understand

2. REUSABILITY
   - Create multiple characters:
     let char1 = new HealthCharacter(100, 200, anim1, anim2);
     let char2 = new HealthCharacter(300, 400, anim1, anim2);
   
3. EXTENSIBILITY
   - Override calculateHealth() for different behaviors
   - Extend class for variants:
     class DecayingCharacter extends HealthCharacter {
       calculateHealth() {
         this.health -= 0.1;
         this.health = constrain(this.health, 0, 100);
       }
     }

4. PERSISTENCE
   - localStorage integration built-in
   - Automatic save/load
   - Easy reset


USAGE PATTERN:
--------------
function setup() {
  character = new HealthCharacter(x, y, anim1, anim2);
}

function draw() {
  character.update();  // Does everything!
}

function mousePressed() {
  character.increaseHealth();
}


COMPARISON TO FUNCTION VERSION:
-------------------------------
Function version (00_template_simple):
  - Global health variable
  - Separate functions for each behavior
  - No persistence
  - Simple but not organized

Class version (04_character_template_class):
  - Health encapsulated in object
  - Behaviors are methods
  - Built-in localStorage
  - Professional structure


THIS IS A TEMPLATE:
-------------------
Copy this class and modify:
1. Change parameter name (health → stress, energy, etc.)
2. Modify calculateHealth() for your needs
3. Customize behaviour1() and behaviour2()
4. Add more thresholds if needed
5. Extend with inheritance for variants

*/
