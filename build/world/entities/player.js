import { PLAYER_INITS, } from './entities-config.js';
import { SCALING_CONFIG } from '../../graphics/graphics-config.js';
import { VisibleShape } from './visibleShape.js';
// represents the player square and it's state
export class Player extends VisibleShape {
    constructor() {
        super(0, 0, PLAYER_INITS.health3Colour, PLAYER_INITS.borderColour);
        this.width = PLAYER_INITS.width;
        this.height = PLAYER_INITS.height;
        this.xspeed = PLAYER_INITS.xspeed;
        this.yspeed = PLAYER_INITS.yspeed;
        this.maxSpeed = PLAYER_INITS.maxSpeed;
        this.defaultAccel = PLAYER_INITS.accel;
        this.accel = this.defaultAccel;
        this.invincibility = false;
        this.health = PLAYER_INITS.num_lives;
    }
    // handles player input and updates it's speed accordingly
    handleInput(movementInput) {
        // increase speed if the arrow keys are pressed
        if (movementInput.up && this.yspeed > -this.maxSpeed)
            this.yspeed -= this.accel;
        if (movementInput.down && this.yspeed < this.maxSpeed)
            this.yspeed += this.accel;
        if (movementInput.left && this.xspeed > -this.maxSpeed)
            this.xspeed -= this.accel;
        if (movementInput.right && this.xspeed < this.maxSpeed)
            this.xspeed += this.accel;
        // decrease speed when the arrow keys are released
        if (!movementInput.up && !movementInput.down && this.yspeed != 0) {
            if (this.yspeed > this.accel)
                this.yspeed -= this.accel;
            else if (this.yspeed < -this.accel)
                this.yspeed += this.accel;
            else
                this.yspeed = 0;
        }
        if (!movementInput.left && !movementInput.right && this.xspeed != 0) {
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
        if (this.y > SCALING_CONFIG.VIRTUAL_HEIGHT - this.height) {
            this.y = SCALING_CONFIG.VIRTUAL_HEIGHT - this.height;
            this.yspeed = 0;
        }
        if (this.x < 0) {
            this.x = 0;
            this.xspeed = 0;
        }
        if (this.x > SCALING_CONFIG.VIRTUAL_WIDTH - this.width) {
            this.x = SCALING_CONFIG.VIRTUAL_WIDTH - this.width;
            this.xspeed = 0;
        }
    }
    // update the player position based on speed, accel, and input
    updatePosition(movementInput) {
        this.handleInput(movementInput);
        // change the rectangle position based on it's speed
        this.y += this.yspeed;
        this.x += this.xspeed;
        this.enforceBoundaries();
        this.setDefaultColourByHealth();
    }
    // applies the active effects to the player
    applyEffects(isInvincible, accelFactor, fillColour, borderColour) {
        this.invincibility = isInvincible;
        this.accel = this.defaultAccel * accelFactor;
        if (fillColour) {
            this.fillColour = fillColour;
        }
        else {
            this.fillColour = this.defaultFillColour;
        }
        if (borderColour) {
            this.borderColour = borderColour;
        }
        else {
            this.borderColour = this.defaultBorderColour;
        }
    }
    // updates the player's health
    modifyHealth(amount) {
        this.health += amount;
        // cap health at a maximum
        if (this.health > PLAYER_INITS.num_lives)
            this.health = PLAYER_INITS.num_lives;
    }
    // getters/setters
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    // set the player's default colour based on it's health
    setDefaultColourByHealth() {
        if (this.health >= 3) {
            this.defaultFillColour = PLAYER_INITS.health3Colour;
        }
        else if (this.health === 2) {
            this.defaultFillColour = PLAYER_INITS.health2Colour;
        }
        else {
            this.defaultFillColour = PLAYER_INITS.health1Colour;
        }
    }
    // sets the player position
    setPositionByCentre(x, y) {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }
    // checks if the player is invincible
    isInvincible() {
        return this.invincibility;
    }
    // checks if the player is dead
    isDead() {
        return this.health <= 0;
    }
    // draw the player rectangle on the canvas
    draw(ctx) {
        // Draw the player rectangle's fill colour
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Draw border
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    // reset the player to the initial state
    reset() {
        this.x = PLAYER_INITS.x;
        this.y = PLAYER_INITS.y;
        this.xspeed = PLAYER_INITS.xspeed;
        this.yspeed = PLAYER_INITS.yspeed;
        this.health = PLAYER_INITS.num_lives;
        this.invincibility = false;
        this.accel = this.defaultAccel;
        this.setDefaultColourByHealth();
        this.fillColour = this.defaultFillColour;
        this.borderColour = this.defaultBorderColour;
    }
}
