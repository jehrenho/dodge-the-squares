export const PLAYER_CONFIG = {
    width: 30,
    height: 30,
    maxSpeed: 7.0,
    defaultAccel: 0.25,
    num_lives: 3,
};

export const MODIFIER_TYPE = {
  INVINCIBILITY: "INVINCIBILITY",
  ICE_RINK: "ICE_RINK",
  SHRINK_HAZ: "SHRINK_HAZ",
  ENLARGE_HAZ: "ENLARGE_HAZ",
  EXTRA_LIFE: "EXTRA_LIFE"
} as const;

export type ModifierType = typeof MODIFIER_TYPE[keyof typeof MODIFIER_TYPE];

export const MOD_EFFECT_CONFIG = {
    INVINCIBILITY: {
        frames: 900
    },
    ICE_RINK: {
        frames: 900,
        accelFactor: 0.36
    },
    SHRINK_HAZ: {
        scaleFactor: 0.5,
        transitionFrames: 60,
        decayFrames: 900
    },
    ENLARGE_HAZ: {
        scaleFactor: 2,
        transitionFrames: 60,
        decayFrames: 900
    }
};

// effect wear off flash constants
export const EWOF_CONFIG = {
    numFramesPerFlash: 4,
    starts: [240, 180, 120, 60], // frame counts for when to start flashing at specific frequencies
    frequencies: [60, 30, 15, 8] // flash frames per flash
};