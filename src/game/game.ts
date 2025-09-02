import { GamePhase } from './game-config.js';
import { GameState } from './game-state.js';
import { InputManager } from '../input/input-manager.js';
import { Graphics } from '../graphics/graphics.js';
import { World } from '../world/world.js';

// represents a single game instance
export class Game {
  private readonly gameState: GameState;
  private readonly inputManager: InputManager;
  private readonly world: World;
  private readonly graphics: Graphics;

  constructor() {
    this.gameState = new GameState();
    this.world = new World(this.gameState);
    this.graphics = new Graphics(this.gameState, this.world.getPlayer(), this.world.getHazardManager(), this.world.getModifierManager());
    this.inputManager = new InputManager(this.graphics);
  }

  // updates the game
  update(): void {
    this.inputManager.update();

    switch (this.gameState.getPhase()) {
      case GamePhase.MENU:
        // start the game when Enter is pressed
        if (this.inputManager.isEnterPressed()) this.gameState.setPhase(GamePhase.INGAME);
        break;
      case GamePhase.INGAME:
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
        } else {
          this.world.update(this.inputManager.getPlayerMovementInput());
          this.gameState.incrementFrameCount();
          if (this.world.isPlayerDead()) {
            this.gameState.setPhase(GamePhase.GAMEOVER);
          }
        }
        break;
      case GamePhase.GAMEOVER:
        if (this.inputManager.isEnterPressed()) {
          this.resetGame();
          this.gameState.setPhase(GamePhase.MENU);
          this.inputManager.waitForEnterToRise();
        }
        break;
    }

  }

  // renders the game
  render(): void {
    this.graphics.prepToDrawFrame();

    switch (this.gameState.getPhase()) {
      case GamePhase.MENU:
        this.graphics.drawMenu();
        break;
      case GamePhase.INGAME:
        // draw the pause menu if the game is paused
        if (this.gameState.isPaused()) {
          this.graphics.drawGamePaused();
        } else {
          this.graphics.drawInGameElements();
        }
        break;
      case GamePhase.GAMEOVER:
        this.graphics.drawGameOver();
        break;
    }

    this.graphics.finishDrawingFrame();
  }

  // the main game loop: generates a single frame in the game
  gameLoop(): void {
    this.update();
    this.render();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  // resets the game objects
  resetGame(): void {
    this.gameState.reset();
    this.world.reset();
    this.graphics.reset();
  }

  // start the game loop
  start(): void {
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

// run the game
const game = new Game();
game.start();
