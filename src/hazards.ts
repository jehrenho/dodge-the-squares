import { canvasHeight, canvasWidth } from './game.js';
import { Player } from './player.js';

const HAZARD_COLOUR = "red";
const HAZARD_INIT_DENSITY = 0.02;
const HAZARD_INIT_SPEED = 2.0;

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

export class HazardsObj {
    COLOUR: string;
    hazardDensity: number;
    hazardSpeed: number;
    hazards: HazardRectangle[];

    constructor () {
        this.COLOUR = HAZARD_COLOUR;
        this.hazardDensity = HAZARD_INIT_DENSITY;
        this.hazardSpeed = HAZARD_INIT_SPEED;
        this.hazards = [];
        
        // testing: create a simple test hazard
        this.hazards[0] = new HazardRectangle(150, 30, 50, 40);
        this.hazards[1] = new HazardRectangle(67, 230, 70, 20);
        this.hazards[2] = new HazardRectangle(450, 550, 30, 90);
    }
    updatePositions() {
        this.generateNewHazards();
        this.moveHazards();
    }
    generateNewHazards() {
        // randomly generate a new hazard based on the hazard density
        const rand = Math.random();
        if (rand < this.hazardDensity) {
            // map the new rectangle location to the canvas dimensions in pixels
            const newHazardy = (canvasHeight * rand) / this.hazardDensity;
            // create a new rectangle
            this.hazards.push(new HazardRectangle(canvasWidth, newHazardy, 50, 50));
        }
    }
    moveHazards() {
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            this.hazards[i].x -= this.hazardSpeed;
            // remove rectangles that have moved off the left side of the canvas
            if (this.hazards[i].x < 0)
                this.hazards.splice(i, 1);
        }
    }
    detectCollisions(player: Player) {
        for (let hazard of this.hazards) {
            if ( hazard.x - player.w < player.x
            && player.x < hazard.x + hazard.w
            && hazard.y - player.h < player.y
            && player.y < hazard.y + hazard.h) return true;
        }
        return false;
    }
    draw(ctx:CanvasRenderingContext2D) {
        ctx.fillStyle = this.COLOUR;
        for (let hazard of this.hazards){
            ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
        }
    }
}