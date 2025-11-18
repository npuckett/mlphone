// ==============================================
// LOCAL STORAGE EXAMPLE
// ==============================================
// This example demonstrates how to save and load values using localStorage
// so they persist between page refreshes.
//
// WHAT YOU'LL LEARN:
// - How to save values to browser storage
// - How to load values when the page starts
// - How to clear saved values
// - How to apply this to your own projects
//
// ==============================================

// ==============================================
// VARIABLES TO SAVE/LOAD
// ==============================================
// These are the values we want to remember between visits
let colorHue = 180;        // Hue value (0-360)
let brightness = 50;       // Brightness value (0-100)
let circleSize = 100;      // Circle size (20-200)

// ==============================================
// UI ELEMENTS
// ==============================================
let hueSlider;
let brightnessSlider;
let sizeSlider;
let clearButton;

// ==============================================
// SETUP - Runs once when page loads
// ==============================================
function setup() {
  // Create portrait canvas (9:16 aspect ratio for mobile)
  createCanvas(405, 720);
  
  // Set color mode to HSB for easier color manipulation
  colorMode(HSB, 360, 100, 100);
  
  // STEP 1: LOAD saved values BEFORE creating sliders
  // This ensures sliders start with the saved values
  loadValuesFromStorage();
  
  // STEP 2: CREATE sliders with the loaded values
  createSliders();
  
  // STEP 3: CREATE clear button
  createClearButton();
}

// ==============================================
// DRAW - Main loop
// ==============================================
function draw() {
  background(0, 0, 10);
  
  // STEP 4: UPDATE variables from sliders
  // Read the current slider values
  colorHue = hueSlider.value();
  brightness = brightnessSlider.value();
  circleSize = sizeSlider.value();
  
  // STEP 5: SAVE values whenever they change
  // This happens automatically as sliders are moved
  saveValuesToStorage();
  
  // Draw the circle with current values
  drawCircle();
  
  // Draw UI labels
  drawLabels();
}

// ==============================================
// CREATE UI ELEMENTS
// ==============================================
function createSliders() {
  let sliderX = 20;
  let sliderY = 80;
  let sliderSpacing = 80;
  let sliderWidth = width - 40;
  
  // HUE SLIDER (0-360)
  hueSlider = createSlider(0, 360, colorHue);
  hueSlider.position(sliderX, sliderY);
  hueSlider.style('width', sliderWidth + 'px');
  
  // BRIGHTNESS SLIDER (0-100)
  brightnessSlider = createSlider(0, 100, brightness);
  brightnessSlider.position(sliderX, sliderY + sliderSpacing);
  brightnessSlider.style('width', sliderWidth + 'px');
  
  // SIZE SLIDER (20-200)
  sizeSlider = createSlider(20, 200, circleSize);
  sizeSlider.position(sliderX, sliderY + sliderSpacing * 2);
  sizeSlider.style('width', sliderWidth + 'px');
}

function createClearButton() {
  clearButton = createButton('Clear Saved Values');
  clearButton.position(20, 320);
  clearButton.mousePressed(clearStorage);
  clearButton.style('padding', '10px 20px');
  clearButton.style('font-size', '16px');
  clearButton.style('background-color', '#ff4444');
  clearButton.style('color', 'white');
  clearButton.style('border', 'none');
  clearButton.style('border-radius', '5px');
  clearButton.style('cursor', 'pointer');
}

// ==============================================
// DRAW FUNCTIONS
// ==============================================
function drawCircle() {
  // Draw circle in lower portion of screen (below UI)
  push();
  fill(colorHue, 80, brightness);
  noStroke();
  circle(width / 2, height - 200, circleSize);
  pop();
}

function drawLabels() {
  // Draw labels for each slider
  fill(255);
  textSize(14);
  textAlign(LEFT);
  
  text(`Color Hue: ${colorHue.toFixed(0)}°`, 25, 75);
  text(`Brightness: ${brightness.toFixed(0)}%`, 25, 155);
  text(`Circle Size: ${circleSize.toFixed(0)}px`, 25, 235);
  
  // Instructions
  textSize(12);
  fill(200);
  text('Move sliders to change values', 25, 380);
  text('Values are saved automatically', 25, 400);
  text('Refresh the page to test!', 25, 420);
}

