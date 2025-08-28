import { GamePhase, Keys } from './config.js';
import { InputManager } from './inputManager.js';
import { Player } from './player.js';
import { HazardManager } from './hazardManager.js';
import { ModifierManager } from './modifierManager.js';
import { Flasher } from './flasher.js';
import { Artist } from './artist.js';
import { CollisionUtil } from './collisionUtil.js';

// stores and manages the game phase and game timer
export class GameState {
  numFramesThisGame: number;
  numSecondsSurvived: number;
  numMinutesSurvived: number;
  phase: GamePhase;
  isPaused: boolean;

  constructor () {
    this.numFramesThisGame = 0;
    this.numSecondsSurvived = 0;
    this.numMinutesSurvived = 0;
    this.phase = GamePhase.MENU;
    this.isPaused = false;
  }

  // increments the frame count and updates the time survived
  incrementFrameCount(): void {
    this.numFramesThisGame++;
    this.numSecondsSurvived = this.numFramesThisGame / 60;
    this.numMinutesSurvived = this.numSecondsSurvived / 60;
    this.increaseDifficulty();
  }

  // returns the number of seconds survived
  getSecondsSurvived(): number {
    return this.numSecondsSurvived;
  }

  // returns the number of minutes survived
  getMinutesSurvived(): number {
    return this.numMinutesSurvived;
  }

  // increases the difficulty of hazards and modifiers
  increaseDifficulty(): void {
    if (this.numFramesThisGame % 60 === 0) { // every second
      hazardManager.updateDifficulty(this.numMinutesSurvived);
      // TODO: Implement difficulty increase for modifiers
    }
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
    this.numSecondsSurvived = 0;
    this.numMinutesSurvived = 0;
    this.isPaused = false;
  }
}

// main game loop: generates a single frame in the game
function gameLoop(): void {
  Artist.prepToDrawFrame();
  switch (gameState.getPhase()) {
    case GamePhase.MENU:
      Artist.drawMenu();
      // start the game when Enter is pressed
      if (inputManager.isKeyJustReleased(Keys.ENTER)) gameState.setPhase(GamePhase.INGAME);
      break;
    case GamePhase.INGAME:
      generateInGameFrame();
      break;
    case GamePhase.GAMEOVER:
      Artist.drawGameOver();
      // return to the menu when Enter is pressed
      if (inputManager.isKeyJustReleased(Keys.ENTER)) {
        resetGame();
        gameState.setPhase(GamePhase.MENU);
      }
  }
  inputManager.update();
  Artist.finishDrawingFrame();
  // schedule the generation of the next frame
  requestAnimationFrame(gameLoop);
}

// generates an in-game frame
function generateInGameFrame(): void {
  // pause the game if space is pressed
  if (!gameState.isPaused && inputManager.isKeyPressed(Keys.SPACE)) {
    gameState.isPaused = true;
    inputManager.clearKeyState(Keys.SPACE);
  }
  // draw the pause menu if the game is paused
  if (gameState.isPaused) {
    Artist.drawGamePaused();
    if (inputManager.isKeyJustReleased(Keys.SPACE)) gameState.isPaused = false;
  } else if (Flasher.isFlashingCollision()) {
    // don't update the game objects if a collision is flashing, just draw the in-game elements
    Flasher.update();
    Artist.drawInGameElements();
  } else {
    // end the game if the player is dead
    if (player.isDead()) {
      gameState.setPhase(GamePhase.GAMEOVER);
    }
    // update game objects
    modifierManager.updateModifiers();
    hazardManager.updateHazards();
    player.updatePosition(inputManager);
    CollisionUtil.resolveModifierCollisions();
    player.updateEffects();
    CollisionUtil.resolveHazardCollisions();
    // draw the frame
    Artist.drawInGameElements();
    // update the time survived this game and increase difficulty
    gameState.incrementFrameCount();
  }
}

// resets the game objects
function resetGame(): void {
  gameState.reset();
  player.reset();
  hazardManager.reset();
  modifierManager.reset();
  Artist.reset();
}

// create and initialize all game objects
const gameState = new GameState();
const player = new Player();
const hazardManager = new HazardManager();
const modifierManager = new ModifierManager();
const inputManager = new InputManager();
Artist.init(gameState, player, hazardManager, modifierManager);
CollisionUtil.init(player, hazardManager, modifierManager);

// start tracking keyboard input
inputManager.startListening();

// start the game loop
gameLoop();