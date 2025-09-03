import { HAZ_GEN_CONFIG, MOD_EFFECT_CONFIG } from './entities-config.js';
import { SCALING_CONFIG } from '../../graphics/graphics-config.js';
import { Player } from './player.js';
import { Hazard } from './hazard.js';
import { GameState } from '../../game/game-state.js';
import { GAME_STATE_CONFIG } from '../../game/game-config.js';

// manages all hazards in the game
export class HazardManager {
    private readonly gameState: GameState;
    private readonly minShrinkFactor: number;
    private readonly maxEnlargeFactor: number;
    private hazardSpeed: number;
    private hazardDensity: number;
    private currentSizeFactor: number;
    private targetSizeFactor: number;
    private rateOfSizeFactorChange: number;
    private hazards: Hazard[];

    constructor (gameState: GameState) {
        this.gameState = gameState;
        this.minShrinkFactor = MOD_EFFECT_CONFIG.SHRINK_HAZ.scaleFactor;
        this.maxEnlargeFactor = MOD_EFFECT_CONFIG.ENLARGE_HAZ.scaleFactor;
        this.hazardSpeed = HAZ_GEN_CONFIG.speed;
        this.hazardDensity = HAZ_GEN_CONFIG.density;
        this.currentSizeFactor = 1.0;
        this.targetSizeFactor = 1.0;
        this.rateOfSizeFactorChange = 0;
        this.hazards = [];
    }

    createHazard(x: number, y: number, w: number, h: number): Hazard {
        const hazard = new Hazard(x, y, w, h, HAZ_GEN_CONFIG.fillColour, HAZ_GEN_CONFIG.borderColour);
        this.hazards.push(hazard);
        return hazard;
    }

    // creates the hazard on the menu screen
    createMenuHazard(): Hazard {
        return this.createHazard(0, 0, HAZ_GEN_CONFIG.w, HAZ_GEN_CONFIG.h);
    }

    // generates new hazards, destroys old ones, and moves all active hazards
    updateHazards(): void {
        this.generateNewHazards();
        this.moveHazards();
        this.updateHazardSizes();
        this.updateDifficulty(this.gameState);
    }

    // grows and shrinks the hazards
    applySizeScaleFactor(scaleFactor: number): void {
        this.targetSizeFactor = this.currentSizeFactor * scaleFactor;
        if (this.targetSizeFactor < this.minShrinkFactor) {
            this.targetSizeFactor = this.minShrinkFactor;
        } else if (this.targetSizeFactor > this.maxEnlargeFactor) {
            this.targetSizeFactor = this.maxEnlargeFactor;
        }
        // calculate the rate of size change given the target size factor and the initial transition frames
        this.rateOfSizeFactorChange = (this.targetSizeFactor - this.currentSizeFactor) / HAZ_GEN_CONFIG.sizeModInitTransFrames;
    }

    // detects collisions between the player and hazards
    detectCollisions(player: Player): Hazard[] {
        if (player.isInvincible()) return [];
        let collisions: Hazard[] = [];
        for (let hazard of this.hazards) {
            if (hazard.getX() < player.getX() + player.getWidth() &&
            hazard.getX() + hazard.getWidth() > player.getX() &&
            hazard.getY() < player.getY() + player.getHeight() &&
            hazard.getY() + hazard.getHeight() > player.getY()
            ) collisions.push(hazard);
        }
        return collisions;
    }

    draw(ctx:CanvasRenderingContext2D): void {
        for (let hazard of this.hazards){
            hazard.draw(ctx);
        }
    }

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

    reset(): void {
        this.hazardSpeed = HAZ_GEN_CONFIG.speed;
        this.hazardDensity = HAZ_GEN_CONFIG.density;
        this.currentSizeFactor = 1.0;
        this.targetSizeFactor = 1.0;
        this.rateOfSizeFactorChange = 0;
        this.hazards = [];
    }

    // generates new hazards based on the hazard density
    private generateNewHazards(): void {
        const rand = Math.random();
        if (rand < this.hazardDensity) {
            // map the new rectangle location to the canvas dimensions in pixels
            const newHazardy = ((SCALING_CONFIG.virtualHeight + HAZ_GEN_CONFIG.h) * rand) / this.hazardDensity;
            // create a new hazard
            this.createHazard(SCALING_CONFIG.virtualWidth, 
                newHazardy - HAZ_GEN_CONFIG.h, 
                HAZ_GEN_CONFIG.w * this.currentSizeFactor, 
                HAZ_GEN_CONFIG.h * this.currentSizeFactor
            );
        }
    }

    // moves all hazards to the left, destroys hazards that have moved off screen, and sets their size
    private moveHazards(): void {
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            this.hazards[i].setX(this.hazards[i].getX() - this.hazardSpeed);
            // remove rectangles that have moved off the left side of the canvas
            if (this.hazards[i].getX() < -this.hazards[i].getWidth() || this.hazards[i].isTimeToKill()) {
                this.hazards.splice(i, 1);
                continue;
            } 

            // update the size of the hazards if we need to
            if (this.rateOfSizeFactorChange === 0) continue;
            this.hazards[i].setWidth(this.hazards[i].getNominalWidth() * this.currentSizeFactor);
            this.hazards[i].setHeight(this.hazards[i].getNominalHeight() * this.currentSizeFactor);
        }
    }

    // updates the size of the hazards
    private updateHazardSizes() {
        // check if we have reached the target size
        if ((this.rateOfSizeFactorChange > 0 && this.currentSizeFactor > this.targetSizeFactor)
        || (this.rateOfSizeFactorChange < 0 && this.currentSizeFactor < this.targetSizeFactor)) {
            if (this.targetSizeFactor != 1) {
                // a new size is now active, decay back to the initial size
                this.currentSizeFactor = this.targetSizeFactor;
                this.targetSizeFactor = 1;
                this.rateOfSizeFactorChange = (this.targetSizeFactor - this.currentSizeFactor) / HAZ_GEN_CONFIG.sizeModDecayFrames;
            }
            else {
                // initial size has been reached
                this.currentSizeFactor = 1;
                this.rateOfSizeFactorChange = 0;
            }
        }
        this.currentSizeFactor += this.rateOfSizeFactorChange;
    }

    // updates the difficulty of the game by making the hazards faster and more numerous
    private updateDifficulty(gameState: GameState): void {
        if (gameState.getFramesSurvived() % GAME_STATE_CONFIG.fps === 0) {
            // calculate the difficulty factor
            const minutesSurvived = gameState.getMinutesSurvived() + 1;
            const logBase = (x: number, base: number) => Math.log(x) / Math.log(base);
            const difficultyFactor = logBase(minutesSurvived, HAZ_GEN_CONFIG.difficultyLogBase);
            // update the hazard density and speed based on the difficulty factor
            this.hazardDensity = HAZ_GEN_CONFIG.density * (difficultyFactor + 1) * HAZ_GEN_CONFIG.difficultyDensityFactor;
            this.hazardSpeed = HAZ_GEN_CONFIG.speed * (difficultyFactor + 1);
        }
    }
}