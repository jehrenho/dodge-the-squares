import { GameOverRenderData, RenderData } from '../graphics/render-data.js';
import { GameOverPhase, GAME_OVER_CONFIG } from './game-over-config.js';
import { VIRTUAL_SCREEN } from '../graphics/graphics-config.js'
import { GameState } from '../game/game-state.js';
import { Viewport } from '../graphics/viewport.js';
import { ANONYMOUS_PLAYER_NAME } from '../common/common-config.js';
import { GAME_STATE_CONFIG } from '../game/game-config.js'

export class GameOverRenderer {
    private gameOverRenderData: GameOverRenderData | null;
    private ctx: CanvasRenderingContext2D;
    private gameState: GameState;
    private readonly viewPort: Viewport;
    private nameInput: HTMLInputElement;

    constructor(ctx: CanvasRenderingContext2D, gameState: GameState, viewPort: Viewport) {
        this.gameOverRenderData = null;
        this.ctx = ctx;
        this.gameState = gameState;
        this.nameInput = document.getElementById("playerName") as HTMLInputElement;
        this.viewPort = viewPort;
    }

    render(renderData: RenderData[]): void {
        this.renderTitle();
        this.renderTimeSurvived();
        for (let i = 0; i < renderData.length; i++) {
            if (renderData[i].type === 'game-over') {
                this.gameOverRenderData = renderData[i] as GameOverRenderData;
                break;
            }
        }
        if (this.gameOverRenderData === null) {
            console.error("Error: GameOverRenderData not found in renderData array.");
            return;
        }
        switch (this.gameOverRenderData.phase) {
            case GameOverPhase.WAITING_FOR_RANK:
                this.renderWaitingForRank();
                break;
            case GameOverPhase.NAME_INPUT:
                this.renderNameInput();
                break;
            case GameOverPhase.SUBMITTING:
                this.renderSubmitting();
                break;
            case GameOverPhase.WAITING_TO_CONTINUE:
                this.renderWaitingToContinue();
                break;
        }
    }

    private renderWaitingForRank(): void {
        if (!this.gameOverRenderData) return;
        this.ctx.fillText("fetching rank data... press enter to return to menu", VIRTUAL_SCREEN.width / 2, VIRTUAL_SCREEN.height / 2);
    }

    private renderNameInput(): void {
        this.renderSubmitPrompt();
        this.renderSubmissionField();
        this.renderTables();
    }

    private renderSubmitting(): void {
        this.renderSubmittingMessage();
        this.renderTables();
    }

    private renderWaitingToContinue(): void {
        this.hideSubmissionField();
        this.renderSubmittedMessage();
        this.renderTables();
    }

    private renderTitle(): void {
        this.ctx.fillStyle = GAME_OVER_CONFIG.fontColour;
        this.ctx.font = GAME_OVER_CONFIG.titleFont;
        this.ctx.textAlign = "center";
        const y = VIRTUAL_SCREEN.height * GAME_OVER_CONFIG.mainTitleHeightFactor;
        this.ctx.fillText(GAME_OVER_CONFIG.gameOverTitle, VIRTUAL_SCREEN.width / 2, y);
    }

    private renderTimeSurvived(): void {
        this.ctx.font = GAME_OVER_CONFIG.messagingFont;
        const y = VIRTUAL_SCREEN.height * GAME_OVER_CONFIG.mainTitleHeightFactor + GAME_OVER_CONFIG.mainScoreSpacing;
        this.ctx.fillText(GAME_OVER_CONFIG.gameOverMessage.replace("{time}", this.gameState.getSecondsSurvived().toFixed(2)),
        VIRTUAL_SCREEN.width / 2, y);
    }

    private renderSubmitPrompt(): void {
        // draw the enter your name and hit enter to submit message
        this.ctx.fillStyle = GAME_OVER_CONFIG.fontColour;
        this.ctx.font = GAME_OVER_CONFIG.messagingFont;
        this.ctx.textAlign = "center";
        this.ctx.fillText("Enter your name and press enter to submit", 
            VIRTUAL_SCREEN.width / 2, (VIRTUAL_SCREEN.height / 2) - 40);
    }

    private renderSubmissionField(): void {
        // adjust size and position based on viewport scaling and translation
        const scale: number = this.viewPort.getScale();
        const x: number = this.viewPort.worldToScreenX(VIRTUAL_SCREEN.width / 2);
        const y: number = this.viewPort.worldToScreenY(VIRTUAL_SCREEN.height / 2);
        this.nameInput.style.position = "absolute";
        this.nameInput.style.left = x + "px";
        this.nameInput.style.top = y + "px";
        this.nameInput.style.transform = `translate(-50%, -50%) scale(${scale})`;
        this.nameInput.style.transformOrigin = "center center";
        this.nameInput.style.fontSize = "24px";
        this.nameInput.style.display = "block";
        this.nameInput.maxLength = 15;
        this.nameInput.focus();
    }

