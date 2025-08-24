import { ModifierType, MODIFIER_TYPE, COLLISION_ROLE, COLLISION_ACTION, collisionMatrix, MOD_EFFECT_CONFIG } from './config.js';
import { Player } from './player.js';
import { HazardManager, Hazard } from './hazardManager.js';
import { ModifierManager, Modifier } from './modifierManager.js';
import { Flasher } from './flasher.js';

export class CollisionUtil {
  static player: Player;
  static hazardManager: HazardManager;
  static modifierManager: ModifierManager;

  static init(player: Player, hazardManager: HazardManager, modifierManager: ModifierManager): void {
    this.player = player;
    this.hazardManager = hazardManager;
    this.modifierManager = modifierManager;
  }

  // detects new player-modifier collisions and takes the appropriate actions associated with the collided modifiers
  static resolveModifierCollisions(): void {
    // detect new collisions
    let modifierCollisions: Modifier[] = CollisionUtil.modifierManager.detectCollisions(CollisionUtil.player);
    if (modifierCollisions.length > 0) {
      // take the necessary actions to resolve the collisions
      Flasher.startFlashingCollision(CollisionUtil.player, modifierCollisions);
      for (const mod of modifierCollisions) {
          mod.setToKill();
          CollisionUtil.actOnModifierCollision(mod.getType(), CollisionUtil.player, CollisionUtil.hazardManager);
      }
    }
    CollisionUtil.player.updateEffects();
  }

  // detects new player-hazard collisions and decreases player health when a hazard is touched
  static resolveHazardCollisions(): void {
    // detect new collisions
    let hazardCollisions: Hazard[] = CollisionUtil.hazardManager.detectCollisions(CollisionUtil.player);
    if (hazardCollisions.length > 0) {
      // decrease player health
      Flasher.startFlashingCollision(CollisionUtil.player, hazardCollisions);
      for (const haz of hazardCollisions) {
        haz.setToKill();
        CollisionUtil.player.modifyHealth(-1);
      }
    }
  }

  // handles logic for applying and resolving modifier effect collisions
  static actOnModifierCollision(newModifierType: ModifierType, player: Player, hazardManager: HazardManager): void {
    if (newModifierType == MODIFIER_TYPE.SHRINK_HAZ) {
      hazardManager.applySizeScaleFactor(MOD_EFFECT_CONFIG.SHRINK_HAZ.scaleFactor);
      return;
    } else if (newModifierType == MODIFIER_TYPE.ENLARGE_HAZ) {
      hazardManager.applySizeScaleFactor(MOD_EFFECT_CONFIG.ENLARGE_HAZ.scaleFactor);
      return;
    } else if (newModifierType == MODIFIER_TYPE.EXTRA_LIFE) {
      player.modifyHealth(1);
      return;
    }
    for (let activeEffect of player.effects) {
      // determine what to do with the new effect
      switch (collisionMatrix[COLLISION_ROLE.NEW][activeEffect.type][newModifierType]) {
        case COLLISION_ACTION.ACTIVATE:
          player.addEffect(newModifierType);
          break;
        case COLLISION_ACTION.DESTROY:
          // do nothing
          break;
        default:
          console.error(`Unexpected collision action for ${newModifierType} and ${activeEffect.type}`);
          break;
      }
      // determine what to do with the active effects
      switch (collisionMatrix[COLLISION_ROLE.OLD][activeEffect.type][newModifierType]) {
        case COLLISION_ACTION.REACTIVATE:
          activeEffect.resetEffectTimer();
          break;
        case COLLISION_ACTION.DESTROY:
          activeEffect.deactivate();
          break;
        case COLLISION_ACTION.IGNORE:
          break;
        default:
          console.error(`Unexpected collision action for ${newModifierType} and ${activeEffect.type}`);
          break;
      }
    }
    // update the player's abilities based on the new effects
    player.updateEffectsAbilities();
  }
}