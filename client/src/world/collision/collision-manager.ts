import { Player } from '../entities/player.js';
import { Hazard } from '../entities/hazard.js';
import { Modifier } from '../entities/modifier.js';
import { VisibleShape } from '../entities/visibleShape.js' 
import { HazardManager } from '../entities/hazard-manager.js';
import { ModifierManager } from '../entities/modifier-manager.js';
import { EffectManager } from './effect-manager.js'
import { CollisionFlasher } from './collision-flasher.js';

// detects and flashes collisions
// delegates all effect management to EffectManager
export class CollisionManager {
  private readonly player: Player;
  private readonly hazardManager: HazardManager;
  private readonly modifierManager: ModifierManager;
  private readonly effectManager: EffectManager;
  private readonly collisionFlasher: CollisionFlasher;
  private  shapesToFlash: VisibleShape[];

  constructor(player: Player, hazardManager: HazardManager, modifierManager: ModifierManager, effectManager: EffectManager) {
    this.player = player;
    this.hazardManager = hazardManager;
    this.modifierManager = modifierManager;
    this.effectManager = effectManager;
    this.collisionFlasher = new CollisionFlasher();
    this.shapesToFlash = [];
  }

  // detects new player-modifier collisions and takes the appropriate actions associated with the collided modifiers
  resolveModifierCollisions(): void {
    // detect new collisions
    let modifierCollisions: Modifier[] = this.modifierManager.detectCollisions(this.player);
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
  resolveHazardCollisions(): void {
    // detect new collisions
    let hazardCollisions: Hazard[] = this.hazardManager.detectCollisions(this.player);
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
  startFlashingCollision(): void {
    this.collisionFlasher.startFlashing();
    this.updateCollisionColour();
  }

  update(): void {
    this.collisionFlasher.update();
    if (this.collisionFlasher.isFlashing()) {
      this.updateCollisionColour();
    } else {
      // flashing stopped, reset shapes to flash
      this.setFlashState(false);
      this.shapesToFlash = [];
    }
  }

  // signals to the world it shouldn't update entity positions for a moment to emphasize a collision
  isFlashingCollision(): boolean {
    return this.collisionFlasher.isFlashing();
  }

  // updates the colour of the flashing objects
  private updateCollisionColour(): void {
    if (this.collisionFlasher.isFlashOn()) {
      this.setFlashState(true);
    } else {
      this.setFlashState(false);
    }
  }

  // sets whether the flash shapes should be the flash colour or not 
  private setFlashState(isFlashing: boolean): void {
    for (const shape of this.shapesToFlash) {
      shape.setFlash(isFlashing);
    }
  }
}