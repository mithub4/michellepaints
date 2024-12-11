let gui;
let playButton;
let currentPage = 0; // page variable

function setup() {
    createCanvas(windowWidth, windowHeight)

    gui = createGui();
    let buttonWidth = windowWidth * 0.1;
    let buttonHeight = windowHeight * (0.04);
    //  playButton.position(windowWidth / 2 - (buttonWidth / 2), windowHeight * 3 / 4); // Center the button;
    playButton = createButton("Button", windowWidth / 2 - (buttonWidth / 2), windowHeight * 3 / 4, buttonWidth, buttonHeight);

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

    drawPlayButton();

}

function drawPlayButton() {
    drawGui();

    if (playButton.isPressed) {
        // Print a message when Button is pressed.
        print(playButton.label + " pressed.");
    }

    if (playButton.isHeld) {
        // Draw an ellipse when Button is held.
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
    pop()
}

function switchPage() {
    // switch to the next page and remove the play button
    currentPage = 1;

    // if (playButton) {
    //     playButton.remove(); // removes the play button when transitioning to board
    // }

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
    // do some stuff
    return false;
}