import { Request, Response } from 'express';
import { POST_TYPE, RankData } from './common/common-config.js';
import { Database } from './database.js';

export class ScoreController {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  public getHandler(req: Request, res: Response): void {
    return;
  }

  public async postHandler(req: Request, res: Response): Promise<void> {
    switch (req.body.type) {
      case POST_TYPE.FETCH_RANK:
        await this.handleFetchRank(req, res);
        break;
      case POST_TYPE.SUBMIT_NAME:
        await this.handleSubmitName(req, res);
        break;
      default:
        res.status(400).json({ error: 'Invalid POST request type' });
        return;
    }
  }

  // inserts all scores anonymously to the database and returns the new score ID with ranking data
  private async handleFetchRank(req: Request, res: Response): Promise<void> {
    // insert the score into the db
    const id: number | null = await this.db.insertAnonScore(req.body.framesSurvived);
    if (!id) {
      res.status(500).json({ error: "DATABASE ERROR while inserting anonymous score" });
      return;
    }
    // get rank data for the score
    const rankData: RankData | null = await this.db.getRankData(id);
    if (!rankData) {
      res.status(500).json({ error: "DATABASE ERROR while getting rank data" });
      return;
    }
    // send the rank data to the client
    res.status(201).json(rankData);
    return;
  }

  private async handleSubmitName(req: Request, res: Response): Promise<void> {
    return;
  }
}
