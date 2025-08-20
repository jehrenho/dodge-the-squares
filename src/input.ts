export const KEYDOWN: "keydown" = "keydown";
export const KEYUP: "keyup" = "keyup";
export enum KEYS {
    UP = "ArrowUp",
    DOWN = "ArrowDown",
    LEFT = "ArrowLeft",
    RIGHT = "ArrowRight"
};

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

    // starts listening for keyboard events
    startKeyboardListening(): void {
        window.addEventListener(KEYDOWN, this.onKeyDown.bind(this));
        window.addEventListener(KEYUP, this.onKeyUp.bind(this));
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


