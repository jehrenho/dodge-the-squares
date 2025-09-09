import { PLAYER_CONFIG } from './entities-config.js';
import { VIRTUAL_SCREEN } from '../../graphics/graphics-config.js';
import { VisibleShape } from './visibleShape.js';
import { MovementInput } from '../../input/input-config.js';
import { PlayerRenderData } from '../../graphics/render-data.js';

// represents the player square and it's state
export class Player extends VisibleShape {
    private readonly width: number;
    private readonly height: number;
    private readonly maxSpeed: number;
    private readonly defaultAccel: number;
    private xspeed: number;
    private yspeed: number;
    private accel: number;
    private health: number;
    private invincibility: boolean;
    private iceRink: boolean;
    private wearOffColourOverride: boolean;

    constructor() {
        super(0, 0);
        this.width = PLAYER_CONFIG.width;
        this.height = PLAYER_CONFIG.height;
        this.maxSpeed = PLAYER_CONFIG.maxSpeed;
        this.defaultAccel = PLAYER_CONFIG.defaultAccel;
        this.health = PLAYER_CONFIG.num_lives;
        this.xspeed = 0;
        this.yspeed = 0;
        this.accel = this.defaultAccel;
        this.invincibility = false;
        this.iceRink = false;
        this.wearOffColourOverride = false;
    }

    // update the player position based on speed, accel, and input
    updatePosition(movementInput: MovementInput): void {
        this.handleInput(movementInput);
        this.y += this.yspeed;
        this.x += this.xspeed;
        this.enforceBoundaries();
    }

    // applies the active effects to the player
    applyEffects(isInvincible: boolean, accelFactor: number): void {
        this.invincibility = isInvincible;
        this.accel = this.defaultAccel * accelFactor;
        if (accelFactor === 1) {
            this.iceRink = false;
        } else {
            this.iceRink = true;
        }
    }

    setWearOffColourOverride(value: boolean): void {
        this.wearOffColourOverride = value;
    }

    setPositionByCentre(x: number, y: number): void {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }

    modifyHealth(amount: number): void {
        this.health += amount;
        // cap health at a maximum
        if (this.health > PLAYER_CONFIG.num_lives) this.health = PLAYER_CONFIG.num_lives;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    isInvincible(): boolean {
        return this.invincibility;
    }

    isDead(): boolean {
        return this.health <= 0;
    }

    getRenderData(): PlayerRenderData {
        return {
            type: 'player',
            position: { x: this.x, y: this.y },
            size: { width: this.width, height: this.height },
            health: this.health,
            invincible: this.invincibility,
            iceRink: this.iceRink,
            flashOn: this.flashOn,
            wearOffColourOverride: this.wearOffColourOverride
        };
    }

    reset(): void {
        this.xspeed = 0;
        this.yspeed = 0;
        this.accel = this.defaultAccel;
        this.invincibility = false;
        this.health = PLAYER_CONFIG.num_lives;
    }

    // reads the movement input and updates it's speed accordingly
    private handleInput(movementInput: MovementInput): void {
        // increase speed if the arrow keys are pressed
        if (movementInput.up && this.yspeed > -this.maxSpeed)    this.yspeed -= this.accel;
        if (movementInput.down && this.yspeed < this.maxSpeed)  this.yspeed += this.accel;
        if (movementInput.left && this.xspeed > -this.maxSpeed)  this.xspeed -= this.accel;
        if (movementInput.right && this.xspeed < this.maxSpeed) this.xspeed += this.accel;

        // decrease speed when the arrow keys are released
        if (!movementInput.up && !movementInput.down && this.yspeed != 0) {
            if (this.yspeed > this.accel) this.yspeed -= this.accel;
            else if (this.yspeed < -this.accel) this.yspeed += this.accel;
            else this.yspeed = 0;
        }
        if (!movementInput.left && !movementInput.right && this.xspeed != 0) {
            if (this.xspeed > this.accel) this.xspeed -= this.accel;
            else if (this.xspeed < -this.accel) this.xspeed += this.accel;
            else this.xspeed = 0;
        }
    }

    // ensures the player stays within the canvas boundaries
    private enforceBoundaries(): void {
        if (this.y < 0) {
            this.y = 0;
            this.yspeed = 0;
        }
        if (this.y > VIRTUAL_SCREEN.height - this.height) {
            this.y = VIRTUAL_SCREEN.height - this.height;
            this.yspeed = 0;
        } 
        if (this.x < 0) {
            this.x = 0;
            this.xspeed = 0;
        }
        if (this.x > VIRTUAL_SCREEN.width - this.width) {
            this.x = VIRTUAL_SCREEN.width - this.width;
            this.xspeed = 0;
        } 
    }
}