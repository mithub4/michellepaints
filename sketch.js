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

let brushColor;

function setup() {

  createCanvas(windowWidth * 0.999, windowHeight);
  canvasBg = loadImage('finalbg.png', img => {
    image(img, 0, 0, width, height);
  });

  push();
  stroke("white");
  fill("white");
  rect(windowWidth * 0.125, windowHeight * 0.155, windowWidth * 0.337, windowHeight * 0.460, 10)
  pop();

  // canvas
  // image background: https://editor.p5js.org/p5/sketches/Image:_Background_Image 
 // background(canvasBg);

  ambiance.loop();
  music.loop();
  gui = createGui();
  colorOptions();

}

function preload() {

  ambiance = loadSound('museumamb.mp3');
  music = loadSound('gallerymusic.mp3');

  //reference for amp: https://p5js.org/reference/p5.SoundFile/amp/
  ambiance.amp(0.50);
  music.amp(0.30);

}

function draw() {

  drawGui();

  if (
    mouseIsPressed &&
    mouseX >= windowWidth * 0.125 &&
    mouseX <= windowWidth * 0.125 + windowWidth * 0.335 &&
    mouseY >= windowHeight * 0.155 &&
    mouseY <= windowHeight * 0.155 + windowHeight * 0.455
  ) {

    // if image is pressed: certainStroke();

    pencilStroke();
  }


}

function colorOptions() {


  // Loop to create a 4-column x 5-row grid of checkboxes
  let perfectSq = windowWidth * 0.032;

  // Loop to create a 4-column x 5-row grid of checkboxes using nested loops
  let index = 0; // Index to track the colorNames array

  for (let i = 0; i < 5; i++) { // Loop over 5 rows
    for (let j = 0; j < 4; j++) { // Loop over 4 columns

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

function pencilStroke() {
  line(mouseX, mouseY, pmouseX, pmouseY);
}

function penStroke() {

}

function paintStroke() {

}

function eraser() {

}

