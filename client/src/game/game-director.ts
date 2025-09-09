import { RenderData } from '../graphics/render-data.js';
import { GamePhase } from './game-config.js';
import { GameState } from './game-state.js';
import { InputManager } from '../input/input-manager.js';
import { World } from '../world/world.js';
import { MenuStager } from '../menu/menu-stager.js';
import { GameOverDirector } from '../game-over/game-over-director.js';

// update and renders the game and orchestrates game phase transitions
export class GameDirector {
  private readonly gameState: GameState;
  private readonly inputManager: InputManager;
  private readonly world: World;
  private readonly menuStager: MenuStager;
  private readonly gameOverDirector: GameOverDirector;

  constructor() {
    this.inputManager = new InputManager();
    this.gameState = new GameState();
    this.world = new World(this.gameState);
    this.menuStager = new MenuStager(this.world.getPlayer(), 
      this.world.getHazardManager(), this.world.getModifierManager());
    this.gameOverDirector = new GameOverDirector(this.inputManager);
    this.menuStager.setStage();
  }

  update(): RenderData[] {
    this.inputManager.update();
    switch (this.gameState.getPhase()) {
      case GamePhase.MENU:
        return this.updateMenu();
      case GamePhase.INGAME:
        return this.updateInGame();
      case GamePhase.GAMEOVER:
        return this.updateGameOver();
    }
  }

  getGameState(): GameState {
    return this.gameState;
  }

  getInputManager(): InputManager {
    return this.inputManager;
  }

  private updateMenu(): RenderData[] {
    // start the game when Enter is pressed
    if (this.inputManager.isEnterPressed()) {
      this.inputManager.waitForEnterToRise();
      this.gameState.setPhase(GamePhase.INGAME);
      return this.updateInGame();
    }
    const renderData: RenderData[] = [];
    renderData.push(...this.menuStager.getRenderData());
    renderData.push(...this.world.getRenderData());
    return renderData;
  }

  private updateInGame(): RenderData[] {
    // pause/unpause game
    if (this.inputManager.isSpacePressed()) {
        this.inputManager.waitForSpaceToRise();
        this.gameState.togglePaused();
    }
    // update logic
    if (!this.gameState.isPaused()) {
      this.world.update(this.inputManager.getPlayerMovementInput());
      this.gameState.incrementFrameCount(); 
    }
    // end the game if the player is dead
    if (this.world.isPlayerDead()) {
      this.gameState.setPhase(GamePhase.GAMEOVER);
      this.gameOverDirector.fetchRank(this.gameState.getFramesSurvived());
      return this.gameOverDirector.update();
    }
    return this.world.getRenderData();
  }

  private updateGameOver(): RenderData[] {
    if (this.gameOverDirector.isReturnToMenu()) {
      this.gameState.reset();
      this.world.reset();
      this.menuStager.setStage();
      return this.updateMenu();
    }
    return this.gameOverDirector.update();
  }
}
