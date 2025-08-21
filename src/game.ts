import { GamePhase, GAME_CONFIG, MODIFIER_TYPE, MOD_GEN_INITS } from './config.js';
import { InputManager } from './input.js';
import { Player } from './player.js';
import { HazardManager, Hazard } from './hazardManager.js';
import { ModifierManager, Modifier } from './modifierManager.js';
import { handleModifierCollisions } from './modifierEffect.js';
import { CollisionFlasher } from './collisionFlasher.js';
import { Menu } from './menu.js';

export const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
if (!canvas) throw new Error("Canvas element with id 'gameCanvas' not found.");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
if (!ctx) throw new Error("2D context not available.");


// represents the game state
export class GameState {
  numFramesThisGame: number;
  numSecondsSurvived: number;
  numMinutesSurvived: number;
  phase: GamePhase;

  constructor () {
    this.numFramesThisGame = 0;
    this.numSecondsSurvived = 0;
    this.numMinutesSurvived = 0;
    this.phase = GamePhase.MENU;
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
  }
}

// draws the game background
export function drawBackground(): void {
  ctx.fillStyle = GAME_CONFIG.backgroundColour;
  ctx.fillRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);
}

// draws the in-game text
function drawInGameText(): void {
  // print the time survived
  ctx.fillStyle = GAME_CONFIG.fontColour;
  ctx.font = GAME_CONFIG.statusBarFont;
  ctx.fillText(`Time: ${gameState.getSecondsSurvived().toFixed(2)}s`, 10, 20);
}

// draws all game elements
export function drawGameElements(): void {
  drawBackground();
  modifierManager.drawModifiers(ctx);
  hazardManager.draw(ctx);
  player.draw(ctx, player.colour);
  drawInGameText();
}

// draws the game
function drawGame(): void {
  // update game objects
  modifierManager.updateModifiers();
  hazardManager.updateHazards();
  player.updatePosition(inputManager);
  
  // handle player-modifier collisions
  let modifierCollisions: Modifier[] = modifierManager.detectCollisions(player, hazardManager);
  if (modifierCollisions.length > 0) {
    // player touched a modifier
    gameState.setPhase(GamePhase.COLLISION_FLASH);
    collisionFlasher.setModifiers(modifierCollisions);
    for (const mod of modifierCollisions) {
      handleModifierCollisions(mod.modifierType, player, hazardManager);
    }
  }
  player.updateEffects();

  // handle player-hazard collisions
  let hazardCollisions: Hazard[] = hazardManager.detectCollisions(player);
  if(hazardCollisions.length > 0) {
    // player touched a hazard
    gameState.setPhase(GamePhase.COLLISION_FLASH);
    collisionFlasher.setHazards(hazardCollisions);
    player.modifyHealth(-1);
  }

  drawGameElements();

  // update the time survived this game and increase difficulty
  gameState.incrementFrameCount();
  gameState.increaseDifficulty();
}

// draws the game over screen
function drawGameOver(): void {
  drawBackground();
  ctx.fillStyle = GAME_CONFIG.gameOverFontColour;
  ctx.font = GAME_CONFIG.menuFont;
  ctx.fillText("Game Over", GAME_CONFIG.VIRTUAL_WIDTH / 2 - 70, GAME_CONFIG.VIRTUAL_HEIGHT / 2);
  ctx.fillText(`You Survived for: ${gameState.getSecondsSurvived().toFixed(2)}s`, 
    GAME_CONFIG.VIRTUAL_WIDTH / 2 - 70, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 40);
  ctx.fillText("Press Enter to continue", GAME_CONFIG.VIRTUAL_WIDTH / 2 - 70, GAME_CONFIG.VIRTUAL_HEIGHT / 2 + 80);

  // listen for Enter key to continue to menu
  if (inputManager.isEnterPressedAndReleased()) {
    gameState.setPhase(GamePhase.MENU);
    gameState.reset();
    player.reset();
    hazardManager.reset();
    modifierManager.reset();
    Menu.reset();
  };
}

// main game loop: generates a single frame in the game
function gameLoop(): void {
  ctx.clearRect(0, 0, GAME_CONFIG.VIRTUAL_WIDTH, GAME_CONFIG.VIRTUAL_HEIGHT);
  // setup the window scaling
  const windowScaleX = canvas.width / GAME_CONFIG.VIRTUAL_WIDTH;
  const windowScaleY = canvas.height / GAME_CONFIG.VIRTUAL_HEIGHT;
  ctx.save();
  ctx.scale(windowScaleX, windowScaleY);
  // draw the game
  if (gameState.getPhase() === GamePhase.MENU) {
      Menu.draw(ctx);
      // start the game when Enter is pressed
      if (inputManager.isEnterPressedAndReleased()) gameState.setPhase(GamePhase.INGAME);
  } else if (gameState.getPhase() === GamePhase.INGAME) {
      drawGame();
  } else if (gameState.getPhase() === GamePhase.COLLISION_FLASH) {
      collisionFlasher.draw(ctx);
  } else if (gameState.getPhase() === GamePhase.GAMEOVER) {
      drawGameOver();
  }
  ctx.restore();
  // schedule next frame
  requestAnimationFrame(gameLoop);
}

// initialize canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// create and initialize all game objects
const player = new Player();
const hazardManager = new HazardManager();
const modifierManager = new ModifierManager();
const inputManager = new InputManager();
const gameState = new GameState();
const collisionFlasher = new CollisionFlasher(player, gameState, hazardManager, modifierManager);
Menu.init(player, hazardManager, modifierManager);

// start tracking keyboard input
inputManager.startListening();

// start the game loop
gameLoop();