import { MODIFIER_TYPE, ModifierType } from '../entities/config/entities-config.js';
import { MOD_EFFECT_CONFIG, EWOF_CONFIG } from '../entities/config/entities-config.js';

// defines the base class for all effects
export abstract class Effect {
    protected framesRemaining: number;
    private type: ModifierType;
    private WOindex1!: number;
    private WOindex2!: number;
    private WOflashMaxFrames!: number;
    private WOflashMinFrames!: number;

    constructor(modifierType: ModifierType) {
        this.type = modifierType;
        this.framesRemaining = 0;
        this.resetWearOffFlash();
    }
    
    abstract reset(): void;

    // returns true is the player colour should be the flash colour because it is wearing off
    isWearOffFlashing(): boolean {
        if (this.framesRemaining >= this.WOflashMaxFrames) {
            // the effect is not flashing yet
            return false;
        } else if (this.framesRemaining < this.WOflashMinFrames) {
            // a single flash just ended, update the flash max/min window for the next flash
            this.WOindex2++;
            this.updateWearOffFlash();
            return false;
        } else {
            // the effect is currently flashing
            return true;
        }
    }

    // updates the frame window max/min for the wear off flash effect
    updateWearOffFlash(): void {
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

    update(): void {
        this.framesRemaining--;
    }

    getFramesRemaining(): number {
        return this.framesRemaining;
    }

    getType(): ModifierType {
        return this.type;
    }

    deactivate(): void {
        this.framesRemaining = 0;
    }

    isExpired(): boolean {
        return this.framesRemaining <= 0;
    }

    resetWearOffFlash(): void {
        this.WOindex1 = 0;
        this.WOindex2 = 0;
        this.updateWearOffFlash();
    }
}

// Invincibility effect class
export class InvincibilityEffect extends Effect {
    constructor() {
        super(MODIFIER_TYPE.INVINCIBILITY);
        this.reset();
    }
    reset(): void {
        this.framesRemaining = MOD_EFFECT_CONFIG.INVINCIBILITY.frames;
        this.resetWearOffFlash();
    }
}

// Ice Rink effect class
export class IceRinkEffect extends Effect {
    constructor() {
        super(MODIFIER_TYPE.ICE_RINK);
        this.reset();
    }
    reset(): void {
        this.framesRemaining = MOD_EFFECT_CONFIG.ICE_RINK.frames;
        this.resetWearOffFlash();
    }
}