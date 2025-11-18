# Classes 02 - Functions Approach (No Classes)

## Overview
This example does **exactly the same thing** as the class version (`01_basic_circle_class`), but without using classes. It demonstrates the traditional approach using separate arrays and functions.

**Purpose:** To show the difference between class-based and function-based approaches, making it clear why classes are valuable.

## What It Does
- **15 circles** spawn at random positions
- Each circle **drifts slowly** in a random direction
- **Click/Touch a circle** to make it fade out
- **Shake your phone** to add 3-5 more circles
- **Press SPACE** to add one circle (desktop)
- Circles are **automatically removed** when fully faded

## Live Demo
[Demo](https://npuckett.github.io/mlphone/wednesday_19th/classes/02_basic_circle_functions/)

## File Structure

### No Separate Class File
```
02_basic_circle_functions/
├── index.html    → HTML structure, loads p5.js and p5-phone
└── sketch.js     → ALL code in one file
```

**Notice:** No `Circle.js` file! All code is in `sketch.js`.

## Key Differences from Class Version

### Data Storage

#### Class Version (01_basic_circle_class)
```javascript
// ONE array holding Circle objects
let circles = [];

// Each object has all its properties together
circles[0].x
circles[0].y
circles[0].size
circles[0].alpha
```

#### Functions Version (02_basic_circle_functions)
```javascript
// SEPARATE arrays for each property
let x = [];
let y = [];
let size = [];
let alpha = [];

// Properties accessed by same index
x[0], y[0], size[0], alpha[0]  // First circle
x[1], y[1], size[1], alpha[1]  // Second circle
```

### Adding a Circle

#### Class Version
```javascript
circles.push(new Circle(100, 200));
```
**1 line** - Constructor handles all properties

#### Functions Version
```javascript
x.push(100);
y.push(200);
speedX.push(random(-0.5, 0.5));
speedY.push(random(-0.5, 0.5));
size.push(random(30, 80));
hue.push(random(360));
saturation.push(random(60, 100));
brightness.push(random(70, 100));
alpha.push(255);
isClicked.push(false);
```
**10 lines** - Must manually add to each array

### Removing a Circle

#### Class Version
```javascript
circles.splice(i, 1);
```
**1 line** - Removes entire object

#### Functions Version
```javascript
x.splice(i, 1);
y.splice(i, 1);
speedX.splice(i, 1);
speedY.splice(i, 1);
size.splice(i, 1);
hue.splice(i, 1);
saturation.splice(i, 1);
brightness.splice(i, 1);
alpha.splice(i, 1);
isClicked.splice(i, 1);
```
**10 lines** - Must remove from each array

### Updating Circles

#### Class Version
```javascript
for (let i = 0; i < circles.length; i++) {
  circles[i].update();   // Logic inside class
  circles[i].display();  // Drawing inside class
}
```
**Clean and organized** - Each object handles itself

#### Functions Version
```javascript
for (let i = 0; i < x.length; i++) {
  // Update logic here
  x[i] += speedX[i];
  y[i] += speedY[i];
  if (isClicked[i]) {
    alpha[i] -= 5;
  }
  
  // Drawing logic here
  if (alpha[i] > 0) {
    fill(hue[i], saturation[i], brightness[i], alpha[i]);
    circle(x[i], y[i], size[i]);
  }
}
```
**All logic in main sketch** - More code, harder to organize

## Code Comparison Table

| Task | Class Version | Functions Version |
|------|---------------|-------------------|
| Create circle | 1 line | 10 lines |
| Remove circle | 1 line | 10 lines |
| Update circle | `obj.update()` | Manual loop |
| Display circle | `obj.display()` | Manual drawing |
| Check if dead | `obj.isDead()` | Check array value |
| Number of files | 3 (index, Circle, sketch) | 2 (index, sketch) |
| Lines of code | ~250 total | ~280 total |

## Problems with Functions Approach

### 1. **Array Synchronization**
All arrays must stay perfectly in sync. If you forget to add/remove from one array, you get bugs:

```javascript
// OOPS - forgot to add to alpha array!
x.push(100);
y.push(200);
size.push(50);
// alpha.push(255);  ← FORGOT THIS!

// Now arrays are different lengths - BUG!
```

### 2. **Code Duplication**
Adding and removing circles requires repeating similar code 10 times:

```javascript
function addCircle(xPos, yPos) {
  x.push(xPos);           // Repetitive
  y.push(yPos);           // Repetitive
  speedX.push(...);       // Repetitive
  speedY.push(...);       // Repetitive
  size.push(...);         // Repetitive
  hue.push(...);          // Repetitive
  saturation.push(...);   // Repetitive
  brightness.push(...);   // Repetitive
  alpha.push(...);        // Repetitive
  isClicked.push(...);    // Repetitive
}
```

### 3. **Hard to Add Features**
Want to add rotation? Must:
1. Create new array: `let rotation = [];`
2. Update `addCircle()` to push rotation
3. Update `removeDeadCircles()` to splice rotation
4. Update `updateCircles()` to change rotation
5. Update `displayCircles()` to use rotation

**Easy to miss a step!**

### 4. **No Encapsulation**
All data is global. Any function can accidentally modify any array:

```javascript
// Could accidentally do this anywhere:
x[5] = 999;  // Move circle 5 off screen by accident
```

### 5. **Unclear Relationships**
Not obvious that `x[3]`, `y[3]`, `size[3]` all belong to the same circle.

## Advantages of Functions Approach

### 1. **Simpler Conceptually**
If you're brand new to programming, arrays are easier to understand than classes.

### 2. **One File**
All code in one place - no separate class file.

### 3. **Direct Access**
Can access any property directly without calling methods:
```javascript
x[5] = 100;  // Direct access
```

### 4. **Good for Learning**
Shows you WHY classes are useful by experiencing the pain without them.

## When to Use Each Approach

### Use Functions When:
- Very simple program (1-3 properties per object)
- Learning programming basics
- Quick prototype or sketch
- Not planning to extend the code

### Use Classes When:
- More than 3 properties per object
- Need to maintain code over time
- Planning to add features
- Working in a team
- Want professional-quality code
- Need to reuse code in other projects

## Memory and Performance

**Common Misconception:** "Functions approach is faster/uses less memory"

**Reality:** Difference is negligible
- Both store same data
- Both do same operations
- Modern JavaScript engines optimize both
- Class overhead is minimal (~few bytes per object)

**Maintainability matters more than tiny performance differences!**

## Code Organization Comparison

### Class Version Structure
```
Circle.js
  ├─ Circle class
  │   ├─ constructor (setup)
  │   ├─ update() (movement logic)
  │   ├─ display() (drawing logic)
  │   ├─ checkClick() (interaction)
  │   └─ isDead() (cleanup check)
  
sketch.js
  ├─ circles array
  ├─ setup() (create circles)
  ├─ draw() (main loop)
  └─ interaction handlers
```
**Organized and modular**

### Functions Version Structure
```
sketch.js
  ├─ 10 separate arrays
  ├─ addCircle() (creation)
  ├─ updateCircles() (movement)
  ├─ displayCircles() (drawing)
  ├─ checkCircleClick() (one circle)
  ├─ checkAllClicks() (all circles)
  ├─ isCircleDead() (one circle)
  ├─ removeDeadCircles() (cleanup)
  ├─ setup() (initialization)
  ├─ draw() (main loop)
  └─ interaction handlers
```
**Everything in one file - harder to navigate**

## Learning Path

This example is designed to help you understand:

1. **How data can be organized** (parallel arrays vs objects)
2. **Why classes exist** (solve organizational problems)
3. **When to use each approach** (complexity threshold)
4. **Professional coding practices** (classes are industry standard)

## Try This Exercise

Open both examples side-by-side and compare:

1. Find where circles are created
2. Find where circles are removed
3. Find where circles are updated
4. Add a new property (like rotation) to both
5. Notice which one is easier to modify

## Real-World Analogy

**Functions Approach:**
Like having separate drawers for:
- T-shirts drawer
- Pants drawer
- Socks drawer
- Underwear drawer

Outfit #1 is: T-shirts[0] + Pants[0] + Socks[0] + Underwear[0]

**Messy!** Hard to keep track of complete outfits.

**Class Approach:**
Like having complete outfits:
- Outfit[0] = {shirt, pants, socks, underwear}
- Outfit[1] = {shirt, pants, socks, underwear}

**Clean!** Each outfit is self-contained.

## Summary

Both approaches work and produce identical results. The class approach is:
- ✓ More organized
- ✓ Easier to maintain
- ✓ Less error-prone
- ✓ Industry standard
- ✓ Better for complex programs

The functions approach is:
- ✓ Simpler for beginners
- ✓ Fewer files
- ✓ Good for very simple programs
- ✗ Doesn't scale well

**Recommendation:** Learn both, but use classes for anything beyond simple experiments.

## Files
- `index.html` - HTML structure
- `sketch.js` - All code in one file
- `README.md` - This documentation

## Related Examples
- `01_basic_circle_class` - Same functionality using classes (compare!)
