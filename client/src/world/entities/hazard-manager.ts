import { MOD_EFFECT_CONFIG } from './config/entities-config.js';
import { Player } from './player.js';
import { Hazard } from './hazard.js';
import { HazardRenderData } from '../../graphics/render-data.js';
import { Spawner } from './spawner.js';
import { SPAWNER_TYPE, SPAWNER_CONFIG, Spawn } from './config/spawner-config.js';
import { GameState } from '../../game/game-state.js';

// manages all hazards in the game
export class HazardManager {
    private readonly spawner: Spawner;
    private readonly minShrinkFactor: number;
    private readonly maxEnlargeFactor: number;
    private currentSizeFactor: number;
    private targetSizeFactor: number;
    private rateOfSizeFactorChange: number;
    private hazards: Hazard[];

    constructor (gameState: GameState) {
        this.spawner = new Spawner(gameState, SPAWNER_TYPE.HAZARD);
        this.minShrinkFactor = MOD_EFFECT_CONFIG.SHRINK_HAZ.scaleFactor;
        this.maxEnlargeFactor = MOD_EFFECT_CONFIG.ENLARGE_HAZ.scaleFactor;
        this.currentSizeFactor = 1.0;
        this.targetSizeFactor = 1.0;
        this.rateOfSizeFactorChange = 0;
        this.hazards = [];
    }

    createHazard(x: number, y: number, xspeed: number, w: number, h: number): Hazard {
        const hazard = new Hazard(x, y, xspeed, w, h);
        this.hazards.push(hazard);
        return hazard;
    }

    // creates the hazard on the menu screen
    createMenuHazard(): Hazard {
        return this.createHazard(0, 0, this.spawner.getXSpeed(), 
        SPAWNER_CONFIG.HAZARD.avgSize, SPAWNER_CONFIG.HAZARD.avgSize);
    }

    // generates new hazards, destroys old ones, and moves all active hazards
    updateHazards(): void {
        this.generateNewHazards();
        this.moveHazards();
        this.updateHazardSizes();
        this.spawner.update();
    }

    // called when enlarge or shrink modifier is collected to change the size of all hazards
    applySizeScaleFactor(scaleFactor: number): void {
        this.targetSizeFactor = this.currentSizeFactor * scaleFactor;
        // clamp the target size factor to the min and max allowed values
        if (this.targetSizeFactor < this.minShrinkFactor) {
            this.targetSizeFactor = this.minShrinkFactor;
        } else if (this.targetSizeFactor > this.maxEnlargeFactor) {
            this.targetSizeFactor = this.maxEnlargeFactor;
        }
        // calculate the rate of size change given the target size factor and the number of transition frames
        const sizeFactorChange: number = this.targetSizeFactor - this.currentSizeFactor;
        if (sizeFactorChange > 0) {
            this.rateOfSizeFactorChange = sizeFactorChange / MOD_EFFECT_CONFIG.ENLARGE_HAZ.transitionFrames;
        } else if (sizeFactorChange < 0) {
            this.rateOfSizeFactorChange = sizeFactorChange / MOD_EFFECT_CONFIG.SHRINK_HAZ.transitionFrames;
        } else {
            this.rateOfSizeFactorChange = 0;
        }
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

    getRenderData(): HazardRenderData[] {
        const renderData: HazardRenderData[] = [];
        for (let hazard of this.hazards) {
            renderData.push(hazard.getRenderData());
        }
        return renderData;
    }

    destroyHazards(inputHazards: Hazard[]): void {
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
        this.currentSizeFactor = 1.0;
        this.targetSizeFactor = 1.0;
        this.rateOfSizeFactorChange = 0;
        this.hazards = [];
    }

    // generates new hazards based on the hazard density
    private generateNewHazards(): void {
        const spawn: Spawn | null = this.spawner.generate(this.currentSizeFactor);
        if (spawn != null) {
            this.createHazard(spawn.x, spawn.y, spawn.xSpeed, 
                spawn.baseSize, spawn.baseSize);
        }
    }

    // moves all hazards to the left, destroys hazards that have moved off screen, and sets their size
    private moveHazards(): void {
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            this.hazards[i].updatePosition();
            // remove rectangles that have moved off the left side of the canvas
            if (this.hazards[i].getX() < -this.hazards[i].getWidth() || this.hazards[i].isTimeToKill()) {
                this.hazards.splice(i, 1);
                continue;
            } 

            // update the size of the hazards
            if (this.rateOfSizeFactorChange === 0) continue;
            this.hazards[i].setWidth(this.hazards[i].getNominalWidth() * this.currentSizeFactor);
            this.hazards[i].setHeight(this.hazards[i].getNominalHeight() * this.currentSizeFactor);
        }
    }

    private updateHazardSizes(): void {
        // check if we have reached the target size
        if ((this.rateOfSizeFactorChange > 0 && this.currentSizeFactor > this.targetSizeFactor)
        || (this.rateOfSizeFactorChange < 0 && this.currentSizeFactor < this.targetSizeFactor)) {
            if (this.targetSizeFactor != 1) {
                // a new size is now active, decay back to the initial size factor of 1
                this.targetSizeFactor = 1;
                if (this.currentSizeFactor > 1) {
                    this.rateOfSizeFactorChange = (this.targetSizeFactor - this.currentSizeFactor) 
                    / MOD_EFFECT_CONFIG.ENLARGE_HAZ.decayFrames;
                } else {
                    this.rateOfSizeFactorChange = (this.targetSizeFactor - this.currentSizeFactor) 
                    / MOD_EFFECT_CONFIG.SHRINK_HAZ.decayFrames;
                }
            }
            else {
                // initial size has been reached
                this.currentSizeFactor = 1;
                this.rateOfSizeFactorChange = 0;
            }
        }
        this.currentSizeFactor += this.rateOfSizeFactorChange;
    }
}