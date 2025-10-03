import { MODIFIER_TYPE, ModifierType } from '../entities/config/entities-config.js';
import { Effect, InvincibilityEffect, IceRinkEffect } from './effect.js';
import { collisionMatrix, COLLISION_ROLE, COLLISION_ACTION } from '../entities/config/collision-matrix.js';
import { MOD_EFFECT_CONFIG } from '../entities/config/entities-config.js';
import { Player } from '../entities/player.js';
import { HazardManager } from '../entities/hazard-manager.js';

// manages all active effects and effect interactions in the game
export class EffectManager {
    private activeEffects: Effect[];
    private readonly player: Player;
    private readonly hazardManager: HazardManager;

    constructor(player: Player, hazardManager: HazardManager) {
        this.activeEffects = [];
        this.player = player;
        this.hazardManager = hazardManager;
    }

    // resolves effect interactions when a player-modifier collision occurs using the collision matrix
    actOnModifierCollision(newModifierType: ModifierType): void {
        // activate the effect if there are no other active effects
        if (this.activeEffects.length === 0) {
            this.activateEffect(newModifierType);
            return;
        }
        // determine what to do, given a new modifier collision, when there are active effects
        for (let activeEffect of this.activeEffects) {
            // determine what to do with the new modifier effect
            switch (collisionMatrix[COLLISION_ROLE.NEW][activeEffect.getType()][newModifierType]) {
                case COLLISION_ACTION.ACTIVATE:
                    this.activateEffect(newModifierType);
                    break;
                case COLLISION_ACTION.DESTROY:
                    // do nothing
                    break;
                default:
                    console.error(`Unexpected collision action for ${newModifierType} and ${activeEffect.getType()}`);
                    break;
            }
            // determine what to do with the already active effects
            switch (collisionMatrix[COLLISION_ROLE.OLD][activeEffect.getType()][newModifierType]) {
                case COLLISION_ACTION.REACTIVATE:
                    activeEffect.reset();
                    break;
                case COLLISION_ACTION.DESTROY:
                    activeEffect.deactivate();
                    break;
                case COLLISION_ACTION.IGNORE:
                    // do nothing
                    break;
                default:
                    console.error(`Unexpected collision action for ${newModifierType} and ${activeEffect.getType()}`);
                    break;
            }
        }
    }

    // sets the player's properties based on the currently active effects
    applyEffects(): void {
        let isInvincible: boolean = false;
        let accelFactor: number = 1;

        // set the player's abilities and colour based on it's active effects
        for (let effect of this.activeEffects) {
            if (effect.getType() === MODIFIER_TYPE.INVINCIBILITY) {
                isInvincible = true;
            } else if (effect.getType() === MODIFIER_TYPE.ICE_RINK) {
                accelFactor = MOD_EFFECT_CONFIG.ICE_RINK.accelFactor;
            }
            // set the player's colour to default if the effect is currently flashing because it is wearing off
            if (effect.isWearOffFlashing()) {
                this.player.setWearOffColourOverride(true);
            } else {
                this.player.setWearOffColourOverride(false);
            }
        }
        this.player.applyEffects(isInvincible, accelFactor);
    }

    updateEffects(): void {
        for (let i = this.activeEffects.length - 1; i >= 0; i--) {
            const effect = this.activeEffects[i];
            effect.update();
            if (effect.isExpired()) {
                this.activeEffects.splice(i, 1);
            }
        }
    }

    // resets the active effects
    reset(): void {
        this.activeEffects = [];
    }

    private activateEffect(type: ModifierType): void {
        switch (type) {
            case MODIFIER_TYPE.SHRINK_HAZ:
                this.hazardManager.applySizeScaleFactor(MOD_EFFECT_CONFIG.SHRINK_HAZ.scaleFactor);
                break;
            case MODIFIER_TYPE.ENLARGE_HAZ:
                this.hazardManager.applySizeScaleFactor(MOD_EFFECT_CONFIG.ENLARGE_HAZ.scaleFactor);
                break;
            case MODIFIER_TYPE.EXTRA_LIFE:
                this.player.modifyHealth(1);
                break;
            case MODIFIER_TYPE.INVINCIBILITY:
                this.activeEffects.push(new InvincibilityEffect());
                break;
            case MODIFIER_TYPE.ICE_RINK:
                this.activeEffects.push(new IceRinkEffect());
                break;
            default:
                console.error(`Unexpected modifier type: ${type}`);
                break;
        }
        return;
    }
}
