import { HAZ_GEN_INITS } from './entities-config.js'
import { VisibleShape } from './visibleShape.js';

// represents a single hazard rectangle in the game
export class Hazard extends VisibleShape {
    private width: number;
    private height: number;
    private nominalWidth: number;
    private nominalHeight: number;

    constructor(x:number, y:number, 
        width:number, height:number, 
        colour: string, borderColour: string){
        super(x, y, colour, borderColour);
        this.width = width;
        this.height = height;
        this.nominalWidth = HAZ_GEN_INITS.w;
        this.nominalHeight = HAZ_GEN_INITS.h;
    }

    // sets the hazards position
    setPositionByCentre(x: number, y: number): void {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }

    // width/height getters/setters
    getNominalWidth(): number {
        return this.nominalWidth;
    }

    getNominalHeight(): number {
        return this.nominalHeight;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    setWidth(width: number): void {
        this.width = width;
    }

    setHeight(height: number): void {
        this.height = height;
    }

    // draws the hazard on the canvas
    draw(ctx: CanvasRenderingContext2D) {
        // Draw the hazard rectangle's fill colour
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw border
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}