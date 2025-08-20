import { canvas } from "./game.js";
import { InputEventType } from "./config.js";
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
    // handle window resize events
    onResize(event) {
        canvas.width = window.innerWidth - 1;
        canvas.height = window.innerHeight - 1;
    }
    // starts listening for events
    startListening() {
        // start keyboard listening
        window.addEventListener(InputEventType.KEYDOWN, this.onKeyDown.bind(this));
        window.addEventListener(InputEventType.KEYUP, this.onKeyUp.bind(this));
        // start listening for resizes
        window.addEventListener(InputEventType.RESIZE, this.onResize.bind(this));
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
