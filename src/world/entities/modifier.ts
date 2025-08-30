import { VisibleShape } from './visibleShape.js';
import { ModifierType } from './entities-config.js';

// represents an individual modifier circle in the game
export class Modifier extends VisibleShape {
    private modifierType: ModifierType;
    private radius: number;

    constructor(modifierType: ModifierType, 
        x: number, 
        y: number, 
        radius: number, 
        fillColour: string, 
        borderColour: string) {
        super(x, y, fillColour, borderColour);
        this.modifierType = modifierType;
        this.radius = radius;
    }

    // getters/setters
    setX(x: number): void {
        this.x = x;
    }

    setY(y: number): void {
        this.y = y;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getRadius(): number {
        return this.radius;
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
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        // Draw outline
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}