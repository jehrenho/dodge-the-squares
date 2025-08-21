// game phases
export const enum GamePhase { 
    MENU,
    INGAME,
    COLLISION_FLASH,
    GAMEOVER 
};

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
export enum InputEventType {
    KEYDOWN = "keydown",
    KEYUP = "keyup",
    RESIZE = "resize"
}

// keyboard keys
export enum Keys {
    UP = "ArrowUp",
    DOWN = "ArrowDown",
    LEFT = "ArrowLeft",
    RIGHT = "ArrowRight",
    ENTER = "Enter"
};

// player configuration constants
export const PLAYER_INITS = {
    x: 200,
    y: 160,
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
    num_lives: 3,
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

// modifier type constants
export const enum MODIFIER_TYPE {
    INVINCIBILITY = "INVINCIBILITY",
    ICE_RINK = "ICE_RINK",
    SHRINK_HAZ = "SHRINK_HAZ",
    ENLARGE_HAZ = "ENLARGE_HAZ",
    EXTRA_LIFE = "EXTRA_LIFE"
};

// modifier generation constants
export const MOD_GEN_INITS = {
    [MODIFIER_TYPE.INVINCIBILITY]: {
        density: 0.00037, // 0.0008 is a good start
        speed: 9,
        radius: 25,
        fillColour: "gold",
        outlineColour: "yellow",
        description: "Grants temporary invincibility"
    },
    [MODIFIER_TYPE.ICE_RINK]: {
        density: 0.0065,
        speed: 5,
        radius: 80,
        fillColour: "lightskyblue",
        outlineColour: "skyblue",
        description: "Creates a slippery ice rink"
    },
    [MODIFIER_TYPE.SHRINK_HAZ]: {
        density: 0.002,
        speed: 6.0,
        radius: 30,
        fillColour: "coral",
        outlineColour: "indianred",
        description: "Shrinks hazards"
    },
    [MODIFIER_TYPE.ENLARGE_HAZ]: {
        density: 0.006,
        speed: 4,
        radius: 100,
        fillColour: "darkred",
        outlineColour: "maroon",
        description: "Enlarges hazards"
    },
    [MODIFIER_TYPE.EXTRA_LIFE]: {
        density: 0.00037,
        speed: 10,
        radius: 20,
        fillColour: "lawngreen",
        outlineColour: "darkgreen",
        description: "Grants an extra life"
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