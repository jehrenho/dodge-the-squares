import { STATUS_BAR_CONFIG, PAUSE_CONFIG } from './graphics-config.js';
import { VIRTUAL_SCREEN } from './graphics-config.js';
import { GameState } from '../game/game-state.js';
import { Viewport } from './viewport.js';
import { InputManager } from '../input/input-manager.js';
import { RenderData } from './render-data.js';
import { GamePhase } from '../game/game-config.js';

import { EntityRenderer } from './entity-renderer.js';
import { MenuRenderer } from '../menu/menu-renderer.js';
import { GameOverRenderer } from '../game-over/game-over-renderer.js';
import { BACKGROUND_CONFIG } from './colours.js';

// manages the canvas context and draws all game elements
export class Graphics {
  private readonly gameState: GameState;
  private readonly inputManager: InputManager;
  private readonly viewport: Viewport;
  private readonly menuRenderer: MenuRenderer;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly entityRenderer: EntityRenderer;
  private readonly gameOverRenderer: GameOverRenderer;
  private readonly centreX: number;
  private readonly centreY: number;

  constructor(gameState: GameState, inputManager: InputManager) {
    this.gameState = gameState;
    this.inputManager = inputManager;
    // get the canvas context
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    if (!canvas) throw new Error("Canvas element with id 'gameCanvas' not found.");
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!this.ctx) throw new Error("2D context not available.");
    this.entityRenderer = new EntityRenderer(this.ctx);
    this.viewport = new Viewport(this.ctx);
    this.menuRenderer = new MenuRenderer(this.ctx);
    this.gameOverRenderer = new GameOverRenderer(this.ctx, this.gameState, this.viewport);
    this.centreX = VIRTUAL_SCREEN.width / 2;
    this.centreY = VIRTUAL_SCREEN.height / 2;
  }

  render(renderData: RenderData[]): void {
    if (this.inputManager.isWindowResized()) {
      this.setCanvasDimensions(window.innerWidth, window.innerHeight);
    }
    this.viewport.startFrame();

    this.renderBackground();
    this.entityRenderer.render(renderData);
    this.renderStateSpecificGraphics(renderData);

    this.viewport.finishFrame();
  }

  private renderStateSpecificGraphics(renderData: RenderData[]): void {
    switch (this.gameState.getPhase()) {
      case GamePhase.MENU:
        this.menuRenderer.render(renderData);
        break;
      case GamePhase.INGAME:
        this.drawGameTimer();
        if (this.gameState.isPaused()) {
          this.drawPauseMessage();
        }
        break;
      case GamePhase.GAMEOVER:
        this.gameOverRenderer.render(renderData);
        break;
    }
  }

  // draws the game background
  private renderBackground(): void {
    this.ctx.fillStyle = BACKGROUND_CONFIG.backgroundColour;
    this.ctx.fillRect(0, 0, VIRTUAL_SCREEN.width, VIRTUAL_SCREEN.height);
  }

  private drawGameTimer(): void {
    this.ctx.fillStyle = STATUS_BAR_CONFIG.fontColour;
    this.ctx.font = STATUS_BAR_CONFIG.font;
    this.ctx.fillText(`Time: ${this.gameState.getSecondsSurvived().toFixed(2)}s`, 10, 20);
  }

  private drawPauseMessage(): void {
    this.ctx.fillStyle = PAUSE_CONFIG.fontColour;
    this.ctx.font = PAUSE_CONFIG.titleFont;
    this.ctx.textAlign = "center";
    this.ctx.fillText(PAUSE_CONFIG.pauseTitle, this.centreX, this.centreY);
    this.ctx.fillText(PAUSE_CONFIG.pauseMessage, this.centreX, this.centreY + 40);
  }

  setCanvasDimensions(width: number, height: number): void {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
  }
}