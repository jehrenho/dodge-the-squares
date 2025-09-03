import { SCALING_CONFIG, MENU_CONFIG } from './graphics-config.js';
import { ModifierType, MOD_GEN_CONFIG } from '../world/entities/entities-config.js'
import { Player } from '../world/entities/player.js';
import { Hazard } from '../world/entities/hazard.js'
import { HazardManager } from '../world/entities/hazard-manager.js';
import { ModifierManager } from '../world/entities/modifier-manager.js';

// menu class for creating the game menu
export class Menu {
    private readonly ctx: CanvasRenderingContext2D;
    private menuHazard: Hazard | null = null;
    private player: Player | null = null;
    private hazardManager: HazardManager | null = null;
    private modifierManager: ModifierManager | null = null;
    private centreX: number = 0;
    private centreY: number = 0;
    private HTPx: number = 0;
    private HTPGapY: number = 0;
    private HTPStarty: number = 0;
    private modExStartX: number = 0;
    private modExStartY: number = 0;
    private modExGapY: number = 0;

    constructor(ctx: CanvasRenderingContext2D, player: Player, hazardManager: HazardManager, modifierManager: ModifierManager) {
        this.ctx = ctx;
        this.player = player;
        this.hazardManager = hazardManager;
        this.modifierManager = modifierManager;
        this.calculatePositioning();
        this.createMenuEntities();
    }

    draw(): void {
        this.drawTitle();
        this.drawStartPrompt();
        this.drawHowToPlay();
        this.drawModifierExplanations();
    }

    reset(): void {
        this.createMenuEntities();
    }

    // calculates the positioning of the menu elements in the virtual frame dimensions
    private calculatePositioning(): void {
        // find the centre dimensions of the virtual canvas
        this.centreX = SCALING_CONFIG.virtualWidth / 2;
        this.centreY = SCALING_CONFIG.virtualHeight / 2;

        // initialize the how to play section
        let totalHTPHeight: number = MENU_CONFIG.HTPVerSizeFactor * SCALING_CONFIG.virtualHeight;
        this.HTPGapY = totalHTPHeight / (MENU_CONFIG.numHTPInstructions - 1);
        this.HTPx = SCALING_CONFIG.virtualWidth * MENU_CONFIG.HTPHorCentreFactor;
        this.HTPStarty = this.centreY - (totalHTPHeight / 2);

        // initialize the modifier explanation section
        let totalModExHeight: number = MENU_CONFIG.modExVertSizeFactor * SCALING_CONFIG.virtualHeight;
        this.modExGapY = totalModExHeight / (Object.keys(MOD_GEN_CONFIG).length - 1);
        this.modExStartY = this.centreY - (totalModExHeight / 2);
        this.modExStartX = SCALING_CONFIG.virtualWidth * MENU_CONFIG.modExHorCentreFactor;
    }

    // creates the entities that come alive when the game starts
    private createMenuEntities() {
        // create menu hazard
        if (!this.hazardManager) throw new Error("Menu.hazardManager has not been initialized!");
        else this.menuHazard = this.hazardManager.createMenuHazard();
        // create the menu modifiers
        if (!this.modifierManager) throw new Error("Menu.modifierManager has not been initialized!");
        else {
            let i = 0;
            for (const [modifierType, config] of Object.entries(MOD_GEN_CONFIG)) {
                this.modifierManager.createModifier(modifierType as ModifierType,
                    this.modExStartX, this.modExStartY + i * this.modExGapY);
                i++
            }
        }
    }

    // draws the how to play instructions
    private drawHowToPlay() {
        let y = this.HTPStarty

        // draw the title
        this.ctx.font = MENU_CONFIG.HTPTitleFont;
        this.ctx.fillStyle = MENU_CONFIG.HTPTextColour;
        this.ctx.textAlign = "center";
        this.ctx.fillText(MENU_CONFIG.HTPTitle, this.HTPx, y);
        y += this.HTPGapY;

        // draw the player square
        if (!this.player) throw new Error("Menu.player has not been initialized!");
        else {
            this.player.setPositionByCentre(this.HTPx, y - MENU_CONFIG.HTPPlayerDiscYOffset);
            this.player.draw(this.ctx);
        }
        // draw the player controls description
        this.ctx.fillStyle = MENU_CONFIG.HTPTextColour;
        this.ctx.font = MENU_CONFIG.HTPTextFont;
        this.ctx.fillText(MENU_CONFIG.HTPPlayerText,
            this.HTPx, y + MENU_CONFIG.HTPPlayerDiscYOffset);
        y += this.HTPGapY;

        // draw a hazard square and description
        if (!this.menuHazard) throw new Error("Menu.menuHazard has not been initialized!");
        else {
            this.menuHazard.setPositionByCentre(this.HTPx, y - MENU_CONFIG.HTPHazardDiscYOffset);
            this.menuHazard.draw(this.ctx);
        }
        this.ctx.fillStyle = MENU_CONFIG.HTPTextColour;
        this.ctx.font = MENU_CONFIG.HTPTextFont;
        this.ctx.fillText(MENU_CONFIG.HTPHazardText, this.HTPx, y + MENU_CONFIG.HTPHazardDiscYOffset);
        y += this.HTPGapY;

        // draw the 3 lives explenation
        this.ctx.fillText(MENU_CONFIG.HTP3LivesText, this.HTPx, y);
        y += this.HTPGapY;

        // draw the pause instruction
        this.ctx.fillText(MENU_CONFIG.HTPPauseText, this.HTPx, y);
        y += this.HTPGapY;

        // draw the game objective description
        this.ctx.font = MENU_CONFIG.HTPObjectiveFont;
        this.ctx.fillText(MENU_CONFIG.HTPObjectiveText, this.HTPx, y);
        y += this.HTPGapY;
    }

    // draws the menu modifiers and their descriptions
    private drawModifierExplanations() {
        // draw the menu modifiers
        if (!this.modifierManager) throw new Error("Menu.modifierManager has not been initialized!");
        else this.modifierManager.drawModifiers(this.ctx);
        // draw the descriptions
        this.ctx.font = MENU_CONFIG.modExFont;
        this.ctx.fillStyle = MENU_CONFIG.modExTextColour;
        this.ctx.textAlign = "left";
        let i = 0;
        for (const [modifierType, config] of Object.entries(MOD_GEN_CONFIG)) {
            this.ctx.fillText(config.description,
                this.modExStartX + MENU_CONFIG.modExDescriptionXOffset,
                this.modExStartY + i * this.modExGapY + 7);
            i++
        }
    }

    private drawTitle() {
        this.ctx.fillStyle = MENU_CONFIG.titleTextColour;
        this.ctx.font = MENU_CONFIG.titleFont;
        this.ctx.textAlign = "center";
        this.ctx.fillText(MENU_CONFIG.titleText, this.centreX, MENU_CONFIG.titleYScale * SCALING_CONFIG.virtualHeight);
    }

    private drawStartPrompt() {
        this.ctx.fillStyle = MENU_CONFIG.startPromptTextColour;
        this.ctx.font = MENU_CONFIG.startPromptFont;
        this.ctx.textAlign = "center";
        this.ctx.fillText(MENU_CONFIG.startPrompt, this.centreX, this.centreY);
    }
}