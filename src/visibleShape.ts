// a generic class for the common properties of all hazard, all modifiers, and the player
export abstract class VisibleShape {
    x: number;
    y: number;
    fillColour: string;
    borderColour: string;
    defaultFillColour: string;
    defaultBorderColour: string;
    killFlag: boolean;
    constructor(x: number, y: number, defaultFillColour: string, defaultBorderColour: string) {
        this.x = x;
        this.y = y;
        this.defaultFillColour = defaultFillColour;
        this.defaultBorderColour = defaultBorderColour;
        this.fillColour = defaultFillColour;
        this.borderColour = defaultBorderColour;
        this.killFlag = false;
    }

    // sets the fill and border colour
    setColour(fillColour: string, borderColour: string): void {
        this.fillColour = fillColour;
        this.borderColour = borderColour;
    }

    // resets the fill and border colour to the default
    setDefaultColour(): void {
        this.fillColour = this.defaultFillColour;
        this.borderColour = this.defaultBorderColour;
    }

    // raises a flag that a manager should remove this shape
    setToKill(): void {
        this.killFlag = true;
    }

    // checks if the shape is marked for removal
    isTimeToKill(): boolean {
        return this.killFlag;
    }
}