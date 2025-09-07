import { PhaseManager } from './phase-manager.js';

// represents a single game instance
export class Game {
  private readonly phaseManager: PhaseManager;

  constructor() {
    this.phaseManager = new PhaseManager();
  }

  start(): void {
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private gameLoop(): void {
    this.phaseManager.update();
    this.phaseManager.render();
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

const game = new Game();
game.start();
