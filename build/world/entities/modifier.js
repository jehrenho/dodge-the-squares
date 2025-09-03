import { VisibleShape } from './visibleShape.js';
// represents an individual modifier circle in the game
export class Modifier extends VisibleShape {
    constructor(modifierType, x, y, radius, fillColour, borderColour) {
        super(x, y, fillColour, borderColour);
        this.modifierType = modifierType;
        this.radius = radius;
    }
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
    getType() {
        return this.modifierType;
    }
    draw(ctx, fillColour) {
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
