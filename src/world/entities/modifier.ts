import { VisibleShape } from './visibleShape.js';
import { ModifierType } from './entities-config.js';

// represents an individual modifier circle in the game
export class Modifier extends VisibleShape {
    private readonly modifierType: ModifierType;
    private readonly radius: number;

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

    getType(): ModifierType {
        return this.modifierType;
    }

    draw(ctx: CanvasRenderingContext2D, fillColour: string): void {
        // draw fill
        ctx.fillStyle = fillColour;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        // draw outline
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}