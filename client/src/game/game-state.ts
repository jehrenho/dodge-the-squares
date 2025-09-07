import { GamePhase, GAME_STATE_CONFIG } from './game-config.js';

// stores and manages information about the current game
export class GameState {
  private numFramesThisGame: number;
  private phase: GamePhase;
  private readonly fps: number;
  private readonly fpm: number;
  private paused: boolean;

  constructor () {
    this.numFramesThisGame = 0;
    this.phase = GamePhase.MENU;
    this.fps = GAME_STATE_CONFIG.fps;
    this.fpm = GAME_STATE_CONFIG.fpm;
    this.paused = false;
  }

  incrementFrameCount(): void {
    this.numFramesThisGame++;
  }

  getFramesSurvived(): number {
    return this.numFramesThisGame;
  }

  getSecondsSurvived(): number {
    return this.numFramesThisGame / this.fps;
  }

  getMinutesSurvived(): number {
    return this.numFramesThisGame / this.fpm;
  }

  getPhase(): GamePhase {
    return this.phase;
  }

  isPaused(): boolean {
    return this.paused;
  }

  setPhase(phase: GamePhase): void {
    this.phase = phase;
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
  }

  reset(): void {
    this.numFramesThisGame = 0;
    this.phase = GamePhase.MENU;
  }
}