import { STATUS_BAR_CONFIG, BACKGROUND_CONFIG, GAME_OVER_CONFIG, PAUSE_CONFIG } from './graphics-config.js';
import { SCALING_CONFIG } from './graphics-config.js';
import { Player } from '../world/entities/player.js';
import { HazardManager } from '../world/entities/hazard-manager.js';
import { ModifierManager } from '../world/entities/modifier-manager.js';
import { Menu } from './menu.js';
import { GameOver } from './game-over.js'
import { GameState } from '../game/game-state.js';
import { Viewport } from './viewport.js';

// manages the canvas context and draws all game elements
export class Graphics {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly gameState: GameState;
  private readonly player: Player;
  private readonly hazardManager: HazardManager;
  private readonly modifierManager: ModifierManager;
  private readonly menu: Menu;
  private readonly gameOver: GameOver;

  private readonly viewport: Viewport;

  constructor(gameState: GameState, 
    player: Player, 
    hazardManager: HazardManager, 
    modifierManager: ModifierManager) {
    this.gameState = gameState;
    this.player = player;
    this.hazardManager = hazardManager;
    this.modifierManager = modifierManager;
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    if (!canvas) throw new Error("Canvas element with id 'gameCanvas' not found.");
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!this.ctx) throw new Error("2D context not available.");
    this.menu = new Menu(this.ctx, player, hazardManager, modifierManager);
    this.gameOver = new GameOver(this.ctx, gameState);
    this.viewport = new Viewport(this.ctx);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // clears the canvas and sets up window scaling to the current window size
  prepToDrawFrame(): void {
    this.viewport.startFrame();
  }

  // finishes drawing the current frame and restores the context
  finishDrawingFrame(): void {
    this.viewport.finishFrame();
  }

  // draws the game background
  drawBackground(): void {
    this.ctx.fillStyle = BACKGROUND_CONFIG.backgroundColour;
    this.ctx.fillRect(0, 0, SCALING_CONFIG.virtualWidth, SCALING_CONFIG.virtualHeight);
  }

  // draws the in-game text
  drawInGameText(): void {
    // print the time survived
    this.ctx.fillStyle = STATUS_BAR_CONFIG.fontColour;
    this.ctx.font = STATUS_BAR_CONFIG.font;
    this.ctx.fillText(`Time: ${this.gameState.getSecondsSurvived().toFixed(2)}s`, 10, 20);
  }

  // draws all in-game elements
  drawInGameElements(): void {
    this.drawBackground();
    this.modifierManager.drawModifiers(this.ctx);
    this.hazardManager.draw(this.ctx);
    this.player.draw(this.ctx);
    this.drawInGameText();
  }

  drawGamePaused(): void {
    this.drawInGameElements();
    this.ctx.fillStyle = PAUSE_CONFIG.fontColour;
    this.ctx.font = PAUSE_CONFIG.titleFont;
    this.ctx.textAlign = "center";
    this.ctx.fillText(PAUSE_CONFIG.pauseTitle, SCALING_CONFIG.virtualWidth / 2, SCALING_CONFIG.virtualHeight / 2);
    this.ctx.fillText(PAUSE_CONFIG.pauseMessage, SCALING_CONFIG.virtualWidth / 2, SCALING_CONFIG.virtualHeight / 2 + 40);
  }

  // draws the game over screen
  drawGameOver(): void {
    this.drawBackground();
    this.gameOver.draw();
  }

  // draws the menu
  drawMenu(): void {
    this.drawBackground();
    this.menu.draw();
  }

  setCanvasDimensions(width: number, height: number): void {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
  }

  // resets the artist's state
  reset(): void {
    this.menu.reset();
  }
}