// ==============================================
// LOCAL STORAGE FUNCTIONS
// ==============================================

// SAVE values to localStorage
// This function saves all our variables to browser storage
function saveValuesToStorage() {
  // localStorage.setItem(key, value) saves a value with a unique key
  // The key is like a label for the stored value
  
  localStorage.setItem('savedColorHue', colorHue);
  localStorage.setItem('savedBrightness', brightness);
  localStorage.setItem('savedCircleSize', circleSize);
  
  // NOTE: localStorage only stores strings, but p5 handles conversion
  // For objects/arrays, you'd need JSON.stringify() - see advanced example below
}

// LOAD values from localStorage
// This function retrieves saved values when the page loads
function loadValuesFromStorage() {
  // localStorage.getItem(key) retrieves a saved value
  // Returns null if the key doesn't exist (first visit)
  
  let savedHue = localStorage.getItem('savedColorHue');
  let savedBright = localStorage.getItem('savedBrightness');
  let savedSize = localStorage.getItem('savedCircleSize');
  
  // Only update variables if saved values exist
  // This prevents errors on first visit
  if (savedHue !== null) {
    colorHue = Number(savedHue);  // Convert string back to number
  }
  
  if (savedBright !== null) {
    brightness = Number(savedBright);
  }
  
  if (savedSize !== null) {
    circleSize = Number(savedSize);
  }
  
  // ALTERNATIVE: Use default values if nothing saved
  // colorHue = Number(savedHue) || 180;  // Use 180 if null
}

// CLEAR all saved values
// This function removes all stored values and resets to defaults
function clearStorage() {
  // Method 1: Remove specific items
  localStorage.removeItem('savedColorHue');
  localStorage.removeItem('savedBrightness');
  localStorage.removeItem('savedCircleSize');
  
  // Method 2: Clear ALL localStorage (use carefully!)
  // localStorage.clear();
  
  // Reset variables to defaults
  colorHue = 180;
  brightness = 50;
  circleSize = 100;
  
  // Update sliders to show reset values
  hueSlider.value(colorHue);
  brightnessSlider.value(brightness);
  sizeSlider.value(circleSize);
  
  console.log('Storage cleared! Values reset to defaults.');
}

// ==============================================
// HOW TO EXPAND THIS TO YOUR PROJECT
// ==============================================
/*

BASIC PATTERN:
--------------
1. Declare your variables at the top
2. In setup(), call loadValuesFromStorage() BEFORE creating UI
3. In draw() or when values change, call saveValuesToStorage()
4. Create a clear button that calls clearStorage()


SAVING MULTIPLE VALUES:
-----------------------
Just add more localStorage.setItem() calls:

function saveValuesToStorage() {
  localStorage.setItem('mySpeed', speed);
  localStorage.setItem('myHealth', health);
  localStorage.setItem('myScore', score);
}


LOADING MULTIPLE VALUES:
------------------------
Add corresponding getItem() calls:

function loadValuesFromStorage() {
  let savedSpeed = localStorage.getItem('mySpeed');
  if (savedSpeed !== null) speed = Number(savedSpeed);
  
  let savedHealth = localStorage.getItem('myHealth');
  if (savedHealth !== null) health = Number(savedHealth);
  
  let savedScore = localStorage.getItem('myScore');
  if (savedScore !== null) score = Number(savedScore);
}


SAVING OBJECTS/ARRAYS (ADVANCED):
----------------------------------
For complex data, use JSON:

// SAVE
function saveComplexData() {
  let myData = {
    speed: speed,
    health: health,
    score: score,
    items: ['sword', 'shield']
  };
  localStorage.setItem('gameData', JSON.stringify(myData));
}

// LOAD
function loadComplexData() {
  let savedData = localStorage.getItem('gameData');
  if (savedData !== null) {
    let myData = JSON.parse(savedData);
    speed = myData.speed;
    health = myData.health;
    score = myData.score;
    // etc.
  }
}


IMPORTANT NOTES:
----------------
- localStorage persists even after closing the browser
- Each website gets its own localStorage (isolated)
- There's a limit (~5-10MB depending on browser)
- Values are always stored as strings
- Use unique key names to avoid conflicts
- Test in incognito mode to simulate first-time visitors

*/
