import { VisibleShape } from './visibleShape.js';
// represents an individual modifier circle in the game
export class Modifier extends VisibleShape {
    constructor(modifierType, x, y, radius, fillColour, borderColour) {
        super(x, y, fillColour, borderColour);
        this.modifierType = modifierType;
        this.radius = radius;
    }
    // getters/setters
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getRadius() {
        return this.radius;
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
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        // Draw outline
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}
