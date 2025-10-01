import { Pool } from "pg";
import { RankData, RankedScore, ANONYMOUS_PLAYER_NAME } from './common/common-config.js';

export class Database {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }

  // inserts a score into the database with the anonymous name
  async insertAnonScore(framesSurvived: number): Promise<number | null> {
    try {
      const result = await this.pool.query(
        "INSERT INTO scores (name, score) VALUES ($1, $2) RETURNING id",
        [ANONYMOUS_PLAYER_NAME, framesSurvived]
      );
      return result.rows[0].id;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // gets the RankData for a specific score ID
  async getRankData(userScoreId: number): Promise<RankData | null> {
    const userRankedScore: RankedScore | null = await this.getUserScore(userScoreId);
    const aroundUser: RankedScore[] | null = await this.getAroundUserScores(userRankedScore);
    const leaderboard: RankedScore[] | null = await this.getLeaderboard();
    if (!userRankedScore || !aroundUser || !leaderboard) {
      return null;
    }
    var rankData: RankData = {
        userRankedScore: userRankedScore,
        aroundUser: aroundUser,
        leaderboard: leaderboard
    };
    return rankData;
  }

  // adds a player name to the database
  async addPlayerName(playerName: string, userScoreId: number): Promise<boolean> {
    try {
      await this.pool.query(
        "UPDATE scores SET name = $1 WHERE id = $2",
        [playerName, userScoreId]
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  // gets the user's score from the database
  private async getUserScore(userScoreId: number): Promise<RankedScore | null> {
    // fetch the user's score using the submitted ID
    const userRes = await this.pool.query(
        'SELECT id, name, score, created_at FROM scores WHERE id = $1',
        [userScoreId]
    );
    if (userRes.rowCount === 0) {
        throw new Error('User score not found');
    }
    const userRank = await this.getGlobalRank(userRes.rows[0].score);
    const userScore: RankedScore = {
        id: userRes.rows[0].id,
        name: userRes.rows[0].name,
        score: userRes.rows[0].score,
        rank: userRank,
        createdAt: userRes.rows[0].created_at.toISOString()
    };
    return userScore;
  }

  // gets the scores ranked just above and just below a given score
  private async getAroundUserScores(userRankedScore: RankedScore): Promise<RankedScore[]> {
    // fetch scores around the user (5 above + 5 below, including the user)
    // Note: adjust the SQL to ensure you fetch enough rows; here we do a simple range
    const aroundRes = await this.pool.query(
      'WITH ranked AS '
      + '(SELECT id, name, score, created_at, RANK() OVER (ORDER BY score DESC) AS rank FROM scores) '
      + 'SELECT * FROM ranked WHERE rank BETWEEN '
      + '(SELECT rank - 3 FROM ranked WHERE id = $1) AND (SELECT rank + 3 FROM ranked WHERE id = $1) '
      + 'ORDER BY rank;',
      [userRankedScore.id]
    );
    // map the "around user" rows to RankedScore objects
    const aroundUser: RankedScore[] = aroundRes.rows.map(function(row) {
      return {
        id: row.id,
        name: row.name,
        score: row.score,
        rank: parseInt(row.rank, 10),
        createdAt: row.created_at.toISOString()
      };
    });
    return aroundUser;
  }

  // gets the top 10 leaderboard scores from the database
  private async getLeaderboard(): Promise<RankedScore[]> {
    const top10Res = await this.pool.query(
        'SELECT id, name, score, created_at, COUNT(*) OVER (ORDER BY score DESC) AS rank ' +
        'FROM scores ' +
        'ORDER BY score DESC ' +
        'LIMIT 10'
    );
    // map the result to RankedScore objects
    const leaderboard: RankedScore[] = top10Res.rows.map(function(row) {
        return {
            id: row.id,
            name: row.name,
            score: row.score,
            rank: parseInt(row.rank, 10),
            createdAt: row.created_at.toISOString()
        };
    });
    return leaderboard;
  }

  private async getGlobalRank(score: number): Promise<number> {
    const result = await this.pool.query(
      'SELECT COUNT(*) + 1 AS rank FROM scores WHERE score > $1',
      [score]
    );
    return parseInt(result.rows[0].rank, 10);
  }
}