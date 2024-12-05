let currentPage = 0; // page variable

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    // Draw the background and handle page transitions
    if (currentPage == 0) {
        main();  // Show the main intro page
    } else if (currentPage == 1) {
        board();  // Show the music board page when currentPage is 1
    }
}

function main() {
    background("white");
}

function board() {
    background("pink");
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    if (currentPage == 0) {
        currentPage = 1;  // Move to the music page
    }
}
