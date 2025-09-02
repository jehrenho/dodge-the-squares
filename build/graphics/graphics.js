import { STATUS_BAR_CONFIG, BACKGROUND_CONFIG, GAME_OVER_CONFIG, PAUSE_CONFIG } from './graphics-config.js';
import { SCALING_CONFIG } from './graphics-config.js';
import { Menu } from './menu.js';
import { Viewport } from './viewport.js';
// Manages the canvas context and draws all game elements
export class Graphics {
    constructor(gameState, player, hazardManager, modifierManager) {
        this.gameState = gameState;
        this.player = player;
        this.hazardManager = hazardManager;
        this.modifierManager = modifierManager;
        const canvas = document.getElementById("gameCanvas");
        if (!canvas)
            throw new Error("Canvas element with id 'gameCanvas' not found.");
        this.ctx = canvas.getContext("2d");
        if (!this.ctx)
            throw new Error("2D context not available.");
        this.menu = new Menu(this.ctx, player, hazardManager, modifierManager);
        this.viewport = new Viewport(this.ctx);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.virtualWidth = SCALING_CONFIG.VIRTUAL_WIDTH;
        this.virtualHeight = SCALING_CONFIG.VIRTUAL_HEIGHT;
    }
    // clears the canvas and sets up window scaling to the current window size
    prepToDrawFrame() {
        this.viewport.startFrame();
    }
    // finishes drawing the current frame and restores the context
    finishDrawingFrame() {
        this.viewport.finishFrame();
    }
    // draws the game background
    drawBackground() {
        this.ctx.fillStyle = BACKGROUND_CONFIG.backgroundColour;
        this.ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);
    }
    // draws the in-game text
    drawInGameText() {
        // print the time survived
        this.ctx.fillStyle = STATUS_BAR_CONFIG.fontColour;
        this.ctx.font = STATUS_BAR_CONFIG.font;
        this.ctx.fillText(`Time: ${this.gameState.getSecondsSurvived().toFixed(2)}s`, 10, 20);
    }
    // draws all in-game elements
    drawInGameElements() {
        this.drawBackground();
        this.modifierManager.drawModifiers(this.ctx);
        this.hazardManager.draw(this.ctx);
        this.player.draw(this.ctx);
        this.drawInGameText();
    }
    drawGamePaused() {
        this.drawInGameElements();
        this.ctx.fillStyle = PAUSE_CONFIG.fontColour;
        this.ctx.font = PAUSE_CONFIG.titleFont;
        this.ctx.textAlign = "center";
        this.ctx.fillText(PAUSE_CONFIG.pauseTitle, this.virtualWidth / 2, this.virtualHeight / 2);
        this.ctx.fillText(PAUSE_CONFIG.pauseMessage, this.virtualWidth / 2, this.virtualHeight / 2 + 40);
    }
    // draws the game over screen
    drawGameOver() {
        this.drawBackground();
        // draws the game over title
        this.ctx.fillStyle = GAME_OVER_CONFIG.fontColour;
        this.ctx.font = GAME_OVER_CONFIG.titleFont;
        this.ctx.textAlign = "center";
        this.ctx.fillText(GAME_OVER_CONFIG.gameOverTitle, this.virtualWidth / 2, this.virtualHeight / 2);
        // draws the game over time survived message
        this.ctx.font = GAME_OVER_CONFIG.messagingFont;
        this.ctx.fillText(GAME_OVER_CONFIG.gameOverMessage.replace("{time}", this.gameState.getSecondsSurvived().toFixed(2)), this.virtualWidth / 2, this.virtualHeight / 2 + 40);
        // draws the game over prompt
        this.ctx.font = GAME_OVER_CONFIG.promptFont;
        this.ctx.fillText(GAME_OVER_CONFIG.gameOverPrompt, this.virtualWidth / 2, this.virtualHeight / 2 + 80);
    }
    // draws the menu
    drawMenu() {
        this.drawBackground();
        this.menu.draw();
    }
    setCanvasDimensions(width, height) {
        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;
    }
    // resets the artist's state
    reset() {
        this.menu.reset();
    }
}
