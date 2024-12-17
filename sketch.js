// http://127.0.0.1:5500/index.html 

let canvasBg;
let ambiance; 
let music;
let gui;

// array for all color value names
let colorValues = [
  "#000000",
  "#FFFFFF",
  "#7f7f7f", // dark gray
  "#c4c4c4", // light gray
  "#880016", // dark brown
  "#b97b57", // light brown
  "#ed1b24", // red
  "#feb0cd", // pink 
  "#ff7f29", // orange
  "#fdca0c", // dandelion
  "#f8ee15", // yellow
  "#ede2af", // light yellow
  "#24b24f", // dark green
  "#b2e71c", // light green
  "#01a3ea", // sky blue
  "#9bdaee", // light blue
  "#4347cd", // blue
  "#7392be", // ashy blue
  "#a549a3", // purple
  "#c8bee9" // light purple
]

// variables for paintStroke()

let f = false; // mouse interaction flag
let spring = 0.4; // spring constant for velocity response
let friction = 0.45; // friction for damping velocity
let v = 0.5; // base velocity magnitude
let r = 0; // radius for brush effect
let vx = 0; // x value of velocity
let vy = 0; // y value of velocity
let splitNum = 100; // number of iterations for creating splitting brush effect
let diff = 8; // random offset for splitting effect variations
let x = 0; // current x value
let y = 0; // current y value

let brushColor = "pink"; // global brush color
let brushSize = 50; // Brush size

let pencil, highlighter, paintbrush, eraserBrush;


function preload() {

  ambiance = loadSound('museumamb.mp3');
  music = loadSound('gallerymusic.mp3');

  //reference for amp: https://p5js.org/reference/p5.SoundFile/amp/
  ambiance.amp(0.50);
  music.amp(0.30);

}

function setup() {

  createCanvas(windowWidth * 0.999, windowHeight);
  gui = createGui();
  colorOptions();

  // loads background image
  canvasBg = loadImage('finalbg.png', img => {
    image(img, 0, 0, width, height);
  });

  // Set up music and ambiance
  ambiance.loop();
  music.loop();

  // pencil
  pencil = createImg('pencil.png', 'pencil');
  pencil.position(windowWidth*(0.07+0.04), windowHeight*0.67);
  pencil.size(windowWidth*0.10, windowHeight*0.24);

  // highlighter
  highlighter = createImg('highlighter.png', 'highlighter');
  highlighter.position(windowWidth*(0.15+0.04), windowHeight*0.67);
  highlighter.size(windowWidth*0.09, windowHeight*0.25);

  // paintbrush
  paintbrush = createImg('paintbrush.png', 'paintbrush');
  paintbrush.position(windowWidth*(0.23+0.04), windowHeight*0.67);
  paintbrush.size(windowWidth*0.09, windowHeight*0.25);

  // eraser
  eraserBrush = createImg('eraser.png', 'eraser'); 
  eraserBrush.position(windowWidth*(0.31+0.04), windowHeight*0.71);
  eraserBrush.size(windowWidth*0.10, windowHeight*0.20);

}

function draw() {

  drawGui();

  // pencilStroke();
  // pencil.mousePressed(pencilStroke);

  highlightStroke();
  //highlighter.mousePressed(highlightStroke);

  // paintStroke();
  //paintbrush.mousePressed(paintStroke);

  // eraser();
  //eraserBrush.mousePressed(eraser);

}

function colorOptions() {


  // sizing down the checkboxes
  let perfectSq = windowWidth * 0.032;

  let index = 0; // index tracking for the color name array

  // nested for loops

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {

      let xPos = windowWidth * (0.55 + j * 0.05); // horizontal position for 4 columns
      let yPos = windowHeight * (0.15 + i * 0.1); // vertical position for 5 rows

      rect(xPos, yPos, perfectSq, perfectSq);

      // touch gui checkbox: xpos, ypos, width, height
      let checkbox = createCheckbox(
        "Checkbox",
        xPos,
        yPos,
        perfectSq,
        perfectSq
      );

      // styling of the checkboxes
      if (index < colorValues.length) {
        checkbox.setStyle({

          fillBg: color(colorValues[index]), // assign color from colorValues
          strokeBg: color("white"),

          fillBgHover: color(colorValues[index]),
          fillBgActive: color(colorValues[index]),

          fillCheck: color("#364034"),
          fillCheckHover: color("#364034"),
          fillCheckActive: color("#364034")
        });

        index++;

      }

    }
  }
}

