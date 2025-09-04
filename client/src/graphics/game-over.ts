import { GAME_OVER_CONFIG, SCALING_CONFIG } from './graphics-config.js';
import { GameState } from '../game/game-state.js';
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
            const startX = SCALING_CONFIG.virtualWidth / 2;
            let startY = SCALING_CONFIG.virtualHeight / 2 + 120;
            this.ctx.font =  "20px Arial";
            this.ctx.fillStyle =  "black";
            this.ctx.textAlign = "center";
            // Draw table header
            this.ctx.fillText("Rank   Name   Score", startX, startY);
            startY += 30;
            // Draw each leaderboard entry
            for (let i = 0; i < rankData.leaderboard.length; i++) {
                const entry = rankData.leaderboard[i];
                const text = `${entry.rank}   ${entry.name}   ${(entry.score / 60).toFixed(2)}s`;
                this.ctx.fillText(text, startX, startY + i * 30);
            }
        }
    }
}