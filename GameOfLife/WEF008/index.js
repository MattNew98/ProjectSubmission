const unitLength = 20;
let boxColor = 150
const strokeColor = 50;
var rgbColor
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let canvas
let slider
let inputX = 0
let inputY = 0
let shoot = 0
let gameMode = 1
let hitCounter = 0
let rgb = false
let insertBoard = []
let pattern2DArray = []
let defaultPattern = true
var bgm = new Audio('/WEF008/bgm.mp3')


function playbgm() {

    bgm.play()

}
function stopbgm() {
    bgm.pause()
    bgm.currentTime = 0
}

function colorGen() {
    var generateColor = Math.floor(Math.random() * 256);
    return generateColor;
}
// set interval for rgb color change
setInterval(function () { rgbColor = 'rgb(' + colorGen() + ',' + colorGen() + ',' + colorGen() + ')' }, 500)

function windowResized() {
    resizeCanvas((windowWidth - 400) - ((windowWidth - 400) % 100), (windowHeight - 200) - ((windowHeight - 200) % 100));
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
    }
    init()
}

function setup() {

    /* Set the canvas to be under the element #canvas*/
    canvas = createCanvas((windowWidth - 400) - (windowWidth - 400) % 100, (windowHeight - 200) - (windowHeight - 200) % 100);
    canvas.parent(document.querySelector('#canvas'));

    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
    }

    // add slider to slider button
    slider = createSlider(0, 30, 15)
    slider.parent(document.querySelector('#slider'))
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard

}

function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0
            nextBoard[i][j] = 0
        }
    }
    if (gameMode === 2) { spawnShip(); }
}

function draw() {
    if (rgb === true) {
        boxColor = rgbColor
    }
    background(100);
    generate();
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 3) {
                fill(255);
            } else if (currentBoard[i][j] == 2) {
                fill(50);
            } else if (currentBoard[i][j] == 1) {
                fill(boxColor);
            } else {
                fill(100);
            }
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
}

// spawnMobs
setInterval(function () {
    let mobSpawns = []
    if (gameMode == 2) {

        let patternWidth = getPatternWidth(insertBoard)
        let patternHeight = insertBoard.length
        pattern2DArray = []
        insertBoard = []
        patternConversion(pattern7)
        function getCoor() { return (Math.floor(Math.random() * columns)) }
        mobSpawns.push(getCoor())
        for (let mobSpawn of mobSpawns) {
            for (i = 0; i < patternHeight; i++) {
                for (j = 0; j < patternWidth; j++) {
                    // if (mobSpawn < columns - 15) {
                    currentBoard[(mobSpawn + j + columns) % columns][(0 + i + rows) % rows] = insertBoard[i][j]
                    nextBoard[mobSpawn][0] = 0
                    // }
                }

            }

        }
        // for (let mobSpawn of mobSpawns) {
        //     currentBoard[mobSpawn][0] = random() > 0.7 ? 3 : 0;
        //     nextBoard[mobSpawn][0] = 0



        // }
    }
}, (Math.floor(Math.random() * 3)) * 1000)
// not working sometimes, depends on first time loading the page. Cant fix by refreshing page but starting a new one

