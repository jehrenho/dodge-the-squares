import { MODIFIER_TYPE, MOD_EFFECT_CONFIG } from "./config.js";
// defines the base class for all modifier effects
export class ModifierEffect {
    constructor(modifierType) {
        this.type = modifierType;
        this.framesRemaining = 0;
    }
    update() {
        this.framesRemaining--;
    }
    deactivate() {
        this.framesRemaining = 0;
    }
    isExpired() {
        return this.framesRemaining <= 0;
    }
}
// Invincibility effect class
export class InvincibilityEffect extends ModifierEffect {
    constructor() {
        super(MODIFIER_TYPE.INVINCIBILITY);
        this.resetEffectTimer();
    }
    resetEffectTimer() {
        this.framesRemaining = MOD_EFFECT_CONFIG.INVINCIBILITY.frames;
    }
}
// Ice Rink effect class
export class IceRinkEffect extends ModifierEffect {
    constructor() {
        super(MODIFIER_TYPE.ICE_RINK);
        this.resetEffectTimer();
    }
    resetEffectTimer() {
        this.framesRemaining = MOD_EFFECT_CONFIG.ICE_RINK.frames;
    }
}
