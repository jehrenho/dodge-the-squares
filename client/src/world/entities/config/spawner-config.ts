import { MODIFIER_TYPE } from './entities-config.js';

export const SPAWNER_TYPE = {
    HAZARD: "HAZARD",
    ...MODIFIER_TYPE
} as const;

export type SpawnerType = typeof SPAWNER_TYPE[keyof typeof SPAWNER_TYPE];

export interface SpawnerInfo {
    initDensity: number;
    initAvgSpeed: number;
    avgSize: number;
    speedVariance: number;
    sizeVariance: number;
    description: string;
}

type SpawnerConfig = {
    [type in SpawnerType]: SpawnerInfo
};

export const SPAWNER_CONFIG: SpawnerConfig = {
    HAZARD: {
        initDensity: 0.02,
        initAvgSpeed: 4,
        avgSize: 60,
        speedVariance: 1.2,
        sizeVariance: 1.9,
        description: "Avoid the hazards"
    },
    INVINCIBILITY: {
        initDensity: 0.00037,
        initAvgSpeed: 9,
        avgSize: 25,
        speedVariance: 1.18,
        sizeVariance: 1,
        description: "Grants temporary invincibility"
    },
    ICE_RINK: {
        initDensity: 0.0065,
        initAvgSpeed: 3.5,
        avgSize: 80,
        speedVariance: 1.8,
        sizeVariance: 1.3,
        description: "Creates a slippery ice rink"
    },
    SHRINK_HAZ: {
        initDensity: 0.0022,
        initAvgSpeed: 6,
        avgSize: 30,
        speedVariance: 1.2,
        sizeVariance: 1.2,
        description: "Shrinks hazards"
    },
    ENLARGE_HAZ: {
        initDensity: 0.004,
        initAvgSpeed: 4,
        avgSize: 100,
        speedVariance: 1.18,
        sizeVariance: 1.7,
        description: "Enlarges hazards"
    },
    EXTRA_LIFE: {
        initDensity: 0.00037,
        initAvgSpeed: 10,
        avgSize: 20,
        speedVariance: 1,
        sizeVariance: 1,
        description: "Grants an extra life"
    }
};

export interface Spawn {
    x: number;
    y: number;
    xSpeed: number;
    baseSize: number;
};

export const DIFFICULTY_CONFIG = {
    logBase: 3,
    densityFactor: 2.2,
};