// http://127.0.0.1:5500/index.html 

let canvasBg;
let ambiance;
let music;
let gui;
let colorNames = [
  'blackButton',
  'whiteButton',
  'darkGrayButton',
  'lightGrayButton',
  'darkBrownButton',
  'lightBrownButton',
  'redButton',
  'pinkButton',
  'orangeButton',
  'dandelionButton',
  'yellowButton',
  'lightYellowButton',
  'darkGreenButton',
  'lightGreenButton',
  'skyBlueButton',
  'lightBlueButton',
  'blueButton',
  'ashyBlueButton',
  'purpleButton',
  'lightPurpleButton',
];

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
let f = false; // Mouse interaction flag
let spring = 0.4; // Spring constant for velocity response
let friction = 0.45; // Friction for damping velocity
let v = 0.5; // Base velocity magnitude
let r = 0; // Radius for brush effect
let vx = 0; // X component of velocity
let vy = 0; // Y component of velocity
let splitNum = 100; // Number of iterations for creating splitting brush effect
let diff = 8; // Random offset for splitting effect variations
let x = 0; // Current X coordinate
let y = 0; // Current Y coordinate

// variables for highlightstroke() 
let isDrawing = false;
let lastX = 0;
let lastY = 0;

let brushColor = "pink"; // global brush color
let brushSize = 50; // Brush size

let button1, button2, button3;


function preload() {

  ambiance = loadSound('museumamb.mp3');
  music = loadSound('gallerymusic.mp3');

  //reference for amp: https://p5js.org/reference/p5.SoundFile/amp/
  ambiance.amp(0.50);
  music.amp(0.30);
  button2 = loadImage('choice2.png');
  button3 = loadImage('choice3.png');

}

function setup() {
  createCanvas(windowWidth * 0.999, windowHeight);
  gui = createGui();
  colorOptions();

  // Load background image
  canvasBg = loadImage('finalbg.png', img => {
    image(img, 0, 0, width, height);
  });

  // Set up music and ambiance
  ambiance.loop();
  music.loop();

  // Button 1
  button1 = createImg('choice1.png', 'Button 1');
  button1.position(100, 100);
  button1.size(100, 100);

  // // Button 2
  // button2 = createImg('choice2.png', 'Button 2');
  // button2.position(250, 100);
  // button2.size(100, 100);
  // button2.mousePressed(pencilStroke);

  // // Button 3
  // button3 = createImg('choice3.png', 'Button 3');
  // button3.position(400, 100);
  // button3.size(100, 100);
  // button3.mousePressed(pencilStroke);

}

function draw() {

  drawGui();
  pencilStroke();


  // if (
  //   mouseIsPressed &&
  //   mouseX >= windowWidth * 0.125 &&
  //   mouseX <= windowWidth * 0.125 + windowWidth * 0.335 &&
  //   mouseY >= windowHeight * 0.155 &&
  //   mouseY <= windowHeight * 0.155 + windowHeight * 0.455
  // ) {

  //   // if image is pressed: certainStroke();

  //   // pencilStroke();
  //   highlightStroke();
  //   // paintStroke();
  //   // eraser();

  // }


}

function colorOptions() {


  let perfectSq = windowWidth * 0.032;

  let index = 0;

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {

      // set a global variable = false (2 dim array)

      let xPos = windowWidth * (0.55 + j * 0.05); // Horizontal position for 4 columns
      let yPos = windowHeight * (0.15 + i * 0.1); // Vertical position for 5 rows

      rect(xPos, yPos, perfectSq, perfectSq);

      let checkbox = createCheckbox(
        "Checkbox",
        xPos,
        yPos,
        perfectSq,
        perfectSq
      );

      // check if mouseIsPressed in a certain image to set global variable to true --> render the color of the brush
      // two global variables that holds true or false, and one that holds the color currently selected

      if (index < colorValues.length) {
        checkbox.setStyle({
          fillBg: color(colorValues[index]), // Assign color from colorValues
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

  stroke("white");
  strokeWeight(brushSize);
  line(mouseX, mouseY, pmouseX, pmouseY);

}

function pencilStroke() {

  button1.mousePressed(pencilStroke);

  if ( mouseIsPressed &&
    mouseX >= windowWidth * 0.125 &&
    mouseX <= windowWidth * 0.125 + windowWidth * 0.335 &&
    mouseY >= windowHeight * 0.155 &&
    mouseY <= windowHeight * 0.155 + windowHeight * 0.455
  ) {

    // if image is pressed: certainStroke();

    strokeWeight(brushSize);
    stroke(brushColor);
    line(mouseX, mouseY, pmouseX, pmouseY);

  }


}

// p5.js dist() Documentation
// p5.js lerp() Documentation
// MDN Math.ceil() Documentation
// p5.js mouseIsPressed Documentation
// p5.js rect() Documentation

function highlightStroke() {
  if (mouseIsPressed) {
    if (!isDrawing) {
      // First time mouse click - initialize the brush start
      isDrawing = true;
      lastX = mouseX;
      lastY = mouseY;
    }

    push();
    stroke(brushColor);
    fill(brushColor);

    let distance = dist(lastX, lastY, mouseX, mouseY);
    let steps = Math.ceil(distance / 2);

    for (let i = 0; i < steps; i++) {
      let t = i / steps;
      let interpX = lerp(lastX, mouseX, t);
      let interpY = lerp(lastY, mouseY, t);

      rect(interpX, interpY, brushSize * 0.75, brushSize * 0.25);
      interpX = null;
      interpY = null;
    }

    pop();

    // Update the brush tracking positions
    lastX = mouseX;
    lastY = mouseY;
  } else {
    // When mouse is released
    isDrawing = false;
  }
}


// tutorial: https://www.gorillasun.de/blog/simulating-brush-strokes-with-hookes-law-in-p5js-and-processing/

function paintStroke() {

  if (mouseIsPressed) {
    if (!f) {
      f = true;
      x = mouseX; // Initialize the starting point
      y = mouseY;
    }

    // Simulate velocity with spring physics and friction
    vx += (mouseX - x) * spring;
    vy += (mouseY - y) * spring;
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
