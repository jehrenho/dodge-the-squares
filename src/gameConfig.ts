export const enum GameState { 
    MENU,
    INGAME,
    GAMEOVER 
};

// player configuration constants
export const PLAYER_INITS = {
    x: 50,
    y: 50,
    w: 30,
    h: 30,
    xspeed: 0,
    yspeed: 0,
    maxSpeed: 7.0,
    Accel: 0.25,
    colour: "green"
};

// modifier type constants
export const enum MODIFIER_TYPE {
    INVINCIBILITY,
    ICE_RINK
};

// hazard generation constants
export const HAZ_GEN_INITS = {
    w: 50,
    h: 50,
    speed: 4,
    density: 0.02,
    colour: "red",
    difficultyLogBase: 3
};

// modifier generation constants
export const MOD_GEN_INITS = {
    INVINCIBILITY: {
        density: 0.004, // 0.0008 is a good start
        speed: 9,
        radius: 25,
        colour: "gold"
    },
    ICE_RINK: {
        density: 0.01,
        speed: 4,
        radius: 60,
        colour: "skyblue"
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
    }
};