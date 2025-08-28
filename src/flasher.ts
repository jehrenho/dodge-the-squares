import { GAME_CONFIG } from './config.js';
import { Player } from './player.js';
import { Hazard } from './hazard.js';
import { Modifier } from './modifier.js';

// handles the flashing of game objects upon collisions
export class Flasher {
  static framesRemainingThisFlash: number = GAME_CONFIG.framesPerFlash;
  static flashFillColour: string = GAME_CONFIG.collisionFlashFillColour;
  static flashBorderColour: string = GAME_CONFIG.collisionFlashBorderColour;
  static flashingFramesRemaining: number = 0;
  static isFlashOnNow: boolean = true;
  static playerToFlash: Player;
  static shapesToFlash: (Hazard | Modifier)[];

  // flashes the player and hazards
  static startFlashingCollision(player: Player, shapesToFlash: (Hazard | Modifier)[]): void {
    Flasher.playerToFlash = player;
    Flasher.shapesToFlash = shapesToFlash;
    Flasher.flashingFramesRemaining = GAME_CONFIG.flashingFramesDuration;
    Flasher.framesRemainingThisFlash = GAME_CONFIG.framesPerFlash;
    // make the player and shapes the flash colour
    Flasher.isFlashOnNow = true;
    Flasher.playerToFlash.setColour(Flasher.flashFillColour, Flasher.flashBorderColour);
    for (const shape of Flasher.shapesToFlash) {
      shape.setColour(Flasher.flashFillColour, Flasher.flashBorderColour);
    }
  }

  // flashes the colours of the flashing objects
  static update() {
    if (Flasher.isFlashingCollision()) {
      if (Flasher.framesRemainingThisFlash == 0) {
        // toggle between flash colour and default colour
        Flasher.framesRemainingThisFlash = GAME_CONFIG.framesPerFlash;
        Flasher.isFlashOnNow = !Flasher.isFlashOnNow;
        if (Flasher.isFlashOnNow) {
          Flasher.playerToFlash.setColour(Flasher.flashFillColour, Flasher.flashBorderColour);
          for (const shape of Flasher.shapesToFlash) {
            shape.setColour(Flasher.flashFillColour, Flasher.flashBorderColour);
          }
        } else {
          Flasher.playerToFlash.setDefaultColour();
          for (const shape of Flasher.shapesToFlash) {
            shape.setDefaultColour();
          }
        }
      }
      Flasher.flashingFramesRemaining--;
      Flasher.framesRemainingThisFlash--;
    }
    else {
      // flashing complete, reset the colours of the player and shapes
      Flasher.playerToFlash.setDefaultColour();
      for (const shape of Flasher.shapesToFlash) {
        shape.setDefaultColour();
      }
      Flasher.reset();
    }
  }

  // returns true if a collision is currently flashing
  static isFlashingCollision(): boolean {
    return Flasher.flashingFramesRemaining > 0;
  }

  // resets the collision flasher
  static reset(): void {
    Flasher.flashingFramesRemaining = 0;
    Flasher.isFlashOnNow = true;
  }
}