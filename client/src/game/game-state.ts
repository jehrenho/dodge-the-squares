import { GamePhase, GAME_STATE_CONFIG } from './game-config.js';

// stores and manages information about the current game
export class GameState {
  private numFramesThisGame: number;
  private phase: GamePhase;
  private paused: boolean;

  constructor () {
    this.numFramesThisGame = 0;
    this.phase = GamePhase.MENU;
    this.paused = false;
  }

  incrementFrameCount(): void {
    this.numFramesThisGame++;
  }

  pauseTimer(): void {
    this.numFramesThisGame -= 1;
  }

  getFramesSurvived(): number {
    return this.numFramesThisGame;
  }

  getSecondsSurvived(): number {
    return this.numFramesThisGame / GAME_STATE_CONFIG.fps;
  }

  getMinutesSurvived(): number {
    return this.numFramesThisGame / GAME_STATE_CONFIG.fpm;
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

  togglePaused(): void {
    this.paused = !this.paused;
  }

  reset(): void {
    this.numFramesThisGame = 0;
    this.phase = GamePhase.MENU;
  }
}