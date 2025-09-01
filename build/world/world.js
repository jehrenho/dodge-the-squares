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
    // updates the entities in the game world
    updateEntities(movementInput) {
        this.player.updatePosition(movementInput);
        this.hazardManager.updateHazards();
        this.modifierManager.updateModifiers();
        this.effectManager.updateEffects();
        this.collisionManager.resolveModifierCollisions();
        this.effectManager.applyEffects();
        this.collisionManager.resolveHazardCollisions();
    }
    // updates the game world
    update(movementInput) {
        // update the collision manager if it's flashing a collision
        if (this.collisionManager.isFlashingCollision()) {
            this.collisionManager.update();
            // otherwise update all the game entities
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
    // resets the game world to the beginning of game state
    reset() {
        this.player.reset();
        this.hazardManager.reset();
        this.modifierManager.reset();
        this.effectManager.reset();
    }
    // returns true if the player is dead
    isPlayerDead() {
        return this.player.isDead() && !this.collisionManager.isFlashingCollision();
    }
}
