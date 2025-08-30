// a generic class for the common properties of all hazard, all modifiers, and the player
export abstract class VisibleShape {
    protected x: number;
    protected y: number;
    protected fillColour: string;
    protected borderColour: string;
    protected defaultFillColour: string;
    protected defaultBorderColour: string;
    private killFlag: boolean;
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

    // sets the x coordinate of the shape
    setX(x: number): void {
        this.x = x;
    }

    // sets the y coordinate of the shape
    setY(y: number): void {
        this.y = y;
    }

    // gets the x coordinate of the shape
    getX(): number {
        return this.x;
    }

    // gets the y coordinate of the shape
    getY(): number {
        return this.y;
    }

    getFillColour(): string {
        return this.fillColour;
    }

    getBorderColour(): string {
        return this.borderColour;
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