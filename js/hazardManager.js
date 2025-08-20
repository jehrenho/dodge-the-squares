import { GAME_CONFIG, HAZ_GEN_INITS, MOD_EFFECT_CONFIG } from './config.js';
// represents a single hazard rectangle in the game
class HazardRectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.initw = HAZ_GEN_INITS.w;
        this.inith = HAZ_GEN_INITS.h;
    }
}
// helper logarithm function with a user specified base
function logBase(x, base) {
    return Math.log(x) / Math.log(base);
}
// represents the collection of hazards in the game
export class HazardManager {
    constructor() {
        this.hazardSpeed = HAZ_GEN_INITS.speed;
        this.hazardDensity = HAZ_GEN_INITS.density;
        this.colour = HAZ_GEN_INITS.colour;
        this.currentSizeFactor = 1.0;
        this.targetSizeFactor = 1.0;
        this.rateOfSizeFactorChange = 0;
        this.minShrinkFactor = MOD_EFFECT_CONFIG.SHRINK_HAZ.scaleFactor;
        this.maxEnlargeFactor = MOD_EFFECT_CONFIG.ENLARGE_HAZ.scaleFactor;
        this.hazards = [];
    }
    // generates new hazards based on the hazard density
    generateNewHazards() {
        const rand = Math.random();
        if (rand < this.hazardDensity) {
            // map the new rectangle location to the canvas dimensions in pixels
            const newHazardy = ((GAME_CONFIG.VIRTUAL_HEIGHT + HAZ_GEN_INITS.h) * rand) / this.hazardDensity;
            // create a new rectangle
            this.hazards.push(new HazardRectangle(GAME_CONFIG.VIRTUAL_WIDTH, newHazardy - HAZ_GEN_INITS.h, HAZ_GEN_INITS.w * this.currentSizeFactor, HAZ_GEN_INITS.h * this.currentSizeFactor));
        }
    }
    // moves all hazards to the left, destroys hazards that have moved off screen, and sets their size
    moveHazards() {
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            this.hazards[i].x -= this.hazardSpeed;
            // remove rectangles that have moved off the left side of the canvas
            if (this.hazards[i].x < -this.hazards[i].w) {
                this.hazards.splice(i, 1);
                continue;
            }
            // update the size of the hazards if we need to
            if (this.rateOfSizeFactorChange === 0)
                continue;
            this.hazards[i].w = this.hazards[i].initw * this.currentSizeFactor;
            this.hazards[i].h = this.hazards[i].inith * this.currentSizeFactor;
        }
    }
    // updates the size of the hazards
    updateHazardSizes() {
        // check if we have reached the target size
        if ((this.rateOfSizeFactorChange > 0 && this.currentSizeFactor > this.targetSizeFactor)
            || (this.rateOfSizeFactorChange < 0 && this.currentSizeFactor < this.targetSizeFactor)) {
            if (this.targetSizeFactor != 1) {
                // a new size is now active, decay back to the initial size
                this.currentSizeFactor = this.targetSizeFactor;
                this.targetSizeFactor = 1;
                this.rateOfSizeFactorChange = (this.targetSizeFactor - this.currentSizeFactor) / HAZ_GEN_INITS.sizeModDecayFrames;
            }
            else {
                // initial size has been reached
                this.currentSizeFactor = 1;
                this.rateOfSizeFactorChange = 0;
            }
        }
        this.currentSizeFactor += this.rateOfSizeFactorChange;
    }
    // generates new hazards, destroys old ones, and moves all hazards
    updateHazards() {
        this.generateNewHazards();
        this.moveHazards();
        this.updateHazardSizes();
    }
    // applies a new size scale factor to all hazards 
    applySizeScaleFactor(scaleFactor) {
        this.targetSizeFactor = this.currentSizeFactor * scaleFactor;
        if (this.targetSizeFactor < this.minShrinkFactor) {
            this.targetSizeFactor = this.minShrinkFactor;
        }
        else if (this.targetSizeFactor > this.maxEnlargeFactor) {
            this.targetSizeFactor = this.maxEnlargeFactor;
        }
        // calculate the rate of size change given the target size factor and the initial transition frames
        this.rateOfSizeFactorChange = (this.targetSizeFactor - this.currentSizeFactor) / HAZ_GEN_INITS.sizeModInitTransFrames;
    }
    // detects collisions between the player and hazard rectangles
    detectCollisions(player) {
        if (player.isInvincible)
            return false;
        for (let hazard of this.hazards) {
            if (hazard.x < player.x + player.w &&
                hazard.x + hazard.w > player.x &&
                hazard.y < player.y + player.h &&
                hazard.y + hazard.h > player.y)
                return true;
        }
        return false;
    }
    // draws all hazards on the canvas
    draw(ctx) {
        ctx.fillStyle = this.colour;
        for (let hazard of this.hazards) {
            // Draw the hazard rectangle's fill colour
            ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
            // Draw border
            ctx.strokeStyle = HAZ_GEN_INITS.borderColour;
            ctx.lineWidth = 1;
            ctx.strokeRect(hazard.x, hazard.y, hazard.w, hazard.h);
        }
    }
    // updates the difficulty of hazards logarithmically based on the time survived
    updateDifficulty(numMinutesSurvived) {
        let difficultyFactor = logBase(numMinutesSurvived + 1, HAZ_GEN_INITS.difficultyLogBase);
        this.hazardDensity = HAZ_GEN_INITS.density * (difficultyFactor + 1) * 2;
        this.hazardSpeed = HAZ_GEN_INITS.speed * (difficultyFactor + 1);
    }
    // resets all hazards (clears them)
    reset() {
        this.hazardSpeed = HAZ_GEN_INITS.speed;
        this.hazardDensity = HAZ_GEN_INITS.density;
        this.colour = HAZ_GEN_INITS.colour;
        this.currentSizeFactor = 1.0;
        this.targetSizeFactor = 1.0;
        this.rateOfSizeFactorChange = 0;
        this.minShrinkFactor = MOD_EFFECT_CONFIG.SHRINK_HAZ.scaleFactor;
        this.maxEnlargeFactor = MOD_EFFECT_CONFIG.ENLARGE_HAZ.scaleFactor;
        this.hazards = [];
    }
}
