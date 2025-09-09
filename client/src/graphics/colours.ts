export const VIEWPORT_CONFIG = {
    letterboxColour: "black"
} as const;

export const BACKGROUND_CONFIG = {
    backgroundColour: "moccasin",
} as const;

export const MODIFIER_COLOURS = {
    INVINCIBILITY: {
        fillColour: "#FFDF10",
        outlineColour: "goldenrod",
    },
    ICE_RINK: {
        fillColour: "mediumaquamarine",
        outlineColour: "lightseagreen",
    },
    SHRINK_HAZ: {
        fillColour: "coral",
        outlineColour: "indianred",
    },
    ENLARGE_HAZ: {
        fillColour: "orangered",
        outlineColour: "firebrick",
    },
    EXTRA_LIFE: {
        fillColour: "yellowgreen",
        outlineColour: "olive",
    }
} as const;

export const HAZARD_COLOURS = {
    fillColour: "#FF1E00",
    outlineColour: "#2B0000",
} as const;

export const PLAYER_COLOURS = {
    health3Colour: "yellowgreen",
    health2Colour: "olive",
    health1Colour: "saddlebrown",
    invincibilityColour: "#FFDF10",
    iceRinkColour: "mediumaquamarine",
    outlineColour: "#102000"
} as const;

export const COLLISION_COLOURS = {
    fillColour: "white",
    outlineColour: "black"
};

export const ENTITY_OUTLINE_WIDTH: number = 1;