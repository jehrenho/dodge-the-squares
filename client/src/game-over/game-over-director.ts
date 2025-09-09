import { GameOverPhase } from './game-over-config.js';
import { InputManager } from '../input/input-manager.js';
import { ScoreApi } from '../score/score-api.js';
import { RankData } from '../../../common/src/common-config.js';
import { RenderData, GameOverRenderData } from '../graphics/render-data.js';
import leoProfanity from 'leo-profanity';
leoProfanity.loadDictionary('en');
console.log(leoProfanity.clean("fuck"));

export class GameOverDirector {
  private inputManager: InputManager;
  private scoreApi: ScoreApi;
  private gameOverPhase: GameOverPhase;
  private rankData: RankData | null;
  private gameOverRenderData: GameOverRenderData;
  private renderData: RenderData[];
  private returnToMenu: boolean;
  private nameInput: HTMLInputElement;
  private userName: string;
  private isNameSubmitted: boolean;

  constructor(inputManager: InputManager) {
    this.inputManager = inputManager;
    this.scoreApi = new ScoreApi();
    this.gameOverPhase = GameOverPhase.WAITING_FOR_RANK;
    this.rankData = null;
    this.gameOverRenderData = {
      type: 'game-over',
      phase: GameOverPhase.WAITING_FOR_RANK,
      rankData: null
    };
    this.renderData = [this.gameOverRenderData];
    this.returnToMenu = false;
    this.nameInput = document.getElementById("playerName") as HTMLInputElement;
    this.userName = "";
    this.isNameSubmitted = false;
  }

  async fetchRank(numFramesSurvived: number): Promise<void> {
    this.rankData = await this.scoreApi.fetchRank(numFramesSurvived);
    if (!this.rankData) {
        console.log("GAME OVER DIRECTOR: Failed to fetch rank data");
    }
  }

  isReturnToMenu(): boolean {
    if (this.returnToMenu) {
        this.rankData = null;
        this.gameOverPhase = GameOverPhase.WAITING_FOR_RANK;
        this.returnToMenu = false;
        this.isNameSubmitted = false;
        return true;
    }
    return false;
  }

    update(): RenderData[] {
        switch (this.gameOverPhase) {
            case GameOverPhase.WAITING_FOR_RANK:
                return this.updateWaitingForRank();
            case GameOverPhase.NAME_INPUT:
                return this.updateNameInput();
            case GameOverPhase.SUBMITTING:
                return this.updateSubmitting();
            case GameOverPhase.WAITING_TO_CONTINUE:
                return this.updateWaitingToContinue();
        }
    }

  private updateWaitingForRank(): RenderData[] {
    if (this.rankData) {
        // fetch returned rank data, next phase
        this.gameOverPhase = GameOverPhase.NAME_INPUT;
        return this.updateNameInput();
    }
    if (this.inputManager.isEnterPressed()) {
        // skip to menu
        this.inputManager.waitForEnterToRise();
        this.returnToMenu = true;
    }
    return this.getRenderData();
  }

  private updateNameInput(): RenderData[] {
    if (this.inputManager.isEnterPressed()) {
        this.inputManager.waitForEnterToRise();
        // submit the user's name
        this.userName = leoProfanity.clean(this.nameInput.value);
        this.submitName(this.userName);
        // name sent, next phase
        this.gameOverPhase = GameOverPhase.SUBMITTING;
        return this.updateSubmitting();
    }
    return this.getRenderData();
  }

  private updateSubmitting(): RenderData[] {
    if (this.isNameSubmitted) {
        if (!this.rankData) return [];
        this.rankData.userRankedScore.name = this.userName;
        this.gameOverPhase = GameOverPhase.WAITING_TO_CONTINUE;
        return this.updateWaitingToContinue();
    }
    return this.getRenderData();
  }

  private updateWaitingToContinue(): RenderData[] {
    if (this.inputManager.isEnterPressed()) {
        this.inputManager.waitForEnterToRise();
        this.returnToMenu = true;
    }
    return this.getRenderData();
  }

  private getRenderData(): RenderData[] {
    this.gameOverRenderData = {
        type: 'game-over',
        phase: this.gameOverPhase,
        rankData: this.rankData
    }
    this.renderData = [this.gameOverRenderData];
    return this.renderData;
  }

  private async submitName(userName: string): Promise<void> {
    if (!this.rankData) return;
    await this.scoreApi.submitName(userName, this.rankData.userRankedScore);
    this.isNameSubmitted = true; // TODO: add error handling states
  }
}
