import { GameState } from './game-state.js';
import { InputManager } from '../input/input-manager.js';
import { Graphics } from '../graphics/graphics.js';
import { World } from '../world/world.js';
// represents a single game instance
export class Game {
    constructor() {
        this.gameState = new GameState();
        this.world = new World(this.gameState);
        this.graphics = new Graphics(this.gameState, this.world.getPlayer(), this.world.getHazardManager(), this.world.getModifierManager());
        this.inputManager = new InputManager(this.graphics);
    }
    start() {
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    update() {
        this.inputManager.update();
        switch (this.gameState.getPhase()) {
            case 0 /* GamePhase.MENU */:
                // start the game when Enter is pressed
                if (this.inputManager.isEnterPressed())
                    this.gameState.setPhase(1 /* GamePhase.INGAME */);
                break;
            case 1 /* GamePhase.INGAME */:
                // pause the game if space is pressed
                if (!this.gameState.isPaused() && this.inputManager.isSpacePressed()) {
                    this.gameState.setPaused(true);
                    this.inputManager.waitForSpaceToRise();
                }
                // draw the pause menu if the game is paused
                if (this.gameState.isPaused()) {
                    if (this.inputManager.isSpacePressed()) {
                        this.gameState.setPaused(false);
                        this.inputManager.waitForSpaceToRise();
                    }
                }
                else {
                    this.world.update(this.inputManager.getPlayerMovementInput());
                    this.gameState.incrementFrameCount();
                    if (this.world.isPlayerDead()) {
                        this.gameState.setPhase(2 /* GamePhase.GAMEOVER */);
                    }
                }
                break;
            case 2 /* GamePhase.GAMEOVER */:
                if (this.inputManager.isEnterPressed()) {
                    this.resetGame();
                    this.gameState.setPhase(0 /* GamePhase.MENU */);
                    this.inputManager.waitForEnterToRise();
                }
                break;
        }
    }
    render() {
        this.graphics.prepToDrawFrame();
        switch (this.gameState.getPhase()) {
            case 0 /* GamePhase.MENU */:
                this.graphics.drawMenu();
                break;
            case 1 /* GamePhase.INGAME */:
                if (this.gameState.isPaused()) {
                    this.graphics.drawGamePaused();
                }
                else {
                    this.graphics.drawInGameElements();
                }
                break;
            case 2 /* GamePhase.GAMEOVER */:
                this.graphics.drawGameOver();
                break;
        }
        this.graphics.finishDrawingFrame();
    }
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    resetGame() {
        this.gameState.reset();
        this.world.reset();
        this.graphics.reset();
    }
}
const game = new Game();
game.start();
