import { SpawnerType, SPAWNER_TYPE, SpawnerInfo, SPAWNER_CONFIG, Spawn, DIFFICULTY_CONFIG } from './config/spawner-config.js';
import { VIRTUAL_SCREEN } from '../../graphics/graphics-config.js';
import { GameState } from '../../game/game-state.js';

// creates entities in the game world on the right side of the screen
export class Spawner {
    private readonly gameState: GameState;
    private readonly type: SpawnerType;
    private readonly info: SpawnerInfo;
    private density: number;
    private avgSpeed: number;

    constructor(gameState: GameState, type: SpawnerType) {
        this.gameState = gameState;
        this.type = type;
        this.info = SPAWNER_CONFIG[type];
        this.density = this.info.initDensity;
        this.avgSpeed = this.info.initAvgSpeed;
    }

    // determines when and where to spawn a new entity based on density
    generate(modifiedSizeFactor: number): Spawn | null {
        const rand = Math.random();
        if (rand < this.density) {
            const spawnBaseSize = this.getSize();
            let spawnX: number = 0;
            let spawnY: number = 0;
            if (this.type === SPAWNER_TYPE.HAZARD) {
                spawnX = VIRTUAL_SCREEN.width;
                const spawnSize = spawnBaseSize * modifiedSizeFactor;
                spawnY = ((VIRTUAL_SCREEN.height + spawnSize) * (rand / this.density)) - spawnSize;
            } else {
                spawnX = VIRTUAL_SCREEN.width + spawnBaseSize;
                spawnY = ((VIRTUAL_SCREEN.height + spawnBaseSize) * (rand / this.density)) - (spawnBaseSize / 2);
            }
            return {
                x: spawnX,
                y: spawnY,
                xSpeed: this.getXSpeed(),
                baseSize: spawnBaseSize,
            };
        } else {
            return null;
        }
    }

    // keeps the difficulty of the game alligned with the time survived
    update(): void {
        // calculate the difficulty factor
        const minutesSurvived = this.gameState.getMinutesSurvived() + 1;
        const logBase = (x: number, base: number) => Math.log(x) / Math.log(base);
        const difficultyFactor = logBase(minutesSurvived, DIFFICULTY_CONFIG.logBase);

        // update the hazard density and speed based on the difficulty factor
        this.density = this.info.initDensity * (difficultyFactor + 1) * DIFFICULTY_CONFIG.densityFactor;
        this.avgSpeed = this.info.initAvgSpeed * (difficultyFactor + 1);
    }

    getXSpeed(): number {
        const minSpeed = this.avgSpeed / this.info.speedVariance;
        const maxSpeed = this.avgSpeed * this.info.speedVariance;
        return Math.random() * (maxSpeed - minSpeed) + minSpeed;
    }

    getSize(): number {
        const minSize = this.info.avgSize / this.info.sizeVariance;
        const maxSize = this.info.avgSize * this.info.sizeVariance;
        return Math.random() * (maxSize - minSize) + minSize;
    }

    getBaseSize(): number {
        return this.info.avgSize;
    }

    reset(): void {
        this.density = this.info.initDensity;
        this.avgSpeed = this.info.initAvgSpeed;
    }
}