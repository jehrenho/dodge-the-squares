// game phases
export const enum GamePhase { 
    MENU,
    INGAME,
    GAMEOVER 
};

// game configuration constants
export const GAME_CONFIG = {
    backgroundColour: "moccasin",
    letterboxColour: "black",
    fontColour: "black",
    menuFont: "25px Arial",
    statusBarFont: "25px Arial",
    pausedFontColour: "black",
    pausedFont: "25px Arial",
    VIRTUAL_WIDTH: 1912,
    VIRTUAL_HEIGHT: 954,
    collisionFlashFillColour: "white",
    collisionFlashBorderColour: "black",
    flashingFramesDuration: 20,
    framesPerFlash: 4,
    pauseTitle: "Game Paused",
    pauseMessage: "Press Space to Continue"
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
    ENTER = "Enter",
    SPACE = " "
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
    health3Colour: "yellowgreen",
    health2Colour: "olive",
    health1Colour: "saddlebrown",
    borderColour: "#102000",
    num_lives: 3,
};

// hazard generation constants
export const HAZ_GEN_INITS = {
    w: 50,
    h: 50,
    speed: 4,
    density: 0.02,
    fillColour: "#FF1E00",
    borderColour: "#2B0000",
    difficultyLogBase: 3,
    difficultyDensityFactor: 2.2,
    sizeModInitTransFrames: 60,
    sizeModDecayFrames: 900,
};

export const MODIFIER_TYPE = {
  INVINCIBILITY: "INVINCIBILITY",
  ICE_RINK: "ICE_RINK",
  SHRINK_HAZ: "SHRINK_HAZ",
  ENLARGE_HAZ: "ENLARGE_HAZ",
  EXTRA_LIFE: "EXTRA_LIFE"
} as const;

export const COLLISION_ACTION = {
  ACTIVATE: "ACTIVATE",
  DESTROY: "DESTROY",
  IGNORE: "IGNORE",
  REACTIVATE: "REACTIVATE",
  ERROR: "ERROR"
} as const;

export const COLLISION_ROLE = {
  NEW: "NEW",
  OLD: "OLD"
} as const;

// create Typescript union types of the properties in the above objects
export type ModifierType = typeof MODIFIER_TYPE[keyof typeof MODIFIER_TYPE];
export type CollisionAction = typeof COLLISION_ACTION[keyof typeof COLLISION_ACTION];
export type CollisionRole = typeof COLLISION_ROLE[keyof typeof COLLISION_ROLE];

// modifier generation constants
export const MOD_GEN_INITS = {
    [MODIFIER_TYPE.INVINCIBILITY]: {
        density: 0.00037, // 0.0008 is a good start
        speed: 9,
        radius: 25,
        fillColour: "#FFDF10",
        outlineColour: "goldenrod",
        description: "Grants temporary invincibility"
    },
    [MODIFIER_TYPE.ICE_RINK]: {
        density: 0.0065,
        speed: 5,
        radius: 80,
        fillColour: "mediumaquamarine",
        outlineColour: "lightseagreen",
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
        fillColour: "orangered",
        outlineColour: "firebrick",
        description: "Enlarges hazards"
    },
    [MODIFIER_TYPE.EXTRA_LIFE]: {
        density: 0.00037,
        speed: 10,
        radius: 20,
        fillColour: "yellowgreen",
        outlineColour: "olive",
        description: "Grants an extra life"
    }
};

// create the CollisionMatrix type with strongly typed keys
type CollisionMatrix = {
  [role in CollisionRole]: {
    [oldType in ModifierType]: {
      [newType in ModifierType]: CollisionAction
    }
  }
};

// declare the collision matrix object used to store action values
export const collisionMatrix: CollisionMatrix = {} as CollisionMatrix;

// initialize the collision matrix with default values
for (const role of Object.values(COLLISION_ROLE)) {
  collisionMatrix[role] = {} as any;

  for (const oldType of Object.values(MODIFIER_TYPE)) {
    collisionMatrix[role][oldType] = {} as any;

    for (const newType of Object.values(MODIFIER_TYPE)) {
      // Default rule = IGNORE
      collisionMatrix[role][oldType][newType] = COLLISION_ACTION.ERROR;
    }
  }
}

// --- Collision-Action Matrix Values ---

