import { GAME_CONFIG, Keys, PLAYER_INITS, MOD_EFFECT_CONFIG } from './config.js';
// represents the player square and it's state
export class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = PLAYER_INITS.w;
        this.h = PLAYER_INITS.h;
        this.xspeed = PLAYER_INITS.xspeed;
        this.yspeed = PLAYER_INITS.yspeed;
        this.maxSpeed = PLAYER_INITS.maxSpeed;
        this.accel = PLAYER_INITS.accel;
        this.colour = PLAYER_INITS.health3Colour;
        this.isInvincible = false;
        this.health = PLAYER_INITS.num_lives;
        this.effects = [];
    }
    // handles player input and updates it's speed accordingly
    handleInput(input) {
        // increase speed if the arrow keys are pressed
        if (input.isKeyPressed(Keys.UP) && this.yspeed > -this.maxSpeed)
            this.yspeed -= this.accel;
        if (input.isKeyPressed(Keys.DOWN) && this.yspeed < this.maxSpeed)
            this.yspeed += this.accel;
        if (input.isKeyPressed(Keys.LEFT) && this.xspeed > -this.maxSpeed)
            this.xspeed -= this.accel;
        if (input.isKeyPressed(Keys.RIGHT) && this.xspeed < this.maxSpeed)
            this.xspeed += this.accel;
        // decrease speed when the arrow keys are released
        if (!input.isKeyPressed(Keys.UP) && !input.isKeyPressed(Keys.DOWN) && this.yspeed != 0) {
            if (this.yspeed > this.accel)
                this.yspeed -= this.accel;
            else if (this.yspeed < -this.accel)
                this.yspeed += this.accel;
            else
                this.yspeed = 0;
        }
        if (!input.isKeyPressed(Keys.LEFT) && !input.isKeyPressed(Keys.RIGHT) && this.xspeed != 0) {
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
        this.updateColour();
        this.accel = PLAYER_INITS.accel;
        for (let effect of this.effects) {
            if (effect.type === "INVINCIBILITY" /* MODIFIER_TYPE.INVINCIBILITY */) {
                this.isInvincible = true;
                this.colour = MOD_EFFECT_CONFIG.INVINCIBILITY.colour;
            }
            else if (effect.type === "ICE_RINK" /* MODIFIER_TYPE.ICE_RINK */) {
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
    // set the player colour
    updateColour() {
        if (this.health >= 3) {
            this.colour = PLAYER_INITS.health3Colour;
        }
        else if (this.health === 2) {
            this.colour = PLAYER_INITS.health2Colour;
        }
        else {
            this.colour = PLAYER_INITS.health1Colour;
        }
    }
    // updates the player's health
    modifyHealth(amount) {
        this.health += amount;
        // cap health at a maximum
        if (this.health > PLAYER_INITS.num_lives)
            this.health = PLAYER_INITS.num_lives;
        this.updateColour();
    }
    // checks if the player is dead
    isDead() {
        return this.health <= 0;
    }
    // sets the player position
    setPositionByCentre(x, y) {
        this.x = x - this.w / 2;
        this.y = y - this.h / 2;
    }
    // draw the player rectangle on the canvas
    draw(ctx, colour) {
        // Draw the player rectangle's fill colour
        ctx.fillStyle = colour;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        // Draw border
        ctx.strokeStyle = PLAYER_INITS.borderColour;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
    // reset the player to the initial state
    reset() {
        this.x = PLAYER_INITS.x;
        this.y = PLAYER_INITS.y;
        this.w = PLAYER_INITS.w;
        this.h = PLAYER_INITS.h;
        this.xspeed = PLAYER_INITS.xspeed;
        this.yspeed = PLAYER_INITS.yspeed;
        this.health = 3;
        this.effects = [];
        this.updateEffectsAbilities();
    }
}
