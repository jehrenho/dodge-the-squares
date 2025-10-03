import { RenderData } from '../graphics/render-data.js';
import { VIRTUAL_SCREEN } from '../graphics/graphics-config.js';
import { MENU_CONFIG } from './menu-config.js';
import { Player } from '../world/entities/player.js';
import { Hazard } from '../world/entities/hazard.js'
import { HazardManager } from '../world/entities/hazard-manager.js';
import { ModifierManager } from '../world/entities/modifier-manager.js';
import { MenuRenderData } from '../graphics/render-data.js';
import { SPAWNER_CONFIG } from '../world/entities/config/spawner-config.js';
import { ModifierType, MODIFIER_TYPE } from '../world/entities/config/entities-config.js';

// stages the menu elements for the game
export class MenuStager {
    private readonly player: Player;
    private menuHazard: Hazard | null;
    private readonly hazardManager: HazardManager;
    private readonly modifierManager: ModifierManager;
    private readonly positioning: MenuRenderData;

    constructor(player: Player, hazardManager: HazardManager, modifierManager: ModifierManager) {
        this.player = player;
        this.hazardManager = hazardManager;
        this.modifierManager = modifierManager;
        this.menuHazard = null;
        this.positioning = {
            type: 'menu',
            centreX: 0,
            centreY: 0,
            HTPx: 0,
            HTPStartY: 0,
            HTPGapY: 0,
            modExStartX: 0,
            modExStartY: 0,
            modExGapY: 0
        };
        this.init();
    }
    
    // creates the entities that come alive when the game starts
    setStage() {
        this.stageMenuEntities();
    }

    getRenderData(): RenderData[] {
        return [this.positioning];
    }

    // calculates the positioning of the menu elements based on the config
    private init(): void {
        // find the centre dimensions of the virtual canvas
        this.positioning.centreX = VIRTUAL_SCREEN.width / 2;
        this.positioning.centreY = VIRTUAL_SCREEN.height / 2;

        // initialize the how to play section
        const totalHTPHeight: number = MENU_CONFIG.HTPVerSizeFactor * VIRTUAL_SCREEN.height;
        this.positioning.HTPGapY = totalHTPHeight / (MENU_CONFIG.numHTPInstructions - 1);
        this.positioning.HTPx = VIRTUAL_SCREEN.width * MENU_CONFIG.HTPHorCentreFactor;
        this.positioning.HTPStartY = this.positioning.centreY - (totalHTPHeight / 2);

        // initialize the modifier explanation section
        const totalModExHeight: number = MENU_CONFIG.modExVertSizeFactor * VIRTUAL_SCREEN.height;
        this.positioning.modExGapY = totalModExHeight / (Object.keys(MODIFIER_TYPE).length - 1);
        this.positioning.modExStartY = this.positioning.centreY - (totalModExHeight / 2);
        this.positioning.modExStartX = VIRTUAL_SCREEN.width * MENU_CONFIG.modExHorCentreFactor;
    }

    private stageMenuEntities(): void {  
        // set player position
        const playerY = this.positioning.HTPStartY + this.positioning.HTPGapY - MENU_CONFIG.HTPPlayerDiscYOffset;
        this.player.setPositionByCentre(this.positioning.HTPx, playerY);
        // create menu hazard and set position
        const menuHazardY = this.positioning.HTPStartY + this.positioning.HTPGapY * 2 - MENU_CONFIG.HTPHazardDiscYOffset;
        this.menuHazard = this.hazardManager.createMenuHazard();
        this.menuHazard.setPositionByCentre(this.positioning.HTPx, menuHazardY);
        // create the menu modifiers
        let i = 0;
        for (const type of Object.values(MODIFIER_TYPE)) {
            this.modifierManager.createModifier(type as ModifierType,
                this.positioning.modExStartX, this.positioning.modExStartY + i * this.positioning.modExGapY);
            i++
        }
    }
}