import { GAME_CONFIG, MOD_GEN_INITS } from './config.js';
// represents an individual modifier circle in the game
export class Modifier {
    constructor(modifierType, x, y, r, fillColour, borderColour) {
        this.modifierType = modifierType;
        this.x = x;
        this.y = y;
        this.r = r;
        this.fillColour = fillColour;
        this.borderColour = borderColour;
    }
    // draws the modifier on the canvas
    draw(ctx, fillColour) {
        // Draw fill
        ctx.fillStyle = fillColour;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        // Draw outline
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}
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
        this.modifierGroups.push(new ModifierGroup(0 /* MODIFIER_TYPE.INVINCIBILITY */, MOD_GEN_INITS.INVINCIBILITY.speed, MOD_GEN_INITS.INVINCIBILITY.density, MOD_GEN_INITS.INVINCIBILITY.radius, MOD_GEN_INITS.INVINCIBILITY.fillColour, MOD_GEN_INITS.INVINCIBILITY.outlineColour));
        this.modifierGroups.push(new ModifierGroup(1 /* MODIFIER_TYPE.ICE_RINK */, MOD_GEN_INITS.ICE_RINK.speed, MOD_GEN_INITS.ICE_RINK.density, MOD_GEN_INITS.ICE_RINK.radius, MOD_GEN_INITS.ICE_RINK.fillColour, MOD_GEN_INITS.ICE_RINK.outlineColour));
        this.modifierGroups.push(new ModifierGroup(2 /* MODIFIER_TYPE.SHRINK_HAZ */, MOD_GEN_INITS.SHRINK_HAZ.speed, MOD_GEN_INITS.SHRINK_HAZ.density, MOD_GEN_INITS.SHRINK_HAZ.radius, MOD_GEN_INITS.SHRINK_HAZ.fillColour, MOD_GEN_INITS.SHRINK_HAZ.outlineColour));
        this.modifierGroups.push(new ModifierGroup(3 /* MODIFIER_TYPE.ENLARGE_HAZ */, MOD_GEN_INITS.ENLARGE_HAZ.speed, MOD_GEN_INITS.ENLARGE_HAZ.density, MOD_GEN_INITS.ENLARGE_HAZ.radius, MOD_GEN_INITS.ENLARGE_HAZ.fillColour, MOD_GEN_INITS.ENLARGE_HAZ.outlineColour));
        this.modifierGroups.push(new ModifierGroup(4 /* MODIFIER_TYPE.EXTRA_LIFE */, MOD_GEN_INITS.EXTRA_LIFE.speed, MOD_GEN_INITS.EXTRA_LIFE.density, MOD_GEN_INITS.EXTRA_LIFE.radius, MOD_GEN_INITS.EXTRA_LIFE.fillColour, MOD_GEN_INITS.EXTRA_LIFE.outlineColour));
    }
    // generates new modifiers based on modifier group densities
    generateNewModifiers() {
        let rand = 0;
        for (let modg of this.modifierGroups) {
            rand = Math.random();
            if (rand < modg.density) {
                // map the new modifier location to the canvas dimensions in pixels
                const newModifierY = ((GAME_CONFIG.VIRTUAL_HEIGHT + modg.radius) * rand) / modg.density;
                // create a new modifier just to the right of the canvas boundry
                modg.modifiers.push(new Modifier(modg.modifierType, GAME_CONFIG.VIRTUAL_WIDTH + modg.radius, newModifierY - modg.radius, modg.radius, modg.fillColour, modg.outlineColour));
            }
        }
    }
    // moves all modifiers to the left and destroys modifiers that have moved off screen
    moveModifiers() {
        for (let modg of this.modifierGroups) {
            for (let i = modg.modifiers.length - 1; i >= 0; i--) {
                modg.modifiers[i].x -= modg.speed;
                // remove modifiers that have moved off the left side of the canvas
                if (modg.modifiers[i].x < -modg.modifiers[i].r) {
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
    detectCollisions(player, hazardManager) {
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
                closestX = Math.max(player.x, Math.min(mod.x, player.x + player.w));
                closestY = Math.max(player.y, Math.min(mod.y, player.y + player.h));
                // calculate distance between circle center and closest point
                dx = mod.x - closestX;
                dy = mod.y - closestY;
                // If distance < radius there is a collision
                if ((dx * dx + dy * dy) <= (mod.r * mod.r)) {
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
                mod.draw(ctx, mod.fillColour);
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
