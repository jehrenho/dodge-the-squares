import { GAME_OVER_CONFIG, SCALING_CONFIG } from './graphics-config.js';
import { GameState } from '../game/game-state.js';
import { GAME_STATE_CONFIG } from '../game/game-config.js';
import { RankData, ANONYMOUS_PLAYER_NAME } from '../common/common-config.js';
import { Viewport } from './viewport.js';
import { InputManager } from '../input/input-manager.js';
import { ScoreApi } from '../score/score-api.js';

export class GameOver {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly gameState: GameState;
    private readonly viewPort: Viewport;
    private readonly inputManager: InputManager;
    private readonly scoreApi: ScoreApi;
    private rankData: RankData | null;
    private readonly nameInput: HTMLInputElement;
    private isNameSubmitted: boolean;
    private startNewGame: boolean;

    constructor(ctx: CanvasRenderingContext2D, gameState: GameState, viewPort: Viewport, inputManager: InputManager, scoreApi: ScoreApi) {
        this.ctx = ctx;
        this.gameState = gameState;
        this.viewPort = viewPort;
        this.inputManager = inputManager;
        this.scoreApi = scoreApi;
        this.rankData = null;
        this.nameInput = document.getElementById("playerName") as HTMLInputElement;
        this.isNameSubmitted = false;
        this.startNewGame = false;
    }

    draw(): void {
        this.drawTitleMessagePrompt();
        this.rankData = this.scoreApi.getRankData();
        if (this.rankData && this.rankData.leaderboard && this.rankData.userRankedScore && this.rankData.aroundUser) {
            this.drawLeaderboard();
            this.drawLocalScores();
            this.drawNameInput();
        }
    }

    isStartNewGame(): boolean {
        if (this.startNewGame) {
            this.startNewGame = false;
            this.isNameSubmitted = false;
            return true;
        }
        return false;
    }

    private drawNameInput(): void {
        if (!this.rankData) return;
        if (!this.isNameSubmitted) {
            // draw the enter your name and hit enter to submit message
            this.ctx.fillStyle = GAME_OVER_CONFIG.fontColour;
            this.ctx.font = GAME_OVER_CONFIG.messagingFont;
            this.ctx.textAlign = "center";
            this.ctx.fillText("Enter your name and press enter to submit", 
                SCALING_CONFIG.virtualWidth / 2, (SCALING_CONFIG.virtualHeight / 2) - 40);

            // adjust size and position based on viewport scaling and translation
            const scale: number = this.viewPort.getScale();
            const x: number = this.viewPort.worldToScreenX(SCALING_CONFIG.virtualWidth / 2);
            const y: number = this.viewPort.worldToScreenY(SCALING_CONFIG.virtualHeight / 2);
            this.nameInput.style.position = "absolute";
            this.nameInput.style.left = x + "px";
            this.nameInput.style.top = y + "px";
            this.nameInput.style.transform = `translate(-50%, -50%) scale(${scale})`;
            this.nameInput.style.transformOrigin = "center center";
            this.nameInput.style.fontSize = "24px";
            this.nameInput.style.display = "block";
            this.nameInput.maxLength = 10;
            this.nameInput.focus();
            if (this.inputManager.isEnterPressed()) {
                this.inputManager.waitForEnterToRise();
                // submit the name to the server
                console.log(this.nameInput.value);
                this.scoreApi.submitName(this.nameInput.value, this.rankData.userRankedScore);
                this.isNameSubmitted = true;
                this.nameInput.hidden = true;
                this.nameInput.style.display = "none";
            }
        } else if (!this.scoreApi.isNameSubmitted) {
            // submission confirmation banner
            console.log("Submitting name:", this.nameInput.value);
            this.ctx.fillStyle = GAME_OVER_CONFIG.fontColour;
            this.ctx.font = GAME_OVER_CONFIG.messagingFont;
            this.ctx.textAlign = "center";
            this.ctx.fillText("Submitting your name...", SCALING_CONFIG.virtualWidth / 2, (SCALING_CONFIG.virtualHeight / 2) - 40);
        } else {
            // submission confirmation
            this.rankData.userRankedScore.name = this.nameInput.value;
            this.ctx.fillStyle = GAME_OVER_CONFIG.fontColour;
            this.ctx.font = GAME_OVER_CONFIG.messagingFont;
            this.ctx.textAlign = "center";
            this.ctx.fillText("Name Submitted", SCALING_CONFIG.virtualWidth / 2, (SCALING_CONFIG.virtualHeight / 2) - 40);
            this.ctx.fillText("Press enter to return to menu", SCALING_CONFIG.virtualWidth / 2, (SCALING_CONFIG.virtualHeight / 2));
            if (this.inputManager.isEnterPressed()) {
                this.inputManager.waitForEnterToRise();
                this.startNewGame = true;
            }
        }
    }

    private drawTitleMessagePrompt(): void {
        // game over banner
        this.ctx.fillStyle = GAME_OVER_CONFIG.fontColour;
        this.ctx.font = GAME_OVER_CONFIG.titleFont;
        this.ctx.textAlign = "center";
        let y = SCALING_CONFIG.virtualHeight * GAME_OVER_CONFIG.mainTitleHeightFactor;
        this.ctx.fillText(GAME_OVER_CONFIG.gameOverTitle, SCALING_CONFIG.virtualWidth / 2, y);
        // time survived message
        this.ctx.font = GAME_OVER_CONFIG.messagingFont;
        y += GAME_OVER_CONFIG.mainScoreSpacing;
        this.ctx.fillText(GAME_OVER_CONFIG.gameOverMessage.replace("{time}", this.gameState.getSecondsSurvived().toFixed(2)),
        SCALING_CONFIG.virtualWidth / 2, y);
    }

