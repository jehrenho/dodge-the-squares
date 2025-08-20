import { MOD_GEN_INITS } from './config.js';
import { canvas } from './game.js';
import { handleModifierCollisions } from './modifierEffect.js';
// represents an individual modifier circle in the game
class Modifier {
    constructor(x, y, r, speed) {
        this.x = x;
        this.y = y;
        this.r = r;
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
    }
    // generates new modifiers based on modifier group densities
    generateNewModifiers() {
        let rand = 0;
        for (let modg of this.modifierGroups) {
            rand = Math.random();
            if (rand < modg.density) {
                // map the new modifier location to the canvas dimensions in pixels
                const newModifierY = ((canvas.height + modg.radius) * rand) / modg.density;
                // create a new modifier just to the right of the canvas boundry
                modg.modifiers.push(new Modifier(canvas.width + modg.radius, newModifierY - modg.radius, modg.radius, modg.speed));
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
    detectModifierCollisions(player, hazardManager) {
        let closestX = 0;
        let closestY = 0;
        let dx = 0;
        let dy = 0;
        let mod;
        for (let modg of this.modifierGroups) {
            for (let i = modg.modifiers.length - 1; i >= 0; i--) {
                mod = modg.modifiers[i];
                // find closest point on rectangle to circle center
                closestX = Math.max(player.x, Math.min(mod.x, player.x + player.w));
                closestY = Math.max(player.y, Math.min(mod.y, player.y + player.h));
                // calculate distance between circle center and closest point
                dx = mod.x - closestX;
                dy = mod.y - closestY;
                // If distance < radius, collision!
                if ((dx * dx + dy * dy) <= (mod.r * mod.r)) {
                    handleModifierCollisions(modg.modifierType, player, hazardManager);
                    modg.modifiers.splice(i, 1); // destroy the modifier after collision
                }
            }
        }
    }
    // draws all modifiers on the canvas
    drawModifiers(ctx) {
        for (let modg of this.modifierGroups) {
            for (let mod of modg.modifiers) {
                // Draw fill
                ctx.fillStyle = modg.fillColour;
                ctx.beginPath();
                ctx.arc(mod.x, mod.y, mod.r, 0, Math.PI * 2);
                ctx.fill();
                // Draw outline
                ctx.strokeStyle = modg.outlineColour;
                ctx.lineWidth = 2; // You can adjust the thickness
                ctx.stroke();
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
