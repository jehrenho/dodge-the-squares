import { GamePhase, GAME_STATE_CONFIG } from './game-config.js';

// stores and manages the game phase and game timer
export class GameState {
  private numFramesThisGame: number;
  private phase: GamePhase;
  private readonly fps: number;
  private readonly fpm: number;

  constructor () {
    this.numFramesThisGame = 0;
    this.phase = GamePhase.MENU;
    this.fps = GAME_STATE_CONFIG.fps;
    this.fpm = GAME_STATE_CONFIG.fpm;
  }

  // increments the frame count and updates the time survived
  incrementFrameCount(): void {
    this.numFramesThisGame++;
  }

  // returns the number of frames survived
  getFramesSurvived(): number {
    return this.numFramesThisGame;
  }

  // returns the number of seconds survived
  getSecondsSurvived(): number {
    return this.numFramesThisGame / this.fps;
  }

  // returns the number of minutes survived
  getMinutesSurvived(): number {
    return this.numFramesThisGame / this.fpm;
  }

  // returns the current game phase
  getPhase(): GamePhase {
    return this.phase;
  }

  // sets the current game phase
  setPhase(phase: GamePhase): void {
    this.phase = phase;
  }

  // resets the game timer
  reset(): void {
    this.numFramesThisGame = 0;
    this.phase = GamePhase.MENU;
  }
}