import { GAME_CONFIG } from './config.js';
import { Player } from './player.js';
import { HazardManager } from './hazardManager.js';
import { ModifierManager } from './modifierManager.js';
import { Menu } from './menu.js';
import { GameState } from './game.js';

// Manages the canvas context and draws all game elements
export class Artist {
  static ctx: CanvasRenderingContext2D;
  static gameState: GameState;
  static player: Player;
  static hazardManager: HazardManager;
  static modifierManager: ModifierManager;

  // initializes the artist, must be called before any drawing
  static init(gameState: GameState, 
    player: Player, 
    hazardManager: HazardManager, 
    modifierManager: ModifierManager) {
    // get the canvas element and its context
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    if (!canvas) throw new Error("Canvas element with id 'gameCanvas' not found.");
    Artist.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!Artist.ctx) throw new Error("2D context not available.");
    // initialize canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // initialize artist state
    Artist.gameState = gameState;
    Artist.player = player;
    Artist.hazardManager = hazardManager;
    Artist.modifierManager = modifierManager;
    // initialize the menu
    Menu.init(Artist.ctx, player, hazardManager, modifierManager);
  }

  // clears the canvas and sets up window scaling to the current window size
  static prepToDrawFrame(): void {
    Artist.ctx.clearRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);
    const windowScaleX = Artist.ctx.canvas.width / GAME_CONFIG.VIRTUAL_WIDTH;
    const windowScaleY = Artist.ctx.canvas.height / GAME_CONFIG.VIRTUAL_HEIGHT;
    Artist.ctx.save();
    Artist.ctx.scale(windowScaleX, windowScaleY);
  }

  // restores the canvas context to its previous state so scaling can be reapplied
  static prepToDrawNextFrame(): void {
    Artist.ctx.restore();
  }

  // draws the game background
  static drawBackground(): void {
    Artist.ctx.fillStyle = GAME_CONFIG.backgroundColour;
    Artist.ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);
  }

  // draws the in-game text
  static drawInGameText(): void {
    // print the time survived
    Artist.ctx.fillStyle = GAME_CONFIG.fontColour;
    Artist.ctx.font = GAME_CONFIG.statusBarFont;
    Artist.ctx.fillText(`Time: ${Artist.gameState.getSecondsSurvived().toFixed(2)}s`, 10, 20);
  }

  // draws all in-game elements
  static drawInGameElements(): void {
    Artist.drawBackground();
    Artist.modifierManager.drawModifiers(Artist.ctx);
    Artist.hazardManager.draw(Artist.ctx);
    Artist.player.draw(Artist.ctx);
    Artist.drawInGameText();
  }

  static drawGamePaused(): void {
    Artist.drawInGameElements();
    Artist.ctx.fillStyle = GAME_CONFIG.pausedFontColour;
    Artist.ctx.font = GAME_CONFIG.pausedFont;
    Artist.ctx.textAlign = "center";
    Artist.ctx.fillText(GAME_CONFIG.pauseTitle, GAME_CONFIG.VIRTUAL_WIDTH / 2, GAME_CONFIG.VIRTUAL_HEIGHT / 2);
    Artist.ctx.fillText(GAME_CONFIG.pauseMessage, GAME_CONFIG.VIRTUAL_WIDTH / 2, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 40);
  }

  // draws the game over screen
  static drawGameOver(): void {
    Artist.drawBackground();
    Artist.ctx.fillStyle = GAME_CONFIG.gameOverFontColour;
    Artist.ctx.font = GAME_CONFIG.menuFont;
    Artist.ctx.fillText("Game Over", GAME_CONFIG.VIRTUAL_WIDTH / 2 - 70, GAME_CONFIG.VIRTUAL_HEIGHT / 2);
    Artist.ctx.fillText(`You Survived for: ${Artist.gameState.getSecondsSurvived().toFixed(2)}s`, 
      GAME_CONFIG.VIRTUAL_WIDTH / 2 - 70, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 40);
    Artist.ctx.fillText("Press Enter to continue", GAME_CONFIG.VIRTUAL_WIDTH / 2 - 70, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 80);
  }

  // draws the menu
  static drawMenu(): void {
    Menu.draw();
  }

  // resets the artist's state
  static reset(): void {
    Menu.reset();
  }
}