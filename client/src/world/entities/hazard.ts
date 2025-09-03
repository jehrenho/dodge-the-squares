import { VisibleShape } from './visibleShape.js';
import { HAZ_GEN_CONFIG } from './entities-config.js'

// represents a single hazard rectangle in the game
export class Hazard extends VisibleShape {
    private readonly nominalWidth: number;
    private readonly nominalHeight: number;
    private width: number;
    private height: number;

    constructor(x:number, y:number, 
        width:number, height:number, 
        colour: string, borderColour: string){
        super(x, y, colour, borderColour);
        this.nominalWidth = HAZ_GEN_CONFIG.w;
        this.nominalHeight = HAZ_GEN_CONFIG.h;
        this.width = width;
        this.height = height;
    }

    setPositionByCentre(x: number, y: number): void {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }

    setWidth(width: number): void {
        this.width = width;
    }

    setHeight(height: number): void {
        this.height = height;
    }

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

    draw(ctx: CanvasRenderingContext2D) {
        // draw fill
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // draw outline
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}