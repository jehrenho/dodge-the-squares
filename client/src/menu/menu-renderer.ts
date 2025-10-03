import { VIRTUAL_SCREEN } from '../graphics/graphics-config.js';
import { MENU_CONFIG } from './menu-config.js';
import { Player } from '../world/entities/player.js';
import { Hazard } from '../world/entities/hazard.js'
import { HazardManager } from '../world/entities/hazard-manager.js';
import { ModifierManager } from '../world/entities/modifier-manager.js';
import { RenderData, MenuRenderData } from '../graphics/render-data.js';
import { SPAWNER_CONFIG } from '../world/entities/config/spawner-config.js';
import { MODIFIER_TYPE, ModifierType } from '../world/entities/config/entities-config.js';

// menu class for creating the game menu
export class MenuRenderer {
    private readonly ctx: CanvasRenderingContext2D;
    private menuHazard: Hazard | null = null;
    private player: Player | null = null;
    private hazardManager: HazardManager | null = null;
    private modifierManager: ModifierManager | null = null;
    private menuRenderData: MenuRenderData | null = null;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    render(renderData: RenderData[]): void {
        this.menuRenderData = this.getMenuRenderData(renderData);
        if (!this.menuRenderData) {
            console.log("MenuRenderer: Menu render data is not available.");
        } else {
            this.renderGameTitle();
            this.renderStartGamePrompt();
            this.renderHowToPlay();
            this.renderModifierExplanations();
        }
    }

    renderGameTitle() {
        if (!this.menuRenderData) return;
        this.ctx.fillStyle = MENU_CONFIG.titleTextColour;
        this.ctx.font = MENU_CONFIG.titleFont;
        this.ctx.textAlign = "center";
        this.ctx.fillText(MENU_CONFIG.titleText, this.menuRenderData.centreX, MENU_CONFIG.titleYScale * VIRTUAL_SCREEN.height);
    }

    renderStartGamePrompt() {
        if (!this.menuRenderData) return;
        this.ctx.fillStyle = MENU_CONFIG.startPromptTextColour;
        this.ctx.font = MENU_CONFIG.startPromptFont;
        this.ctx.textAlign = "center";
        this.ctx.fillText(MENU_CONFIG.startPrompt, this.menuRenderData.centreX, this.menuRenderData.centreY);
    }

    // draws the how to play instructions
    private renderHowToPlay() {
        if (!this.menuRenderData) return;
        let y = this.menuRenderData.HTPStartY;

        // draw the title
        this.ctx.font = MENU_CONFIG.HTPTitleFont;
        this.ctx.fillStyle = MENU_CONFIG.HTPTextColour;
        this.ctx.textAlign = "center";
        this.ctx.fillText(MENU_CONFIG.HTPTitle, this.menuRenderData.HTPx, y);
        y += this.menuRenderData.HTPGapY;

        // draw the player controls description
        this.ctx.fillStyle = MENU_CONFIG.HTPTextColour;
        this.ctx.font = MENU_CONFIG.HTPTextFont;
        this.ctx.fillText(MENU_CONFIG.HTPPlayerText,
            this.menuRenderData.HTPx, y + MENU_CONFIG.HTPPlayerDiscYOffset);
        y += this.menuRenderData.HTPGapY;

        // draw the hazards description
        this.ctx.fillStyle = MENU_CONFIG.HTPTextColour;
        this.ctx.font = MENU_CONFIG.HTPTextFont;
        this.ctx.fillText(MENU_CONFIG.HTPHazardText, this.menuRenderData.HTPx, y + MENU_CONFIG.HTPHazardDiscYOffset);
        y += this.menuRenderData.HTPGapY;

        // draw the 3 lives explanation
        this.ctx.fillText(MENU_CONFIG.HTP3LivesText, this.menuRenderData.HTPx, y);
        y += this.menuRenderData.HTPGapY;

        // draw the pause instruction
        this.ctx.fillText(MENU_CONFIG.HTPPauseText, this.menuRenderData.HTPx, y);
        y += this.menuRenderData.HTPGapY;

        // draw the game objective description
        this.ctx.font = MENU_CONFIG.HTPObjectiveFont;
        this.ctx.fillText(MENU_CONFIG.HTPObjectiveText, this.menuRenderData.HTPx, y);
        y += this.menuRenderData.HTPGapY;
    }

    // draws the menu modifiers and their descriptions
    private renderModifierExplanations() {
        if (!this.menuRenderData) return;
        // draw the descriptions
        this.ctx.font = MENU_CONFIG.modExFont;
        this.ctx.fillStyle = MENU_CONFIG.modExTextColour;
        this.ctx.textAlign = "left";
        let i = 0;
        for (const type of Object.values(MODIFIER_TYPE)) {
            const spawnerInfo = SPAWNER_CONFIG[type as ModifierType];
            this.ctx.fillText(spawnerInfo.description,
                this.menuRenderData.modExStartX + MENU_CONFIG.modExDescriptionXOffset,
                this.menuRenderData.modExStartY + i * this.menuRenderData.modExGapY + 7);
            i++
        }
    }

    private getMenuRenderData(renderData: RenderData[]): MenuRenderData | null {
        for (let i = 0; i < renderData.length; i++) {
            if (renderData[i].type === 'menu') {
                return renderData[i] as MenuRenderData;
            }
        }
        return null;
    }
}