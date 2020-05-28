// Button class for the four Simon Buttons
class Button {
    constructor(querySelectedElement) {
        this.element = querySelectedElement;
        this.name = this.element.getAttribute("id");
        this.disabled = false;
    }

    flash() {
        if (!this.disabled) {
            this.element.classList.add(this.name + "-flash");
            setTimeout(() => this.element.classList.remove(this.name + "-flash"), 300);
            let audio = new Audio(document.querySelector("#clip-" + this.name).getAttribute("src"));
            audio.play();
        }
    }

    addEventListenerButton(arg1, callback) {
        this.element.addEventListener(arg1, callback);
    }

    toggleDisabled() {
        this.disabled = !this.disabled;
    }

}

// the Simon Game class
class Game {
    constructor(topleft, topright, bottomleft, bottomright, startbutton, powerbutton, strictbutton, leveldisplay, maxLevelDisplay) {
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
        this.maxLevelDisplay = maxLevelDisplay;

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

        //EventListeners
        this.topLeft.addEventListenerButton("click", () => {
            if (this.start && this.power && !this.topLeft.disabled) {
                this.playerSequence.push(this.topLeft);
                this.topLeft.flash();
                this.checkMove();
            }
        });
        this.topRight.addEventListenerButton("click", () => {
            if (this.start && this.power && !this.topRight.disabled) {
                this.playerSequence.push(this.topRight);
                this.topRight.flash();
                this.checkMove();
            }
        });
        this.bottomLeft.addEventListenerButton("click", () => {
            if (this.start && this.power && !this.bottomLeft.disabled) {
                this.playerSequence.push(this.bottomLeft);
                this.bottomLeft.flash();
                this.checkMove();
            }
        });
        this.bottomRight.addEventListenerButton("click", () => {
            if (this.start && this.power && !this.bottomRight.disabled) {
                this.playerSequence.push(this.bottomRight);
                this.bottomRight.flash();
                this.checkMove();
            }
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
        this.levelDisplay.textContent = "--";
        this.noErrorStreak = 0;
        this.currentLevel = 1;
        this.playerSequence = [];
        this.randomSequence = [];
        this.generateSequence();
    }

    // resetLevel function to reset current level only
    resetLevel() {
        this.noErrorStreak = 0;
        this.playerSequence = [];
    }

    // funciton to generate random sequence
    generateSequence() {
        for (let i = 0; i < 20; i++) {
            this.randomSequence.push(this.numberToButton[Math.floor(Math.random() * 4)]);
        }
    }

    // function to change max-level
    changeMaxLevel(newLevel) {
        if (newLevel <= 0 || this.start) {
            return false;
        } else {
            this.MAXLEVEL = newLevel;
            this.maxLevelDisplay.textContent = this.MAXLEVEL;
            return true;
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
                //go back to level 1 
                this.levelDisplay.textContent = "NO!";
                setTimeout(() => this.hardReset(), 800);
                setTimeout(() => this.computerPlayLevel(), 1000);
            } else {
                //restart current level 
                this.levelDisplay.textContent = "NO!";
                setTimeout(() => this.resetLevel(), 800);
                setTimeout(() => this.computerPlayLevel(), 1000);
            }
        } else {
            console.log("correct move");
            this.noErrorStreak++;
            if (this.noErrorStreak === this.currentLevel) {
                this.currentLevel++;

                if (!(this.currentLevel > this.MAXLEVEL)) {
                    //when no win i.e next level
                    this.playerSequence[this.playerSequence.length - 1].flash();
                    this.playerSequence = [];
                    this.noErrorStreak = 0;
                    setTimeout(() => this.computerPlayLevel(), 1000);
                } else {
                    // in case of win, beep and hard reset
                    this.levelDisplay.textContent = "WIN!";
                    this.beep();
                    this.start = false;
                    setTimeout(this.hardReset(), 1000);
                }
            }
        }

    }

    // computer play moves for this.currentLevel
    computerPlayLevel() {
        this.toggleDisableAllButtons();
        this.levelDisplay.textContent = this.currentLevel;
        for (let i = 0; i < this.currentLevel; i++) {
            setTimeout(() => this.randomSequence[i].flash(), i * 500);
        }
        this.toggleDisableAllButtons();
    }

    // function to toggleAttribute("disabled") for buttons
    toggleDisableAllButtons() {
        this.topLeft.toggleDisabled();
        this.topRight.toggleDisabled();
        this.bottomLeft.toggleDisabled();
        this.bottomRight.toggleDisabled();
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

let maxLevForm = document.querySelector("#set-max-level");
let maxLevelInput = document.querySelector("#max-level-input");
let currentMaxLevel = document.querySelector("#current-max-level");

let simonGame = new Game(topLeft, topRight, bottomLeft, bottomRight, startButton, powerToggler, strictModeToggler, gameDisplay, currentMaxLevel);

function changeMaxLevel() {
    if (!simonGame.changeMaxLevel(maxLevelInput.value)) {
        maxLevelInput.classList.add("error");
        setTimeout(() => {
            maxLevelInput.classList.remove("error");
        }, 600);
    } else {
        maxLevelInput.classList.add("success");
        setTimeout(() => {
            maxLevelInput.classList.remove("success");
        }, 600);
    }
}
maxLevForm.addEventListener("submit", (event) => {
    event.preventDefault();
    changeMaxLevel();
});
