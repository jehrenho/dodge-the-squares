// a generic class for the common properties of all hazard, all modifiers, and the player
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
    // sets the fill and border colour
    setColour(fillColour, borderColour) {
        this.fillColour = fillColour;
        this.borderColour = borderColour;
    }
    // resets the fill and border colour to the default
    setDefaultColour() {
        this.fillColour = this.defaultFillColour;
        this.borderColour = this.defaultBorderColour;
    }
    // sets the x coordinate of the shape
    setX(x) {
        this.x = x;
    }
    // sets the y coordinate of the shape
    setY(y) {
        this.y = y;
    }
    // gets the x coordinate of the shape
    getX() {
        return this.x;
    }
    // gets the y coordinate of the shape
    getY() {
        return this.y;
    }
    getFillColour() {
        return this.fillColour;
    }
    getBorderColour() {
        return this.borderColour;
    }
    // raises a flag that a manager should remove this shape
    setToKill() {
        this.killFlag = true;
    }
    // checks if the shape is marked for removal
    isTimeToKill() {
        return this.killFlag;
    }
}
