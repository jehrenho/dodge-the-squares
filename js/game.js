import { Keys } from './config.js';
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
        this.numSecondsSurvived = 0;
        this.numMinutesSurvived = 0;
        this.phase = 0 /* GamePhase.MENU */;
        this.isPaused = false;
    }
    // increments the frame count and updates the time survived
    incrementFrameCount() {
        this.numFramesThisGame++;
        this.numSecondsSurvived = this.numFramesThisGame / 60;
        this.numMinutesSurvived = this.numSecondsSurvived / 60;
        this.increaseDifficulty();
    }
    // returns the number of seconds survived
    getSecondsSurvived() {
        return this.numSecondsSurvived;
    }
    // returns the number of minutes survived
    getMinutesSurvived() {
        return this.numMinutesSurvived;
    }
    // increases the difficulty of hazards and modifiers
    increaseDifficulty() {
        if (this.numFramesThisGame % 60 === 0) { // every second
            hazardManager.updateDifficulty(this.numMinutesSurvived);
            // TODO: Implement difficulty increase for modifiers
        }
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
        this.numSecondsSurvived = 0;
        this.numMinutesSurvived = 0;
        this.isPaused = false;
    }
}
// main game loop: generates a single frame in the game
function gameLoop() {
    // prepare the graphics utility to draw the frame
    GraphicsUtil.prepToDrawFrame();
    // draw the frame depending on the game phase
    switch (gameState.getPhase()) {
        case 0 /* GamePhase.MENU */:
            GraphicsUtil.drawMenu();
            // start the game when Enter is pressed
            if (inputManager.isKeyJustReleased(Keys.ENTER))
                gameState.setPhase(1 /* GamePhase.INGAME */);
            break;
        case 1 /* GamePhase.INGAME */:
            generateInGameFrame();
            break;
        case 2 /* GamePhase.GAMEOVER */:
            GraphicsUtil.drawGameOver();
            // return to the menu when Enter is pressed
            if (inputManager.isKeyJustReleased(Keys.ENTER)) {
                resetGame();
                gameState.setPhase(0 /* GamePhase.MENU */);
            }
    }
    // finish drawing the frame and prepare the graphics utility for the next frame
    GraphicsUtil.finishDrawingFrame();
    // update the input manager for key rising/falling detection
    inputManager.update();
    // schedule the generation of the next frame
    requestAnimationFrame(gameLoop);
}
// generates an in-game frame
function generateInGameFrame() {
    // pause the game if space is pressed
    if (!gameState.isPaused && inputManager.isKeyPressed(Keys.SPACE)) {
        gameState.isPaused = true;
        inputManager.clearKeyState(Keys.SPACE);
    }
    // draw the pause menu if the game is paused
    if (gameState.isPaused) {
        GraphicsUtil.drawGamePaused();
        if (inputManager.isKeyJustReleased(Keys.SPACE))
            gameState.isPaused = false;
    }
    else if (Flasher.isFlashingCollision()) {
        // don't update the game objects if a collision is flashing, just draw the in-game elements
        Flasher.update();
        GraphicsUtil.drawInGameElements();
    }
    else {
        // end the game if the player is dead
        if (player.isDead()) {
            gameState.setPhase(2 /* GamePhase.GAMEOVER */);
        }
        // update game objects
        modifierManager.updateModifiers();
        hazardManager.updateHazards();
        player.updatePosition(inputManager);
        CollisionUtil.resolveModifierCollisions();
        player.updateEffects();
        CollisionUtil.resolveHazardCollisions();
        // draw the frame
        GraphicsUtil.drawInGameElements();
        // update the time survived this game and increase difficulty
        gameState.incrementFrameCount();
    }
}
// resets the game objects
function resetGame() {
    gameState.reset();
    player.reset();
    hazardManager.reset();
    modifierManager.reset();
    GraphicsUtil.reset();
}
// create and initialize all game objects
const gameState = new GameState();
const player = new Player();
const hazardManager = new HazardManager();
const modifierManager = new ModifierManager();
const inputManager = new InputManager();
GraphicsUtil.init(gameState, player, hazardManager, modifierManager);
CollisionUtil.init(player, hazardManager, modifierManager);
// start tracking keyboard input
inputManager.startListening();
// start the game loop
gameLoop();
