export const POST_TYPE = {
    FETCH_RANK: "FETCH_RANK",
    SUBMIT_NAME: "SUBMIT_NAME"
} as const;

export interface RankedScore {
  id: number;
  name: string;
  score: number;
  rank: number;       // global rank
  createdAt: string;  // ISO string for client
}

export interface RankData {
  userRankedScore: RankedScore;        // the score ID of the submitting player
  aroundUser: RankedScore[];  // 5 above + user + 5 below (up to 11 rows)
  leaderboard: RankedScore[]; // top 10 scores
}

export const ANONYMOUS_PLAYER_NAME = 'Anonymous';