// What happens to new effects when invincibility is active
collisionMatrix[COLLISION_ROLE.NEW][MODIFIER_TYPE.INVINCIBILITY] = {
    [MODIFIER_TYPE.INVINCIBILITY]: COLLISION_ACTION.DESTROY, // reactivate the old invincibility
    [MODIFIER_TYPE.ICE_RINK]: COLLISION_ACTION.DESTROY,
    [MODIFIER_TYPE.SHRINK_HAZ]: COLLISION_ACTION.ACTIVATE,
    [MODIFIER_TYPE.ENLARGE_HAZ]: COLLISION_ACTION.DESTROY,
    [MODIFIER_TYPE.EXTRA_LIFE]: COLLISION_ACTION.ACTIVATE
};
// What happens to an active invincibility effect when new effects are applied
collisionMatrix[COLLISION_ROLE.OLD][MODIFIER_TYPE.INVINCIBILITY] = {
    [MODIFIER_TYPE.INVINCIBILITY]: COLLISION_ACTION.REACTIVATE, // destroy the new invincibility
    [MODIFIER_TYPE.ICE_RINK]: COLLISION_ACTION.IGNORE,
    [MODIFIER_TYPE.SHRINK_HAZ]: COLLISION_ACTION.IGNORE,
    [MODIFIER_TYPE.ENLARGE_HAZ]: COLLISION_ACTION.IGNORE,
    [MODIFIER_TYPE.EXTRA_LIFE]: COLLISION_ACTION.IGNORE
};
// What happens to new effects when ice rink is active
collisionMatrix[COLLISION_ROLE.NEW][MODIFIER_TYPE.ICE_RINK] = {
    [MODIFIER_TYPE.INVINCIBILITY]: COLLISION_ACTION.ACTIVATE,
    [MODIFIER_TYPE.ICE_RINK]: COLLISION_ACTION.DESTROY, // reactivate the old ice rink
    [MODIFIER_TYPE.SHRINK_HAZ]: COLLISION_ACTION.ACTIVATE,
    [MODIFIER_TYPE.ENLARGE_HAZ]: COLLISION_ACTION.ACTIVATE,
    [MODIFIER_TYPE.EXTRA_LIFE]: COLLISION_ACTION.ACTIVATE
};
// What happens to an active ice rink effect when new effects are applied
collisionMatrix[COLLISION_ROLE.OLD][MODIFIER_TYPE.ICE_RINK] = {
    [MODIFIER_TYPE.INVINCIBILITY]: COLLISION_ACTION.DESTROY,
    [MODIFIER_TYPE.ICE_RINK]: COLLISION_ACTION.REACTIVATE, // destroy the new ice rink
    [MODIFIER_TYPE.SHRINK_HAZ]: COLLISION_ACTION.IGNORE,
    [MODIFIER_TYPE.ENLARGE_HAZ]: COLLISION_ACTION.IGNORE,
    [MODIFIER_TYPE.EXTRA_LIFE]: COLLISION_ACTION.IGNORE
};



// modifier effect constants
export const MOD_EFFECT_CONFIG = {
    INVINCIBILITY: {
        colour: "#FFDF10",
        frames: 900
    },
    ICE_RINK: {
        colour: "mediumaquamarine",
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

// effect wear off flash constants
export const EWOF_CONFIG = {
    numFramesPerFlash: 4,
    starts: [240, 180, 120, 60], // frame counts for when to start flashing
    frequencies: [60, 30, 15, 8] 
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
    HTP3LivesText: "You have 3 lives - avoid hazards to keep them",
    HTPPauseText: "Press space to pause the game",
    HTPObjectiveText: "Survive as long as you can",
    HTPObjectiveFont: "bold 21px Arial",
    // modifier description font size and colour
    modExFont: "18px Arial",
    modExTextColour: "black",
    // start prompt font size, colour, and description
    startPrompt: "Press Enter to Start Game",
    startPromptFont: "20px Arial",
    startPromptTextColour: "black",
    titleTextColour: "black",
    titleFont: "bold 36px Arial",
    titleText: "Dodge the Squares",
    titleYScale: 0.1
};

export const GAME_OVER_CONFIG = {
    fontColour: "black",
    titleFont: "32px Arial",
    gameOverTitle: "Game Over",
    messagingFont: "26px Arial",
    gameOverMessage: "You Survived for: {time}s",
    promptFont: "20px Arial",
    gameOverPrompt: "Press Enter to continue"
};