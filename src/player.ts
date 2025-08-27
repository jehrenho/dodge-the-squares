import { GAME_CONFIG,
    Keys,
    PLAYER_INITS,
    MODIFIER_TYPE,
    ModifierType,
    MOD_EFFECT_CONFIG
 } from './config.js';
import { InputManager } from './inputManager.js';
import { ModifierEffect, InvincibilityEffect, IceRinkEffect } from './modifierEffect.js';
import { VisibleShape } from './visibleShape.js';

// represents the player square and it's state
export class Player extends VisibleShape {
    h: number;
    w: number;
    xspeed: number;
    yspeed: number;
    maxSpeed: number;
    accel: number;
    effects: ModifierEffect[]; // array of active modifier effects
    isInvincible: boolean;
    health: number;

    constructor() {
        super(0, 0, PLAYER_INITS.health3Colour, PLAYER_INITS.borderColour);
        this.w = PLAYER_INITS.w;
        this.h = PLAYER_INITS.h;
        this.xspeed = PLAYER_INITS.xspeed;
        this.yspeed = PLAYER_INITS.yspeed;
        this.maxSpeed = PLAYER_INITS.maxSpeed;
        this.accel = PLAYER_INITS.accel;
        this.isInvincible = false;
        this.health = PLAYER_INITS.num_lives;
        this.effects = [];
    }

    // handles player input and updates it's speed accordingly
    handleInput(input: InputManager): void {
        // increase speed if the arrow keys are pressed
        if (input.isKeyPressed(Keys.UP) && this.yspeed > -this.maxSpeed)    this.yspeed -= this.accel;
        if (input.isKeyPressed(Keys.DOWN) && this.yspeed < this.maxSpeed)  this.yspeed += this.accel;
        if (input.isKeyPressed(Keys.LEFT) && this.xspeed > -this.maxSpeed)  this.xspeed -= this.accel;
        if (input.isKeyPressed(Keys.RIGHT) && this.xspeed < this.maxSpeed) this.xspeed += this.accel;

        // decrease speed when the arrow keys are released
        if (!input.isKeyPressed(Keys.UP) && !input.isKeyPressed(Keys.DOWN) && this.yspeed != 0) {
            if (this.yspeed > this.accel) this.yspeed -= this.accel;
            else if (this.yspeed < -this.accel) this.yspeed += this.accel;
            else this.yspeed = 0;
        }
        if (!input.isKeyPressed(Keys.LEFT) && !input.isKeyPressed(Keys.RIGHT) && this.xspeed != 0) {
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

    // adds a new modifier effect to the player
    addEffect(effectType: ModifierType): void {
        switch(effectType) {
            case MODIFIER_TYPE.INVINCIBILITY:
                this.effects.push(new InvincibilityEffect());
                break;
            case MODIFIER_TYPE.ICE_RINK:
                this.effects.push(new IceRinkEffect());
                break;
            default:
                console.error(`Unknown modifier type: ${effectType}`);
        }
    }

    // return true if there are no active effects
    isNoEffects(): boolean {
        return this.effects.length === 0;
    }

    // update the player's effects and remove any that have expired
    updateEffects(): void {
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            effect.update();
            if (effect.isExpired()) {
                // remove the ModifierEffect from the player's effects array
                this.effects.splice(i, 1);
            }
        }
        // update the player's abilities based on the remaining effects
        this.resolveActiveEffects();
    }

    // sets the player properties based on the currently active effects
    resolveActiveEffects(): void {
        // sets abilities to defaults
        this.isInvincible = false;
        this.setColourByHealth();
        this.accel = PLAYER_INITS.accel;
        // add effects abilities
        for (let effect of this.effects) {
            if (effect.type === MODIFIER_TYPE.INVINCIBILITY) {
                this.isInvincible = true;
                this.fillColour = MOD_EFFECT_CONFIG.INVINCIBILITY.colour;
            } else if (effect.type === MODIFIER_TYPE.ICE_RINK) {
                this.fillColour = MOD_EFFECT_CONFIG.ICE_RINK.colour;
                this.accel = MOD_EFFECT_CONFIG.ICE_RINK.accel;
            }
        }
    }

    // set the player colour
    setColourByHealth() {
        if (this.health >= 3) {
            this.fillColour = PLAYER_INITS.health3Colour;
        } else if (this.health === 2) {
            this.fillColour = PLAYER_INITS.health2Colour;
        } else {
            this.fillColour = PLAYER_INITS.health1Colour;
        }
    }

    // updates the player's health
    modifyHealth(amount: number): void {
        this.health += amount;
        // cap health at a maximum
        if (this.health > PLAYER_INITS.num_lives) this.health = PLAYER_INITS.num_lives;
        this.setColourByHealth();
    }

    // checks if the player is dead
    isDead(): boolean {
        return this.health <= 0;
    }

    // sets the player position
    setPositionByCentre(x: number, y: number): void {
        this.x = x - this.w / 2;
        this.y = y - this.h / 2;
    }

    // draw the player rectangle on the canvas
    draw(ctx: CanvasRenderingContext2D): void {
        // Draw the player rectangle's fill colour
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Draw border
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    // reset the player to the initial state
    reset(): void {
        this.x = PLAYER_INITS.x;
        this.y = PLAYER_INITS.y;
        this.w = PLAYER_INITS.w;
        this.h = PLAYER_INITS.h;
        this.xspeed = PLAYER_INITS.xspeed;
        this.yspeed = PLAYER_INITS.yspeed;
        this.health = 3;
        this.effects = [];
        this.resolveActiveEffects();
    }
}