export const KEYDOWN: "keydown" = "keydown";
export const KEYUP: "keyup" = "keyup";
export enum KEYS {
    UP = "ArrowUp",
    DOWN = "ArrowDown",
    LEFT = "ArrowLeft",
    RIGHT = "ArrowRight"
};

// tracks which keys are being held down
export const keys: Record<string, boolean> = {};

// function to start listening to keyboard events
export function startKeyboardListening(): void {
    window.addEventListener(KEYDOWN, (e: KeyboardEvent) => {
        keys[e.key] = true;
    });

    window.addEventListener(KEYUP, (e: KeyboardEvent) => {
        keys[e.key] = false;
    });
}