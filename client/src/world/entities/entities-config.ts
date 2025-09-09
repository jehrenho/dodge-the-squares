export const PLAYER_CONFIG = {
    width: 30,
    height: 30,
    maxSpeed: 7.0,
    defaultAccel: 0.25,
    num_lives: 3,
};

export const HAZ_GEN_CONFIG = {
    w: 50,
    h: 50,
    speed: 4,
    density: 0.02,
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
        scaleFactor: 0.5
    },
    ENLARGE_HAZ: {
        scaleFactor: 2
    }
};

// effect wear off flash constants
export const EWOF_CONFIG = {
    numFramesPerFlash: 4,
    starts: [240, 180, 120, 60], // frame counts for when to start flashing at specific frequencies
    frequencies: [60, 30, 15, 8] // flash frames per flash
};

export const MOD_GEN_CONFIG = {
    [MODIFIER_TYPE.INVINCIBILITY]: {
        density: 0.00037,
        speed: 9,
        radius: 25,
        description: "Grants temporary invincibility"
    },
    [MODIFIER_TYPE.ICE_RINK]: {
        density: 0.0065,
        speed: 5,
        radius: 80,
        description: "Creates a slippery ice rink"
    },
    [MODIFIER_TYPE.SHRINK_HAZ]: {
        density: 0.002,
        speed: 6.0,
        radius: 30,
        description: "Shrinks hazards"
    },
    [MODIFIER_TYPE.ENLARGE_HAZ]: {
        density: 0.006,
        speed: 4,
        radius: 100,
        description: "Enlarges hazards"
    },
    [MODIFIER_TYPE.EXTRA_LIFE]: {
        density: 0.00037,
        speed: 10,
        radius: 20,
        description: "Grants an extra life"
    }
};

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

export type CollisionAction = typeof COLLISION_ACTION[keyof typeof COLLISION_ACTION];
export type CollisionRole = typeof COLLISION_ROLE[keyof typeof COLLISION_ROLE];


// --- Collision-Action Matrix ---

type CollisionMatrix = {
  [role in CollisionRole]: {
    [oldType in ModifierType]: {
      [newType in ModifierType]: CollisionAction
    }
  }
};

export const collisionMatrix: CollisionMatrix = {} as CollisionMatrix;

// initialize the collision action matrix with default values
for (const role of Object.values(COLLISION_ROLE)) {
  collisionMatrix[role] = {} as any;
  for (const oldType of Object.values(MODIFIER_TYPE)) {
    collisionMatrix[role][oldType] = {} as any;
    for (const newType of Object.values(MODIFIER_TYPE)) {
      collisionMatrix[role][oldType][newType] = COLLISION_ACTION.ERROR;
    }
  }
}

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