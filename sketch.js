let gui;
let playButton;
let colorButton;
let currentPage = 0; // page variable

function setup() {
    createCanvas(windowWidth, windowHeight)

    gui = createGui();

    let buttonWidth = windowWidth * 0.1;
    let buttonHeight = windowHeight * (0.04);
    // colorButton = createCheckbox("Checkbox", 0, 100, 100, 100);
    playButton = createButton("PLAY", windowWidth / 2 - (buttonWidth / 2), windowHeight * 3 / 4, buttonWidth, buttonHeight);

}

function preload() {
    myLogo = loadImage("mleepaints.jpeg")
}

function draw() {
    background(220);
    
    if (currentPage == 0) {
        main();
    } else if (currentPage == 1) {
        board();
    }
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
    let buttonFontSize = windowWidth / 80;

    image(myLogo, windowWidth / 2, windowHeight * (0.40), myLogo.width * scaleFactor, myLogo.height * scaleFactor);
    
    playButton.setStyle({

        // default colors

        fillBg: color("#fec5d4"),
        font: "Courier New",
        rounding: 40,
        textSize: buttonFontSize,
        fillLabel: color("#6F4F37"),
        strokeBg: color("#6F4F37"),

        // colors when hover button
        fillBgHover: color("#eaa0b6"),
        strokeBgHover: color("#6F4F37"),
        fillLabelHover: color("#6F4F37"),

        // colors when active button
        fillBgActive: color("#FFDBE1"),
        fillLabelActive: color("#6F4F37"),
        strokeBgActive: color("#6F4F37")

    })
    pop();

    push();

    textStyle(BOLDITALIC);
    fill("#6F4F37");
    let fontSize = windowWidth / 50;
    textSize(fontSize);
    text("hit play to start!", windowWidth / 2, windowHeight * (2 / 3));

    pop();

    drawPlayButton();

    push();
    fill("#6F4F37");
    fontSize = windowWidth / 80;
    textSize(fontSize);
    text("© codingmiche", windowWidth / 2, windowHeight * (0.90));
    pop();

}

function drawPlayButton() {

    drawGui();

    if (playButton.isPressed) {
        // Print a message when Button is pressed.
        switchPage();
    }

}

function board() {
    background("#f9f9f9");

    push()
    stroke("#6F4F37")
    strokeWeight(3);
    rect(windowWidth / 16, windowHeight / 8, windowWidth * (2 / 3), windowHeight / 2, 20);
    fill("white");
    pop();

    colorOptions();

}

function colorOptions() {
    drawGui();
}

function switchPage() {
    // switch to the next page and remove the play button
    currentPage = 1;

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
    // do some stuff
    return false;
}