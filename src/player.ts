import { keys, KEYS } from './input.js';
import { canvasHeight, canvasWidth } from './game.js';

const NORMALCOLOUR: string = "green";
const COLLISIONCOLOUR: string = "black"

export class Player {
    rectHeight: number;
    rectWidth: number;
    maxSpeed: number;
    accel: number;
    x: number;
    y: number;
    xspeed: number;
    yspeed: number;
    COLOUR: string;

    constructor() {
        this.rectHeight = 30;
        this.rectWidth = 30;
        this.maxSpeed = 5;
        this.accel = 0.1;
        this.x = 50;
        this.y = 50;
        this.xspeed = 0;
        this.yspeed = 0;
        this.COLOUR = NORMALCOLOUR;
    }
    updatePosition() {
        // increase the rectangle speed based on the arrow keys
        if (keys[KEYS.UP] && this.yspeed > -this.maxSpeed)    this.yspeed -= this.accel;
        if (keys[KEYS.DOWN] && this.yspeed < this.maxSpeed)  this.yspeed += this.accel;
        if (keys[KEYS.LEFT] && this.xspeed > -this.maxSpeed)  this.xspeed -= this.accel;
        if (keys[KEYS.RIGHT] && this.xspeed < this.maxSpeed) this.xspeed += this.accel;

        // decellerate when the arrow keys are released
        if (!keys[KEYS.UP] && !keys[KEYS.DOWN] && this.yspeed != 0) {
            if (this.yspeed > this.accel) this.yspeed -= this.accel;
            else if (this.yspeed < -this.accel) this.yspeed += this.accel;
            else this.yspeed = 0;
        }
        if (!keys[KEYS.LEFT] && !keys[KEYS.RIGHT] && this.xspeed != 0) {
            if (this.xspeed > this.accel) this.xspeed -= this.accel;
            else if (this.xspeed < -this.accel) this.xspeed += this.accel;
            else this.xspeed = 0;
        }

        // change the rectangle position based on it's speed
        this.y += this.yspeed;
        this.x += this.xspeed;

        // don't leave the boundary of the canvas
        // kill speed when the rectangle hits the boundary 
        if (this.y < 0) {
            this.y = 0;
            this.yspeed = 0;
        }
        if (this.y > canvasHeight - this.rectHeight) {
            this.y = canvasHeight - this.rectHeight;
            this.yspeed = 0;
        } 
        if (this.x < 0) {
            this.x = 0;
            this.xspeed = 0;
        }
        if (this.x > canvasWidth - this.rectWidth) {
            this.x = canvasWidth - this.rectWidth;
            this.xspeed = 0;
        } 
    }
    updateColour(isCollision:boolean) {
        if (!isCollision) this.COLOUR = NORMALCOLOUR;
        else this.COLOUR = COLLISIONCOLOUR;
    }
    draw(ctx:CanvasRenderingContext2D) {
        ctx.fillStyle = this.COLOUR;
        ctx.fillRect(this.x, this.y, this.rectWidth, this.rectHeight);
    }
}