    private drawLeaderboard(): void {
        if (!this.rankData) return;
        this.ctx.textAlign = "center";
        this.ctx.fillStyle =  GAME_OVER_CONFIG.tableFontColour;
        const startX = SCALING_CONFIG.virtualWidth * (1 - GAME_OVER_CONFIG.windowWidthFactor);
        const numRows: number = this.rankData.leaderboard.length;
        let startY = (SCALING_CONFIG.virtualHeight / 2) - 
            (((numRows * GAME_OVER_CONFIG.rowSpacing) + GAME_OVER_CONFIG.headerSpacing + GAME_OVER_CONFIG.titleSpacing) / 2);
        let y: number = startY;

        // Draw title
        this.ctx.font =  GAME_OVER_CONFIG.tableTitleFont;
        this.ctx.fillText(GAME_OVER_CONFIG.leaderboardTitle, startX, y);
        y += GAME_OVER_CONFIG.rowSpacing + GAME_OVER_CONFIG.titleSpacing;

        // Draw table header
        this.ctx.font =  GAME_OVER_CONFIG.tableHeaderFont;
        this.ctx.fillText("Rank", startX - GAME_OVER_CONFIG.columnSpacing, y);
        this.ctx.fillText("Name", startX, y);
        this.ctx.fillText("Score", startX + GAME_OVER_CONFIG.columnSpacing, y);
        y += GAME_OVER_CONFIG.rowSpacing + GAME_OVER_CONFIG.headerSpacing;

        // Draw each leaderboard entry
        this.ctx.font =  GAME_OVER_CONFIG.tableHighScoreFont;
        for (let i = 0; i < this.rankData.leaderboard.length; i++) {
            const entry = this.rankData.leaderboard[i];
            if (i === GAME_OVER_CONFIG.numTopScores) {
                // Switch to row font for remaining entries
                this.ctx.font =  GAME_OVER_CONFIG.tableRowFont;
            }
            if (this.rankData.userRankedScore.id == entry.id) {
                // highlight the user score if it's in the leaderboard
                this.ctx.fillStyle = GAME_OVER_CONFIG.tablePlayerFontColour;
                if (this.rankData.userRankedScore.name === ANONYMOUS_PLAYER_NAME) {
                    entry.name = "you";
                } else {
                    entry.name = this.rankData.userRankedScore.name;
                }
            } else {
                this.ctx.fillStyle = GAME_OVER_CONFIG.tableFontColour;
            }
            this.ctx.fillText(entry.rank.toString(), startX - GAME_OVER_CONFIG.columnSpacing, y);
            this.ctx.fillText(entry.name, startX, y);
            this.ctx.fillText(`${(entry.score / GAME_STATE_CONFIG.fps).toFixed(2)}s`, startX + GAME_OVER_CONFIG.columnSpacing, y);
            y += GAME_OVER_CONFIG.rowSpacing;
        }
    }

    private drawLocalScores(): void {
        if (!this.rankData) return;
        this.ctx.textAlign = "center";
        this.ctx.fillStyle =  GAME_OVER_CONFIG.tableFontColour;
        const startX = SCALING_CONFIG.virtualWidth * GAME_OVER_CONFIG.windowWidthFactor;
        const numRows: number = this.rankData.aroundUser.length;
        let startY = (SCALING_CONFIG.virtualHeight / 2) - 
            (((numRows * GAME_OVER_CONFIG.rowSpacing) + GAME_OVER_CONFIG.headerSpacing + GAME_OVER_CONFIG.titleSpacing) / 2);
        let y: number = startY;

        // Draw title
        this.ctx.font =  GAME_OVER_CONFIG.tableTitleFont;
        this.ctx.fillText("Your Rank: " + this.rankData.userRankedScore.rank, startX, y);
        y += GAME_OVER_CONFIG.rowSpacing + GAME_OVER_CONFIG.titleSpacing;

        // Draw table header
        this.ctx.font =  GAME_OVER_CONFIG.tableHeaderFont;
        this.ctx.fillText("Rank", startX - GAME_OVER_CONFIG.columnSpacing, y);
        this.ctx.fillText("Name", startX, y);
        this.ctx.fillText("Score", startX + GAME_OVER_CONFIG.columnSpacing, y);
        y += GAME_OVER_CONFIG.rowSpacing + GAME_OVER_CONFIG.headerSpacing;

        // Draw each entry
        this.ctx.font =  GAME_OVER_CONFIG.tableRowFont;
        for (let i = 0; i < this.rankData.aroundUser.length; i++) {
            const entry = this.rankData.aroundUser[i];
            if (this.rankData.userRankedScore.id == entry.id) {
                // highlight the user score
                this.ctx.fillStyle = GAME_OVER_CONFIG.tablePlayerFontColour;
                if (this.rankData.userRankedScore.name === ANONYMOUS_PLAYER_NAME) {
                    entry.name = "you";
                } else {
                    entry.name = this.rankData.userRankedScore.name;
                }
            } else {
                this.ctx.fillStyle = GAME_OVER_CONFIG.tableFontColour;
            }
            this.ctx.fillText(entry.rank.toString(), startX - GAME_OVER_CONFIG.columnSpacing, y);
            this.ctx.fillText(entry.name, startX, y);
            this.ctx.fillText(`${(entry.score / GAME_STATE_CONFIG.fps).toFixed(2)}s`, startX + GAME_OVER_CONFIG.columnSpacing, y);
            y += GAME_OVER_CONFIG.rowSpacing;
        }
    }
}