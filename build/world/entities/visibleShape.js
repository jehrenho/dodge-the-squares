// generic class for the common properties of all hazards, all modifiers, and the player
export class VisibleShape {
    constructor(x, y, defaultFillColour, defaultBorderColour) {
        this.x = x;
        this.y = y;
        this.defaultFillColour = defaultFillColour;
        this.defaultBorderColour = defaultBorderColour;
        this.fillColour = defaultFillColour;
        this.borderColour = defaultBorderColour;
        this.killFlag = false;
    }
    setColour(fillColour, borderColour) {
        this.fillColour = fillColour;
        this.borderColour = borderColour;
    }
    setDefaultColour() {
        this.fillColour = this.defaultFillColour;
        this.borderColour = this.defaultBorderColour;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    // tells managers to destroy this shape
    setToKill() {
        this.killFlag = true;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getFillColour() {
        return this.fillColour;
    }
    getBorderColour() {
        return this.borderColour;
    }
    // checks if the shape is marked for removal
    isTimeToKill() {
        return this.killFlag;
    }
}
