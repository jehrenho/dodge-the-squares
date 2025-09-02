// player movement input interface
export interface MovementInput {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
};

// input event types
export enum InputEventType {
    KEYDOWN = "keydown",
    KEYUP = "keyup",
    RESIZE = "resize"
};

// keyboard keys
export const KEYS = {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    ENTER: "Enter",
    SPACE: " "
} as const;

export type Keys = typeof KEYS[keyof typeof KEYS];