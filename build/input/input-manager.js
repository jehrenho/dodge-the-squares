import { InputEventType, KEYS } from './input-config.js';
// manages keyboard input for the game
export class InputManager {
    constructor(graphics) {
        this.keyStates = {};
        this.keyStatesLastFrame = {};
        this.graphics = graphics;
        for (const keyName of Object.values(KEYS)) {
            this.keyStates[keyName] = false;
            this.keyStatesLastFrame[keyName] = false;
        }
        window.addEventListener(InputEventType.KEYDOWN, this.onKeyDown.bind(this));
        window.addEventListener(InputEventType.KEYUP, this.onKeyUp.bind(this));
        window.addEventListener(InputEventType.RESIZE, this.onResize.bind(this));
    }
    update() {
        for (const key in this.keyStates) {
            this.keyStatesLastFrame[key] = this.keyStates[key];
        }
    }
    isEnterPressed() {
        return this.isKeyPressed(KEYS.ENTER);
    }
    isSpacePressed() {
        return this.isKeyPressed(KEYS.SPACE);
    }
    // ensures the space key is released before the next press is registered
    waitForSpaceToRise() {
        this.keyStates[KEYS.SPACE] = false;
    }
    // ensures the enter key is released before the next press is registered
    waitForEnterToRise() {
        this.keyStates[KEYS.ENTER] = false;
    }
    // returns a MovementInput interface for the player class
    getPlayerMovementInput() {
        return {
            up: this.isKeyPressed(KEYS.UP),
            down: this.isKeyPressed(KEYS.DOWN),
            left: this.isKeyPressed(KEYS.LEFT),
            right: this.isKeyPressed(KEYS.RIGHT)
        };
    }
    isKeyPressed(key) {
        return this.keyStates[key] === true;
    }
    // handles key down events
    onKeyDown(event) {
        if (!event.repeat) {
            this.keyStates[event.key] = true;
        }
    }
    // handles key up events
    onKeyUp(event) {
        this.keyStates[event.key] = false;
    }
    // handle window resize events
    onResize(event) {
        this.graphics.setCanvasDimensions(window.innerWidth - 1, window.innerHeight - 1);
    }
}
