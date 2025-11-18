# localStorage Example - Persistent Values

## Overview
This example demonstrates how to use browser `localStorage` to save and load values between page visits. It's designed for beginners with clear comments and an expandable pattern.

## What It Does
- **3 Sliders** control color hue, brightness, and circle size
- **Values are saved automatically** as you move the sliders
- **Values persist** when you refresh the page
- **Clear button** resets everything to defaults

## Live Demo
[Demo](https://npuckett.github.io/mlphone/localStorage_example/)

## Key Concepts

### What is localStorage?
`localStorage` is a browser feature that lets you save data that persists even after:
- Refreshing the page
- Closing the browser
- Shutting down the computer

It's perfect for:
- Remembering user preferences
- Saving game progress
- Storing settings
- Caching data

### Basic Pattern

```javascript
// 1. SAVE a value
localStorage.setItem('myKey', myValue);

// 2. LOAD a value
let savedValue = localStorage.getItem('myKey');

// 3. REMOVE a value
localStorage.removeItem('myKey');

// 4. CLEAR everything
localStorage.clear();
```

## Code Structure

### Setup Flow
1. **Declare variables** (top of file)
2. **Load saved values** from localStorage
3. **Create UI elements** with loaded values
4. **Create clear button**

### Draw Loop
1. **Read slider values**
2. **Save to localStorage** (happens automatically)
3. **Draw visual feedback**

### Storage Functions
- `saveValuesToStorage()` - Saves all values
- `loadValuesFromStorage()` - Loads all values
- `clearStorage()` - Resets everything

## How to Expand

### Add More Values
```javascript
// 1. Add variable
let myNewValue = 50;

// 2. Add to save function
function saveValuesToStorage() {
  localStorage.setItem('savedColorHue', colorHue);
  localStorage.setItem('savedMyNewValue', myNewValue);  // Add this
}

// 3. Add to load function
function loadValuesFromStorage() {
  let savedHue = localStorage.getItem('savedColorHue');
  if (savedHue !== null) colorHue = Number(savedHue);
  
  let savedNew = localStorage.getItem('savedMyNewValue');  // Add this
  if (savedNew !== null) myNewValue = Number(savedNew);
}

// 4. Add to clear function
function clearStorage() {
  localStorage.removeItem('savedColorHue');
  localStorage.removeItem('savedMyNewValue');  // Add this
  myNewValue = 50;  // Reset to default
}
```

### Save Complex Data (Objects/Arrays)
```javascript
// Save
let gameState = {
  level: 5,
  health: 100,
  items: ['sword', 'shield']
};
localStorage.setItem('gameState', JSON.stringify(gameState));

// Load
let saved = localStorage.getItem('gameState');
if (saved !== null) {
  let gameState = JSON.parse(saved);
  console.log(gameState.level);  // 5
}
```

## Important Notes

### Storage Limits
- Each website gets ~5-10MB (varies by browser)
- Data is stored as strings only
- Use `Number()` to convert back to numbers
- Use `JSON.stringify()` / `JSON.parse()` for objects

### Best Practices
1. **Always check for null** before using loaded values
2. **Use unique key names** to avoid conflicts
3. **Provide default values** for first-time visitors
4. **Test in incognito mode** to simulate new users
5. **Don't store sensitive data** (passwords, personal info)

### Browser Compatibility
- Works in all modern browsers
- Data is isolated per website
- User can clear it via browser settings
- Works offline (it's local to the device)

## Testing

1. **First Visit**: Sliders start at default values
2. **Move Sliders**: Values change and save automatically
3. **Refresh Page**: Values are remembered!
4. **Click Clear Button**: Resets to defaults
5. **Refresh Again**: Defaults remain (storage cleared)

## Use Cases

- **User Preferences**: Theme, language, font size
- **Game Progress**: Level, score, unlocked items
- **Form Data**: Save draft inputs
- **Settings**: Volume, difficulty, controls
- **Session Data**: Last viewed page, filters applied

## Files
- `index.html` - HTML structure with p5.js
- `sketch.js` - Main code with extensive comments
- `README.md` - This documentation

## Related Examples
- Character Controller examples for parameter-based systems
- Device sensor examples for user input patterns
