import { GameDirector } from './game-director.js';
import { RenderData } from '../graphics/render-data.js';
import { Graphics } from '../graphics/graphics.js';

// represents a single game instance
export class Game {
  private readonly gameDirector: GameDirector;
  private readonly graphics: Graphics;

  constructor() {
    this.gameDirector = new GameDirector();
    this.graphics = new Graphics(this.gameDirector.getGameState(), this.gameDirector.getInputManager());
  }

  start(): void {
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private gameLoop(): void {
    const renderData: RenderData[] = this.gameDirector.update();
    this.graphics.render(renderData);
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

const game = new Game();
game.start();
