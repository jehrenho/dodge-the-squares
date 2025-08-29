import { HAZ_GEN_INITS } from './config.js';
import { VisibleShape } from './visibleShape.js';
// represents a single hazard rectangle in the game
export class Hazard extends VisibleShape {
    constructor(x, y, w, h, colour, borderColour) {
        super(x, y, colour, borderColour);
        this.w = w;
        this.h = h;
        this.nominalw = HAZ_GEN_INITS.w;
        this.nominalh = HAZ_GEN_INITS.h;
    }
    // sets the hazards position
    setPositionByCentre(x, y) {
        this.x = x - this.w / 2;
        this.y = y - this.h / 2;
    }
    // draws the hazard on the canvas
    draw(ctx) {
        // Draw the hazard rectangle's fill colour
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        // Draw border
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}
