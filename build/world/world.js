import { Player } from './entities/player.js';
import { HazardManager } from './entities/hazard-manager.js';
import { ModifierManager } from './entities/modifier-manager.js';
import { EffectManager } from './entities/effect-manager.js';
import { CollisionManager } from './collision/collision-manager.js';
// represents the game world where entities exist and interact
export class World {
    constructor(gameState) {
        this.player = new Player();
        this.hazardManager = new HazardManager(gameState);
        this.modifierManager = new ModifierManager();
        this.effectManager = new EffectManager(this.player, this.hazardManager);
        this.collisionManager = new CollisionManager(this.player, this.hazardManager, this.modifierManager, this.effectManager);
    }
    update(movementInput) {
        // update the collision manager if it's flashing a collision
        if (this.collisionManager.isFlashingCollision()) {
            this.collisionManager.update();
        }
        else {
            this.updateEntities(movementInput);
        }
    }
    getPlayer() {
        return this.player;
    }
    getHazardManager() {
        return this.hazardManager;
    }
    getModifierManager() {
        return this.modifierManager;
    }
    isPlayerDead() {
        return this.player.isDead() && !this.collisionManager.isFlashingCollision();
    }
    reset() {
        this.player.reset();
        this.hazardManager.reset();
        this.modifierManager.reset();
        this.effectManager.reset();
    }
    // moves, generates, and destroys entities in the game world
    updateEntities(movementInput) {
        this.player.updatePosition(movementInput);
        this.hazardManager.updateHazards();
        this.modifierManager.updatePositions();
        this.effectManager.updateEffects();
        this.collisionManager.resolveModifierCollisions();
        this.effectManager.applyEffects();
        this.collisionManager.resolveHazardCollisions();
    }
}
