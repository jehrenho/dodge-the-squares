import { API_BASE } from './score-api-config.js';
import { POST_TYPE, RankData, RankedScore } from '../common/common-config.js';

export class ScoreApi {
    private nameSubmitted: boolean;

    constructor() {
        this.nameSubmitted = false;
    }

    isNameSubmitted(): boolean {
        return this.nameSubmitted;
    }

    // gets the ranking data for a player's score when their game ends
    async fetchRank(numFramesSurvived: number): Promise<RankData | null> {
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
                return null;
            }

            // parse JSON safely
            return await response.json() as RankData;

        } catch (err) {
            // handle network/runtime errors
            console.error("Network or parsing error in fetchRank:", err);
            return null;
        }
    }

    async submitName(name: string, rankedScore: RankedScore): Promise<void> {
        try {
            // create the request
            const request: Request = new Request(`${API_BASE}/scores`);
            const options: RequestInit = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: POST_TYPE.SUBMIT_NAME,
                    playerName: name,
                    id: rankedScore.id
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
            console.log("Name submitted successfully");
            this.nameSubmitted = true;
            return;

        } catch (err) {
            // handle network/runtime errors
            console.error("Network or parsing error in submitName:", err);
            return;
        }
    }

    reset(): void {
        this.nameSubmitted = false;
    }
}
