import { GAME_CONFIG,
    HAZ_GEN_INITS, 
    MOD_EFFECT_CONFIG } from './config.js';
import { Player } from './player.js';
import { VisibleShape } from './visibleShape.js';

// represents a single hazard rectangle in the game
export class Hazard extends VisibleShape {
    w: number;
    h: number;
    nominalw: number;
    nominalh: number;

    constructor(x:number, y:number, 
        w:number, h:number, 
        colour: string, borderColour: string){
        super(x, y, colour, borderColour);
        this.w = w;
        this.h = h;
        this.nominalw = HAZ_GEN_INITS.w;
        this.nominalh = HAZ_GEN_INITS.h;
    }

    // sets the hazards position
    setPositionByCentre(x: number, y: number): void {
        this.x = x - this.w / 2;
        this.y = y - this.h / 2;
    }

    // draws the hazard on the canvas
    draw(ctx: CanvasRenderingContext2D) {
        // Draw the hazard rectangle's fill colour
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Draw border
        ctx.strokeStyle = this.borderColour;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}

// helper logarithm function with a user specified base
function logBase(x: number, base: number): number {
    return Math.log(x) / Math.log(base);
}

// represents the collection of hazards in the game
export class HazardManager {
    hazardSpeed: number;
    hazardDensity: number;
    fillColour: string;
    borderColour: string;
    currentSizeFactor: number;
    targetSizeFactor: number;
    rateOfSizeFactorChange: number;
    minShrinkFactor: number;
    maxEnlargeFactor: number;
    hazards: Hazard[];

    constructor () {
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
    createHazard(x: number, y: number, w: number, h: number, colour: string, borderColour: string): Hazard {
        const hazard = new Hazard(x, y, w, h, colour, borderColour);
        this.hazards.push(hazard);
        return hazard;
    }

    // generates new hazards based on the hazard density
    generateNewHazards(): void {
        const rand = Math.random();
        if (rand < this.hazardDensity) {
            // map the new rectangle location to the canvas dimensions in pixels
            const newHazardy = ((GAME_CONFIG.VIRTUAL_HEIGHT + HAZ_GEN_INITS.h) * rand) / this.hazardDensity;
            // create a new hazard
            this.createHazard(GAME_CONFIG.VIRTUAL_WIDTH, 
                newHazardy - HAZ_GEN_INITS.h, 
                HAZ_GEN_INITS.w * this.currentSizeFactor, 
                HAZ_GEN_INITS.h * this.currentSizeFactor, 
                this.fillColour, 
                this.borderColour
            );
        }
    }

    // moves all hazards to the left, destroys hazards that have moved off screen, and sets their size
    moveHazards(): void {
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            this.hazards[i].x -= this.hazardSpeed;
            // remove rectangles that have moved off the left side of the canvas
            if (this.hazards[i].x < -this.hazards[i].w || this.hazards[i].isTimeToKill()) {
                this.hazards.splice(i, 1);
                continue;
            } 

            // update the size of the hazards if we need to
            if (this.rateOfSizeFactorChange === 0) continue;
            this.hazards[i].w = this.hazards[i].nominalw * this.currentSizeFactor;
            this.hazards[i].h = this.hazards[i].nominalh * this.currentSizeFactor;
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
    updateHazards(): void {
        this.generateNewHazards();
        this.moveHazards();
        this.updateHazardSizes();
    }

    // applies a new size scale factor to all hazards 
    applySizeScaleFactor(scaleFactor: number): void {
        this.targetSizeFactor = this.currentSizeFactor * scaleFactor;
        if (this.targetSizeFactor < this.minShrinkFactor) {
            this.targetSizeFactor = this.minShrinkFactor;
        } else if (this.targetSizeFactor > this.maxEnlargeFactor) {
            this.targetSizeFactor = this.maxEnlargeFactor;
        }
        // calculate the rate of size change given the target size factor and the initial transition frames
        this.rateOfSizeFactorChange = (this.targetSizeFactor - this.currentSizeFactor) / HAZ_GEN_INITS.sizeModInitTransFrames;
    }

    // detects collisions between the player and hazards
    detectCollisions(player: Player): Hazard[] {
        if (player.isInvincible) return [];
        let collisions: Hazard[] = [];
        for (let hazard of this.hazards) {
            if (hazard.x < player.x + player.w &&
            hazard.x + hazard.w > player.x &&
            hazard.y < player.y + player.h &&
            hazard.y + hazard.h > player.y
            ) collisions.push(hazard);
        }
        return collisions;
    }

    // draws all hazards on the canvas
    draw(ctx:CanvasRenderingContext2D): void {
        ctx.fillStyle = this.fillColour;
        for (let hazard of this.hazards){
            hazard.draw(ctx);
        }
    }

    // updates the difficulty of hazards logarithmically based on the time survived
    updateDifficulty(numMinutesSurvived: number): void {
        let difficultyFactor = logBase(numMinutesSurvived + 1, HAZ_GEN_INITS.difficultyLogBase);
        this.hazardDensity = HAZ_GEN_INITS.density * (difficultyFactor + 1) * 2;
        this.hazardSpeed = HAZ_GEN_INITS.speed * (difficultyFactor + 1);
    }

    // destroys active hazards
    destroyHazards(inputHazards: Hazard[]) {
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
    reset(): void {
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