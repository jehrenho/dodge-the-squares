import { MODIFIER_TYPE, ModifierType, MOD_EFFECT_CONFIG } from "./config.js";

// defines the base class for all modifier effects
export abstract class ModifierEffect {
    type: ModifierType;
    framesRemaining: number;
    constructor(modifierType: ModifierType) {
        this.type = modifierType;
        this.framesRemaining = 0;
    }
    abstract resetEffectTimer(): void;
    update(): void {
        this.framesRemaining--;
    }
    deactivate(): void {
        this.framesRemaining = 0;
    }
    isExpired(): boolean {
        return this.framesRemaining <= 0;
    }
}

// Invincibility effect class
export class InvincibilityEffect extends ModifierEffect {
    constructor() {
        super(MODIFIER_TYPE.INVINCIBILITY);
        this.resetEffectTimer();
    }
    resetEffectTimer(): void {
        this.framesRemaining = MOD_EFFECT_CONFIG.INVINCIBILITY.frames;
    }
}

// Ice Rink effect class
export class IceRinkEffect extends ModifierEffect {
    constructor() {
        super(MODIFIER_TYPE.ICE_RINK);
        this.resetEffectTimer();
    }
    resetEffectTimer(): void {
        this.framesRemaining = MOD_EFFECT_CONFIG.ICE_RINK.frames;
    }
}