    private hideSubmissionField(): void {
        this.nameInput.style.display = "none";
        this.nameInput.hidden = true;
    }

    private renderSubmittingMessage(): void {
        console.log("Submitting name:", this.nameInput.value);
        this.ctx.fillStyle = GAME_OVER_CONFIG.fontColour;
        this.ctx.font = GAME_OVER_CONFIG.messagingFont;
        this.ctx.textAlign = "center";
        this.ctx.fillText("Submitting your name...", VIRTUAL_SCREEN.width / 2, (VIRTUAL_SCREEN.height / 2) - 40);
    }

    private renderSubmittedMessage(): void {
        this.ctx.fillStyle = GAME_OVER_CONFIG.fontColour;
        this.ctx.font = GAME_OVER_CONFIG.messagingFont;
        this.ctx.textAlign = "center";
        this.ctx.fillText("Name Submitted!", VIRTUAL_SCREEN.width / 2, (VIRTUAL_SCREEN.height / 2) - 40);
        this.ctx.font = GAME_OVER_CONFIG.continuePromptFont;
        this.ctx.fillText("Press enter to return to menu", VIRTUAL_SCREEN.width / 2, (VIRTUAL_SCREEN.height / 2));
    }
    
    private renderTables(): void {
        this.renderLeaderboardTable();
        this.renderUserRankTable();
    }

    private renderLeaderboardTable(): void {
        if (!this.gameOverRenderData) return;
        if (!this.gameOverRenderData.rankData) return;
        this.ctx.textAlign = "center";
        this.ctx.fillStyle =  GAME_OVER_CONFIG.tableFontColour;
        const startX = VIRTUAL_SCREEN.width * (1 - GAME_OVER_CONFIG.windowWidthFactor);
        const numRows: number = this.gameOverRenderData.rankData.leaderboard.length;
        let startY = (VIRTUAL_SCREEN.height / 2) - 
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
        for (let i = 0; i < this.gameOverRenderData.rankData.leaderboard.length; i++) {
            const entry = this.gameOverRenderData.rankData.leaderboard[i];
            if (i === GAME_OVER_CONFIG.numTopScores) {
                // Switch to row font for remaining entries
                this.ctx.font =  GAME_OVER_CONFIG.tableRowFont;
            }
            if (this.gameOverRenderData.rankData.userRankedScore.id == entry.id) {
                // highlight the user score if it's in the leaderboard
                this.ctx.fillStyle = GAME_OVER_CONFIG.tablePlayerFontColour;
                if (this.gameOverRenderData.rankData.userRankedScore.name === ANONYMOUS_PLAYER_NAME) {
                    entry.name = "you";
                } else {
                    entry.name = this.gameOverRenderData.rankData.userRankedScore.name;
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

    private renderUserRankTable(): void {
        if (!this.gameOverRenderData) return;
        if (!this.gameOverRenderData.rankData) return;
        this.ctx.textAlign = "center";
        this.ctx.fillStyle =  GAME_OVER_CONFIG.tableFontColour;
        const startX = VIRTUAL_SCREEN.width * GAME_OVER_CONFIG.windowWidthFactor;
        const numRows: number = this.gameOverRenderData.rankData.aroundUser.length;
        let startY = (VIRTUAL_SCREEN.height / 2) - 
            (((numRows * GAME_OVER_CONFIG.rowSpacing) + GAME_OVER_CONFIG.headerSpacing + GAME_OVER_CONFIG.titleSpacing) / 2);
        let y: number = startY;

        // Draw title
        this.ctx.font =  GAME_OVER_CONFIG.tableTitleFont;
        this.ctx.fillText("Your Rank: " + this.gameOverRenderData.rankData.userRankedScore.rank, startX, y);
        y += GAME_OVER_CONFIG.rowSpacing + GAME_OVER_CONFIG.titleSpacing;

        // Draw table header
        this.ctx.font =  GAME_OVER_CONFIG.tableHeaderFont;
        this.ctx.fillText("Rank", startX - GAME_OVER_CONFIG.columnSpacing, y);
        this.ctx.fillText("Name", startX, y);
        this.ctx.fillText("Score", startX + GAME_OVER_CONFIG.columnSpacing, y);
        y += GAME_OVER_CONFIG.rowSpacing + GAME_OVER_CONFIG.headerSpacing;

        // Draw each entry
        this.ctx.font =  GAME_OVER_CONFIG.tableRowFont;
        for (let i = 0; i < this.gameOverRenderData.rankData.aroundUser.length; i++) {
            const entry = this.gameOverRenderData.rankData.aroundUser[i];
            if (this.gameOverRenderData.rankData.userRankedScore.id == entry.id) {
                // highlight the user score
                this.ctx.fillStyle = GAME_OVER_CONFIG.tablePlayerFontColour;
                if (this.gameOverRenderData.rankData.userRankedScore.name === ANONYMOUS_PLAYER_NAME) {
                    entry.name = "you";
                } else {
                    entry.name = this.gameOverRenderData.rankData.userRankedScore.name;
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