let canvasBg;
let ambiance;
let music;

function setup() {
    createCanvas(windowWidth*0.999, windowHeight);
    canvasBg = loadImage('finalbg.png');
    ambiance.loop();
    music.loop();

}

function preload() {
  ambiance = loadSound('museumamb.mp3');	
  music = loadSound('gallerymusic.mp3');

  //reference for amp: https://p5js.org/reference/p5.SoundFile/amp/
  ambiance.amp(0.5);
  music.amp(0.30);
}

function draw() {
    background(canvasBg);
    // canvas
    // image background: https://editor.p5js.org/p5/sketches/Image:_Background_Image 
    push();
    stroke("white");
    rect(windowWidth*0.125,windowHeight*0.155, windowWidth*0.337, windowHeight*0.460, 10)
    pop();






}
