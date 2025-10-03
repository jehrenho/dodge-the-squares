// generic class for the common properties of all hazards, all modifiers, and the player
export abstract class VisibleShape {
    protected x: number;
    protected y: number;
    protected xspeed: number;
    protected flashOn: boolean;
    private killFlag: boolean;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.xspeed = 0;
        this.flashOn = false;
        this.killFlag = false;
    }

    setX(x: number): void {
        this.x = x;
    }

    setY(y: number): void {
        this.y = y;
    }

    setFlash(flashOn: boolean): void {
        this.flashOn = flashOn;
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

    // checks if the shape is marked for removal
    isTimeToKill(): boolean {
        return this.killFlag;
    }
}