# Stress Shake with localStorage - Persistent State

## Overview
This example extends the shake detection character controller to demonstrate **localStorage persistence**. The character's stress level is saved and restored between page visits, so the character "remembers" how stressed it was from your last session.

## What's New (vs. Original Shake Example)

### Added Features
- **Stress persists** when you refresh the page
- **Auto-save** - stress value saved every frame
- **Auto-load** - stress restored on page load
- **Reset button** - clears saved stress and resets to 0
- **Storage indicator** - UI shows saved value vs current value

### localStorage Integration
```javascript
// LOAD on startup (in setup())
loadStressFromStorage();

// SAVE continuously (in draw())
saveStressToStorage();

// RESET on button click
resetStress();
```

## How It Works

### 1. Load Saved Stress (Setup)
When the page loads, the stress value is loaded from localStorage **before** the character is created:

```javascript
function loadStressFromStorage() {
  let savedStress = localStorage.getItem('characterStress');
  
  if (savedStress !== null) {
    stress = Number(savedStress);
    displayStress = stress;  // Prevent visual jump
    console.log('📦 Loaded stress:', stress.toFixed(1));
  }
}
```

### 2. Save Stress Continuously (Draw Loop)
Every frame, the current stress value is saved:

```javascript
function saveStressToStorage() {
  localStorage.setItem('characterStress', stress);
}
```

### 3. Reset Button
Clears the saved value and resets stress to 0:

```javascript
function resetStress() {
  localStorage.removeItem('characterStress');
  stress = 0;
  displayStress = 0;
}
```

## Testing the Persistence

1. **First Visit**: Character starts with stress at 0
2. **Shake Device**: Stress increases (turns red, jittery)
3. **Refresh Page**: Character remembers stress level!
4. **Wait**: Stress naturally recovers over time
5. **Refresh Again**: Current stress level persists
6. **Click "Reset Stress"**: Clears storage, resets to 0
7. **Refresh Once More**: Starts fresh at 0

## Code Structure

### Storage Functions (New)
```javascript
loadStressFromStorage()   // Called once in setup()
saveStressToStorage()     // Called every frame in draw()
resetStress()             // Called by button click
createResetButton()       // Creates UI button
```

### Flow Diagram
```
PAGE LOAD
    ↓
loadStressFromStorage() → Read saved value
    ↓
setup() → Create character with loaded stress
    ↓
draw() → Update stress from shake/recovery
    ↓
saveStressToStorage() → Save current value
    ↓
REFRESH → Loop back to PAGE LOAD
```

## Key Implementation Details

### Why Load in Setup?
Loading must happen **before** creating the character so the visual state matches the loaded stress value:

```javascript
function setup() {
  // 1. FIRST - Load saved stress
  loadStressFromStorage();
  
  // 2. THEN - Create character (will use loaded stress for color)
  character = new Sprite(width / 2, height / 2);
  
  // 3. Color is set based on loaded stress value
}
```

### Why Save Every Frame?
Saving every frame ensures no stress progress is lost:
- If user closes tab suddenly, last frame's stress is saved
- Negligible performance impact (localStorage writes are fast)
- Alternative: Save only when stress changes by threshold

### Display Stress Synchronization
Both `stress` and `displayStress` are loaded to prevent visual jumps:

```javascript
stress = Number(savedStress);
displayStress = stress;  // Match immediately, no lerp transition
```

## UI Enhancements

### Storage Status Display
The debug UI shows:
- **Saved Value**: What's in localStorage
- **Current Stress**: Live value
- Confirmation that auto-save is active

### Reset Button
- Positioned in top-right corner
- Red color indicates destructive action
- Immediately clears storage and resets state

## Expanding This Pattern

### Save Multiple Parameters
```javascript
function saveToStorage() {
  localStorage.setItem('stress', stress);
  localStorage.setItem('health', health);
  localStorage.setItem('energy', energy);
}

function loadFromStorage() {
  let savedStress = localStorage.getItem('stress');
  if (savedStress !== null) stress = Number(savedStress);
  
  let savedHealth = localStorage.getItem('health');
  if (savedHealth !== null) health = Number(savedHealth);
  
  let savedEnergy = localStorage.getItem('energy');
  if (savedEnergy !== null) energy = Number(savedEnergy);
}
```

### Save Complex State (Advanced)
```javascript
function saveComplexState() {
  let gameState = {
    stress: stress,
    characterX: character.x,
    characterY: character.y,
    wanderTimer: wanderTimer
  };
  localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadComplexState() {
  let saved = localStorage.getItem('gameState');
  if (saved !== null) {
    let gameState = JSON.parse(saved);
    stress = gameState.stress;
    // Restore position after character created
    character.x = gameState.characterX;
    character.y = gameState.characterY;
    wanderTimer = gameState.wanderTimer;
  }
}
```

### Conditional Saving (Optimize)
```javascript
let lastSavedStress = 0;
const SAVE_THRESHOLD = 1;  // Only save if stress changes by 1+

function saveStressToStorage() {
  // Only save if stress changed significantly
  if (abs(stress - lastSavedStress) >= SAVE_THRESHOLD) {
    localStorage.setItem('characterStress', stress);
    lastSavedStress = stress;
  }
}
```

## Use Cases for Persistent Parameters

### Game State
- Player health/energy that persists between sessions
- Level progress or unlocked content
- Character customization choices

### User Preferences
- Difficulty settings
- Control sensitivity
- Visual/audio preferences

### Session Continuity
- Resume where you left off
- Remember last interaction state
- Maintain emotional/behavioral states

## Important Notes

- **localStorage** persists until explicitly cleared
- Each origin (domain) gets separate storage
- ~5-10MB storage limit per origin
- Values stored as strings (convert back to numbers)
- Test in incognito to simulate new users
- Users can clear via browser settings

## Files
- `index.html` - HTML with all required libraries
- `sketch.js` - Main code with localStorage integration
- `animations/` - Character animation frames (idle & walk)
- `README.md` - This documentation

## Related Examples
- [localStorage_example](../localStorage_example/) - Basic localStorage tutorial
- [05_parameter_stress_shake](../../../friday_7th/characterController/05_parameter_stress_shake/) - Original example without persistence
- [06_multi_character_class](../../../friday_7th/characterController/06_multi_character_class/) - Could extend this to save each character's state
