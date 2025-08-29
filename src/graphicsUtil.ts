import { GAME_CONFIG, GAME_OVER_CONFIG } from './config.js';
import { Player } from './player.js';
import { HazardManager } from './hazardManager.js';
import { ModifierManager } from './modifierManager.js';
import { Menu } from './menu.js';
import { GameState } from './game.js';

// Manages the canvas context and draws all game elements
export class GraphicsUtil {
  static ctx: CanvasRenderingContext2D;
  static gameState: GameState;
  static player: Player;
  static hazardManager: HazardManager;
  static modifierManager: ModifierManager;
  static windowScaleX: number = 0;
  static windowScaleY: number = 0;
  static scale: number = 0;

  // initializes the artist, must be called before any drawing
  static init(gameState: GameState, 
    player: Player, 
    hazardManager: HazardManager, 
    modifierManager: ModifierManager) {
    // get the canvas element and its context
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    if (!canvas) throw new Error("Canvas element with id 'gameCanvas' not found.");
    GraphicsUtil.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!GraphicsUtil.ctx) throw new Error("2D context not available.");
    // initialize canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // initialize artist state
    GraphicsUtil.gameState = gameState;
    GraphicsUtil.player = player;
    GraphicsUtil.hazardManager = hazardManager;
    GraphicsUtil.modifierManager = modifierManager;
    // initialize the menu
    Menu.init(GraphicsUtil.ctx, player, hazardManager, modifierManager);
  }

  // clears the canvas and sets up window scaling to the current window size
  static prepToDrawFrame(): void {
    // clear the game area
    GraphicsUtil.ctx.clearRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);
    GraphicsUtil.ctx.save();

    // set up translation and scaling for the game area
    GraphicsUtil.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any transforms

    GraphicsUtil.windowScaleX = GraphicsUtil.ctx.canvas.width / GAME_CONFIG.VIRTUAL_WIDTH;
    GraphicsUtil.windowScaleY = GraphicsUtil.ctx.canvas.height / GAME_CONFIG.VIRTUAL_HEIGHT;
    GraphicsUtil.scale = Math.min(GraphicsUtil.windowScaleX, GraphicsUtil.windowScaleY);

    // calculate translation to center the game area
    const offsetX = (GraphicsUtil.ctx.canvas.width - GAME_CONFIG.VIRTUAL_WIDTH * GraphicsUtil.scale) / 2;
    const offsetY = (GraphicsUtil.ctx.canvas.height - GAME_CONFIG.VIRTUAL_HEIGHT * GraphicsUtil.scale) / 2;

    // apply the translation and scaling
    GraphicsUtil.ctx.translate(offsetX, offsetY);
    GraphicsUtil.ctx.scale(GraphicsUtil.scale, GraphicsUtil.scale);
  }

  // finishes drawing the current frame and restores the context
  static finishDrawingFrame(): void {
    GraphicsUtil.ctx.restore();

    // draw the black letterbox bars
    const gameWidth = GAME_CONFIG.VIRTUAL_WIDTH * GraphicsUtil.scale;
    const gameHeight = GAME_CONFIG.VIRTUAL_HEIGHT * GraphicsUtil.scale;
    const offsetX = (GraphicsUtil.ctx.canvas.width - gameWidth) / 2;
    const offsetY = (GraphicsUtil.ctx.canvas.height - gameHeight) / 2;

    GraphicsUtil.ctx.save();
    GraphicsUtil.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transforms
    GraphicsUtil.ctx.fillStyle = GAME_CONFIG.letterboxColour;

    // left bar
    if (offsetX > 0) {
      GraphicsUtil.ctx.fillRect(0, 0, offsetX, GraphicsUtil.ctx.canvas.height);
      // right bar
      GraphicsUtil.ctx.fillRect(offsetX + gameWidth, 0, offsetX, GraphicsUtil.ctx.canvas.height);
    }
    // top bar
    if (offsetY > 0) {
      GraphicsUtil.ctx.fillRect(0, 0, GraphicsUtil.ctx.canvas.width, offsetY);
      // bottom bar
      GraphicsUtil.ctx.fillRect(0, offsetY + gameHeight, GraphicsUtil.ctx.canvas.width, offsetY);
    }
    GraphicsUtil.ctx.restore();
  }

  // draws the game background
  static drawBackground(): void {
    GraphicsUtil.ctx.fillStyle = GAME_CONFIG.backgroundColour;
    GraphicsUtil.ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);
  }

  // draws the in-game text
  static drawInGameText(): void {
    // print the time survived
    GraphicsUtil.ctx.fillStyle = GAME_CONFIG.fontColour;
    GraphicsUtil.ctx.font = GAME_CONFIG.statusBarFont;
    GraphicsUtil.ctx.fillText(`Time: ${GraphicsUtil.gameState.getSecondsSurvived().toFixed(2)}s`, 10, 20);
  }

  // draws all in-game elements
  static drawInGameElements(): void {
    GraphicsUtil.drawBackground();
    GraphicsUtil.modifierManager.drawModifiers(GraphicsUtil.ctx);
    GraphicsUtil.hazardManager.draw(GraphicsUtil.ctx);
    GraphicsUtil.player.draw(GraphicsUtil.ctx);
    GraphicsUtil.drawInGameText();
  }

  static drawGamePaused(): void {
    GraphicsUtil.drawInGameElements();
    GraphicsUtil.ctx.fillStyle = GAME_CONFIG.pausedFontColour;
    GraphicsUtil.ctx.font = GAME_CONFIG.pausedFont;
    GraphicsUtil.ctx.textAlign = "center";
    GraphicsUtil.ctx.fillText(GAME_CONFIG.pauseTitle, GAME_CONFIG.VIRTUAL_WIDTH / 2, GAME_CONFIG.VIRTUAL_HEIGHT / 2);
    GraphicsUtil.ctx.fillText(GAME_CONFIG.pauseMessage, GAME_CONFIG.VIRTUAL_WIDTH / 2, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 40);
  }

  // draws the game over screen
  static drawGameOver(): void {
    GraphicsUtil.drawBackground();
    GraphicsUtil.ctx.fillStyle = GAME_OVER_CONFIG.fontColour;
    GraphicsUtil.ctx.font = GAME_OVER_CONFIG.titleFont;
    GraphicsUtil.ctx.textAlign = "center";
    GraphicsUtil.ctx.fillText(GAME_OVER_CONFIG.gameOverTitle, GAME_CONFIG.VIRTUAL_WIDTH / 2, GAME_CONFIG.VIRTUAL_HEIGHT / 2);
    GraphicsUtil.ctx.font = GAME_OVER_CONFIG.messagingFont;
    GraphicsUtil.ctx.fillText(GAME_OVER_CONFIG.gameOverMessage.replace("{time}", GraphicsUtil.gameState.getSecondsSurvived().toFixed(2)),
      GAME_CONFIG.VIRTUAL_WIDTH / 2, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 40);
    GraphicsUtil.ctx.font = GAME_OVER_CONFIG.promptFont;
    GraphicsUtil.ctx.fillText(GAME_OVER_CONFIG.gameOverPrompt, GAME_CONFIG.VIRTUAL_WIDTH / 2, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 80);
  }

  // draws the menu
  static drawMenu(): void {
    GraphicsUtil.drawBackground();
    Menu.draw();
  }

  // resets the artist's state
  static reset(): void {
    Menu.reset();
  }
}