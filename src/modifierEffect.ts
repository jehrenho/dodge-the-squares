import { MODIFIER_TYPE, MOD_EFFECT_CONFIG } from "./gameConfig.js";
import { Player } from "./player.js";
import { HazardManager } from "./hazards.js";

// defines the base class for all modifier effects
export abstract class ModifierEffect {
    type: MODIFIER_TYPE;
    framesRemaining: number;
    constructor(player: Player, modifierType: MODIFIER_TYPE) {
        this.type = modifierType;
        this.framesRemaining = 0;
    }
    abstract resetEffectTimer(): void;
    update(player: Player): number {
        this.framesRemaining--;
        return this.framesRemaining;
    }
}

// Invincibility effect class
export class InvincibilityEffect extends ModifierEffect {
    constructor(player: Player) {
        super(player, MODIFIER_TYPE.INVINCIBILITY)
        this.resetEffectTimer();
    }
    resetEffectTimer(): void {
        this.framesRemaining = MOD_EFFECT_CONFIG.INVINCIBILITY.frames;
    }
}

// Ice Rink effect class
export class IceRinkEffect extends ModifierEffect {
    constructor(player: Player) {
        super(player, MODIFIER_TYPE.ICE_RINK);
        this.resetEffectTimer();
    }
    resetEffectTimer(): void {
        this.framesRemaining = MOD_EFFECT_CONFIG.ICE_RINK.frames;
    }
}

// handles logic for applying and resolving modifier effect collisions
// IN DEV.
export function handleModifierCollisions(contactedModifierType: MODIFIER_TYPE, player: Player, hazardManager: HazardManager): void {
    
    // see if the new effect is already active
    for (let effect of player.effects) {
        if (effect.type === contactedModifierType) {
            // if it is, just reset the timer on the existing effect
            // no further action required
            effect.resetEffectTimer();
            return;
        }
    }

    // return if there are any active effects that are incompatible with the new effect
    if (player.isInvincible) return;

    // destroy any existing effects that are incompatible with the new effect
   if (contactedModifierType === MODIFIER_TYPE.INVINCIBILITY) {
        // invincibility deactivates ice rink
        for (let i = player.effects.length - 1; i >= 0; i--) {
            if (player.effects[i].type != MODIFIER_TYPE.INVINCIBILITY) {
                player.effects.splice(i, 1);
                break;
            }
        }
    }

    // add the new effect to the player's effects
    switch (contactedModifierType) {
        case MODIFIER_TYPE.INVINCIBILITY:
            player.effects.push(new InvincibilityEffect(player));
            break;
        case MODIFIER_TYPE.ICE_RINK:
            player.effects.push(new IceRinkEffect(player));
            break;
        case MODIFIER_TYPE.SHRINK_HAZ:
            hazardManager.applySizeScaleFactor(MOD_EFFECT_CONFIG.SHRINK_HAZ.scaleFactor);
            break;
        case MODIFIER_TYPE.ENLARGE_HAZ:
            hazardManager.applySizeScaleFactor(MOD_EFFECT_CONFIG.ENLARGE_HAZ.scaleFactor);
            break;
    }

    // update the player's abilities based on the new effects
    player.updateEffectsAbilities();
}
