import { Player } from '../entities/player.js';
import { Hazard } from '../entities/hazard.js';
import { Modifier } from '../entities/modifier.js';
import { VisibleShape } from '../entities/visibleShape.js' 
import { HazardManager } from '../entities/hazard-manager.js';
import { ModifierManager } from '../entities/modifier-manager.js';
import { EffectManager } from '../entities/effect-manager.js'
import { CollisionFlasher } from './collision-flasher.js';
import { COLLISION_MANAGER_CONFIG } from './collision-config.js';

export class CollisionManager {
  private player: Player;
  private hazardManager: HazardManager;
  private modifierManager: ModifierManager;
  private effectManager: EffectManager;
  private collisionFlasher: CollisionFlasher;
  private shapesToFlash: VisibleShape[];
  private readonly flashFillColour: string;
  private readonly flashBorderColour: string;

  constructor(player: Player, hazardManager: HazardManager, modifierManager: ModifierManager, effectManager: EffectManager) {
    this.player = player;
    this.hazardManager = hazardManager;
    this.modifierManager = modifierManager;
    this.effectManager = effectManager;
    this.collisionFlasher = new CollisionFlasher();
    this.shapesToFlash = [];
    this.flashFillColour = COLLISION_MANAGER_CONFIG.flashFillColour;
    this.flashBorderColour = COLLISION_MANAGER_CONFIG.flashBorderColour;
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

  // flashes the player and hazards
  startFlashingCollision(): void {
    this.collisionFlasher.startFlashing();
    this.updateCollisionColour();
  }

  // updates the flash colour of any colliding objects
  update(): void {
    if (this.collisionFlasher.isFlashing()) {
      this.collisionFlasher.update();
      this.updateCollisionColour();
    } else {
      // flashing stopped, reset shapes to flash
      this.setFlashShapesToDefaultColour();
      this.shapesToFlash = [];
    }
  }

  // sets the flash shapes to their default colours
  setFlashShapesToDefaultColour(): void {
    for (const shape of this.shapesToFlash) {
      shape.setDefaultColour();
    }
  }

  // updates the colour of the flashing objects
  updateCollisionColour(): void {
    if (this.collisionFlasher.isFlashOn()) {
      // set the collided objects to the flash colour
      for (const shape of this.shapesToFlash) {
        shape.setColour(this.flashFillColour, this.flashBorderColour);
      }
    } else {
      // set the collided objects to their default colour
      this.setFlashShapesToDefaultColour();
    }
  }

  // returns true if a collision is currently being flashed
  isFlashingCollision(): boolean {
    return this.collisionFlasher.isFlashing();
  }
}