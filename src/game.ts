import { GamePhase, GAME_CONFIG } from './config.js';
import { InputManager } from './inputManager.js';
import { Player } from './player.js';
import { HazardManager } from './hazardManager.js';
import { ModifierManager } from './modifierManager.js';
import { Flasher } from './flasher.js';
import { GraphicsUtil } from './graphicsUtil.js';
import { CollisionUtil } from './collisionUtil.js';

// stores and manages the game phase and game timer
export class GameState {
  numFramesThisGame: number;
  phase: GamePhase;

  constructor () {
    this.numFramesThisGame = 0;
    this.phase = GamePhase.MENU;
  }

  // increments the frame count and updates the time survived
  incrementFrameCount(): void {
    this.numFramesThisGame++;
  }

  // returns the number of frames survived
  getFramesSurvived(): number {
    return this.numFramesThisGame;
  }

  // returns the number of seconds survived
  getSecondsSurvived(): number {
    return this.numFramesThisGame / GAME_CONFIG.fps;
  }

  // returns the number of minutes survived
  getMinutesSurvived(): number {
    return this.numFramesThisGame / GAME_CONFIG.fpm;
  }

  // returns the current game phase
  getPhase(): GamePhase {
    return this.phase;
  }

  // sets the current game phase
  setPhase(phase: GamePhase): void {
    this.phase = phase;
  }

  // resets the game timer
  reset(): void {
    this.numFramesThisGame = 0;
    this.phase = GamePhase.MENU;
  }
}

// represents a single game instance
export class Game {
  private readonly gameState: GameState;
  private readonly player: Player;
  private readonly hazardManager: HazardManager;
  private readonly modifierManager: ModifierManager;
  private readonly inputManager: InputManager;
  isGamePaused: boolean;

  constructor() {
    this.gameState = new GameState();
    this.player = new Player();
    this.hazardManager = new HazardManager(this.gameState);
    this.modifierManager = new ModifierManager();
    this.inputManager = new InputManager();
    GraphicsUtil.init(this.gameState, this.player, this.hazardManager, this.modifierManager);
    CollisionUtil.init(this.player, this.hazardManager, this.modifierManager);
    this.inputManager.init();
    this.isGamePaused = false;
  }

  // the main game loop: generates a single frame in the game
  gameLoop(): void {
    // prepare the graphics utility to draw the frame
    GraphicsUtil.prepToDrawFrame();

    // draw the frame depending on the game phase
    switch (this.gameState.getPhase()) {
      case GamePhase.MENU:
        GraphicsUtil.drawMenu();
        // start the game when Enter is pressed
        if (this.inputManager.isEnterPressed()) this.gameState.setPhase(GamePhase.INGAME);
        break;
      case GamePhase.INGAME:
        this.generateInGameFrame();
        break;
      case GamePhase.GAMEOVER:
        GraphicsUtil.drawGameOver();
        // return to the menu when Enter is pressed
        if (this.inputManager.isEnterPressed()) {
          this.resetGame();
          this.gameState.setPhase(GamePhase.MENU);
        }
        break;
    }

    // finish drawing the frame and prepare the graphics utility for the next frame
    GraphicsUtil.finishDrawingFrame();
    
    // update the input manager for key rising/falling detection
    this.inputManager.update();

    // schedule the generation of the next frame
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  // generates an in-game frame
  generateInGameFrame(): void {
    // pause the game if space is pressed
    if (!this.isGamePaused && this.inputManager.isSpaceJustPressed()) {
      this.isGamePaused = true;
      this.inputManager.waitForSpaceToRelease();
    }
    // draw the pause menu if the game is paused
    if (this.isGamePaused) {
      GraphicsUtil.drawGamePaused();
      if (this.inputManager.isSpaceJustPressed()) {
        this.isGamePaused = false;
      }
    } else if (Flasher.isFlashingCollision()) {
      // don't update the game objects if a collision is flashing, just draw the in-game elements
      Flasher.update();
      GraphicsUtil.drawInGameElements();
    } else {
      // end the game if the player is dead
      if (this.player.isDead()) {
        this.gameState.setPhase(GamePhase.GAMEOVER);
      }
      // update game objects
      this.modifierManager.updateModifiers();
      this.hazardManager.updateHazards();
      this.player.updatePosition(this.inputManager);
      CollisionUtil.resolveModifierCollisions();
      this.player.updateEffects();
      CollisionUtil.resolveHazardCollisions();
      // draw the frame
      GraphicsUtil.drawInGameElements();
      // update the time survived this game and increase difficulty
      this.gameState.incrementFrameCount();
    }
  }

  // resets the game objects
  resetGame(): void {
    this.gameState.reset();
    this.player.reset();
    this.hazardManager.reset();
    this.modifierManager.reset();
    GraphicsUtil.reset();
  }

  // start the game loop
  start(): void {
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

// start the game
const game = new Game();
game.start();
