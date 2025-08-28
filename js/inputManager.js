import { Artist } from "./graphicsUtil.js";
import { InputEventType } from "./config.js";
// manages keyboard input for the game
export class InputManager {
    constructor() {
        this.keyStates = {};
        this.keyStatesLastFrame = {};
    }
    // handles key down events
    onKeyDown(event) {
        this.keyStates[event.key] = true;
    }
    // handles key up events
    onKeyUp(event) {
        this.keyStates[event.key] = false;
    }
    // handle window resize events
    onResize(event) {
        Artist.ctx.canvas.width = window.innerWidth - 1;
        Artist.ctx.canvas.height = window.innerHeight - 1;
    }
    // checks if a key is currently pressed
    isKeyPressed(key) {
        return this.keyStates[key] === true;
    }
    // checks if a key was just released this frame
    isKeyJustReleased(key) {
        if (!this.keyStates[key] && this.keyStatesLastFrame[key])
            return true;
        else
            return false;
    }
    // clears the key state for a specific key
    clearKeyState(key) {
        this.keyStates[key] = false;
    }
    // updates the state of the input manager
    update() {
        for (const key in this.keyStates) {
            this.keyStatesLastFrame[key] = this.keyStates[key];
        }
    }
    // starts listening for events
    startListening() {
        // start keyboard listening
        window.addEventListener(InputEventType.KEYDOWN, this.onKeyDown.bind(this));
        window.addEventListener(InputEventType.KEYUP, this.onKeyUp.bind(this));
        // start listening for window resizes
        window.addEventListener(InputEventType.RESIZE, this.onResize.bind(this));
    }
}
