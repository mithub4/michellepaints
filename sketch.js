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
    textFont('Courier New');
    fill("#6F4F37");
    
    textAlign(CENTER)

    push()
    textStyle(BOLDITALIC);
    let fontSize = windowWidth/50; // You can change this ratio to suit your needs
    textSize(fontSize);
    text("hit play to start!", windowWidth / 2, windowHeight*(2/3));
    pop()

    push();
    fontSize = windowWidth/80; // You can change this ratio to suit your needs
    textSize(fontSize);
    text("© codingmiche", windowWidth/2, windowHeight*(3/4))
    pop();

}

function board() {
    background("white");
    text("board", windowWidth / 2, windowHeight / 2)

    stroke(30);
    rect(windowWidth / 16, windowHeight / 8, windowWidth * (2 / 3), windowHeight / 2);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    if (currentPage == 0) {
        currentPage = 1;  // Move to the music page
    }
}
