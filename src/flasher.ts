import { GameStatus, GAME_CONFIG } from './config.js';
import { Player } from './player.js';
import { Hazard } from './hazardManager.js';
import { Modifier, ModifierManager } from './modifierManager.js';
import { GameState, drawGameElements } from './game.js';

// handles the flashing of game objects upon collisions
export class Flasher {
  player: Player;
  gameState: GameState;
  modifierManager: ModifierManager;
  hazards: Hazard[];
  modifiers: Modifier[];
  flashingFramesRemaining: number;
  framesRemainingThisFlash: number;
  flashColour: string;
  isFlashOnNow: boolean;

  constructor(player: Player, gameState: GameState, modifierManager: ModifierManager) {
    this.player = player;
    this.gameState = gameState;
    this.modifierManager = modifierManager;
    this.hazards = [];
    this.modifiers = [];
    this.flashingFramesRemaining = 0;
    this.framesRemainingThisFlash = GAME_CONFIG.framesPerFlash;
    this.flashColour = GAME_CONFIG.collisionFlashColour;
    this.isFlashOnNow = true;
  }

  // sets the hazards to flash if there are any
  setHazards(hazards: Hazard[]): void {
    if (hazards.length === 0) return;
    else {
      this.hazards = hazards;
      this.flashingFramesRemaining = GAME_CONFIG.flashingFramesDuration;
    }
  }

  // sets the modifiers to flash if there are any
  setModifiers(modifiers: Modifier[]): void {
    if (modifiers.length === 0) return;
    else {
      this.modifiers = modifiers;
      this.flashingFramesRemaining = GAME_CONFIG.flashingFramesDuration;
    }
  }

  // returns true if the collision flasher is currently flashing
  isFlashing(): boolean {
    return this.flashingFramesRemaining > 0;
  }

  // draws the collision flash effect
  draw(ctx: CanvasRenderingContext2D): void {
    // draw all the existing game elements
    drawGameElements();

    if (this.isFlashOnNow) {
      // draw the objects in the flash colour
      this.player.draw(ctx, this.flashColour);
      for (const hazard of this.hazards) {
        hazard.draw(ctx, this.flashColour);
      }
      for (const modifier of this.modifiers) {
        modifier.draw(ctx, this.flashColour);
      }
    } else {
      // draw the objects in with their normal colours
      this.player.draw(ctx, this.player.colour);
      for (const hazard of this.hazards) {
        hazard.draw(ctx, hazard.colour);
      }
      for (const modifier of this.modifiers) {
        modifier.draw(ctx, modifier.fillColour);
      }
    }
    // update the flashing state
    if (this.isFlashing()) {
      // toggle between flash colour and default colour
      if (this.framesRemainingThisFlash == 0) {
        this.framesRemainingThisFlash = GAME_CONFIG.framesPerFlash;
        this.isFlashOnNow = !this.isFlashOnNow;
      }
      this.flashingFramesRemaining--;
      this.framesRemainingThisFlash--;
    } else {
      // exit the COLLISION_FLASH state and continue with the game
      if (this.player.isDead()) this.gameState.setStatus(GameStatus.GAMEOVER);
      else {
        this.gameState.setStatus(GameStatus.INGAME);
        this.modifierManager.destroyModifiers(this.modifiers);
      }
      this.reset();
    }
  }

  // resets the collision flasher
  reset(): void {
    this.hazards = [];
    this.modifiers = [];
    this.flashingFramesRemaining = 0;
    this.framesRemainingThisFlash = GAME_CONFIG.framesPerFlash;
    this.flashColour = GAME_CONFIG.collisionFlashColour;
    this.isFlashOnNow = true;
  }
}