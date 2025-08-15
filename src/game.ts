import { startKeyboardListening} from './input.js';
import { Player } from './player.js';
import { HazardsObj } from './hazards.js';

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
if (!canvas) throw new Error("Canvas element with id 'gameCanvas' not found.");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
if (!ctx) throw new Error("2D context not available.");

export const canvasWidth = canvas.width;
export const canvasHeight = canvas.height;

const player = new Player();
const hazardsObj = new HazardsObj();

// start listening for keyboard input
startKeyboardListening();

function drawBackground() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  hazardsObj.draw(ctx);
  player.draw(ctx);
}

function gameLoop() {
  // update the hazard and player position
  hazardsObj.updatePositions();
  player.updatePosition();

  // check for player-hazard contact
  player.updateColour(hazardsObj.detectCollisions(player));

  draw(); // draw this frame
  requestAnimationFrame(gameLoop); // schedule next frame
}

// start generating frames
gameLoop();