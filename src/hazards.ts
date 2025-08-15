import { canvasHeight, canvasWidth } from './game.js';
import { Player } from './player.js';

const HAZARDCOLOUR = "red";
const initHazardDensity = 0.02;
const initHazardSpeed = 2.0;

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
    rectangles: HazardRectangle[];
    rand: number;

    constructor () {
        this.COLOUR = HAZARDCOLOUR;
        this.hazardDensity = initHazardDensity;
        this.hazardSpeed = initHazardSpeed;
        this.rectangles = [];
        this.rand = 1.0;
        
        //testing: create a simple test hazard
        this.rectangles[0] = new HazardRectangle(150, 30, 50, 40);
        this.rectangles[1] = new HazardRectangle(67, 230, 70, 20);
        this.rectangles[2] = new HazardRectangle(450, 550, 30, 90);
    }
    updatePositions() {
        this.generateNewHazards();
        this.moveHazards();
    }
    generateNewHazards() {
        // generate a random number 
        this.rand = Math.random();
        if (this.rand < this.hazardDensity) {
            // map the new rectangle location to the canvas dimensions in pixels
            let newRecty = (canvasHeight * this.rand) / this.hazardDensity;
            // create a new rectangle
            this.rectangles.push(new HazardRectangle(canvasWidth, newRecty, 50, 50));
        }
    }
    moveHazards() {
        for (let i = 0; i < this.rectangles.length; i++) {
            this.rectangles[i].x -= this.hazardSpeed;
            // delete old rectangles
            if (this.rectangles[i].x < 0)
                this.rectangles.splice(i, 1);
        }
    }
    detectCollisions(player:Player) {
        for (let i = 0; i < this.rectangles.length; i++) {
            if ( this.rectangles[i].x - player.rectWidth < player.x
            && player.x < this.rectangles[i].x + this.rectangles[i].w
            && this.rectangles[i].y - player.rectHeight < player.y
            && player.y < this.rectangles[i].y + this.rectangles[i].h) return true;
        }
        return false;
    }
    draw(ctx:CanvasRenderingContext2D) {
        ctx.fillStyle = this.COLOUR;
        for (let i = 0; i < this.rectangles.length; i++){
            ctx.fillRect(this.rectangles[i].x, this.rectangles[i].y, this.rectangles[i].w, this.rectangles[i].h);
        }
    }
}

