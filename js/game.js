import { Keys, GAME_CONFIG } from './config.js';
import { InputManager } from './inputManager.js';
import { Player } from './player.js';
import { HazardManager } from './hazardManager.js';
import { ModifierManager } from './modifierManager.js';
import { Flasher } from './flasher.js';
import { GraphicsUtil } from './graphicsUtil.js';
import { CollisionUtil } from './collisionUtil.js';
// stores and manages the game phase and game timer
export class GameState {
    constructor() {
        this.numFramesThisGame = 0;
        this.phase = 0 /* GamePhase.MENU */;
        this.isPaused = false;
    }
    // increments the frame count and updates the time survived
    incrementFrameCount(hazardManager) {
        this.numFramesThisGame++;
    }
    // returns the number of frames survived
    getFramesSurvived() {
        return this.numFramesThisGame;
    }
    // returns the number of seconds survived
    getSecondsSurvived() {
        return this.numFramesThisGame / GAME_CONFIG.fps;
    }
    // returns the number of minutes survived
    getMinutesSurvived() {
        return this.numFramesThisGame / GAME_CONFIG.fpm;
    }
    // returns the current game phase
    getPhase() {
        return this.phase;
    }
    // sets the current game phase
    setPhase(phase) {
        this.phase = phase;
    }
    // resets the game timer
    reset() {
        this.numFramesThisGame = 0;
        this.phase = 0 /* GamePhase.MENU */;
        this.isPaused = false;
    }
}
// represents a single game instance
export class Game {
    constructor() {
        this.gameState = new GameState();
        this.player = new Player();
        this.hazardManager = new HazardManager(this.gameState);
        this.modifierManager = new ModifierManager();
        this.inputManager = new InputManager();
        GraphicsUtil.init(this.gameState, this.player, this.hazardManager, this.modifierManager);
        CollisionUtil.init(this.player, this.hazardManager, this.modifierManager);
        // start tracking keyboard input
        this.inputManager.startListening();
    }
    // the main game loop: generates a single frame in the game
    gameLoop() {
        // prepare the graphics utility to draw the frame
        GraphicsUtil.prepToDrawFrame();
        // draw the frame depending on the game phase
        switch (this.gameState.getPhase()) {
            case 0 /* GamePhase.MENU */:
                GraphicsUtil.drawMenu();
                // start the game when Enter is pressed
                if (this.inputManager.isKeyJustReleased(Keys.ENTER))
                    this.gameState.setPhase(1 /* GamePhase.INGAME */);
                break;
            case 1 /* GamePhase.INGAME */:
                this.generateInGameFrame();
                break;
            case 2 /* GamePhase.GAMEOVER */:
                GraphicsUtil.drawGameOver();
                // return to the menu when Enter is pressed
                if (this.inputManager.isKeyJustReleased(Keys.ENTER)) {
                    this.resetGame();
                    this.gameState.setPhase(0 /* GamePhase.MENU */);
                }
        }
        // finish drawing the frame and prepare the graphics utility for the next frame
        GraphicsUtil.finishDrawingFrame();
        // update the input manager for key rising/falling detection
        this.inputManager.update();
        // schedule the generation of the next frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    // generates an in-game frame
    generateInGameFrame() {
        // pause the game if space is pressed
        if (!this.gameState.isPaused && this.inputManager.isKeyPressed(Keys.SPACE)) {
            this.gameState.isPaused = true;
            this.inputManager.clearKeyState(Keys.SPACE);
        }
        // draw the pause menu if the game is paused
        if (this.gameState.isPaused) {
            GraphicsUtil.drawGamePaused();
            if (this.inputManager.isKeyJustReleased(Keys.SPACE))
                this.gameState.isPaused = false;
        }
        else if (Flasher.isFlashingCollision()) {
            // don't update the game objects if a collision is flashing, just draw the in-game elements
            Flasher.update();
            GraphicsUtil.drawInGameElements();
        }
        else {
            // end the game if the player is dead
            if (this.player.isDead()) {
                this.gameState.setPhase(2 /* GamePhase.GAMEOVER */);
            }
            // update game objects
            this.modifierManager.updateModifiers();
            this.hazardManager.updateHazards();
            this.player.updatePosition(this.inputManager);
            CollisionUtil.resolveModifierCollisions();
            this.player.updateEffects();
            CollisionUtil.resolveHazardCollisions();
            // draw the frame
            GraphicsUtil.drawInGameElements();
            // update the time survived this game and increase difficulty
            this.gameState.incrementFrameCount(this.hazardManager);
        }
    }
    // resets the game objects
    resetGame() {
        this.gameState.reset();
        this.player.reset();
        this.hazardManager.reset();
        this.modifierManager.reset();
        GraphicsUtil.reset();
    }
    // start the game loop
    start() {
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}
// start the game
const game = new Game();
game.start();
