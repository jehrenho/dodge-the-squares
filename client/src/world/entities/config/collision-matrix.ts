import { ModifierType, MODIFIER_TYPE } from './entities-config.js';

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