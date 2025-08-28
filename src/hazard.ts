import { HAZ_GEN_INITS } from './config.js'
import { VisibleShape } from './visibleShape.js';

// represents a single hazard rectangle in the game
export class Hazard extends VisibleShape {
    w: number;
    h: number;
    nominalw: number;
    nominalh: number;

    constructor(x:number, y:number, 
        w:number, h:number, 
        colour: string, borderColour: string){
        super(x, y, colour, borderColour);
        this.w = w;
        this.h = h;
        this.nominalw = HAZ_GEN_INITS.w;
        this.nominalh = HAZ_GEN_INITS.h;
    }

    // sets the hazards position
    setPositionByCentre(x: number, y: number): void {
        this.x = x - this.w / 2;
        this.y = y - this.h / 2;
    }

    // draws the hazard on the canvas
    draw(ctx: CanvasRenderingContext2D) {
        // Draw the hazard rectangle's fill colour
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Draw border
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}