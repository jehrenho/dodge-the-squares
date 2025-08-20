import { canvas } from "./game.js";
import { InputEventType, Keys } from "./config.js";

// manages keyboard input for the game
export class InputManager {
    keys: Record<string, boolean> = {};
    isEnterPressedYet: boolean = false;

    // handles key down events
    onKeyDown(event: KeyboardEvent): void {
        this.keys[event.key] = true;
    }

    // handles key up events
    onKeyUp(event: KeyboardEvent): void {
        this.keys[event.key] = false;
    }

    // handle window resize events
    onResize(event: Event): void {
        canvas.width = window.innerWidth - 1;
        canvas.height = window.innerHeight - 1;
    }

    // starts listening for events
    startListening(): void {
        // start keyboard listening
        window.addEventListener(InputEventType.KEYDOWN, this.onKeyDown.bind(this));
        window.addEventListener(InputEventType.KEYUP, this.onKeyUp.bind(this));
        // start listening for resizes
        window.addEventListener(InputEventType.RESIZE, this.onResize.bind(this));
    }

    // checks if the Enter key has been pressed and released
    isEnterPressedAndReleased(): boolean {
        // enter hasn't been pressed yet
        if (!this.keys["Enter"] && !this.isEnterPressedYet) {
            return false;
        }
        // enter has just been pressed
        else if (this.keys["Enter"] && !this.isEnterPressedYet){
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


