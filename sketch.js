let currentPage = 0; // page variable
let playButton;
let myLogo;

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    if (currentPage == 0) {
       main();
    } else if (currentPage == 1) {
        board();
    }
}

function preload() {
    myLogo = loadImage("mleepaints.jpeg")
}

function main() {
    
    background("white");
    textFont('Courier New');
    textAlign(CENTER);

    push();

    imageMode(CENTER);

    // dynamically calculate dimensions based on window size
    let scaleFactorWidth = (windowWidth * 0.9) / myLogo.width;
    let scaleFactorHeight = (windowHeight * 0.7) / myLogo.height;

    // choose the smaller value to maintain aspect ratio
    // ref: https://www.w3schools.com/jsref/jsref_min.asp 
    let scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);

    image(myLogo, windowWidth / 2, windowHeight * (0.40), myLogo.width * scaleFactor, myLogo.height * scaleFactor);

    pop();

    push();
    textStyle(BOLDITALIC);
    fill("#6F4F37");
    let fontSize = windowWidth / 50;
    textSize(fontSize);
    text("hit play to start!", windowWidth / 2, windowHeight * (2 / 3));
    pop();

    // the play button only exists on the main page

    push()
    let buttonWidth = windowWidth * 0.1;
    let buttonHeight = windowHeight * (0.04);
    let buttonFontSize = windowWidth / 80;

    // reference for `${}` : https://stackoverflow.com/questions/35835362/what-does-dollar-sign-and-curly-braces-mean-in-a-string-in-javascript
    // reference for css: https://www.w3schools.com/cssref/index.php
    if (!playButton) {
        playButton = createButton("PLAY");
        playButton.style("font-weight", "bold");
        playButton.position(windowWidth / 2 - (buttonWidth / 2), windowHeight * 3 / 4); // Center the button;
        playButton.style("font-family", "Courier New");
        playButton.style("border-radius", '40px')
        playButton.style("font-size", `${buttonFontSize}px`);
        playButton.style("background-color", "#fec5d4");
        playButton.style("color", "#6F4F37")
        playButton.style("border-color", "#6F4F37")
        playButton.style("width", `${buttonWidth}px`);
        playButton.style("height", `${buttonHeight}px`);
        playButton.mousePressed(switchPage);
    }
    pop()

    push();
    fill("#6F4F37");
    fontSize = windowWidth / 80;
    textSize(fontSize);
    text("© codingmiche", windowWidth / 2, windowHeight * (0.90));
    pop();
}

function board() {
    background("#f9f9f9");

    push()
    stroke("#6F4F37")
    strokeWeight(3);
    rect(windowWidth / 16, windowHeight / 8, windowWidth * (2 / 3), windowHeight / 2, 20);
    fill("white");
    pop()
}

function switchPage() {
    // switch to the next page and remove the play button
    currentPage = 1;

    if (playButton) {
        playButton.remove(); // removes the play button when transitioning to board
    }

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
