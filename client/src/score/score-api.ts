import { API_BASE } from './score-api-config.js';
import { POST_TYPE, RankData } from '../common/common-config.js';
import { GameState } from '../game/game-state.js';

export class ScoreApi {
    private readonly gameState: GameState;

    constructor(gameState: GameState) {
        this.gameState = gameState;
    }

    // gets the ranking data for a player's score when their game ends
    async fetchRank(numFramesSurvived: number): Promise<void> {
        try {
            // create the request
            const request: Request = new Request(`${API_BASE}/scores`);
            const options: RequestInit = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: POST_TYPE.FETCH_RANK,
                    framesSurvived: numFramesSurvived
                })
            };

            // send request
            const response = await fetch(request, options);

            // handle non-OK HTTP codes
            if (!response.ok) {
                console.error(`Server responded with ${response.status}: ${response.statusText}`);
                return;
            }

            // parse JSON safely
            const rankData: RankData = await response.json() as RankData;
            this.gameState.setRankData(rankData);

        } catch (err) {
            // handle network/runtime errors
            console.error("Network or parsing error in fetchRank:", err);
        }
    }
}
