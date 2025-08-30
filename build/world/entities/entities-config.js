// player configuration constants
export const PLAYER_INITS = {
    x: 200,
    y: 160,
    width: 30,
    height: 30,
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
// modifier type constants
export const MODIFIER_TYPE = {
    INVINCIBILITY: "INVINCIBILITY",
    ICE_RINK: "ICE_RINK",
    SHRINK_HAZ: "SHRINK_HAZ",
    ENLARGE_HAZ: "ENLARGE_HAZ",
    EXTRA_LIFE: "EXTRA_LIFE"
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
// modifier effect constants
export const MOD_EFFECT_CONFIG = {
    INVINCIBILITY: {
        colour: "#FFDF10",
        frames: 900
    },
    ICE_RINK: {
        colour: "mediumaquamarine",
        frames: 900,
        accelFactor: 0.36
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
export const COLLISION_ACTION = {
    ACTIVATE: "ACTIVATE",
    DESTROY: "DESTROY",
    IGNORE: "IGNORE",
    REACTIVATE: "REACTIVATE",
    ERROR: "ERROR"
};
export const COLLISION_ROLE = {
    NEW: "NEW",
    OLD: "OLD"
};
// declare the collision matrix object used to store action values
export const collisionMatrix = {};
// initialize the collision matrix with default values
for (const role of Object.values(COLLISION_ROLE)) {
    collisionMatrix[role] = {};
    for (const oldType of Object.values(MODIFIER_TYPE)) {
        collisionMatrix[role][oldType] = {};
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
