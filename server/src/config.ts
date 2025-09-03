export const CONFIG = {
  PORT: 3000,
  PUBLIC_DIR: '../../client/public'
};

export interface Score {
  name: string;
  score: number;
  date: Date;
}