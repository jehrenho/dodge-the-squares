import { GAME_CONFIG,
    Keys,
    PLAYER_INITS,
    MODIFIER_TYPE,
    MOD_EFFECT_CONFIG
 } from './config.js';
import { InputManager } from './input.js';
import { ModifierEffect } from './modifierEffect.js';

// represents the player square and it's state
export class Player {
    x: number;
    y: number;
    h: number;
    w: number;
    xspeed: number;
    yspeed: number;
    maxSpeed: number;
    accel: number;
    colour: string;
    effects: ModifierEffect[]; // array of active modifier effects
    isInvincible: boolean;

    constructor() {
        this.x = PLAYER_INITS.x;
        this.y = PLAYER_INITS.y;
        this.w = PLAYER_INITS.w;
        this.h = PLAYER_INITS.h;
        this.xspeed = PLAYER_INITS.xspeed;
        this.yspeed = PLAYER_INITS.yspeed;
        this.maxSpeed = PLAYER_INITS.maxSpeed;
        this.accel = PLAYER_INITS.Accel;
        this.colour = PLAYER_INITS.fillColour;
        this.effects = [];
        this.isInvincible = false;
    }

    // handles player input and updates it's speed accordingly
    handleInput(input: InputManager): void {
        // increase speed if the arrow keys are pressed
        if (input.keys[Keys.UP] && this.yspeed > -this.maxSpeed)    this.yspeed -= this.accel;
        if (input.keys[Keys.DOWN] && this.yspeed < this.maxSpeed)  this.yspeed += this.accel;
        if (input.keys[Keys.LEFT] && this.xspeed > -this.maxSpeed)  this.xspeed -= this.accel;
        if (input.keys[Keys.RIGHT] && this.xspeed < this.maxSpeed) this.xspeed += this.accel;

        // decrease speed when the arrow keys are released
        if (!input.keys[Keys.UP] && !input.keys[Keys.DOWN] && this.yspeed != 0) {
            if (this.yspeed > this.accel) this.yspeed -= this.accel;
            else if (this.yspeed < -this.accel) this.yspeed += this.accel;
            else this.yspeed = 0;
        }
        if (!input.keys[Keys.LEFT] && !input.keys[Keys.RIGHT] && this.xspeed != 0) {
            if (this.xspeed > this.accel) this.xspeed -= this.accel;
            else if (this.xspeed < -this.accel) this.xspeed += this.accel;
            else this.xspeed = 0;
        }
    }

    // ensures the player stays within the canvas boundaries
    enforceBoundaries(): void {
        if (this.y < 0) {
            this.y = 0;
            this.yspeed = 0;
        }
        if (this.y > GAME_CONFIG.VIRTUAL_HEIGHT - this.h) {
            this.y = GAME_CONFIG.VIRTUAL_HEIGHT - this.h;
            this.yspeed = 0;
        } 
        if (this.x < 0) {
            this.x = 0;
            this.xspeed = 0;
        }
        if (this.x > GAME_CONFIG.VIRTUAL_WIDTH - this.w) {
            this.x = GAME_CONFIG.VIRTUAL_WIDTH - this.w;
            this.xspeed = 0;
        } 
    }

    // update the player position based on speed, accel, and input
    updatePosition(input: InputManager): void {
        this.handleInput(input);
        // change the rectangle position based on it's speed
        this.y += this.yspeed;
        this.x += this.xspeed;
        this.enforceBoundaries();
    }

    // updated the player's abilities based on the currently active effects
    updateEffectsAbilities(): void {
        this.isInvincible = false;
        this.colour = PLAYER_INITS.fillColour;
        this.accel = PLAYER_INITS.Accel;

        for (let effect of this.effects) {
            if (effect.type === MODIFIER_TYPE.INVINCIBILITY) {
                this.isInvincible = true;
                this.colour = MOD_EFFECT_CONFIG.INVINCIBILITY.colour;
            } else if (effect.type === MODIFIER_TYPE.ICE_RINK) {
                this.colour = MOD_EFFECT_CONFIG.ICE_RINK.colour;
                this.accel = MOD_EFFECT_CONFIG.ICE_RINK.accel;
            }
        }
    }

    // update the player's effects and remove any that have expired
    updateEffects(): void {
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            if (effect.update(this) <= 0) {
                // remove the ModifierEffect from the player's effects array
                this.effects.splice(i, 1);
            }
        }
        // update the player's abilities based on the remaining effects
        this.updateEffectsAbilities();
    }

    // draw the player rectangle on the canvas
    draw(ctx: CanvasRenderingContext2D): void {
        // Draw the player rectangle's fill colour
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Draw border
        ctx.strokeStyle = PLAYER_INITS.borderColour;        // Border color
        ctx.lineWidth = 1;                // Border thickness
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    // set the player colour
    setColour(colour: string): void {
        this.colour = colour;
    }

    // reset the player to the initial state
    reset(): void {
        this.x = PLAYER_INITS.x;
        this.y = PLAYER_INITS.y;
        this.w = PLAYER_INITS.w;
        this.h = PLAYER_INITS.h;
        this.xspeed = PLAYER_INITS.xspeed;
        this.yspeed = PLAYER_INITS.yspeed;
        this.effects = [];
        this.updateEffectsAbilities();
    }
}