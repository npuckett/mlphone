# Classes 01 - Basic Circle Class

## Overview
This example introduces **classes** in JavaScript using a simple Circle class. It demonstrates how to create multiple objects from a class blueprint, manage them in an array, and make them interactive.

## What It Does
- **15 circles** spawn at random positions
- Each circle **drifts slowly** in a random direction
- **Click/Touch a circle** to make it fade out
- **Shake your phone** to add 3-5 more circles
- **Press SPACE** to add one circle (desktop)
- Circles are **automatically removed** when fully faded

## Live Demo
[Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/01_basic_circle_class/)

## File Structure

### Separate Class File
```
01_basic_circle_class/
├── index.html    → HTML structure, loads files in order
├── Circle.js     → Circle class definition (blueprint)
└── sketch.js     → Main program (creates and uses circles)
```

**Why separate files?**
- Organization: Class code separate from main code
- Reusability: Could use Circle class in other projects
- Clarity: Easier to find and modify class definition
- Best practice: Mirrors professional code structure

## Key Concepts

### What is a Class?

A **class** is a blueprint for creating objects with shared properties and behaviors.

```javascript
// THE BLUEPRINT (class)
class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(30, 80);
  }
  
  display() {
    circle(this.x, this.y, this.size);
  }
}

// CREATING OBJECTS (instances)
let circle1 = new Circle(100, 200);  // First circle
let circle2 = new Circle(300, 400);  // Second circle

// Each has its own x, y, size
```

### Class Anatomy

```javascript
class Circle {
  // CONSTRUCTOR - Runs when object is created
  constructor(x, y) {
    this.property = value;  // Set initial properties
  }
  
  // METHODS - Functions that belong to the class
  update() {
    // Update logic
  }
  
  display() {
    // Drawing logic
  }
}
```

### The "this" Keyword

`this` refers to the **specific object** you're working with:

```javascript
let circle1 = new Circle(100, 200);
let circle2 = new Circle(300, 400);

circle1.display();  // "this" refers to circle1
circle2.display();  // "this" refers to circle2
```

## Circle Class Properties

Each circle has its own:

| Property | Description | Initial Value |
|----------|-------------|---------------|
| `x`, `y` | Position | Passed to constructor |
| `speedX`, `speedY` | Movement speed | Random between -0.5 and 0.5 |
| `size` | Diameter | Random between 30 and 80 |
| `hue` | Color hue | Random between 0 and 360 |
| `saturation` | Color vibrancy | Random between 60 and 100 |
| `brightness` | Color brightness | Random between 70 and 100 |
| `alpha` | Opacity | 255 (fully opaque) |
| `isClicked` | Clicked state | false |

## Circle Class Methods

### `update()`
- Moves circle by adding speed to position
- Fades out if clicked (reduces alpha by 5)

### `display()`
- Draws the circle if visible (alpha > 0)
- Uses current hue, saturation, brightness, and alpha

### `checkClick(mx, my)`
- Checks if point (mx, my) is inside circle
- Marks circle as clicked if true
- Returns boolean

### `isDead()`
- Returns true if alpha is 0 (fully faded)
- Used to remove circles from array

## Main Program Flow

### Setup
1. Create canvas
2. Set HSB color mode
3. **Enable gyroscope** with `enableGyroTap()` for shake detection
4. **Lock gestures** with `lockGestures()` to prevent accidental zoom/refresh
5. Create 15 circles at random positions
6. Store all circles in `circles` array

### Draw Loop (60 FPS)
1. Draw background
2. **Update** each circle (move, fade)
3. **Display** each circle (draw)
4. **Remove** dead circles (faded out)
5. Draw instructions

### Interaction
- **Click/Touch**: Marks clicked circles for fade-out
- **Device Shake**: Adds 3-5 circles at random positions (requires sensor permission)
- **Spacebar**: Adds one circle at random position (desktop)

## Array Management

### Adding Circles
```javascript
let newCircle = new Circle(x, y);
circles.push(newCircle);  // Add to end of array
```

