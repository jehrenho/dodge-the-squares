import { GAME_OVER_CONFIG, SCALING_CONFIG } from './graphics-config.js';
import { GameState } from '../game/game-state.js';
import { GAME_STATE_CONFIG } from '../game/game-config.js';
import { RankData } from '../common/common-config.js';

export class GameOver {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly gameState: GameState;

    constructor(ctx: CanvasRenderingContext2D, gameState: GameState) {
        this.ctx = ctx;
        this.gameState = gameState;
    }

    draw(): void {
        this.drawTitleMessagePrompt();
        this.drawLeaderboard();
        this.drawLocalScores();
    }

    private drawTitleMessagePrompt(): void {
        // draws the game over title
        this.ctx.fillStyle = GAME_OVER_CONFIG.fontColour;
        this.ctx.font = GAME_OVER_CONFIG.titleFont;
        this.ctx.textAlign = "center";
        this.ctx.fillText(GAME_OVER_CONFIG.gameOverTitle, SCALING_CONFIG.virtualWidth / 2, SCALING_CONFIG.virtualHeight / 2);
        // draws the game over time survived message
        this.ctx.font = GAME_OVER_CONFIG.messagingFont;
        this.ctx.fillText(GAME_OVER_CONFIG.gameOverMessage.replace("{time}", this.gameState.getSecondsSurvived().toFixed(2)),
        SCALING_CONFIG.virtualWidth / 2, SCALING_CONFIG.virtualHeight / 2 + 40);
        // draws the game over prompt
        this.ctx.font = GAME_OVER_CONFIG.promptFont;
        this.ctx.fillText(GAME_OVER_CONFIG.gameOverPrompt, SCALING_CONFIG.virtualWidth / 2, SCALING_CONFIG.virtualHeight / 2 + 80);
    }

    private drawLeaderboard(): void {
        const rankData: RankData | null = this.gameState.getRankData();
        if (rankData && rankData.leaderboard) {
            this.ctx.textAlign = "center";
            this.ctx.fillStyle =  GAME_OVER_CONFIG.tableFontColour;
            const startX = SCALING_CONFIG.virtualWidth * (1 - GAME_OVER_CONFIG.windowWidthFactor);
            const numRows: number = rankData.leaderboard.length;
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
            for (let i = 0; i < rankData.leaderboard.length; i++) {
                const entry = rankData.leaderboard[i];
                if (i === GAME_OVER_CONFIG.numTopScores) {
                    // Switch to row font for remaining entries
                    this.ctx.font =  GAME_OVER_CONFIG.tableRowFont;
                }
                if (rankData.userRankedScore.id == entry.id) {
                    // highlight the user score if it's in the leaderboard
                    this.ctx.fillStyle = GAME_OVER_CONFIG.tablePlayerFontColour;
                    entry.name = "you";
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

    private drawLocalScores(): void {
        const rankData: RankData | null = this.gameState.getRankData();
        if (rankData && rankData.aroundUser) {
            this.ctx.textAlign = "center";
            this.ctx.fillStyle =  GAME_OVER_CONFIG.tableFontColour;
            const startX = SCALING_CONFIG.virtualWidth * GAME_OVER_CONFIG.windowWidthFactor;
            const numRows: number = rankData.aroundUser.length;
            let startY = (SCALING_CONFIG.virtualHeight / 2) - 
                (((numRows * GAME_OVER_CONFIG.rowSpacing) + GAME_OVER_CONFIG.headerSpacing + GAME_OVER_CONFIG.titleSpacing) / 2);
            let y: number = startY;

            // Draw title
            this.ctx.font =  GAME_OVER_CONFIG.tableTitleFont;
            this.ctx.fillText("Your Rank: " + rankData.userRankedScore.rank, startX, y);
            y += GAME_OVER_CONFIG.rowSpacing + GAME_OVER_CONFIG.titleSpacing;

            // Draw table header
            this.ctx.font =  GAME_OVER_CONFIG.tableHeaderFont;
            this.ctx.fillText("Rank", startX - GAME_OVER_CONFIG.columnSpacing, y);
            this.ctx.fillText("Name", startX, y);
            this.ctx.fillText("Score", startX + GAME_OVER_CONFIG.columnSpacing, y);
            y += GAME_OVER_CONFIG.rowSpacing + GAME_OVER_CONFIG.headerSpacing;

            // Draw each entry
            this.ctx.font =  GAME_OVER_CONFIG.tableRowFont;
            for (let i = 0; i < rankData.aroundUser.length; i++) {
                const entry = rankData.aroundUser[i];
                if (rankData.userRankedScore.id == entry.id) {
                    // highlight the user score
                    this.ctx.fillStyle = GAME_OVER_CONFIG.tablePlayerFontColour;
                    entry.name = "you";
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
}