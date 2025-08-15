import { keys, KEYS } from './input.js';
import { canvasHeight, canvasWidth } from './game.js';

const PLAYER_INIT_X = 50;
const PLAYER_INIT_Y = 50;
const PLAYER_INIT_W = 30;
const PLAYER_INIT_H = 30;
const PLAYER_MAX_SPEED = 5;
const PLAYER_INIT_ACCEL = 0.1;
const PLAYER_NOMINAL_COLOUR: string = "green";
const COLLISIONCOLOUR: string = "black";

export class Player {
    x: number;
    y: number;
    h: number;
    w: number;
    xspeed: number;
    yspeed: number;
    maxSpeed: number;
    accel: number;
    COLOUR: string;

    constructor() {
        this.x = PLAYER_INIT_X;
        this.y = PLAYER_INIT_Y;
        this.w = PLAYER_INIT_W;
        this.h = PLAYER_INIT_H;
        this.xspeed = 0;
        this.yspeed = 0;
        this.maxSpeed = PLAYER_MAX_SPEED;
        this.accel = PLAYER_INIT_ACCEL;
        this.COLOUR = PLAYER_NOMINAL_COLOUR;
    }
    // update the player position based on the arrow keys
    updatePosition() {
        // increase the rectangle speed based on the arrow keys
        if (keys[KEYS.UP] && this.yspeed > -this.maxSpeed)    this.yspeed -= this.accel;
        if (keys[KEYS.DOWN] && this.yspeed < this.maxSpeed)  this.yspeed += this.accel;
        if (keys[KEYS.LEFT] && this.xspeed > -this.maxSpeed)  this.xspeed -= this.accel;
        if (keys[KEYS.RIGHT] && this.xspeed < this.maxSpeed) this.xspeed += this.accel;

        // decelerate when the arrow keys are released
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
        if (this.y > canvasHeight - this.h) {
            this.y = canvasHeight - this.h;
            this.yspeed = 0;
        } 
        if (this.x < 0) {
            this.x = 0;
            this.xspeed = 0;
        }
        if (this.x > canvasWidth - this.w) {
            this.x = canvasWidth - this.w;
            this.xspeed = 0;
        } 
    }
    updateColour(isCollision: boolean) {
        if (!isCollision) this.COLOUR = PLAYER_NOMINAL_COLOUR;
        else this.COLOUR = COLLISIONCOLOUR;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.COLOUR;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}