function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }
            // game of life
            if (gameMode == 1) {
                //     // Rules of Life
                if (currentBoard[x][y] == 1 && neighbors < 2) {
                    // Die of Loneliness

                    nextBoard[x][y] = 0;
                } else if (currentBoard[x][y] == 1 && neighbors > 3) {
                    // Die of Overpopulation

                    nextBoard[x][y] = 0;
                } else if (currentBoard[x][y] == 0 && neighbors == 3) {
                    //     // New life due to Reproduction

                    nextBoard[x][y] = 1;
                } else {
                    //         //     // Stasis
                    nextBoard[x][y] = currentBoard[x][y]
                }
            }
            // Space Invader
            else if (gameMode == 2) {
                if (hitCounter == 1) {
                    // console.log('lose')
                    hitCounter = 0
                    init()
                    spawnShip()
                    return
                }
                if (currentBoard[x][y] == 2 && nextBoard[x][y - 1] == 1) {
                    nextBoard[x][y] = 0;
                    currentBoard[x][y] = 0
                    hitCounter++
                    // removeShip when hit
                }
                else if (currentBoard[x][y] == 2 && shoot == -3 && neighbors == 2) {
                    currentBoard[x][y] = 0
                    nextBoard[((x + inputX + columns) % columns)][((y + inputY + rows) % rows)] = 2
                    nextBoard[x][y + shoot - 2] = shoot * -1
                    // control + shootBullets

                } else if (currentBoard[x][y] == 2) {
                    currentBoard[x][y] = 0
                    nextBoard[((x + inputX + columns) % columns)][((y + inputY + rows) % rows)] = 2
                    // control
                } else if (currentBoard[x][y] == 3 && y == 0) {
                    currentBoard[x][y] = 0
                    nextBoard[x][y] = 0
                    // remove bullet if reaches the top 
                } else if (currentBoard[x][y] == 3) {
                    currentBoard[x][y] = 0
                    nextBoard[x][y - 2] = 3
                    // bullet moves up
                } else if (currentBoard[x][y] == 1 && currentBoard[x][y + 1] == 3 || currentBoard[x][y] == 1 && currentBoard[x][y + 2] == 3) {
                    currentBoard[x][y] = 0
                    nextBoard[x][y] = 0
                    // remove block if hit by bullet
                } else if (currentBoard[x][y] == 1) {
                    currentBoard[x][y] = 0
                    nextBoard[x][y + 1] = 1
                    // block falls down
                } else if (currentBoard[x][y] == 3 && neighbors > 2) {
                    currentBoard[x][y] = 3;
                    nextBoard[x][y] = 3;
                }
            }
        }
    }
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
    frameRate(slider.value())
}

function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseX < 0 || mouseY < 0) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);

    if (gameMode == 1) {
        let patternWidth = getPatternWidth(insertBoard)
        let patternHeight = insertBoard.length
        // console.log(patternWidth, patternHeight, x, y);
        if (defaultPattern == true) {
            currentBoard[x][y] = 1
        } else {
            for (i = 0; i < patternHeight; i++) {
                for (j = 0; j < patternWidth; j++) {
                    currentBoard[(x + j + columns) % columns][(y + i + rows) % rows] = insertBoard[i][j]
                }
            }
        }
    }
    fill(boxColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
    noLoop();
    mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
    loop();
}

// start
document.querySelector('.start-button')
    .addEventListener('click', function () {
        // frameRate(slider.value())
        loop()
    });
//    pause
document.querySelector('.pause-button')
    .addEventListener('click', function () {
        // frameRate(0)
        noLoop()
    });
// restart
document.querySelector('.restart-button')
    .addEventListener('click', function () {
        init();

    });

function spawnShip() {
    for (let j = 1; j < rows; j++) {
        currentBoard[(columns / 2) - (columns / 2) % 2][rows - 3] = 2
        currentBoard[(columns / 2) - (columns / 2) % 2 + 1][rows - 3] = 2
        currentBoard[(columns / 2) - (columns / 2) % 2 - 1][rows - 3] = 2
        currentBoard[(columns / 2) - (columns / 2) % 2][rows - 4] = 2

    }
}

function keyPressed() {
    if (key === 'w') {
        inputY = -1
        // console.log(`Y:${inputY}`);
    } else if (key === 's') {
        inputY = 1;
        // console.log(`Y:${inputY}`);
    } else if (key === 'a') {
        inputX = -1;
        // console.log(`X:${inputX}`);
    } else if (key === 'd') {
        inputX = 1;
        // console.log(`X:${inputX}`);
    } else if (key === ' ') {
        shoot = -3
    }
}

function keyReleased() {
    if (key === 'w') {
        inputY = 0
        // console.log(`Y:${inputY}`);
    } else if (key === 's') {
        inputY = 0
        // console.log(`Y:${inputY}`);
    } else if (key === 'a') {
        inputX = 0
        // console.log(`X:${inputX}`);
    } else if (key === 'd') {
        inputX = 0
        // console.log(`X:${inputX}`);
    } else if (key === ' ') {
        shoot = 0
    }
}

