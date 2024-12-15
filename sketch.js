let canvasBg;
let ambiance;
let music;
let gui;
let blackButton, whiteButton, darkGrayButton, lightGrayButton, darkBrownButton, lightBrownButton;
let redButton, pinkButton, orangeButton, tangerineButton, yellowButton, lightYellowButton, darkGreenButton, lightGreenButton;
let skyBlueButton, lightBlueButton, blueButton, ashyBlueButton, purpleButton, lightPurpleButton;

function setup() {

  createCanvas(windowWidth * 0.999, windowHeight);
  canvasBg = loadImage('finalbg.png');
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

  let perfectSq = windowWidth*0.032

  background(canvasBg);
  // canvas
  // image background: https://editor.p5js.org/p5/sketches/Image:_Background_Image 
  push();
  stroke("white");
  rect(windowWidth * 0.125, windowHeight * 0.155, windowWidth * 0.337, windowHeight * 0.460, 10)
  pop();

  drawGui();

}

function colorOptions() {

  let perfectSq = windowWidth*0.032

  blackButton = createCheckbox("Checkbox", windowWidth * 0.55, windowHeight * 0.08, perfectSq, perfectSq);
  blackButton.setStyle({

    fillBg: color("black"),
    strokeBg: color("white")

  }
  )

  whiteButton = createCheckbox("Checkbox", windowWidth * 0.59, windowHeight * 0.08, perfectSq, perfectSq);
  whiteButton.setStyle({
    fillBg: color("white"),
    strokeBg: color("gray")
  }
  )

  darkGrayButton = createCheckbox("Checkbox", windowWidth * 0.55, windowHeight * 0.16, perfectSq, perfectSq);
  darkGrayButton.setStyle({
    fillBg: color("#7f7f7f"),
    strokeBg: color("white")
  }
  )

  lightGrayButton = createCheckbox("Checkbox", windowWidth * 0.59, windowHeight * 0.16, perfectSq, perfectSq);
  lightGrayButton.setStyle({
    fillBg: color("#c4c4c4"),
    strokeBg: color("white")
  }
  )

}
