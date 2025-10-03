import { VisibleShape } from './visible-shape.js';
import { HazardRenderData } from '../../graphics/render-data.js';

// represents a single hazard rectangle in the game
export class Hazard extends VisibleShape {
    private readonly nominalWidth: number;
    private readonly nominalHeight: number;
    private width: number;
    private height: number;

    constructor(x:number, y:number, xspeed:number, width:number, height:number) {
        super(x, y);
        this.nominalWidth = width;
        this.nominalHeight = height;
        this.width = width;
        this.height = height;
        this.xspeed = xspeed;
    }

    updatePosition(): void {
        this.x -= this.xspeed;
    }

    setPositionByCentre(x: number, y: number): void {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }

    setWidth(width: number): void {
        this.width = width;
    }

    setHeight(height: number): void {
        this.height = height;
    }

    getNominalWidth(): number {
        return this.nominalWidth;
    }

    getNominalHeight(): number {
        return this.nominalHeight;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getRenderData(): HazardRenderData {
        return {
            type: 'hazard',
            position: { x: this.x, y: this.y },
            size: { width: this.width, height: this.height },
            flashOn: this.flashOn
        };
    }
}