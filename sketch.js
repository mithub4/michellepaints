let currentPage = 0; // page variable

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
