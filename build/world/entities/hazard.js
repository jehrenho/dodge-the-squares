import { VisibleShape } from './visibleShape.js';
import { HAZ_GEN_CONFIG } from './entities-config.js';
// represents a single hazard rectangle in the game
export class Hazard extends VisibleShape {
    constructor(x, y, width, height, colour, borderColour) {
        super(x, y, colour, borderColour);
        this.nominalWidth = HAZ_GEN_CONFIG.w;
        this.nominalHeight = HAZ_GEN_CONFIG.h;
        this.width = width;
        this.height = height;
    }
    setPositionByCentre(x, y) {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }
    setWidth(width) {
        this.width = width;
    }
    setHeight(height) {
        this.height = height;
    }
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
    draw(ctx) {
        // draw fill
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // draw outline
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}
