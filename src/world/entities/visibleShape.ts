// generic class for the common properties of all hazards, all modifiers, and the player
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

    setColour(fillColour: string, borderColour: string): void {
        this.fillColour = fillColour;
        this.borderColour = borderColour;
    }
    
    setDefaultColour(): void {
        this.fillColour = this.defaultFillColour;
        this.borderColour = this.defaultBorderColour;
    }

    setX(x: number): void {
        this.x = x;
    }

    setY(y: number): void {
        this.y = y;
    }

    // tells managers to destroy this shape
    setToKill(): void {
        this.killFlag = true;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getFillColour(): string {
        return this.fillColour;
    }

    getBorderColour(): string {
        return this.borderColour;
    }

    // checks if the shape is marked for removal
    isTimeToKill(): boolean {
        return this.killFlag;
    }
}