import { GamePhase } from './game-config.js';
import { GameState } from './game-state.js';
import { InputManager } from '../input/inputManager.js';
import { Player } from '../world/entities/player.js';
import { HazardManager } from '../world/entities/hazard-manager.js';
import { ModifierManager } from '../world/entities/modifier-manager.js';
import { GraphicsUtil } from '../graphics/graphicsUtil.js';
import { CollisionManager } from '../world/collision/collision-manager.js';
import { EffectManager } from '../world/entities/effect-manager.js'

// represents a single game instance
export class Game {
  private readonly gameState: GameState;
  private readonly player: Player;
  private readonly hazardManager: HazardManager;
  private readonly modifierManager: ModifierManager;
  private readonly effectManager: EffectManager;
  private readonly collisionManager: CollisionManager;
  private readonly inputManager: InputManager;
  isGamePaused: boolean;

  constructor() {
    this.gameState = new GameState();
    this.player = new Player();
    this.hazardManager = new HazardManager(this.gameState);
    this.modifierManager = new ModifierManager();
    this.effectManager = new EffectManager(this.player, this.hazardManager);
    this.inputManager = new InputManager();
    GraphicsUtil.init(this.gameState, this.player, this.hazardManager, this.modifierManager);
    this.collisionManager = new CollisionManager(
      this.player, this.hazardManager, this.modifierManager, this.effectManager);
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
          this.inputManager.waitForEnterToRise();
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
    if (!this.isGamePaused && this.inputManager.isSpacePressed()) {
      this.isGamePaused = true;
      this.inputManager.waitForSpaceToRise();
    }
    // draw the pause menu if the game is paused
    if (this.isGamePaused) {
      GraphicsUtil.drawGamePaused();
      if (this.inputManager.isSpacePressed()) {
        this.isGamePaused = false;
        this.inputManager.waitForSpaceToRise();
      }
    } else if (this.collisionManager.isFlashingCollision()) {
      // don't update the game objects if a collision is flashing, just draw the in-game elements
      this.collisionManager.update();
      GraphicsUtil.drawInGameElements();
    } else {
      // end the game if the player is dead
      if (this.player.isDead()) {
        this.gameState.setPhase(GamePhase.GAMEOVER);
      }
      // update game objects
      this.modifierManager.updateModifiers();
      this.hazardManager.updateHazards();
      this.player.updatePosition(this.inputManager.getPlayerMovementInput());
      this.effectManager.updateEffects();
      this.collisionManager.resolveModifierCollisions();
      this.effectManager.applyEffects();
      this.collisionManager.resolveHazardCollisions();
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
    this.effectManager.reset();
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
