import { InvincibilityEffect, IceRinkEffect } from './effect.js';
import { MODIFIER_TYPE, collisionMatrix, COLLISION_ROLE, COLLISION_ACTION, MOD_EFFECT_CONFIG } from './entities-config.js';
// manages all active effects and effect interactions in the game
export class EffectManager {
    constructor(player, hazardManager) {
        this.activeEffects = [];
        this.player = player;
        this.hazardManager = hazardManager;
    }
    // determines the appropriate action for a new modifier collision
    actOnModifierCollision(newModifierType) {
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
    applyEffects() {
        let isInvincible = false;
        let accelFactor = 1;
        let fillColour = null;
        let borderColour = null;
        // set the player's abilities and colour based on it's active effects
        for (let effect of this.activeEffects) {
            if (effect.getType() === MODIFIER_TYPE.INVINCIBILITY) {
                isInvincible = true;
                fillColour = MOD_EFFECT_CONFIG.INVINCIBILITY.colour;
            }
            else if (effect.getType() === MODIFIER_TYPE.ICE_RINK) {
                fillColour = MOD_EFFECT_CONFIG.ICE_RINK.colour;
                accelFactor = MOD_EFFECT_CONFIG.ICE_RINK.accelFactor;
            }
            // set the player's colour to default if the effect is currently flashing because it is wearing off
            if (effect.isWearOffFlashing()) {
                fillColour = null;
            }
        }
        this.player.applyEffects(isInvincible, accelFactor, fillColour, borderColour);
    }
    updateEffects() {
        for (let i = this.activeEffects.length - 1; i >= 0; i--) {
            const effect = this.activeEffects[i];
            effect.update();
            if (effect.isExpired()) {
                this.activeEffects.splice(i, 1);
            }
        }
    }
    // resets the active effects
    reset() {
        this.activeEffects = [];
    }
    activateEffect(type) {
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
                const invincibilityEffect = new InvincibilityEffect();
                this.activeEffects.push(invincibilityEffect);
                break;
            case MODIFIER_TYPE.ICE_RINK:
                const iceRinkEffect = new IceRinkEffect();
                this.activeEffects.push(iceRinkEffect);
                break;
            default:
                console.error(`Unexpected modifier type: ${type}`);
                break;
        }
    }
}
