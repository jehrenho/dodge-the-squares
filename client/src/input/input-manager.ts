import { MovementInput, InputEventType, KEYS, Keys } from './input-config.js';

// manages keyboard input for the game
export class InputManager {
    private keyStates: Record<string, boolean> = {};
    private keyStatesLastFrame: Record<string, boolean> = {};
    private windowResize: boolean;

    constructor() {
        for (const keyName of Object.values(KEYS)) {
            this.keyStates[keyName] = false;
            this.keyStatesLastFrame[keyName] = false;
        }
        this.windowResize = true;
        window.addEventListener(InputEventType.KEYDOWN, this.onKeyDown.bind(this));
        window.addEventListener(InputEventType.KEYUP, this.onKeyUp.bind(this));
        window.addEventListener(InputEventType.RESIZE, this.onResize.bind(this));
    }

    update(): void {
        for (const key in this.keyStates) {
            this.keyStatesLastFrame[key] = this.keyStates[key];
        }
    }

    isEnterPressed(): boolean {
        return this.isKeyPressed(KEYS.ENTER);
    }

    isSpacePressed(): boolean {
        return this.isKeyPressed(KEYS.SPACE);
    }

    // signals the graphics module to adjust the canvas size because the window size changed
    isWindowResized(): boolean {
        if (this.windowResize) {
            this.windowResize = false;
            return true;
        }
        return false;
    }

    // ensures the space key is released before the next press is registered
    waitForSpaceToRise(): void {
        this.keyStates[KEYS.SPACE] = false;
    }

    // ensures the enter key is released before the next press is registered
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

    private isKeyPressed(key: Keys): boolean {
        return this.keyStates[key] === true;
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
        this.windowResize = true;
    }
}


