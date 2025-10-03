import { ModifierType } from '../world/entities/config/entities-config.js';
import { GameOverPhase } from '../game-over/game-over-config.js';
import { RankData } from '../common/common-config.js'

export type RenderData = PlayerRenderData | HazardRenderData | ModifierRenderData | MenuRenderData | GameOverRenderData;

export interface PlayerRenderData extends RenderDataBase {
  type: 'player';
  size: { width: number; height: number };
  health: number;
  invincible: boolean;
  iceRink: boolean;
  wearOffColourOverride: boolean;
};

export interface HazardRenderData extends RenderDataBase {
  type: 'hazard';
  size: { width: number; height: number };
};

export interface ModifierRenderData extends RenderDataBase {
  type: 'modifier';
  modifierType: ModifierType;
  radius: number;
};

export interface MenuRenderData {
  type: 'menu';
  centreX: number;
  centreY: number;
  HTPx: number;
  HTPStartY: number;
  HTPGapY: number;
  modExStartX: number;
  modExStartY: number;
  modExGapY: number;
};

export interface GameOverRenderData {
  type: 'game-over';
  phase: GameOverPhase;
  rankData: RankData | null;
};

interface RenderDataBase {
  position: { x: number; y: number };
  flashOn: boolean;
};
