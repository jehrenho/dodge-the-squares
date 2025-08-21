import { GAME_CONFIG } from './config.js';
import { InputManager } from './input.js';
import { Player } from './player.js';
import { HazardManager } from './hazardManager.js';
import { ModifierManager } from './modifierManager.js';
import { handleModifierCollisions } from './modifierEffect.js';
import { Flasher } from './flasher.js';
export const canvas = document.getElementById("gameCanvas");
if (!canvas)
    throw new Error("Canvas element with id 'gameCanvas' not found.");
const ctx = canvas.getContext("2d");
if (!ctx)
    throw new Error("2D context not available.");
// represents the game state
export class GameState {
    constructor() {
        this.numFramesThisGame = 0;
        this.numSecondsSurvived = 0;
        this.numMinutesSurvived = 0;
        this.status = 0 /* GameStatus.MENU */;
    }
    // increments the frame count and updates the time survived
    incrementFrameCount() {
        this.numFramesThisGame++;
        this.numSecondsSurvived = this.numFramesThisGame / 60;
        this.numMinutesSurvived = this.numSecondsSurvived / 60;
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
    // returns the current game status
    getStatus() {
        return this.status;
    }
    // sets the current game status
    setStatus(status) {
        this.status = status;
    }
    // resets the game timer
    reset() {
        this.numFramesThisGame = 0;
        this.numSecondsSurvived = 0;
        this.numMinutesSurvived = 0;
    }
}
// draws the game background
function drawBackground() {
    ctx.fillStyle = GAME_CONFIG.backgroundColour;
    ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);
}
// draws the in-game text
function drawInGameText() {
    // print the time survived
    ctx.fillStyle = GAME_CONFIG.fontColour;
    ctx.font = GAME_CONFIG.statusBarFont;
    ctx.fillText(`Time: ${gameState.getSecondsSurvived().toFixed(2)}s`, 10, 20);
}
// draws all game elements
export function drawGameElements() {
    drawBackground();
    modifierManager.drawModifiers(ctx);
    hazardManager.draw(ctx);
    player.draw(ctx, player.colour);
    drawInGameText();
}
// draws the menu
function drawMenu() {
    ctx.fillStyle = GAME_CONFIG.fontColour;
    ctx.font = GAME_CONFIG.menuFont;
    ctx.fillText("Press Enter to Start", GAME_CONFIG.VIRTUAL_WIDTH / 2 - 100, GAME_CONFIG.VIRTUAL_HEIGHT / 2);
    if (inputManager.isEnterPressedAndReleased())
        gameState.setStatus(1 /* GameStatus.INGAME */);
}
// draws the game
function drawGame() {
    // update game objects
    modifierManager.updateModifiers();
    hazardManager.updateHazards();
    player.updatePosition(inputManager);
    // handle player-modifier collisions
    let modifierCollisions = modifierManager.detectCollisions(player, hazardManager);
    if (modifierCollisions.length > 0) {
        // player touched a modifier
        gameState.setStatus(2 /* GameStatus.COLLISION_FLASH */);
        flasher.setModifiers(modifierCollisions);
        for (const mod of modifierCollisions) {
            handleModifierCollisions(mod.modifierType, player, hazardManager);
        }
    }
    player.updateEffects();
    // handle player-hazard collisions
    let hazardCollisions = hazardManager.detectCollisions(player);
    if (hazardCollisions.length > 0) {
        // player touched a hazard
        gameState.setStatus(2 /* GameStatus.COLLISION_FLASH */);
        flasher.setHazards(hazardCollisions);
        player.updateHealth(-1);
    }
    drawGameElements();
    // update the time survived this game and increase difficulty
    gameState.incrementFrameCount();
    gameState.increaseDifficulty();
}
// draws the game over screen
function drawGameOver() {
    // print the game over screen
    ctx.fillStyle = GAME_CONFIG.gameOverFontColour;
    ctx.font = GAME_CONFIG.menuFont;
    ctx.fillText("Game Over", GAME_CONFIG.VIRTUAL_WIDTH / 2 - 70, GAME_CONFIG.VIRTUAL_HEIGHT / 2);
    ctx.fillText(`You Survived for: ${gameState.getSecondsSurvived().toFixed(2)}s`, GAME_CONFIG.VIRTUAL_WIDTH / 2 - 70, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 40);
    ctx.fillText("Press Enter to continue", GAME_CONFIG.VIRTUAL_WIDTH / 2 - 70, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 80);
    // listen for Enter key to continue to menu
    if (inputManager.isEnterPressedAndReleased()) {
        gameState.setStatus(0 /* GameStatus.MENU */);
        gameState.reset();
        player.reset();
        hazardManager.reset();
        modifierManager.reset();
    }
    ;
}
// main game loop: generates a single frame in the game
function gameLoop() {
    ctx.clearRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);
    // setup the window scaling
    const windowScaleX = canvas.width / GAME_CONFIG.VIRTUAL_WIDTH;
    const windowScaleY = canvas.height / GAME_CONFIG.VIRTUAL_HEIGHT;
    ctx.save();
    ctx.scale(windowScaleX, windowScaleY);
    // draw the game
    if (gameState.getStatus() === 0 /* GameStatus.MENU */) {
        drawMenu();
    }
    else if (gameState.getStatus() === 1 /* GameStatus.INGAME */) {
        drawGame();
    }
    else if (gameState.getStatus() === 2 /* GameStatus.COLLISION_FLASH */) {
        flasher.draw(ctx);
    }
    else if (gameState.getStatus() === 3 /* GameStatus.GAMEOVER */) {
        drawGameOver();
    }
    ctx.restore();
    // schedule next frame
    requestAnimationFrame(gameLoop);
}
// initialize canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// create instances of the game objects
const player = new Player();
const hazardManager = new HazardManager();
const modifierManager = new ModifierManager();
const inputManager = new InputManager();
const gameState = new GameState();
const flasher = new Flasher(player, gameState, modifierManager);
// start tracking keyboard input
inputManager.startListening();
// start the game loop
gameLoop();