// changeColor
let colors = document.querySelector('.colors')
colors.addEventListener('change', function (event) {
    // console.log(event.currentTarget.value);
    let color = event.currentTarget.value
    if (color == 1) {
        // red
        boxColor = 'rgb(255,0,0)'
        rgb = false
    } else if (color == 2) {
        // yellow
        boxColor = 'rgb(255,255,0)'
        rgb = false
    }
    else if (color == 3) {
        // blue
        boxColor = 'rgb(0,0,255)'
        rgb = false
    } else if (color == 4) {
        //green
        boxColor = 'rgb(0,255,0)'
        rgb = false
    }
    else if (color == 5) {
        //rgb
        rgb = true
    } else if (color == 6) {
        // random
        boxColor = rgbColor
        rgb = false
    } else {
        boxColor = 150
        rgb = false
    }
})

// change GameMode
let gameModes = document.querySelector('.game-mode')
gameModes.addEventListener('change', function (event) {
    let mode = event.currentTarget.value
    if (mode == 1) {
        gameMode = 1
        init()
        stopbgm()
    } else if (mode == 2) {
        gameMode = 2
        init()
        spawnShip()
        playbgm()
    }
}
)

//change pattern
let patternSelection = document.querySelector('.pattern-selection')
patternSelection.addEventListener('change', function (event) {
    let patternVal = event.currentTarget.value
    if (patternVal == 1) {
        defaultPattern = false
        pattern2DArray = []
        insertBoard = []
        patternConversion(pattern1)
    } else if (patternVal == 2) {
        defaultPattern = false
        pattern2DArray = []
        insertBoard = []
        patternConversion(pattern2)
    } else if (patternVal == 3) {
        defaultPattern = false
        pattern2DArray = []
        insertBoard = []
        patternConversion(pattern3)
    } else if (patternVal == 4) {
        defaultPattern = false
        pattern2DArray = []
        insertBoard = []
        patternConversion(pattern4)
    } else if (patternVal == 5) {
        defaultPattern = false
        pattern2DArray = []
        insertBoard = []
        patternConversion(pattern5)
    } else if (patternVal == 6) {
        defaultPattern = false
        pattern2DArray = []
        insertBoard = []
        patternConversion(pattern6)
    } else {
        pattern2DArray = []
        insertBoard = []
        defaultPattern = true

    }
})

// PATTERN
let pattern1 =
    `000`
let pattern2 =
    `00
00`
let pattern3 =
    `000
000
000`

let pattern4 =
    `.O
..O
OOO`

let pattern5 =
    `........................O
......................O.O
............OO......OO............OO
...........O...O....OO............OO
OO........O.....O...OO
OO........O...O.OO....O.O
..........O.....O.......O
...........O...O
............OO`

let pattern6 = `.O.O
O
.O..O
...OOO`

let pattern7 = `..0.....0
...0...0
..0000000
.00.000.00
00000000000
0.0000000.0
0.0.....0.0
...00.00`

// v return usable pattern as insertBoard[]
function patternConversion(pattern) {
    let patternRowStringArray = pattern.split("\n")
    for (i in patternRowStringArray) {
        let patternRowArray = []
        for (j of patternRowStringArray[i]) {
            if (j == ".") {
                patternRowArray.push(0)
            } else {
                patternRowArray.push(1)
            }
        }
        pattern2DArray.push(patternRowArray)
    }
    insertPattern(pattern2DArray)
}

function insertPattern(patternArray) {
    let patternWidth = getPatternWidth(patternArray)
    let patternHeight = patternArray.length

    // console.log(patternHeight)
    for (i = 0; i < patternHeight; i++) {
        insertBoard[i] = []
        for (j = 0; j < patternWidth; j++) {
            if (patternArray[i][j]) {
                insertBoard[i][j] = patternArray[i][j]
            } else {
                insertBoard[i][j] = 0
            }
        }
    }
    console.log(insertBoard)
    return insertBoard
}

function getPatternWidth(patternArray) {
    let rowLengthArray = []
    for (row of patternArray) {
        rowLengthArray.push(row.length)
    }
    return Math.max(...rowLengthArray)
}

