// Button class for the four Simon Buttons
class Button {
    constructor(querySelectedElement) {
        this.element = querySelectedElement;
        this.name = this.element.getAttribute("id");
        this.element.addEventListener("click", this.flash);
    }

    flash() {
        this.element.classList.add(this.name + "-flash");
        setTimeout(() => this.element.classList.remove(this.name + "-flash"), 300);
        let audio = new Audio(document.querySelector("#clip-" + this.name).getAttribute("src"));
        audio.play();
    }

    addEventListenerButton(arg1, callback) {
        this.element.addEventListener(arg1, callback);
    }

    toggleDisabled() {
        this.element.toggleAttribute("disabled");
    }

}

// the Simon Game class
class Game {
    constructor(topleft, topright, bottomleft, bottomright, startbutton, powerbutton, strictbutton, leveldisplay) {
        this.strictButton = strictbutton;
        this.strictMode = false;

        this.powerButton = powerbutton;
        this.power = false;

        this.startButton = startbutton;
        this.start = false;

        this.levelDisplay = leveldisplay;
        this.currentLevel = 1;

        this.noErrorStreak = 0;

        this.randomSequence = [];
        this.playerSequence = [];
        this.MAXLEVEL = 20;
        //Game buttons
        this.topLeft = new Button(topleft);
        this.topRight = new Button(topright);
        this.bottomLeft = new Button(bottomleft);
        this.bottomRight = new Button(bottomright);
        this.numberToButton = {
            0: this.topLeft,
            1: this.topRight,
            2: this.bottomLeft,
            3: this.bottomRight
        };

        this.topLeft.addEventListenerButton("click", () => {
            this.playerSequence.push(this.topLeft);
            this.checkMove();
        });
        this.topRight.addEventListenerButton("click", () => {
            this.playerSequence.push(this.topRight);
            this.checkMove();
        });
        this.bottomLeft.addEventListenerButton("click", () => {
            this.playerSequence.push(this.bottomLeft);
            this.checkMove();
        });
        this.bottomRight.addEventListenerButton("click", () => {
            this.playerSequence.push(this.bottomRight);
            this.checkMove();
        });

        this.strictButton.addEventListener("click", () => this.strictMode = !this.strictMode);

        this.startButton.addEventListener("click", () => {
            this.start = true;
            this.runGame();
        });

        this.powerButton.addEventListener("click", () => {
            this.power = !this.power;
            if (this.power) {
                this.levelDisplay.textContent = "--";
                this.beep();
            } else {
                this.hardReset();
                this.levelDisplay.textContent = "";
            }
        });
    }

    //function to beep all four lights in row
    beep() {
        let myInterval = setInterval(() => {
            setTimeout(() => this.topLeft.flash(), 0);
            setTimeout(() => this.topRight.flash(), 100);
            setTimeout(() => this.bottomRight.flash(), 200);
            setTimeout(() => this.bottomLeft.flash(), 300);
        }, 400);
        setTimeout(() => {
            clearInterval(myInterval);
        }, 1200);
    }

    // hardReset function
    hardReset() {
        this.start = false;
        this.noErrorStreak = 0;
        this.levelDisplay.textContent = "";
        this.currentLevel = 1;
        this.randomSequence = [];
        this.playerSequence = [];
    }

    // resetLevel function
    resetLevel() {
        this.start = true;
        this.noErrorStreak = 0;
        this.playerSequence = [];
        this.levelDisplay.textContent = this.currentLevel;
    }

    // random sequence generator funciton
    generateSequence() {
        for (let i = 0; i < 20; i++) {
            this.randomSequence.push(this.numberToButton[Math.floor(Math.random() * 4)]);
        }
    }

    // funciton to check player moves and depending upon strictMode is true or false, hard reset the game or just reset the level and continue from there
    checkMove() {
        console.log(this.randomSequence);
        console.log(this.playerSequence);
        if (this.playerSequence[this.playerSequence.length - 1] !== this.randomSequence[this.playerSequence.length - 1]) {
            // when there is error
            console.log("wrong move");
            if (this.strictMode) {
                //go back to level 1 (hard reset maybe)
                this.levelDisplay.textContent = "NO!";
                setTimeout(() => this.hardReset(), 1000);
                this.computerPlayLevel();
            } else {
                //restart current level (soft resset maybe)
                this.levelDisplay.textContent = "NO!";
                setTimeout(() => this.resetLevel(), 1000);
                this.computerPlayLevel();
            }
        } else {
            console.log("correct move");
            this.noErrorStreak++;
            if (this.noErrorStreak === this.currentLevel) {
                this.currentLevel++;

                if (!this.checkWin()) { //when no win i.e next level
                    this.levelDisplay.textContent = this.currentLevel;
                    this.playerSequence = [];
                    this.noErrorStreak = 0;
                    this.computerPlayLevel();
                } else { // in case of win, beep and exit
                    this.levelDisplay.textContent = "WIN!";
                    this.beep();
                    this.hardReset();
                }
            }
        }
    }

    // computer play moves with level = this.currentLevel
    computerPlayLevel() {
        //plays moves depending upon the level number entered as arguement
        this.toggleDisableAllButtons();
        this.levelDisplay.textContent = this.currentLevel;
        for (var i = 0; i < this.currentLevel; i++) {
            console.log("i = " + i);
            setTimeout(() => this.randomSequence[i].flash(), i * 500);
        }
        this.toggleDisableAllButtons();
    }

    // win checker fucntion 
    checkWin() { //returns boolean depending upon win or not
        // win decidede by this.currentLevel > this.MAXLEVEL or not
        if (this.currentLevel > this.MAXLEVEL) {
            return true;
        } else {
            return false;
        }
    }

    // function to toggleAttribute("disabled") for buttons
    toggleDisableAllButtons() {
        // makes all buttons disabled (or unclickable) when computer is playing moves
        this.topLeft.toggleDisabled("disabled");
        this.topRight.toggleDisabled("disabled");
        this.bottomLeft.toggleDisabled("disabled");
        this.bottomRight.toggleDisabled("disabled");
    }

    //runGame function
    runGame() {
        if (this.power && this.start) {
            this.hardReset();
            this.generateSequence();
            this.computerPlayLevel();
        }
    }
}

//store all buttons on document in variables and initialize new Simon Game!
let topLeft = document.querySelector("#topleft");
let topRight = document.querySelector("#topright");
let bottomLeft = document.querySelector("#bottomleft");
let bottomRight = document.querySelector("#bottomright");

let startButton = document.querySelector("#start");
let strictModeToggler = document.querySelector("#strict");
let powerToggler = document.querySelector("#power");
let gameDisplay = document.querySelector("#level");

let simonGame = new Game(topLeft, topRight, bottomLeft, bottomRight, startButton, powerToggler, strictModeToggler, gameDisplay);


// PSEUDOCODE // Ignore //
/*
hard reset everything
if start is clicked then
check if power is on. if it is on then 
generate random sequence
currentLevel = 1 
humanInteraction = false
start game with level one
    computerPLayMoves()
    humanInteraction = true
    as the user clicks buttons, check for moves
        if noErrorStreak = currentLevel
            currentLevel++
            check for win
            noErrorStreak = 0
            playerMoves = []
            start game with new currentLevel 
        else reset game acc to strict mode
*/
// PSEUDOCODE // Ignore //