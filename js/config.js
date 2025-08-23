;
// game configuration constants
export const GAME_CONFIG = {
    backgroundColour: "lightgreen",
    fontColour: "black",
    gameOverFontColour: "darkred",
    menuFont: "25px Arial",
    statusBarFont: "25px Arial",
    pausedFontColour: "black",
    pausedFont: "25px Arial",
    VIRTUAL_WIDTH: 1912,
    VIRTUAL_HEIGHT: 954,
    collisionFlashFillColour: "white",
    collisionFlashBorderColour: "black",
    flashingFramesDuration: 30,
    framesPerFlash: 4,
    pauseTitle: "Game Paused",
    pauseMessage: "Press Space to Continue"
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
    Keys["SPACE"] = " ";
})(Keys || (Keys = {}));
;
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
    fillColour: "red",
    borderColour: "darkred",
    difficultyLogBase: 3,
    sizeModInitTransFrames: 60,
    sizeModDecayFrames: 900,
};
;
// modifier generation constants
export const MOD_GEN_INITS = {
    ["INVINCIBILITY" /* MODIFIER_TYPE.INVINCIBILITY */]: {
        density: 0.00037, // 0.0008 is a good start
        speed: 9,
        radius: 25,
        fillColour: "gold",
        outlineColour: "yellow",
        description: "Grants temporary invincibility"
    },
    ["ICE_RINK" /* MODIFIER_TYPE.ICE_RINK */]: {
        density: 0.0065,
        speed: 5,
        radius: 80,
        fillColour: "lightskyblue",
        outlineColour: "skyblue",
        description: "Creates a slippery ice rink"
    },
    ["SHRINK_HAZ" /* MODIFIER_TYPE.SHRINK_HAZ */]: {
        density: 0.002,
        speed: 6.0,
        radius: 30,
        fillColour: "coral",
        outlineColour: "indianred",
        description: "Shrinks hazards"
    },
    ["ENLARGE_HAZ" /* MODIFIER_TYPE.ENLARGE_HAZ */]: {
        density: 0.006,
        speed: 4,
        radius: 100,
        fillColour: "darkred",
        outlineColour: "maroon",
        description: "Enlarges hazards"
    },
    ["EXTRA_LIFE" /* MODIFIER_TYPE.EXTRA_LIFE */]: {
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
// menu constants
export const MENU_CONFIG = {
    // How to Play constants
    HTPHorCentreFactor: 0.22, // aligns the how to play section horizontally
    HTPVerSizeFactor: 0.7, // sets the vertical size for the how to play section
    HTPPlayerDiscYOffset: 25, // set how far apart the player and player description is
    HTPHazardDiscYOffset: 30, // set how far apart the hazard and hazard description is
    numHTPInstructions: 6, // sets the how to play instruction spacing
    // modifier explanation constants
    modExHorCentreFactor: 0.74, // aligns the modifier explanation section horizontally
    modExVertSizeFactor: 0.7, // sets the vertical size for the modifier explanation section
    modExDescriptionXOffset: 140, // sets the horizontal offset for the modifier description text
    // How to Play font size, colour, and descriptions
    HTPTitle: "How to Play",
    HTPTitleFont: "bold 26px Arial",
    HTPTextFont: "18px Arial",
    HTPTextColour: "black",
    HTPPlayerText: "Move your green player square with the arrow keys",
    HTPHazardText: "Avoid the red hazard squares",
    HTP3LivesText: "You have 3 lives. Avoid hazards to keep them",
    HTPPauseText: "Press space to Pause",
    HTPObjectiveText: "SURVIVE AS LONG AS YOU CAN",
    HTPObjectiveFont: "20px Arial",
    // modifier description font size and colour
    modExFont: "18px Arial",
    modExTextColour: "black",
    // start prompt font size, colour, and description
    startPrompt: "Press Enter to Start Game",
    startPromptFont: "bold 20px Arial",
    startPromptTextColour: "black"
};
