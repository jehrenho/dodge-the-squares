import { HAZ_GEN_INITS, MOD_EFFECT_CONFIG } from './entities-config.js';
import { GAME_CONFIG } from '../../game/game-config.js';
import { Hazard } from './hazard.js';
import { GAME_STATE_CONFIG } from '../../game/game-config.js';
// helper logarithm function with a user specified base
function logBase(x, base) {
    return Math.log(x) / Math.log(base);
}
// represents the collection of hazards in the game
export class HazardManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.hazardSpeed = HAZ_GEN_INITS.speed;
        this.hazardDensity = HAZ_GEN_INITS.density;
        this.fillColour = HAZ_GEN_INITS.fillColour;
        this.borderColour = HAZ_GEN_INITS.borderColour;
        this.currentSizeFactor = 1.0;
        this.targetSizeFactor = 1.0;
        this.rateOfSizeFactorChange = 0;
        this.minShrinkFactor = MOD_EFFECT_CONFIG.SHRINK_HAZ.scaleFactor;
        this.maxEnlargeFactor = MOD_EFFECT_CONFIG.ENLARGE_HAZ.scaleFactor;
        this.hazards = [];
    }
    // creates a new hazard given it's center position
    createHazard(x, y, w, h, colour, borderColour) {
        const hazard = new Hazard(x, y, w, h, colour, borderColour);
        this.hazards.push(hazard);
        return hazard;
    }
    // creates the hazard on the menu screen
    createMenuHazard() {
        const hazard = new Hazard(0, 0, HAZ_GEN_INITS.w, HAZ_GEN_INITS.h, HAZ_GEN_INITS.fillColour, HAZ_GEN_INITS.borderColour);
        this.hazards.push(hazard);
        return hazard;
    }
    // generates new hazards based on the hazard density
    generateNewHazards() {
        const rand = Math.random();
        if (rand < this.hazardDensity) {
            // map the new rectangle location to the canvas dimensions in pixels
            const newHazardy = ((GAME_CONFIG.VIRTUAL_HEIGHT + HAZ_GEN_INITS.h) * rand) / this.hazardDensity;
            // create a new hazard
            this.createHazard(GAME_CONFIG.VIRTUAL_WIDTH, newHazardy - HAZ_GEN_INITS.h, HAZ_GEN_INITS.w * this.currentSizeFactor, HAZ_GEN_INITS.h * this.currentSizeFactor, this.fillColour, this.borderColour);
        }
    }
    // moves all hazards to the left, destroys hazards that have moved off screen, and sets their size
    moveHazards() {
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            this.hazards[i].setX(this.hazards[i].getX() - this.hazardSpeed);
            // remove rectangles that have moved off the left side of the canvas
            if (this.hazards[i].getX() < -this.hazards[i].getWidth() || this.hazards[i].isTimeToKill()) {
                this.hazards.splice(i, 1);
                continue;
            }
            // update the size of the hazards if we need to
            if (this.rateOfSizeFactorChange === 0)
                continue;
            this.hazards[i].setWidth(this.hazards[i].getNominalWidth() * this.currentSizeFactor);
            this.hazards[i].setHeight(this.hazards[i].getNominalHeight() * this.currentSizeFactor);
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
        this.updateDifficulty(this.gameState);
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
    // detects collisions between the player and hazards
    detectCollisions(player) {
        if (player.isInvincible())
            return [];
        let collisions = [];
        for (let hazard of this.hazards) {
            if (hazard.getX() < player.getX() + player.getWidth() &&
                hazard.getX() + hazard.getWidth() > player.getX() &&
                hazard.getY() < player.getY() + player.getHeight() &&
                hazard.getY() + hazard.getHeight() > player.getY())
                collisions.push(hazard);
        }
        return collisions;
    }
    // draws all hazards on the canvas
    draw(ctx) {
        ctx.fillStyle = this.fillColour;
        for (let hazard of this.hazards) {
            hazard.draw(ctx);
        }
    }
    // updates the difficulty of hazards logarithmically based on the time survived every second
    updateDifficulty(gameState) {
        if (gameState.getFramesSurvived() % GAME_STATE_CONFIG.fps === 0) {
            let difficultyFactor = logBase(gameState.getMinutesSurvived() + 1, HAZ_GEN_INITS.difficultyLogBase);
            this.hazardDensity = HAZ_GEN_INITS.density * (difficultyFactor + 1) * HAZ_GEN_INITS.difficultyDensityFactor;
            this.hazardSpeed = HAZ_GEN_INITS.speed * (difficultyFactor + 1);
        }
    }
    // destroys active hazards
    destroyHazards(inputHazards) {
        for (let haz of this.hazards) {
            for (let inputHaz of inputHazards) {
                if (haz === inputHaz) {
                    // remove the hazard from the hazards array
                    this.hazards.splice(this.hazards.indexOf(haz), 1);
                    break;
                }
            }
        }
    }
    // resets all hazards (clears them)
    reset() {
        this.hazardSpeed = HAZ_GEN_INITS.speed;
        this.hazardDensity = HAZ_GEN_INITS.density;
        this.minShrinkFactor = MOD_EFFECT_CONFIG.SHRINK_HAZ.scaleFactor;
        this.maxEnlargeFactor = MOD_EFFECT_CONFIG.ENLARGE_HAZ.scaleFactor;
        this.currentSizeFactor = 1.0;
        this.targetSizeFactor = 1.0;
        this.rateOfSizeFactorChange = 0;
        this.hazards = [];
    }
}
