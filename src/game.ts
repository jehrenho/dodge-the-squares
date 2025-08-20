import { GameState } from './gameConfig.js';
import { InputManager } from './input.js';
import { Player } from './player.js';
import { HazardManager } from './hazards.js';
import { ModifierManager } from './modifiers.js';

export const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
if (!canvas) throw new Error("Canvas element with id 'gameCanvas' not found.");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
if (!ctx) throw new Error("2D context not available.");


// represents the game timer
class GameTimer {
  numFramesThisGame: number;
  numSecondsSurvived: number;
  numMinutesSurvived: number;

  constructor () {
    this.numFramesThisGame = 0;
    this.numSecondsSurvived = 0;
    this.numMinutesSurvived = 0;
  }

  // increments the frame count and updates the time survived
  incrementFrameCount(): void {
    this.numFramesThisGame++;
    this.numSecondsSurvived = this.numFramesThisGame / 60;
    this.numMinutesSurvived = this.numSecondsSurvived / 60;
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

  // resets the game timer
  reset(): void {
    this.numFramesThisGame = 0;
    this.numSecondsSurvived = 0;
    this.numMinutesSurvived = 0;
  }
}

// draws the game background
function drawBackground(): void {
  ctx.fillStyle = "LightGreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// draws the in-game text
function drawInGameText(): void {
  // print the time survived
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  ctx.fillText(`Time: ${gameTimer.getSecondsSurvived().toFixed(2)}s`, 10, 20);
}

// draws the menu
function drawMenu(): void {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Press Enter to Start", canvas.width / 2 - 100, canvas.height / 2);

  if (inputManager.isEnterPressedAndReleased()) currentGameState = GameState.INGAME;
}

// draws the game
function drawGame(): void {
  // update game objects
  modifierManager.updateModifiers();
  hazardManager.updateHazards();
  player.updatePosition(inputManager);
  
  // handle player-modifier collisions
  modifierManager.detectModifierCollisions(player);
  player.updateEffects();

  // end the game if player collides with a hazard
  if(hazardManager.detectCollisions(player)) {
    currentGameState = GameState.GAMEOVER;
  }

  // draw the game elements
  drawBackground();
  modifierManager.drawModifiers(ctx);
  hazardManager.draw(ctx);
  player.draw(ctx);
  drawInGameText();

  // update the time survived this game and increase difficulty
  gameTimer.incrementFrameCount();
  gameTimer.increaseDifficulty();
}

// draws the game over screen
function drawGameOver(): void {
  // print the game over screen
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2);
  ctx.fillText(`You Survived for: ${gameTimer.getSecondsSurvived().toFixed(2)}s`, 
    canvas.width / 2 - 70, canvas.height / 2 + 40);
  ctx.fillText("Press Enter to continue", canvas.width / 2 - 70, canvas.height / 2 + 80);

  // listen for Enter key to continue to menu
  if (inputManager.isEnterPressedAndReleased()) {
    currentGameState = GameState.MENU;
    gameTimer.reset();
    player.reset();
    hazardManager.reset();
    modifierManager.reset();
  };
}

// main game loop: generates a single frame in the game
function gameLoop(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (currentGameState === GameState.MENU) {
      drawMenu();
  } else if (currentGameState === GameState.INGAME) {
      drawGame();
  } else if (currentGameState === GameState.GAMEOVER) {
      drawGameOver();
  }
  requestAnimationFrame(gameLoop); // schedule next frame
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// create instances of the game objects
const player = new Player();
const hazardManager = new HazardManager();
const modifierManager = new ModifierManager();
const inputManager = new InputManager();
const gameTimer = new GameTimer();

// start tracking keyboard input
inputManager.startKeyboardListening();

// start generating frames
let currentGameState: GameState = GameState.MENU;
gameLoop();