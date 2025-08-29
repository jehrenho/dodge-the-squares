import { GraphicsUtil } from "./graphicsUtil.js";
import { InputEventType, KEYS, Keys } from "./config.js";

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
        GraphicsUtil.ctx.canvas.width = window.innerWidth - 1;
        GraphicsUtil.ctx.canvas.height = window.innerHeight - 1;
    }

    // checks if a key is currently pressed
    isKeyPressed(key: Keys): boolean {
        return this.keyStates[key] === true;
    }

    // checks if the Enter key is currently pressed
    isEnterPressed(): boolean {
        return this.keyStates[KEYS.ENTER] === true;
    }

    // checks if the Space key is currently pressed
    isSpaceJustPressed(): boolean {
        return this.keyStates[KEYS.SPACE] === true && this.keyStatesLastFrame[KEYS.SPACE] === false;
    }

    // checks if a key was just released this frame
    isKeyJustReleased(key: Keys): boolean {
        if (!this.keyStates[key] && this.keyStatesLastFrame[key]) return true;
        else return false;
    }

    // clears the key state for a specific key
    clearKeyState(key: Keys): void {
        this.keyStates[key] = false;
    }

    // sets the space key state to false to wait for the key to be released
    waitForSpaceToRelease(): void {
        this.keyStates[KEYS.SPACE] = false;
    }

    // updates the last frame key states for key rising/falling detection
    update(): void {
        for (const key in this.keyStates) {
            this.keyStatesLastFrame[key] = this.keyStates[key];
        }
    }

    // initializes state and starts listening for events
    init(): void {
        // initialize key states
        for (const keyName of Object.values(KEYS)) {
            this.keyStates[keyName] = false;
            this.keyStatesLastFrame[keyName] = false;
        }

        // start keyboard listening
        window.addEventListener(InputEventType.KEYDOWN, this.onKeyDown.bind(this));
        window.addEventListener(InputEventType.KEYUP, this.onKeyUp.bind(this));
        // start listening for window resizes
        window.addEventListener(InputEventType.RESIZE, this.onResize.bind(this));
    }
}


