import { ModifierType } from './config/entities-config.js';
import { Modifier } from './modifier.js';
import { Player } from './player.js';
import { ModifierRenderData } from '../../graphics/render-data.js';
import { Spawner } from './spawner.js';
import { Spawn } from './config/spawner-config.js';
import { GameState } from '../../game/game-state.js';

// manages a group of modifier circles of the same type (e.g., all invincibility modifiers)
export class ModifierGroup {
    private readonly modifierType: ModifierType;
    private modifiers: Modifier[];
    private readonly spawner: Spawner;

    constructor(gameState: GameState, modifierType: ModifierType) {
        this.modifierType = modifierType;
        this.spawner = new Spawner(gameState, modifierType);
        this.modifiers = [];
    }

    createModifier(x: number, y: number, xspeed: number, size: number): void {
        const newModifier = new Modifier(this.modifierType, x, y, xspeed, size);
        this.modifiers.push(newModifier);
    }
    
    // detects collisions between the player and modifier circles
    detectCollisions(player: Player): Modifier[] {
        let closestX: number = 0;
        let closestY: number = 0;
        let dx: number = 0;
        let dy: number = 0;
        let mod: Modifier;
        let collisions: Modifier[] = [];
        for (let i = this.modifiers.length - 1; i >= 0; i--) {
            mod = this.modifiers[i];
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
        return collisions;
    }
    
    getRenderData(): ModifierRenderData[] {
        const renderData: ModifierRenderData[] = [];
        for (let mod of this.modifiers) {
            renderData.push(mod.getRenderData());
        }
        return renderData;
    }

    // destroys modifiers that are currently active
    destroyModifiers(modifiers: Modifier[]): void {
        for (let mod of modifiers) {
            const index = this.modifiers.indexOf(mod);
            if (index !== -1) {
                this.modifiers.splice(index, 1);
                break;
            }
        }
    }

    generateModifiers(): void {
        const spawn: Spawn | null = this.spawner.generate(1);
        if (spawn != null) {
            this.createModifier(spawn.x, spawn.y, spawn.xSpeed, spawn.baseSize);
            console.log(`Generated modifier of type ${this.modifierType} at (${spawn.x}, ${spawn.y}) with speed ${spawn.xSpeed} and size ${spawn.baseSize}`);
        }
    }

    // moves all modifiers to the left and destroys modifiers that have moved off screen
    moveModifiers(): void {
        for (let i = this.modifiers.length - 1; i >= 0; i--) {
            this.modifiers[i].updatePosition();
            // remove old modifiers
            if (this.modifiers[i].getX() < -this.modifiers[i].getRadius() || this.modifiers[i].isTimeToKill()) {
                this.modifiers.splice(i, 1);
            }
        }
    }

    getModifierType(): ModifierType {
        return this.modifierType;
    }

    getXSpeed(): number {
        return this.spawner.getXSpeed();
    }

    getBaseSize(): number {
        return this.spawner.getBaseSize();
    }

    reset(): void {
        this.modifiers = [];
    }
}