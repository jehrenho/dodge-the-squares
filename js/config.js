;
// game configuration constants
export const GAME_CONFIG = {
    backgroundColour: "lightgreen",
    fontColour: "black",
    gameOverFontColour: "darkred",
    menuFont: "25px Arial",
    statusBarFont: "25px Arial",
    VIRTUAL_WIDTH: 1912,
    VIRTUAL_HEIGHT: 954,
    collisionFlashColour: "white",
    flashingFramesDuration: 30,
    framesPerFlash: 4
};
// input event types
export var InputEventType;
(function (InputEventType) {
    InputEventType["KEYDOWN"] = "keydown";
    InputEventType["KEYUP"] = "keyup";
    InputEventType["RESIZE"] = "resize";
})(InputEventType || (InputEventType = {}));
// keyboard keys
export var Keys;
(function (Keys) {
    Keys["UP"] = "ArrowUp";
    Keys["DOWN"] = "ArrowDown";
    Keys["LEFT"] = "ArrowLeft";
    Keys["RIGHT"] = "ArrowRight";
    Keys["ENTER"] = "Enter";
})(Keys || (Keys = {}));
;
// player configuration constants
export const PLAYER_INITS = {
    x: 50,
    y: 50,
    w: 30,
    h: 30,
    xspeed: 0,
    yspeed: 0,
    maxSpeed: 7.0,
    accel: 0.25,
    health3Colour: "green",
    health2Colour: "olive",
    health1Colour: "saddlebrown",
    borderColour: "black",
    num_lives: 3
};
// hazard generation constants
export const HAZ_GEN_INITS = {
    w: 50,
    h: 50,
    speed: 4,
    density: 0.02,
    colour: "red",
    borderColour: "darkred",
    difficultyLogBase: 3,
    sizeModInitTransFrames: 60,
    sizeModDecayFrames: 900,
};
;
// modifier generation constants
export const MOD_GEN_INITS = {
    INVINCIBILITY: {
        density: 0.00037, // 0.0008 is a good start
        speed: 9,
        radius: 25,
        fillColour: "gold",
        outlineColour: "yellow"
    },
    ICE_RINK: {
        density: 0.0065,
        speed: 5,
        radius: 80,
        fillColour: "lightskyblue",
        outlineColour: "skyblue"
    },
    SHRINK_HAZ: {
        density: 0.002,
        speed: 6.0,
        radius: 30,
        fillColour: "coral",
        outlineColour: "indianred"
    },
    ENLARGE_HAZ: {
        density: 0.006,
        speed: 4,
        radius: 100,
        fillColour: "darkred",
        outlineColour: "maroon"
    },
    EXTRA_LIFE: {
        density: 0.00037,
        speed: 10,
        radius: 20,
        fillColour: "lawngreen",
        outlineColour: "darkgreen"
    }
};
// modifier effect constants
export const MOD_EFFECT_CONFIG = {
    INVINCIBILITY: {
        colour: "gold",
        frames: 900
    },
    ICE_RINK: {
        colour: "skyblue",
        frames: 900,
        accel: 0.09
    },
    SHRINK_HAZ: {
        scaleFactor: 0.5
    },
    ENLARGE_HAZ: {
        scaleFactor: 2
    }
};
