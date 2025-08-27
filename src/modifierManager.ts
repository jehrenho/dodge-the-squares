import { GAME_CONFIG,
    ModifierType, MODIFIER_TYPE,
    MOD_GEN_INITS
} from './config.js';
import { Player } from './player.js';
import { HazardManager } from './hazardManager.js';
import { VisibleShape } from './visibleShape.js';

// represents an individual modifier circle in the game
export class Modifier extends VisibleShape {
    private readonly modifierType: ModifierType;
    private readonly r: number;

    constructor(modifierType: ModifierType, 
        x: number, 
        y: number, 
        r: number, 
        fillColour: string, 
        borderColour: string) {
        super(x, y, fillColour, borderColour);
        this.modifierType = modifierType;
        this.r = r;
    }

    // returns the radius of the modifier
    getRadius(): number {
        return this.r;
    }

    // returns the type of the modifier
    getType(): ModifierType {
        return this.modifierType;
    }

    // draws the modifier on the canvas
    draw(ctx: CanvasRenderingContext2D, fillColour: string): void {
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
    modifierType: ModifierType;
    speed: number;
    density: number;
    radius: number;
    fillColour: string;
    outlineColour: string;
    modifiers: Modifier[];
    constructor(modifierType: ModifierType, 
        speed: number,  
        density: number,
        radius: number, 
        fillColour: string,
        outlineColour: string) {
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
    modifierGroups: ModifierGroup[];

    // initializes all modifier groups
    constructor() {
        this.modifierGroups = [];
        this.modifierGroups.push(new ModifierGroup(
            MODIFIER_TYPE.INVINCIBILITY, 
            MOD_GEN_INITS.INVINCIBILITY.speed, 
            MOD_GEN_INITS.INVINCIBILITY.density, 
            MOD_GEN_INITS.INVINCIBILITY.radius,
            MOD_GEN_INITS.INVINCIBILITY.fillColour,
            MOD_GEN_INITS.INVINCIBILITY.outlineColour
        ));
        this.modifierGroups.push(new ModifierGroup(
            MODIFIER_TYPE.ICE_RINK, 
            MOD_GEN_INITS.ICE_RINK.speed, 
            MOD_GEN_INITS.ICE_RINK.density, 
            MOD_GEN_INITS.ICE_RINK.radius,
            MOD_GEN_INITS.ICE_RINK.fillColour,
            MOD_GEN_INITS.ICE_RINK.outlineColour
        ));
        this.modifierGroups.push(new ModifierGroup(
            MODIFIER_TYPE.SHRINK_HAZ,
            MOD_GEN_INITS.SHRINK_HAZ.speed,
            MOD_GEN_INITS.SHRINK_HAZ.density,
            MOD_GEN_INITS.SHRINK_HAZ.radius,
            MOD_GEN_INITS.SHRINK_HAZ.fillColour,
            MOD_GEN_INITS.SHRINK_HAZ.outlineColour
        ));
        this.modifierGroups.push(new ModifierGroup(
            MODIFIER_TYPE.ENLARGE_HAZ,
            MOD_GEN_INITS.ENLARGE_HAZ.speed,
            MOD_GEN_INITS.ENLARGE_HAZ.density,
            MOD_GEN_INITS.ENLARGE_HAZ.radius,
            MOD_GEN_INITS.ENLARGE_HAZ.fillColour,
            MOD_GEN_INITS.ENLARGE_HAZ.outlineColour
        ));
        this.modifierGroups.push(new ModifierGroup(
            MODIFIER_TYPE.EXTRA_LIFE,
            MOD_GEN_INITS.EXTRA_LIFE.speed,
            MOD_GEN_INITS.EXTRA_LIFE.density,
            MOD_GEN_INITS.EXTRA_LIFE.radius,
            MOD_GEN_INITS.EXTRA_LIFE.fillColour,
            MOD_GEN_INITS.EXTRA_LIFE.outlineColour
        ));
    }

    // creates modifiers and add's them to the correct modifier group
    createModifier(type: ModifierType, x: number, y: number): void {
        const modGroup = this.modifierGroups.find(group => group.modifierType === type);
        if (modGroup) {
            const newModifier = new Modifier(type, x, y, modGroup.radius, modGroup.fillColour, modGroup.outlineColour);
            modGroup.modifiers.push(newModifier);
        }
    }
   
    // generates new modifiers based on modifier group densities
    generateNewModifiers(): void {
        let rand: number = 0;
        for (let modg of this.modifierGroups) {
            rand = Math.random();
            if (rand < modg.density) {
                // map the new modifier location to the canvas dimensions in pixels
                const newModifierY = ((GAME_CONFIG.VIRTUAL_HEIGHT + modg.radius) * rand) / modg.density;
                // create a new modifier just to the right of the canvas boundry
                modg.modifiers.push(new Modifier(modg.modifierType,
                    GAME_CONFIG.VIRTUAL_WIDTH + modg.radius, 
                    newModifierY - modg.radius, 
                    modg.radius, 
                    modg.fillColour,
                    modg.outlineColour
                ));
            }   
        }
    }

    // moves all modifiers to the left and destroys modifiers that have moved off screen
    moveModifiers(): void {
        for (let modg of this.modifierGroups) {
            for (let i = modg.modifiers.length - 1; i >= 0; i--) {
                modg.modifiers[i].x -= modg.speed;
                // remove old modifiers
                if (modg.modifiers[i].x < -modg.modifiers[i].getRadius() || modg.modifiers[i].isTimeToKill()) {
                    modg.modifiers.splice(i, 1);
                }
            }
        }
    }

    // generates new modifiers, destroys old ones, and moves all modifiers
    updateModifiers(): void {
        this.generateNewModifiers();
        this.moveModifiers();
    }

    // detects collisions between the player and modifier circles
    detectCollisions(player: Player): Modifier[] {
        let closestX: number = 0;
        let closestY: number = 0;
        let dx: number = 0;
        let dy: number = 0;
        let mod: Modifier;
        let collisions: Modifier[] = [];

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
                if ((dx * dx + dy * dy) <= (mod.getRadius() * mod.getRadius())) {
                    //modg.modifiers.splice(i, 1); // destroy the modifier after collision
                    collisions.push(mod);
                }
            }
        }
        return collisions;
    }

    // draws all modifiers on the canvas
    drawModifiers(ctx: CanvasRenderingContext2D): void {
        for (let modg of this.modifierGroups) {
            for (let mod of modg.modifiers) {
                mod.draw(ctx, mod.fillColour);
            }
        }
    }

    // destroys modifiers that are currently active
    destroyModifiers(modifiers: Modifier[]): void {
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
    reset(): void {
        for (let modg of this.modifierGroups) {
            modg.modifiers = [];
        }
    }
}