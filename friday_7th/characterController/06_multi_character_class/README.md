# Character Controller 06 - Multi Character Class System

## Overview
This example demonstrates an object-oriented approach to character management with **10 autonomous characters**, each with unique personalities and stress responses. It builds on the shake detection example (#05) but uses a custom `StressCharacter` class to encapsulate all behavior and state.

## Key Concepts

### Custom Character Class
- **StressCharacter class** encapsulates all character data and behavior
- Each instance maintains its own stress parameter and visual state
- Methods handle update logic, movement, and visual effects

### Randomized Personality Traits
Each of the 10 characters has randomly assigned characteristics:

1. **stressSensitivity** (3-12): How much stress each shake adds
2. **stressRecovery** (0.08-0.25): How fast stress naturally decreases
3. **baseSpeed** (1.5-3.5): Normal movement speed
4. **warningThreshold** (30-50): Stress level where jitter begins
5. **panicThreshold** (60-85): Stress level for extreme jitter
6. **jitterMultiplier** (0.5-1.5): How much they shake when stressed
7. **speedStressMultiplier** (1.2-2.0): Speed increase when stressed
8. **colorShift** (0.8-1.2): Color intensity variation

### Pattern: INPUT → PARAMETER → OUTPUT

**INPUT:** 
- Global shake detection (`deviceShaken()`)
- Affects ALL characters simultaneously
- Each character responds according to its personality

**PARAMETER:**
- Individual `stress` value per character (0-100)
- Increases based on character's `stressSensitivity`
- Decreases based on character's `stressRecovery`

**OUTPUT:**
- Color shift (green → yellow → red)
- Position jitter (based on stress thresholds)
- Movement speed variation
- Visual stress indicator above each character

## Features

### Multiple Characters
- 10 characters spawned in grid layout
- Each wanders autonomously with unique timing
- All respond to shake input differently

### Character Selection
- Click/tap any character to select it
- Press number keys 1-9, 0 to select by index
- Selected character's stats shown in UI panel

### Population Statistics
- Average stress across all characters
- Count of highly stressed characters (>50)
- Real-time monitoring of entire population

### Visual Feedback
- Global shake intensity meter (top)
- Individual stress bars above each character
- Character number labels
- Detailed personality traits for selected character

## How It Works

### Character Class Structure
```javascript
class StressCharacter {
  constructor(x, y, index)  // Create character with randomized traits
  update()                  // Main update loop
  addStressFromShake()      // Apply stress from shake input
  updateStress()            // Natural stress decay
  updateWandering()         // Autonomous movement AI
  updateColor()             // Visual color shift
  updateJitter()            // Position shake effect
  updateSpeed()             // Movement speed variation
  move()                    // Apply movement
  drawStressIndicator()     // Visual stress bar
}
```

### Shake Response Flow
1. Device shaken → `deviceShaken()` called
2. Global `shakeIntensity` increases
3. All characters call `addStressFromShake()`
4. Each adds stress based on their `stressSensitivity`
5. Characters update outputs based on new stress level

## Controls

- **Shake Device**: Increase stress for all characters
- **Tap Character**: Select for detailed view
- **Number Keys (1-9, 0)**: Select character by index
- **Space**: Toggle UI display

## Learning Objectives

1. **Object-Oriented Programming**: Using classes to manage multiple entities
2. **Randomization**: Creating variety through randomized parameters
3. **Emergent Behavior**: Complex interactions from simple rules
4. **State Management**: Each character maintains independent state
5. **Population Dynamics**: Observing aggregate behavior across individuals

## Code Pattern

This demonstrates how to:
- Create a reusable character class
- Instantiate multiple objects with varied properties
- Manage individual and collective state
- Respond to global inputs with personalized reactions
- Display aggregate statistics

## Extensions

Consider adding:
- Character interaction (affect each other's stress)
- Different character types/classes
- Save/load personality presets
- Stress contagion between nearby characters
- Evolution/adaptation of traits over time
