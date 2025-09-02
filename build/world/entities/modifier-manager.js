import { MODIFIER_TYPE, MOD_GEN_INITS } from './entities-config.js';
import { SCALING_CONFIG } from '../../graphics/graphics-config.js';
import { Modifier } from './modifier.js';
// manages a group of modifier circles of the same type (e.g., all invincibility modifiers)
class ModifierGroup {
    constructor(modifierType, speed, density, radius, fillColour, outlineColour) {
        this.modifierType = modifierType;
        this.speed = speed;
        this.density = density;
        this.radius = radius;
        this.fillColour = fillColour;
        this.outlineColour = outlineColour;
        this.modifiers = [];
    }
}
// manages all modifier groupds and handles their logic
export class ModifierManager {
    // initializes all modifier groups
    constructor() {
        this.modifierGroups = [];
        this.modifierGroups.push(new ModifierGroup(MODIFIER_TYPE.INVINCIBILITY, MOD_GEN_INITS.INVINCIBILITY.speed, MOD_GEN_INITS.INVINCIBILITY.density, MOD_GEN_INITS.INVINCIBILITY.radius, MOD_GEN_INITS.INVINCIBILITY.fillColour, MOD_GEN_INITS.INVINCIBILITY.outlineColour));
        this.modifierGroups.push(new ModifierGroup(MODIFIER_TYPE.ICE_RINK, MOD_GEN_INITS.ICE_RINK.speed, MOD_GEN_INITS.ICE_RINK.density, MOD_GEN_INITS.ICE_RINK.radius, MOD_GEN_INITS.ICE_RINK.fillColour, MOD_GEN_INITS.ICE_RINK.outlineColour));
        this.modifierGroups.push(new ModifierGroup(MODIFIER_TYPE.SHRINK_HAZ, MOD_GEN_INITS.SHRINK_HAZ.speed, MOD_GEN_INITS.SHRINK_HAZ.density, MOD_GEN_INITS.SHRINK_HAZ.radius, MOD_GEN_INITS.SHRINK_HAZ.fillColour, MOD_GEN_INITS.SHRINK_HAZ.outlineColour));
        this.modifierGroups.push(new ModifierGroup(MODIFIER_TYPE.ENLARGE_HAZ, MOD_GEN_INITS.ENLARGE_HAZ.speed, MOD_GEN_INITS.ENLARGE_HAZ.density, MOD_GEN_INITS.ENLARGE_HAZ.radius, MOD_GEN_INITS.ENLARGE_HAZ.fillColour, MOD_GEN_INITS.ENLARGE_HAZ.outlineColour));
        this.modifierGroups.push(new ModifierGroup(MODIFIER_TYPE.EXTRA_LIFE, MOD_GEN_INITS.EXTRA_LIFE.speed, MOD_GEN_INITS.EXTRA_LIFE.density, MOD_GEN_INITS.EXTRA_LIFE.radius, MOD_GEN_INITS.EXTRA_LIFE.fillColour, MOD_GEN_INITS.EXTRA_LIFE.outlineColour));
    }
    // creates modifiers and add's them to the correct modifier group
    createModifier(type, x, y) {
        const modGroup = this.modifierGroups.find(group => group.modifierType === type);
        if (modGroup) {
            const newModifier = new Modifier(type, x, y, modGroup.radius, modGroup.fillColour, modGroup.outlineColour);
            modGroup.modifiers.push(newModifier);
        }
    }
    // generates new modifiers based on modifier group densities
    generateNewModifiers() {
        let rand = 0;
        for (let modg of this.modifierGroups) {
            rand = Math.random();
            if (rand < modg.density) {
                // map the new modifier location to the canvas dimensions in pixels
                const newModifierY = ((SCALING_CONFIG.VIRTUAL_HEIGHT + modg.radius) * rand) / modg.density;
                // create a new modifier just to the right of the canvas boundry
                modg.modifiers.push(new Modifier(modg.modifierType, SCALING_CONFIG.VIRTUAL_WIDTH + modg.radius, newModifierY - modg.radius, modg.radius, modg.fillColour, modg.outlineColour));
            }
        }
    }
    // moves all modifiers to the left and destroys modifiers that have moved off screen
    moveModifiers() {
        for (let modg of this.modifierGroups) {
            for (let i = modg.modifiers.length - 1; i >= 0; i--) {
                modg.modifiers[i].setX(modg.modifiers[i].getX() - modg.speed);
                // remove old modifiers
                if (modg.modifiers[i].getX() < -modg.modifiers[i].getRadius() || modg.modifiers[i].isTimeToKill()) {
                    modg.modifiers.splice(i, 1);
                }
            }
        }
    }
    // generates new modifiers, destroys old ones, and moves all modifiers
    updateModifiers() {
        this.generateNewModifiers();
        this.moveModifiers();
    }
    // detects collisions between the player and modifier circles
    detectCollisions(player) {
        let closestX = 0;
        let closestY = 0;
        let dx = 0;
        let dy = 0;
        let mod;
        let collisions = [];
        for (let modg of this.modifierGroups) {
            for (let i = modg.modifiers.length - 1; i >= 0; i--) {
                mod = modg.modifiers[i];
                // find closest point on rectangle to circle center
                closestX = Math.max(player.getX(), Math.min(mod.getX(), player.getX() + player.getWidth()));
                closestY = Math.max(player.getY(), Math.min(mod.getY(), player.getY() + player.getHeight()));
                // calculate distance between circle center and closest point
                dx = mod.getX() - closestX;
                dy = mod.getY() - closestY;
                // If distance < radius there is a collision
                if ((dx * dx + dy * dy) <= (mod.getRadius() * mod.getRadius())) {
                    //modg.modifiers.splice(i, 1); // destroy the modifier after collision
                    collisions.push(mod);
                }
            }
        }
        return collisions;
    }
    // draws all modifiers on the canvas
    drawModifiers(ctx) {
        for (let modg of this.modifierGroups) {
            for (let mod of modg.modifiers) {
                mod.draw(ctx, mod.getFillColour());
            }
        }
    }
    // destroys modifiers that are currently active
    destroyModifiers(modifiers) {
        for (let modg of this.modifierGroups) {
            for (let mod of modifiers) {
                const index = modg.modifiers.indexOf(mod);
                if (index !== -1) {
                    modg.modifiers.splice(index, 1);
                    break;
                }
            }
        }
    }
    // resets all modifiers (clears them)
    reset() {
        for (let modg of this.modifierGroups) {
            modg.modifiers = [];
        }
    }
}
