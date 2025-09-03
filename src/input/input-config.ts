export interface MovementInput {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
};

export enum InputEventType {
    KEYDOWN = "keydown",
    KEYUP = "keyup",
    RESIZE = "resize"
};

export const KEYS = {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    ENTER: "Enter",
    SPACE: " "
} as const;

export type Keys = typeof KEYS[keyof typeof KEYS];