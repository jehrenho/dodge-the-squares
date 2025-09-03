import { CollisionFlasher } from './collision-flasher.js';
import { COLLISION_MANAGER_CONFIG } from './collision-config.js';
// manages all collision detection and resolution in the game
export class CollisionManager {
    constructor(player, hazardManager, modifierManager, effectManager) {
        this.player = player;
        this.hazardManager = hazardManager;
        this.modifierManager = modifierManager;
        this.effectManager = effectManager;
        this.collisionFlasher = new CollisionFlasher();
        this.shapesToFlash = [];
    }
    // detects new player-modifier collisions and takes the appropriate actions associated with the collided modifiers
    resolveModifierCollisions() {
        // detect new collisions
        let modifierCollisions = this.modifierManager.detectCollisions(this.player);
        if (modifierCollisions.length > 0) {
            // start flashing the player and collided modifiers
            this.shapesToFlash.push(this.player, ...modifierCollisions);
            this.startFlashingCollision();
            for (const mod of modifierCollisions) {
                // destroy the modifier and apply the modifiers effect(s)
                mod.setToKill();
                this.effectManager.actOnModifierCollision(mod.getType());
            }
        }
    }
    // detects new player-hazard collisions and decreases player health when a hazard is touched
    resolveHazardCollisions() {
        // detect new collisions
        let hazardCollisions = this.hazardManager.detectCollisions(this.player);
        if (hazardCollisions.length > 0) {
            this.shapesToFlash = [this.player, ...hazardCollisions];
            this.startFlashingCollision();
            for (const haz of hazardCollisions) {
                // destroy the hazard and decrease player health
                haz.setToKill();
                this.player.modifyHealth(-1);
            }
        }
    }
    // starts the flashing effect that occurs when the player collides with something
    startFlashingCollision() {
        this.collisionFlasher.startFlashing();
        this.updateCollisionColour();
    }
    update() {
        if (this.collisionFlasher.isFlashing()) {
            this.collisionFlasher.update();
            this.updateCollisionColour();
        }
        else {
            // flashing stopped, reset shapes to flash
            this.setFlashShapesToDefaultColour();
            this.shapesToFlash = [];
        }
    }
    // signals to the world it shouldn't update entity positions for a moment to emphasize a collision
    isFlashingCollision() {
        return this.collisionFlasher.isFlashing();
    }
    // sets the flash shapes to their default colours
    setFlashShapesToDefaultColour() {
        for (const shape of this.shapesToFlash) {
            shape.setDefaultColour();
        }
    }
    // updates the colour of the flashing objects
    updateCollisionColour() {
        if (this.collisionFlasher.isFlashOn()) {
            // set the collided objects to the flash colour
            for (const shape of this.shapesToFlash) {
                shape.setColour(COLLISION_MANAGER_CONFIG.flashFillColour, COLLISION_MANAGER_CONFIG.flashBorderColour);
            }
        }
        else {
            // set the collided objects to their default colour
            this.setFlashShapesToDefaultColour();
        }
    }
}
