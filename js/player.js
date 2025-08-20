import { PLAYER_INITS, MOD_EFFECT_CONFIG } from './config.js';
import { KEYS } from './input.js';
import { canvas } from './game.js';
// represents the player square and it's state
export class Player {
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
    handleInput(input) {
        // increase speed if the arrow keys are pressed
        if (input.keys[KEYS.UP] && this.yspeed > -this.maxSpeed)
            this.yspeed -= this.accel;
        if (input.keys[KEYS.DOWN] && this.yspeed < this.maxSpeed)
            this.yspeed += this.accel;
        if (input.keys[KEYS.LEFT] && this.xspeed > -this.maxSpeed)
            this.xspeed -= this.accel;
        if (input.keys[KEYS.RIGHT] && this.xspeed < this.maxSpeed)
            this.xspeed += this.accel;
        // decrease speed when the arrow keys are released
        if (!input.keys[KEYS.UP] && !input.keys[KEYS.DOWN] && this.yspeed != 0) {
            if (this.yspeed > this.accel)
                this.yspeed -= this.accel;
            else if (this.yspeed < -this.accel)
                this.yspeed += this.accel;
            else
                this.yspeed = 0;
        }
        if (!input.keys[KEYS.LEFT] && !input.keys[KEYS.RIGHT] && this.xspeed != 0) {
            if (this.xspeed > this.accel)
                this.xspeed -= this.accel;
            else if (this.xspeed < -this.accel)
                this.xspeed += this.accel;
            else
                this.xspeed = 0;
        }
    }
    // ensures the player stays within the canvas boundaries
    enforceBoundaries() {
        if (this.y < 0) {
            this.y = 0;
            this.yspeed = 0;
        }
        if (this.y > canvas.height - this.h) {
            this.y = canvas.height - this.h;
            this.yspeed = 0;
        }
        if (this.x < 0) {
            this.x = 0;
            this.xspeed = 0;
        }
        if (this.x > canvas.width - this.w) {
            this.x = canvas.width - this.w;
            this.xspeed = 0;
        }
    }
    // update the player position based on speed, accel, and input
    updatePosition(input) {
        this.handleInput(input);
        // change the rectangle position based on it's speed
        this.y += this.yspeed;
        this.x += this.xspeed;
        this.enforceBoundaries();
    }
    // updated the player's abilities based on the currently active effects
    updateEffectsAbilities() {
        this.isInvincible = false;
        this.colour = PLAYER_INITS.fillColour;
        this.accel = PLAYER_INITS.Accel;
        for (let effect of this.effects) {
            if (effect.type === 0 /* MODIFIER_TYPE.INVINCIBILITY */) {
                this.isInvincible = true;
                this.colour = MOD_EFFECT_CONFIG.INVINCIBILITY.colour;
            }
            else if (effect.type === 1 /* MODIFIER_TYPE.ICE_RINK */) {
                this.colour = MOD_EFFECT_CONFIG.ICE_RINK.colour;
                this.accel = MOD_EFFECT_CONFIG.ICE_RINK.accel;
            }
        }
    }
    // update the player's effects and remove any that have expired
    updateEffects() {
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
    draw(ctx) {
        // Draw the player rectangle's fill colour
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        // Draw border
        ctx.strokeStyle = PLAYER_INITS.borderColour; // Border color
        ctx.lineWidth = 1; // Border thickness
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
    // set the player colour
    setColour(colour) {
        this.colour = colour;
    }
    // reset the player to the initial state
    reset() {
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
