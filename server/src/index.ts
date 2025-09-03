import express, { Request, Response } from 'express';
import path from 'path';
import { CONFIG, Score } from './config.js';

const app = express();

// JSON parsing
app.use(express.json());

// Serve static files from public/
app.use(express.static(path.join(__dirname, CONFIG.PUBLIC_DIR)));

// In-memory "database"
let scores: Score[] = [];

// --- Handler functions --- //
function getScores(req: Request, res: Response): void {
  const sorted = scores.sort((a, b) => b.score - a.score);
  res.json(sorted);
}

function postScore(req: Request, res: Response): void {
  const { name, score } = req.body as { name: string; score: number };

  if (!name || typeof score !== 'number') {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }

  const newScore = { name, score, date: new Date() };
  scores.push(newScore);
  res.status(201).json(newScore);
}

// --- Routes --- //
app.get('/scores', getScores);
app.post('/scores', postScore);

// Start server
app.listen(CONFIG.PORT, function () {
  console.log(`Server running at http://localhost:${CONFIG.PORT}`);
});