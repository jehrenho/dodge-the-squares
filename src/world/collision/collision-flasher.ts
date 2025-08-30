import { COLLISION_FLASH_CONFIG } from './collision-config.js';

// handles the flashing of game objects upon collisions
export class CollisionFlasher {
  private readonly defaultDuration: number;
  private readonly framesPerFlash: number;
  private flashingFramesRemaining: number;
  private framesRemainingThisFlash: number;
  private flashOn: boolean;

  constructor() {
    this.defaultDuration = COLLISION_FLASH_CONFIG.duration;
    this.framesPerFlash = COLLISION_FLASH_CONFIG.framesPerFlash;
    this.flashingFramesRemaining = 0;
    this.framesRemainingThisFlash = 0;
    this.flashOn = false;
  }

  // starts the flashing effect
  startFlashing(): void {
    this.flashingFramesRemaining = this.defaultDuration;
    this.framesRemainingThisFlash = this.framesPerFlash;
    this.flashOn = true;
  }

  // flashes the colours of the flashing objects
  update() {
    if (this.isFlashing()) {
      if (this.framesRemainingThisFlash == 0) {
        // toggle between flash colour and default colour
        this.framesRemainingThisFlash = this.framesPerFlash;
        this.flashOn = !this.flashOn;
      }
      this.flashingFramesRemaining--;
      this.framesRemainingThisFlash--;
    }
  }

  // returns true if the collided objects should be the flash colour
  isFlashOn(): boolean {
    return this.flashOn;
  }

  // returns true if a collision is currently flashing
  isFlashing(): boolean {
    return this.flashingFramesRemaining > 0;
  }
}