let currentPage = 0; // page variable
let playButton;

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

function main() {
    background("white");
    textFont('Courier New');
    fill("#6F4F37");
    textAlign(CENTER);

    push();
    textStyle(BOLDITALIC);
    let fontSize = windowWidth / 50;
    textSize(fontSize);
    text("hit play to start!", windowWidth / 2, windowHeight * (2 / 3));
    pop();

    // the play button only exists on the main page

    const buttonWidth = windowWidth * 0.1;
    const buttonHeight = windowHeight * (0.03);
    const buttonFontSize = windowWidth / 120;

    // reference for `${}` : https://stackoverflow.com/questions/35835362/what-does-dollar-sign-and-curly-braces-mean-in-a-string-in-javascript
    // reference for css: https://www.w3schools.com/cssref/index.php
    if (!playButton) {
        playButton = createButton("PLAY");
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

    push();
    fontSize = windowWidth / 80;
    textSize(fontSize);
    text("© codingmiche", windowWidth / 2, windowHeight * (0.90));
    pop();
}

function board() {
    background("white");
    rect(windowWidth / 16, windowHeight / 8, windowWidth * (2 / 3), windowHeight / 2);
}

function switchPage() {
    // Switch to the next page and remove the Play button
    currentPage = 1;

    if (playButton) {
        playButton.remove(); // removes the play button when transitioning to board
    }

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    // Reposition the play button dynamically on resize if it exists
    if (playButton) {
        playButton.position(windowWidth / 2, windowHeight * 2 / 3 + 20);
    }
}
