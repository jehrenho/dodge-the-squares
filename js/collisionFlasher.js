import { GAME_CONFIG } from './config.js';
import { drawGameElements } from './game.js';
// handles the flashing of game objects upon collisions
export class CollisionFlasher {
    constructor(player, gameState, hazardManager, modifierManager) {
        this.player = player;
        this.gameState = gameState;
        this.hazardManager = hazardManager;
        this.modifierManager = modifierManager;
        this.hazards = [];
        this.modifiers = [];
        this.flashingFramesRemaining = 0;
        this.framesRemainingThisFlash = GAME_CONFIG.framesPerFlash;
        this.flashColour = GAME_CONFIG.collisionFlashColour;
        this.isFlashOnNow = true;
    }
    // sets the hazards to flash if there are any
    setHazards(hazards) {
        if (hazards.length === 0)
            return;
        else {
            this.hazards = hazards;
            this.flashingFramesRemaining = GAME_CONFIG.flashingFramesDuration;
        }
    }
    // sets the modifiers to flash if there are any
    setModifiers(modifiers) {
        if (modifiers.length === 0)
            return;
        else {
            this.modifiers = modifiers;
            this.flashingFramesRemaining = GAME_CONFIG.flashingFramesDuration;
        }
    }
    // returns true if the collision flasher is currently flashing
    isFlashing() {
        return this.flashingFramesRemaining > 0;
    }
    // draws the collision flash effect
    draw(ctx) {
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
        }
        else {
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
        }
        else {
            // exit the COLLISION_FLASH state and continue with the game
            if (this.player.isDead())
                this.gameState.setPhase(3 /* GamePhase.GAMEOVER */);
            else {
                this.gameState.setPhase(1 /* GamePhase.INGAME */);
                this.modifierManager.destroyModifiers(this.modifiers);
                this.hazardManager.destroyHazards(this.hazards);
            }
            this.reset();
        }
    }
    // resets the collision flasher
    reset() {
        this.hazards = [];
        this.modifiers = [];
        this.flashingFramesRemaining = 0;
        this.framesRemainingThisFlash = GAME_CONFIG.framesPerFlash;
        this.flashColour = GAME_CONFIG.collisionFlashColour;
        this.isFlashOnNow = true;
    }
}
