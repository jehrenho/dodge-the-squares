import { GAME_CONFIG, GAME_OVER_CONFIG } from '../game/game-config.js';
import { Player } from '../world/entities/player.js';
import { HazardManager } from '../world/entities/hazard-manager.js';
import { ModifierManager } from '../world/entities/modifier-manager.js';
import { Menu } from './menu.js';
import { GameState } from '../game/game-state.js';

// Manages the canvas context and draws all game elements
export class Graphics {
  private ctx: CanvasRenderingContext2D;
  private gameState: GameState;
  private player: Player;
  private hazardManager: HazardManager;
  private modifierManager: ModifierManager;
  private windowScaleX: number = 0;
  private windowScaleY: number = 0;
  private scale: number = 0;

  // initializes the artist, must be called before any drawing
  constructor(gameState: GameState, 
    player: Player, 
    hazardManager: HazardManager, 
    modifierManager: ModifierManager) {
    // get the canvas element and its context
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    if (!canvas) throw new Error("Canvas element with id 'gameCanvas' not found.");
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!this.ctx) throw new Error("2D context not available.");
    // initialize canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // initialize artist state
    this.gameState = gameState;
    this.player = player;
    this.hazardManager = hazardManager;
    this.modifierManager = modifierManager;
    // initialize the menu
    Menu.init(this.ctx, player, hazardManager, modifierManager);
  }

  // clears the canvas and sets up window scaling to the current window size
  prepToDrawFrame(): void {
    // clear the game area
    this.ctx.clearRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);
    this.ctx.save();

    // set up translation and scaling for the game area
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any transforms

    this.windowScaleX = this.ctx.canvas.width / GAME_CONFIG.VIRTUAL_WIDTH;
    this.windowScaleY = this.ctx.canvas.height / GAME_CONFIG.VIRTUAL_HEIGHT;
    this.scale = Math.min(this.windowScaleX, this.windowScaleY);

    // calculate translation to center the game area
    const offsetX = (this.ctx.canvas.width - GAME_CONFIG.VIRTUAL_WIDTH * this.scale) / 2;
    const offsetY = (this.ctx.canvas.height - GAME_CONFIG.VIRTUAL_HEIGHT * this.scale) / 2;

    // apply the translation and scaling
    this.ctx.translate(offsetX, offsetY);
    this.ctx.scale(this.scale, this.scale);
  }

  // finishes drawing the current frame and restores the context
  finishDrawingFrame(): void {
    this.ctx.restore();

    // draw the black letterbox bars
    const gameWidth = GAME_CONFIG.VIRTUAL_WIDTH * this.scale;
    const gameHeight = GAME_CONFIG.VIRTUAL_HEIGHT * this.scale;
    const offsetX = (this.ctx.canvas.width - gameWidth) / 2;
    const offsetY = (this.ctx.canvas.height - gameHeight) / 2;

    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transforms
    this.ctx.fillStyle = GAME_CONFIG.letterboxColour;

    // left bar
    if (offsetX > 0) {
      this.ctx.fillRect(0, 0, offsetX, this.ctx.canvas.height);
      // right bar
      this.ctx.fillRect(offsetX + gameWidth, 0, offsetX, this.ctx.canvas.height);
    }
    // top bar
    if (offsetY > 0) {
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, offsetY);
      // bottom bar
      this.ctx.fillRect(0, offsetY + gameHeight, this.ctx.canvas.width, offsetY);
    }
    this.ctx.restore();
  }

  // draws the game background
  drawBackground(): void {
    this.ctx.fillStyle = GAME_CONFIG.backgroundColour;
    this.ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);
  }

  // draws the in-game text
  drawInGameText(): void {
    // print the time survived
    this.ctx.fillStyle = GAME_CONFIG.fontColour;
    this.ctx.font = GAME_CONFIG.statusBarFont;
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
    this.ctx.fillStyle = GAME_CONFIG.pausedFontColour;
    this.ctx.font = GAME_CONFIG.pausedFont;
    this.ctx.textAlign = "center";
    this.ctx.fillText(GAME_CONFIG.pauseTitle, GAME_CONFIG.VIRTUAL_WIDTH / 2, GAME_CONFIG.VIRTUAL_HEIGHT / 2);
    this.ctx.fillText(GAME_CONFIG.pauseMessage, GAME_CONFIG.VIRTUAL_WIDTH / 2, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 40);
  }

  // draws the game over screen
  drawGameOver(): void {
    this.drawBackground();
    this.ctx.fillStyle = GAME_OVER_CONFIG.fontColour;
    this.ctx.font = GAME_OVER_CONFIG.titleFont;
    this.ctx.textAlign = "center";
    this.ctx.fillText(GAME_OVER_CONFIG.gameOverTitle, GAME_CONFIG.VIRTUAL_WIDTH / 2, GAME_CONFIG.VIRTUAL_HEIGHT / 2);
    this.ctx.font = GAME_OVER_CONFIG.messagingFont;
    this.ctx.fillText(GAME_OVER_CONFIG.gameOverMessage.replace("{time}", this.gameState.getSecondsSurvived().toFixed(2)),
      GAME_CONFIG.VIRTUAL_WIDTH / 2, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 40);
    this.ctx.font = GAME_OVER_CONFIG.promptFont;
    this.ctx.fillText(GAME_OVER_CONFIG.gameOverPrompt, GAME_CONFIG.VIRTUAL_WIDTH / 2, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 80);
  }

  // draws the menu
  drawMenu(): void {
    this.drawBackground();
    Menu.draw();
  }

  setCanvasDimensions(width: number, height: number): void {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
  }

  // resets the artist's state
  reset(): void {
    Menu.reset();
  }
}