export const KEYDOWN = "keydown";
export const KEYUP = "keyup";
export var KEYS;
(function (KEYS) {
    KEYS["UP"] = "ArrowUp";
    KEYS["DOWN"] = "ArrowDown";
    KEYS["LEFT"] = "ArrowLeft";
    KEYS["RIGHT"] = "ArrowRight";
})(KEYS || (KEYS = {}));
;
// manages keyboard input for the game
export class InputManager {
    constructor() {
        this.keys = {};
        this.isEnterPressedYet = false;
    }
    // handles key down events
    onKeyDown(event) {
        this.keys[event.key] = true;
    }
    // handles key up events
    onKeyUp(event) {
        this.keys[event.key] = false;
    }
    // starts listening for keyboard events
    startKeyboardListening() {
        window.addEventListener(KEYDOWN, this.onKeyDown.bind(this));
        window.addEventListener(KEYUP, this.onKeyUp.bind(this));
    }
    // checks if the Enter key has been pressed and released
    isEnterPressedAndReleased() {
        // enter hasn't been pressed yet
        if (!this.keys["Enter"] && !this.isEnterPressedYet) {
            return false;
        }
        // enter has just been pressed
        else if (this.keys["Enter"] && !this.isEnterPressedYet) {
            this.isEnterPressedYet = true;
            return false;
        }
        // enter is being held down
        else if (this.keys["Enter"] && this.isEnterPressedYet) {
            return false;
        }
        else {
            // !this.keys["Enter"] && this.isEnterPressed
            // enter has been pressed and released
            // reset state
            this.isEnterPressedYet = false;
            return true;
        }
    }
}
