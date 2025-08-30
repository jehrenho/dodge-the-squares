import { GraphicsUtil } from "../graphics/graphicsUtil.js";
import { InputEventType, KEYS, Keys } from "../game/game-config.js";
import { MovementInput } from './input-config.js';

// manages keyboard input for the game
export class InputManager {
    keyStates: Record<string, boolean> = {};
    keyStatesLastFrame: Record<string, boolean> = {};

    // handles key down events
    onKeyDown(event: KeyboardEvent): void {
        if (!event.repeat) {
            this.keyStates[event.key] = true;
        }
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


