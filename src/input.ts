import { canvas } from "./game.js";
import { InputEventType, Keys } from "./config.js";

// manages keyboard input for the game
export class InputManager {
    keyStates: Record<string, boolean> = {};
    keyStatesLastFrame: Record<string, boolean> = {};

    // handles key down events
    onKeyDown(event: KeyboardEvent): void {
        this.keyStates[event.key] = true;
    }

    // handles key up events
    onKeyUp(event: KeyboardEvent): void {
        this.keyStates[event.key] = false;
    }

    // handle window resize events
    onResize(event: Event): void {
        canvas.width = window.innerWidth - 1;
        canvas.height = window.innerHeight - 1;
    }

    // checks if a key is currently pressed
    isKeyPressed(key: Keys): boolean {
        return this.keyStates[key] === true;
    }

    // checks if a key was just released this frame
    isKeyJustReleased(key: Keys): boolean {
        if (!this.keyStates[key] && this.keyStatesLastFrame[key]) return true;
        else return false;
    }

    // updates the state of the input manager
    update(): void {
        for (const key in this.keyStates) {
            this.keyStatesLastFrame[key] = this.keyStates[key];
        }
    }

    // starts listening for events
    startListening(): void {
        // start keyboard listening
        window.addEventListener(InputEventType.KEYDOWN, this.onKeyDown.bind(this));
        window.addEventListener(InputEventType.KEYUP, this.onKeyUp.bind(this));
        // start listening for window resizes
        window.addEventListener(InputEventType.RESIZE, this.onResize.bind(this));
    }
}


