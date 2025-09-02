import { Graphics } from "../graphics/graphics.js";
import { MovementInput, InputEventType, KEYS, Keys } from './input-config.js';

// manages keyboard input for the game
export class InputManager {
    private keyStates: Record<string, boolean> = {};
    private keyStatesLastFrame: Record<string, boolean> = {};
    private graphics: Graphics;

    constructor(graphics: Graphics) {
        this.graphics = graphics;
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

    // handles key down events
    private onKeyDown(event: KeyboardEvent): void {
        if (!event.repeat) {
            this.keyStates[event.key] = true;
        }
    }

    // handles key up events
    private onKeyUp(event: KeyboardEvent): void {
        this.keyStates[event.key] = false;
    }

    // handle window resize events
    private onResize(event: Event): void {
        this.graphics.setCanvasDimensions(window.innerWidth - 1, window.innerHeight - 1);
    }

    // checks if a key is currently pressed
    isKeyPressed(key: Keys): boolean {
        return this.keyStates[key] === true;
    }

    // checks if the Enter key is currently pressed
    isEnterPressed(): boolean {
        return this.isKeyPressed(KEYS.ENTER);
    }

    // checks if the Space key is currently pressed
    isSpacePressed(): boolean {
        return this.isKeyPressed(KEYS.SPACE);
    }

    // sets the space key state to false to wait for the key to be released
    waitForSpaceToRise(): void {
        this.keyStates[KEYS.SPACE] = false;
    }

    waitForEnterToRise(): void {
        this.keyStates[KEYS.ENTER] = false;
    }

    // returns a MovementInput interface for the player class
    getPlayerMovementInput(): MovementInput {
        return {
            up: this.isKeyPressed(KEYS.UP),
            down: this.isKeyPressed(KEYS.DOWN),
            left: this.isKeyPressed(KEYS.LEFT),
            right: this.isKeyPressed(KEYS.RIGHT)
        };
    }

    // updates the last frame key states for key rising/falling detection
    update(): void {
        for (const key in this.keyStates) {
            this.keyStatesLastFrame[key] = this.keyStates[key];
        }
    }
}


