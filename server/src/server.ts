import express, { Application } from 'express';
import path from 'path';
import { ScoreController } from './score-controller.js';

// the main server class that serves the game and handles API requests
export class Server {
  private app: Application;
  private port: number;
  private publicDir: string;
  private scoreController: ScoreController;

  constructor(port: number, publicDir: string) {
    this.app = express();
    this.port = port;
    this.publicDir = publicDir;
    this.scoreController = new ScoreController();

    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, this.publicDir)));
  }

  private configureRoutes(): void {
    this.app.get('/scores', this.scoreController.getHandler.bind(this.scoreController));
    this.app.post('/scores', this.scoreController.postHandler.bind(this.scoreController));
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
