import { GAME_STATE_CONFIG } from './game-config.js';
// stores and manages the game phase and game timer
export class GameState {
    constructor() {
        this.numFramesThisGame = 0;
        this.phase = 0 /* GamePhase.MENU */;
        this.fps = GAME_STATE_CONFIG.fps;
        this.fpm = GAME_STATE_CONFIG.fpm;
    }
    // increments the frame count and updates the time survived
    incrementFrameCount() {
        this.numFramesThisGame++;
    }
    // returns the number of frames survived
    getFramesSurvived() {
        return this.numFramesThisGame;
    }
    // returns the number of seconds survived
    getSecondsSurvived() {
        return this.numFramesThisGame / this.fps;
    }
    // returns the number of minutes survived
    getMinutesSurvived() {
        return this.numFramesThisGame / this.fpm;
    }
    // returns the current game phase
    getPhase() {
        return this.phase;
    }
    // sets the current game phase
    setPhase(phase) {
        this.phase = phase;
    }
    // resets the game timer
    reset() {
        this.numFramesThisGame = 0;
        this.phase = 0 /* GamePhase.MENU */;
    }
}
