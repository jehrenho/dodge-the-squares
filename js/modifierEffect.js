import { MODIFIER_TYPE, MOD_EFFECT_CONFIG, EWOF_CONFIG } from "./config.js";
// defines the base class for all modifier effects
export class ModifierEffect {
    constructor(modifierType) {
        this.type = modifierType;
        this.framesRemaining = 0;
        this.resetWearOffFlash();
    }
    // decrements the frames remaining for the effect
    update() {
        this.framesRemaining--;
    }
    // returns the number of frames remaining for the effect
    getFramesRemaining() {
        return this.framesRemaining;
    }
    // returns true is the player colour should be flashing (because it is wearing off) given the frames remaining
    isWearOffFlashing() {
        if (this.framesRemaining >= this.WOflashMaxFrames) {
            // the effect is not flashing yet
            return false;
        }
        else if (this.framesRemaining < this.WOflashMinFrames) {
            // a single flash just ended, update the flash max/min window for the next flash
            this.WOindex2++;
            this.updateWearOffFlash();
            return false;
        }
        else {
            // the effect is currently flashing
            return true;
        }
    }
    // updates the frame window max/min for the wear off flash effect based on the frames remaining on the effect
    updateWearOffFlash() {
        // sets the flash window max/min
        this.WOflashMaxFrames = EWOF_CONFIG.starts[this.WOindex1] - this.WOindex2 * EWOF_CONFIG.frequencies[this.WOindex1];
        this.WOflashMinFrames = this.WOflashMaxFrames - EWOF_CONFIG.numFramesPerFlash;
        if (this.WOflashMinFrames <= EWOF_CONFIG.starts[this.WOindex1 + 1]) {
            // increases the flashing frequency
            this.WOindex1++;
            this.WOindex2 = 0;
            this.updateWearOffFlash();
        }
    }
    // deactivates the effect immediately
    deactivate() {
        this.framesRemaining = 0;
    }
    // checks if the effect is expired
    isExpired() {
        return this.framesRemaining <= 0;
    }
    // resets the wear off flashing state
    resetWearOffFlash() {
        this.WOindex1 = 0;
        this.WOindex2 = 0;
        this.updateWearOffFlash();
    }
}
// Invincibility effect class
export class InvincibilityEffect extends ModifierEffect {
    constructor() {
        super(MODIFIER_TYPE.INVINCIBILITY);
        this.reset();
    }
    reset() {
        this.framesRemaining = MOD_EFFECT_CONFIG.INVINCIBILITY.frames;
        this.resetWearOffFlash();
    }
}
// Ice Rink effect class
export class IceRinkEffect extends ModifierEffect {
    constructor() {
        super(MODIFIER_TYPE.ICE_RINK);
        this.reset();
    }
    reset() {
        this.framesRemaining = MOD_EFFECT_CONFIG.ICE_RINK.frames;
        this.resetWearOffFlash();
    }
}
