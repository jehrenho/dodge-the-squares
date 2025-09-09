import { ModifierType, MODIFIER_TYPE } from './entities-config.js';
import { MOD_GEN_CONFIG } from './entities-config.js';
import { VIRTUAL_SCREEN } from '../../graphics/graphics-config.js';
import { Player } from './player.js';
import { Modifier } from './modifier.js';
import { ModifierRenderData } from '../../graphics/render-data.js';

// manages a group of modifier circles of the same type (e.g., all invincibility modifiers)
class ModifierGroup {
    modifierType: ModifierType;
    speed: number;
    density: number;
    radius: number;
    modifiers: Modifier[];

    constructor(modifierType: ModifierType, 
        speed: number,  
        density: number,
        radius: number) {
        this.modifierType = modifierType;
        this.speed = speed;
        this.density = density;
        this.radius = radius;
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
            MOD_GEN_CONFIG.INVINCIBILITY.speed, 
            MOD_GEN_CONFIG.INVINCIBILITY.density, 
            MOD_GEN_CONFIG.INVINCIBILITY.radius,
        ));
        this.modifierGroups.push(new ModifierGroup(
            MODIFIER_TYPE.ICE_RINK, 
            MOD_GEN_CONFIG.ICE_RINK.speed, 
            MOD_GEN_CONFIG.ICE_RINK.density, 
            MOD_GEN_CONFIG.ICE_RINK.radius
        ));
        this.modifierGroups.push(new ModifierGroup(
            MODIFIER_TYPE.SHRINK_HAZ,
            MOD_GEN_CONFIG.SHRINK_HAZ.speed,
            MOD_GEN_CONFIG.SHRINK_HAZ.density,
            MOD_GEN_CONFIG.SHRINK_HAZ.radius
        ));
        this.modifierGroups.push(new ModifierGroup(
            MODIFIER_TYPE.ENLARGE_HAZ,
            MOD_GEN_CONFIG.ENLARGE_HAZ.speed,
            MOD_GEN_CONFIG.ENLARGE_HAZ.density,
            MOD_GEN_CONFIG.ENLARGE_HAZ.radius
        ));
        this.modifierGroups.push(new ModifierGroup(
            MODIFIER_TYPE.EXTRA_LIFE,
            MOD_GEN_CONFIG.EXTRA_LIFE.speed,
            MOD_GEN_CONFIG.EXTRA_LIFE.density,
            MOD_GEN_CONFIG.EXTRA_LIFE.radius
        ));
    }

    // creates modifiers and add's them to the correct modifier group
    createModifier(type: ModifierType, x: number, y: number): void {
        const modGroup = this.modifierGroups.find(group => group.modifierType === type);
        if (modGroup) {
            const newModifier = new Modifier(type, x, y, modGroup.radius);
            modGroup.modifiers.push(newModifier);
        }
    }

    // generates new modifiers, destroys old ones, and moves all modifiers
    updatePositions(): void {
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

    getRenderData(): ModifierRenderData[] {
        const renderData: ModifierRenderData[] = [];
        for (let modg of this.modifierGroups) {
            for (let mod of modg.modifiers) {
                renderData.push(mod.getRenderData());
            }
        }
        return renderData;
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
   
    // generates new modifiers based on modifier group densities
    private generateNewModifiers(): void {
        let rand: number = 0;
        for (let modg of this.modifierGroups) {
            rand = Math.random();
            if (rand < modg.density) {
                // map the new modifier location to the canvas dimensions in pixels
                const newModifierY = ((VIRTUAL_SCREEN.height + modg.radius) * rand) / modg.density;
                // create a new modifier just to the right of the canvas boundry
                modg.modifiers.push(new Modifier(modg.modifierType,
                    VIRTUAL_SCREEN.width + modg.radius,
                    newModifierY - modg.radius,
                    modg.radius
                ));
            }   
        }
    }

    // moves all modifiers to the left and destroys modifiers that have moved off screen
    private moveModifiers(): void {
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
}