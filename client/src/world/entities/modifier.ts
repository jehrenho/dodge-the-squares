import { VisibleShape } from './visible-shape.js';
import { ModifierType } from './config/entities-config.js';
import { ModifierRenderData } from '../../graphics/render-data.js';

// represents an individual modifier circle in the game
export class Modifier extends VisibleShape {
    private readonly modifierType: ModifierType;
    private readonly radius: number;

    constructor(modifierType: ModifierType, x: number, y: number, xspeed: number, radius: number) {
        super(x, y);
        this.modifierType = modifierType;
        this.xspeed = xspeed;
        this.radius = radius;
    }

    updatePosition(): void {
        this.x -= this.xspeed;
    }

    setX(x: number): void {
        this.x = x;
    }

    setY(y: number): void {
        this.y = y;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getRadius(): number {
        return this.radius;
    }

    getType(): ModifierType {
        return this.modifierType;
    }

    getRenderData(): ModifierRenderData {
        return {
            type: 'modifier',
            modifierType: this.modifierType,
            position: { x: this.x, y: this.y },
            radius: this.radius,
            flashOn: this.flashOn
        };
    }
}