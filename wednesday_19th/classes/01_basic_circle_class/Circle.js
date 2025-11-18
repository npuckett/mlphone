// ==============================================
// CIRCLE CLASS
// ==============================================
// A class is a blueprint for creating objects with shared properties and behaviors.
// Think of it like a cookie cutter - the class is the cutter, and each object
// you create from it is a cookie.
//
// This Circle class defines what every circle should have and what it can do.
// ==============================================

class Circle {
  // ==============================================
  // CONSTRUCTOR - Runs when you create a new circle
  // ==============================================
  // The constructor is called when you write: new Circle(x, y)
  // It sets up the initial properties (variables) for this specific circle
  
  constructor(x, y) {
    // POSITION - Where the circle is located
    this.x = x;
    this.y = y;
    
    // MOVEMENT - How the circle drifts
    this.speedX = random(-0.5, 0.5);  // Horizontal speed (negative = left, positive = right)
    this.speedY = random(-0.5, 0.5);  // Vertical speed (negative = up, positive = down)
    
    // SIZE - How big the circle is
    this.size = random(30, 80);  // Random size between 30 and 80 pixels
    
    // COLOR - The circle's color (using HSB color mode)
    this.hue = random(360);        // Random hue (0-360 degrees on color wheel)
    this.saturation = random(60, 100);  // How vibrant the color is
    this.brightness = random(70, 100);  // How bright the color is
    
    // OPACITY - How see-through the circle is
    this.alpha = 255;  // Start fully opaque (255 = solid, 0 = invisible)
    
    // STATE - Is the circle clicked or not?
    this.isClicked = false;  // Boolean (true/false) to track if circle was clicked
  }
  
  // ==============================================
  // UPDATE METHOD - Called every frame to update the circle
  // ==============================================
  // This method contains all the logic for how the circle behaves
  
  update() {
    // MOVE the circle by adding speed to position
    this.x += this.speedX;
    this.y += this.speedY;
    
    // FADE OUT if clicked
    if (this.isClicked) {
      this.alpha -= 5;  // Reduce opacity by 5 each frame
      
      // Make sure alpha doesn't go below 0
      if (this.alpha < 0) {
        this.alpha = 0;
      }
    }
  }
  
  // ==============================================
  // DISPLAY METHOD - Called every frame to draw the circle
  // ==============================================
  // This method handles all the visual drawing
  
  display() {
    // Only draw if circle is still visible
    if (this.alpha > 0) {
      push();  // Save current drawing settings
      
      // Set fill color with transparency
      fill(this.hue, this.saturation, this.brightness, this.alpha);
      noStroke();  // No outline
      
      // Draw the circle
      circle(this.x, this.y, this.size);
      
      pop();  // Restore drawing settings
    }
  }
  
  // ==============================================
  // CHECK CLICK METHOD - See if a point is inside this circle
  // ==============================================
  // Returns true if the given x,y point is inside the circle
  // Used to detect mouse/touch clicks
  
  checkClick(mx, my) {
    // Calculate distance from click point to circle center
    let distance = dist(mx, my, this.x, this.y);
    
    // If distance is less than radius, click is inside circle
    if (distance < this.size / 2) {
      this.isClicked = true;  // Mark this circle as clicked
      return true;  // Return true to indicate click was detected
    }
    
    return false;  // Click was outside this circle
  }
  
  // ==============================================
  // IS DEAD METHOD - Check if circle should be removed
  // ==============================================
  // Returns true if the circle has completely faded out
  // This helps us clean up circles that are no longer visible
  
  isDead() {
    return this.alpha <= 0;  // True if completely transparent
  }
}

// ==============================================
// KEY CONCEPTS ABOUT CLASSES
// ==============================================
/*

WHAT IS "this"?
---------------
"this" refers to the specific object (circle) you're working with.
If you create 10 circles, each one has its own x, y, size, etc.
"this.x" means "THIS circle's x position" (not some other circle's x).


METHODS vs FUNCTIONS:
----------------------
- A function is standalone: function doSomething() { }
- A method is a function inside a class: display() { }
- Methods operate on the object's data (using "this")


CREATING OBJECTS FROM A CLASS:
-------------------------------
let myCircle = new Circle(100, 200);
                    ↑        ↑    ↑
                  keyword   x    y

The "new" keyword creates a new object from the class blueprint.


USING THE OBJECT:
-----------------
myCircle.update();      // Call the update method
myCircle.display();     // Call the display method
myCircle.checkClick(mouseX, mouseY);  // Call with parameters


WHY USE CLASSES?
----------------
1. Organization - All circle code in one place
2. Reusability - Create many circles easily
3. Encapsulation - Each circle manages its own data
4. Scalability - Easy to add more circles or features

*/
