import { ModifierType, MODIFIER_TYPE, COLLISION_ROLE, COLLISION_ACTION, collisionMatrix, MOD_EFFECT_CONFIG } from './config.js';
import { Player } from './player.js';
import { Hazard } from './hazard.js';
import { Modifier } from './modifier.js';
import { HazardManager } from './hazardManager.js';
import { ModifierManager } from './modifierManager.js';
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
      // start flashing the player and collided modifiers
      Flasher.startFlashingCollision(CollisionUtil.player, modifierCollisions);
      for (const mod of modifierCollisions) {
        // destroy the modifier and apply the modifiers effect(s)
        mod.setToKill();
        CollisionUtil.actOnModifierCollision(mod.getType(), CollisionUtil.player, CollisionUtil.hazardManager);
      }
    }
  }

  // detects new player-hazard collisions and decreases player health when a hazard is touched
  static resolveHazardCollisions(): void {
    // detect new collisions
    let hazardCollisions: Hazard[] = CollisionUtil.hazardManager.detectCollisions(CollisionUtil.player);
    if (hazardCollisions.length > 0) {
      Flasher.startFlashingCollision(CollisionUtil.player, hazardCollisions);
      for (const haz of hazardCollisions) {
        // destroy the hazard and decrease player health
        haz.setToKill();
        CollisionUtil.player.modifyHealth(-1);
      }
    }
  }

  // handles logic for applying and resolving modifier effect collisions
  static actOnModifierCollision(newModifierType: ModifierType, player: Player, hazardManager: HazardManager): void {
    // activate the effect if there are no other active effects
    if (player.isNoEffects()) {
      CollisionUtil.activateEffect(newModifierType, player, hazardManager);
      return;
    }
    // determine what to do, given a new modifier collision, when there are active effects
    for (let activeEffect of player.effects) {
      // determine what to do with the new modifier effect
      switch (collisionMatrix[COLLISION_ROLE.NEW][activeEffect.type][newModifierType]) {
        case COLLISION_ACTION.ACTIVATE:
          CollisionUtil.activateEffect(newModifierType, player, hazardManager);
          break;
        case COLLISION_ACTION.DESTROY:
          // do nothing
          break;
        default:
          console.error(`Unexpected collision action for ${newModifierType} and ${activeEffect.type}`);
          break;
      }
      // determine what to do with the already active effects
      switch (collisionMatrix[COLLISION_ROLE.OLD][activeEffect.type][newModifierType]) {
        case COLLISION_ACTION.REACTIVATE:
          activeEffect.reset();
          break;
        case COLLISION_ACTION.DESTROY:
          activeEffect.deactivate();
          break;
        case COLLISION_ACTION.IGNORE:
          // do nothing
          break;
        default:
          console.error(`Unexpected collision action for ${newModifierType} and ${activeEffect.type}`);
          break;
      }
    }
  }

  // activates new effects
  static activateEffect(type: ModifierType, player: Player, hazardManager: HazardManager): void {
    switch (type) {
      case MODIFIER_TYPE.SHRINK_HAZ:
        hazardManager.applySizeScaleFactor(MOD_EFFECT_CONFIG.SHRINK_HAZ.scaleFactor);
        break;
      case MODIFIER_TYPE.ENLARGE_HAZ:
        hazardManager.applySizeScaleFactor(MOD_EFFECT_CONFIG.ENLARGE_HAZ.scaleFactor);
        break;
      case MODIFIER_TYPE.EXTRA_LIFE:
        player.modifyHealth(1);
        break;
      case MODIFIER_TYPE.INVINCIBILITY:
        player.addEffect(type);
        break;
      case MODIFIER_TYPE.ICE_RINK:
        player.addEffect(type);
        break;
      default:
        console.error(`Unexpected modifier type: ${type}`);
        break;
    }
  }
}