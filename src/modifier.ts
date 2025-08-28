import { VisibleShape } from './visibleShape.js';
import { ModifierType } from './config.js';

// represents an individual modifier circle in the game
export class Modifier extends VisibleShape {
    private readonly modifierType: ModifierType;
    private readonly r: number;

    constructor(modifierType: ModifierType, 
        x: number, 
        y: number, 
        r: number, 
        fillColour: string, 
        borderColour: string) {
        super(x, y, fillColour, borderColour);
        this.modifierType = modifierType;
        this.r = r;
    }

    // returns the radius of the modifier
    getRadius(): number {
        return this.r;
    }

    // returns the type of the modifier
    getType(): ModifierType {
        return this.modifierType;
    }

    // draws the modifier on the canvas
    draw(ctx: CanvasRenderingContext2D, fillColour: string): void {
        // Draw fill
        ctx.fillStyle = fillColour;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        // Draw outline
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}