function eraser() {

  // if statement checks if mouse is being pressed within the white canvas
  
  if (mouseIsPressed &&
    mouseX >= windowWidth * 0.125 &&
    mouseX <= windowWidth * 0.125 + windowWidth * 0.335 &&
    mouseY >= windowHeight * 0.155 &&
    mouseY <= windowHeight * 0.155 + windowHeight * 0.455
  ) {
    stroke("white");
    strokeWeight(brushSize);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }

}

function pencilStroke() {

  if (mouseIsPressed &&
    mouseX >= windowWidth * 0.125 &&
    mouseX <= windowWidth * 0.125 + windowWidth * 0.335 &&
    mouseY >= windowHeight * 0.155 &&
    mouseY <= windowHeight * 0.155 + windowHeight * 0.455
  ) {

    strokeWeight(brushSize);
    stroke(brushColor);
    line(mouseX, mouseY, pmouseX, pmouseY);

  }


}

// dist() docu: https://p5js.org/reference/p5/dist/
// lerp() docu: https://p5js.org/reference/p5/lerp/
// ceil() docu: https://p5js.org/reference/p5/ceil/

function highlightStroke() {


  if (mouseIsPressed &&
    mouseX >= windowWidth * 0.125 &&
    mouseX <= windowWidth * 0.125 + windowWidth * 0.335 &&
    mouseY >= windowHeight * 0.155 &&
    mouseY <= windowHeight * 0.155 + windowHeight * 0.455
  ) {


    // initialize the brush

    if (!isDrawing) {
      isDrawing = true;
      lastX = mouseX;
      lastY = mouseY;
    }

    push();

    stroke(brushColor);
    fill(brushColor);

    let distance = dist(lastX, lastY, mouseX, mouseY);
    // calculate the distance between the last mouse position and the current mouse position

    let steps = ceil(distance / 2);
    // determines the number of steps needed for smooth transition between last and current mouse positions. 

    // loops through the calculated number of steps to tranisiton between the last mouse position and the current mouse position.
    for (let i = 0; i < steps; i++) {

      let transition = i / steps; // calculate the transition factor for smooth movement over each step
      
      let interlopX = lerp(lastX, mouseX, transition); // interpolate the lastX to mouseX based on the transition factor.
      let interlopY = lerp(lastY, mouseY, transition); // interpolate the lastY to mouseY based on the transition factor.
    
      rect(interlopX, interlopY, brushSize * 0.75, brushSize * 0.25); // draw a rectangle as the highlighter shape
    }

    pop();

    // updates the brush tracking position with previous mouse X and Y 
    lastX = pmouseX;
    lastY = pmouseY;
    
  } else {
    // when mouse is released
    isDrawing = false;
  }

}


// followed this tutorial: https://www.gorillasun.de/blog/simulating-brush-strokes-with-hookes-law-in-p5js-and-processing/

function paintStroke() {

  if (mouseIsPressed &&
    mouseX >= windowWidth * 0.125 &&
    mouseX <= windowWidth * 0.125 + windowWidth * 0.335 &&
    mouseY >= windowHeight * 0.155 &&
    mouseY <= windowHeight * 0.155 + windowHeight * 0.455
  ) {


    if (mouseIsPressed) {
      if (!f) {
        f = true;
        x = mouseX; // Initialize the starting point
        y = mouseY;
      }

      // Simulate velocity with spring physics and friction
      vx += (pmouseX - x) * spring;
      vy += (pmouseY - y) * spring;
      vx *= friction;
      vy *= friction;

      // Calculate velocity magnitude for brush dynamics
      v += sqrt(vx * vx + vy * vy) - v;
      v *= 0.6;

      let oldR = r;
      r = brushSize - v; // Update dynamic radius based on velocity changes

      for (let i = 0; i < splitNum; ++i) {
        let oldX = x;
        let oldY = y;

        // Interpolate motion to smooth out the brush effect
        x += vx / splitNum;
        y += vy / splitNum;

        // Smoothly transition radius over iterations
        oldR += (r - oldR) / splitNum;
        if (oldR < 1) {
          oldR = 1; // Clamp minimum radius value
        }

        // Set stroke weight for splitting brush effect
        strokeWeight(oldR + diff);
        line(x, y, oldX, oldY);

        // Additional offsets for randomized brush effects
        strokeWeight(oldR);
        line(x + diff * 1.5, y + diff * 2, oldX + diff * 2, oldY + diff * 2);
        line(x - diff, y - diff, oldX - diff, oldY - diff);
        stroke(brushColor)
      }
    } else if (f) {
      // Reset velocity and flags on mouse release
      vx = 0;
      vy = 0;
      v = 0;
      f = false;
    }

  }
}