### Accessing Circles
```javascript
circles[0]        // First circle
circles[i]        // Circle at index i
circles.length    // Number of circles
```

### Removing Circles
```javascript
// Loop BACKWARDS to safely remove
for (let i = circles.length - 1; i >= 0; i--) {
  if (circles[i].isDead()) {
    circles.splice(i, 1);  // Remove 1 item at index i
  }
}
```

**Why loop backwards?**
When you remove an item, all items after it shift down. Looping backwards prevents skipping items.

## Common Patterns

### Creating Multiple Objects
```javascript
for (let i = 0; i < 15; i++) {
  let x = random(width);
  let y = random(height);
  circles.push(new Circle(x, y));
}
```

### Updating All Objects
```javascript
for (let i = 0; i < circles.length; i++) {
  circles[i].update();
  circles[i].display();
}
```

### Finding Clicked Object
```javascript
for (let i = 0; i < circles.length; i++) {
  if (circles[i].checkClick(mouseX, mouseY)) {
    // This circle was clicked
  }
}
```

## Expanding This Example

### Add More Properties
```javascript
constructor(x, y) {
  this.x = x;
  this.y = y;
  this.rotation = 0;          // Add rotation
  this.rotationSpeed = 0.02;  // Add rotation speed
}
```

### Add More Methods
```javascript
bounce() {
  // Bounce off edges
  if (this.x < 0 || this.x > width) {
    this.speedX *= -1;
  }
  if (this.y < 0 || this.y > height) {
    this.speedY *= -1;
  }
}
```

### Change Behavior
```javascript
update() {
  this.x += this.speedX;
  this.y += this.speedY;
  this.rotation += this.rotationSpeed;  // Add rotation
  this.bounce();  // Add bouncing
  
  if (this.isClicked) {
    this.alpha -= 5;
  }
}
```

## Why Use Classes?

### Before Classes (Hard Way)
```javascript
let x1 = 100, y1 = 200, size1 = 50, alpha1 = 255;
let x2 = 300, y2 = 400, size2 = 60, alpha2 = 255;
let x3 = 150, y3 = 300, size3 = 40, alpha3 = 255;
// ... managing 50 variables per circle!
```

### With Classes (Easy Way)
```javascript
let circles = [];
circles.push(new Circle(100, 200));
circles.push(new Circle(300, 400));
circles.push(new Circle(150, 300));
// ... just create more circles!
```

## Benefits of This Approach

1. **Organization** - All circle code in one place
2. **Scalability** - Easy to add 100s of circles
3. **Maintainability** - Change class once, affects all circles
4. **Readability** - Clear what each method does
5. **Reusability** - Use class in other projects

## Next Steps

Try modifying the Circle class to:
- Add gravity (make circles fall)
- Add acceleration (speed up over time)
- Change size when clicked (before fading)
- Bounce off edges instead of drifting off screen
- Split into multiple circles when clicked
- Add trails or particle effects

## Files
- `index.html` - HTML structure, loads scripts in order
- `Circle.js` - Circle class definition
- `sketch.js` - Main program with extensive comments
- `README.md` - This documentation

## Mobile Sensor Integration

This example uses **p5-phone** library to access device sensors:

### Shake Detection
```javascript
// Called automatically when device is shaken
function deviceShaken() {
  // Add multiple circles
  for (let i = 0; i < 5; i++) {
    circles.push(new Circle(random(width), random(height)));
  }
}
```

### Setup Requirements
```javascript
function setup() {
  // Enable motion sensors (gyroscope, accelerometer)
  enableGyroTap('Tap to enable motion sensors');
  
  // Prevent unwanted mobile browser gestures
  lockGestures();
}
```

### Checking Sensor Status
```javascript
if (window.sensorsEnabled) {
  // Sensors are ready, deviceShaken() will work
} else {
  // User needs to tap to grant permission
}
```

## Related Concepts
- Object-Oriented Programming (OOP)
- Encapsulation
- Arrays and array methods
- Loop patterns for object management
- Mobile sensor APIs (gyroscope, accelerometer)
- Device shake detection
- Permission handling for device features
