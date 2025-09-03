import { GAME_STATE_CONFIG } from './game-config.js';
// stores and manages the game phase and game timer
export class GameState {
    constructor() {
        this.numFramesThisGame = 0;
        this.phase = 0 /* GamePhase.MENU */;
        this.fps = GAME_STATE_CONFIG.fps;
        this.fpm = GAME_STATE_CONFIG.fpm;
        this.paused = false;
    }
    incrementFrameCount() {
        this.numFramesThisGame++;
    }
    getFramesSurvived() {
        return this.numFramesThisGame;
    }
    getSecondsSurvived() {
        return this.numFramesThisGame / this.fps;
    }
    getMinutesSurvived() {
        return this.numFramesThisGame / this.fpm;
    }
    getPhase() {
        return this.phase;
    }
    isPaused() {
        return this.paused;
    }
    setPhase(phase) {
        this.phase = phase;
    }
    setPaused(paused) {
        this.paused = paused;
    }
    reset() {
        this.numFramesThisGame = 0;
        this.phase = 0 /* GamePhase.MENU */;
    }
}
