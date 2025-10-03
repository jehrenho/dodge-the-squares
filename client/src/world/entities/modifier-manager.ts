import { ModifierType, MODIFIER_TYPE } from './config/entities-config.js';
import { Player } from './player.js';
import { Modifier } from './modifier.js';
import { ModifierRenderData } from '../../graphics/render-data.js';
import { ModifierGroup } from './modifier-group.js';
import { GameState } from '../../game/game-state.js';

// manages all modifier groups and handles their logic
export class ModifierManager {
    modifierGroups: ModifierGroup[];

    constructor(gameState: GameState) {
        this.modifierGroups = [];
        for (const key of Object.keys(MODIFIER_TYPE)) {
            this.modifierGroups.push(new ModifierGroup(gameState, key as ModifierType));
        }
    }

    createModifier(modifierType: ModifierType, x: number, y: number): void {
        for (let modifierGroup of this.modifierGroups) {
            if (modifierGroup.getModifierType() === modifierType) {
                modifierGroup.createModifier(x, y, modifierGroup.getXSpeed(), modifierGroup.getBaseSize());
                break;
            }
        }
    }

    // generates new modifiers, destroys old ones, and moves all modifiers
    updatePositions(): void {
        this.generateNewModifiers();
        this.moveModifiers();
    }

    // detects collisions between the player and modifier circles
    detectCollisions(player: Player): Modifier[] {
        let collisions: Modifier[] = [];
        for (let modifierGroup of this.modifierGroups) {
            collisions.push(...modifierGroup.detectCollisions(player));
        }
        return collisions;
    }

    getRenderData(): ModifierRenderData[] {
        const renderData: ModifierRenderData[] = [];
        for (let modifierGroup of this.modifierGroups) {
            renderData.push(...modifierGroup.getRenderData());
        }
        return renderData;
    }

    // destroys modifiers that are currently active
    destroyModifiers(modifiers: Modifier[]): void {
        for (let modifierGroup of this.modifierGroups) {
            modifierGroup.destroyModifiers(modifiers);
        }
    }

    getModifierGroup(modifierType: ModifierType): ModifierGroup | null{
        for (let modifierGroup of this.modifierGroups) {
            if (modifierGroup.getModifierType() === modifierType) {
                return modifierGroup;
            }
        }
        return null;
    }

    // resets all modifiers (clears them)
    reset(): void {
        for (let modifierGroup of this.modifierGroups) {
            modifierGroup.reset();
        }
    }
   
    // generates new modifiers based on modifier group densities
    private generateNewModifiers(): void {
        for (let modifierGroup of this.modifierGroups) {
            modifierGroup.generateModifiers();
        }
    }

    // moves all modifiers to the left and destroys modifiers that have moved off screen
    private moveModifiers(): void {
        for (let modifierGroup of this.modifierGroups) {
            modifierGroup.moveModifiers();
        }
    }
}