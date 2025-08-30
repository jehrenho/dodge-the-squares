import { HAZ_GEN_INITS } from './entities-config.js';
import { VisibleShape } from './visibleShape.js';
// represents a single hazard rectangle in the game
export class Hazard extends VisibleShape {
    constructor(x, y, width, height, colour, borderColour) {
        super(x, y, colour, borderColour);
        this.width = width;
        this.height = height;
        this.nominalWidth = HAZ_GEN_INITS.w;
        this.nominalHeight = HAZ_GEN_INITS.h;
    }
    // sets the hazards position
    setPositionByCentre(x, y) {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }
    // width/height getters/setters
    getNominalWidth() {
        return this.nominalWidth;
    }
    getNominalHeight() {
        return this.nominalHeight;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    setWidth(width) {
        this.width = width;
    }
    setHeight(height) {
        this.height = height;
    }
    // draws the hazard on the canvas
    draw(ctx) {
        // Draw the hazard rectangle's fill colour
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Draw border
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}
