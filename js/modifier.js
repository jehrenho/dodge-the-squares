import { VisibleShape } from './visibleShape.js';
// represents an individual modifier circle in the game
export class Modifier extends VisibleShape {
    constructor(modifierType, x, y, r, fillColour, borderColour) {
        super(x, y, fillColour, borderColour);
        this.modifierType = modifierType;
        this.r = r;
    }
    // returns the radius of the modifier
    getRadius() {
        return this.r;
    }
    // returns the type of the modifier
    getType() {
        return this.modifierType;
    }
    // draws the modifier on the canvas
    draw(ctx, fillColour) {
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
