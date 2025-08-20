import { HAZ_GEN_INITS } from './gameConfig.js';
import { canvas } from './game.js';
import { Player } from './player.js';

// represents a single hazard rectangle in the game
class HazardRectangle {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x:number, y:number, w:number, h:number){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

// helper logarithm function with a user specified base
function logBase(x: number, base: number): number {
    return Math.log(x) / Math.log(base);
}

// represents the collection of hazards in the game
export class HazardManager {
    hazardSpeed: number;
    hazardDensity: number;
    COLOUR: string;
    hazards: HazardRectangle[];

    constructor () {
        this.hazardSpeed = HAZ_GEN_INITS.speed;
        this.hazardDensity = HAZ_GEN_INITS.density;
        this.COLOUR = HAZ_GEN_INITS.colour;
        this.hazards = [];
    }

    // generates new hazards, destroys old ones, and moves all hazards
    updateHazards(): void {
        this.generateNewHazards();
        this.moveHazards();
    }

    // generates new hazards based on the hazard density
    generateNewHazards(): void {
        const rand = Math.random();
        if (rand < this.hazardDensity) {
            // map the new rectangle location to the canvas dimensions in pixels
            const newHazardy = ((canvas.height + HAZ_GEN_INITS.h) * rand) / this.hazardDensity;
            // create a new rectangle
            this.hazards.push(new HazardRectangle(canvas.width, 
                newHazardy - HAZ_GEN_INITS.h, 
                HAZ_GEN_INITS.w, 
                HAZ_GEN_INITS.h));
        }
    }

    // moves all hazards to the left and destroys hazards that have moved off screen
    moveHazards(): void {
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            this.hazards[i].x -= this.hazardSpeed;
            // remove rectangles that have moved off the left side of the canvas
            if (this.hazards[i].x < -HAZ_GEN_INITS.w)
                this.hazards.splice(i, 1);
        }
    }

    // detects collisions between the player and hazard rectangles
    detectCollisions(player: Player): boolean {
        if (player.isInvincible) return false;
        for (let hazard of this.hazards) {
            if (hazard.x < player.x + player.w &&
            hazard.x + hazard.w > player.x &&
            hazard.y < player.y + player.h &&
            hazard.y + hazard.h > player.y
            ) return true;
        }
        return false;
    }

    // draws all hazards on the canvas
    draw(ctx:CanvasRenderingContext2D): void {
        ctx.fillStyle = this.COLOUR;
        for (let hazard of this.hazards){
            ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
        }
    }

    // updates the difficulty of hazards logarithmically based on the time survived
    updateDifficulty(numMinutesSurvived: number): void {
        let difficultyFactor = logBase(numMinutesSurvived + 1, HAZ_GEN_INITS.difficultyLogBase);
        this.hazardDensity = HAZ_GEN_INITS.density * (difficultyFactor + 1) * 2;
        this.hazardSpeed = HAZ_GEN_INITS.speed * (difficultyFactor + 1);
    }

    // resets all hazards (clears them)
    reset(): void {
        this.hazards = [];
        this.hazardDensity = HAZ_GEN_INITS.density;
        this.hazardSpeed = HAZ_GEN_INITS.speed;
    }
}