import { GAME_CONFIG, MODIFIER_TYPE, MOD_GEN_INITS, HAZ_GEN_INITS, MENU_CONFIG } from './config.js';
import { Player } from './player.js';
import { HazardManager, Hazard } from './hazardManager.js';
import { drawBackground } from './game.js';
import { ModifierManager } from './modifierManager.js';

export class Menu {
    static menuHazard: Hazard | null = null;
    static player: Player | null = null;
    static hazardManager: HazardManager | null = null;
    static modifierManager: ModifierManager | null = null;

    // variables used to position the menu elements
    static centreX: number = 0;
    static centreY: number = 0;
    static HTPx: number = 0;
    static HTPy: number = 0;
    static HTPGapY: number = 0;
    static HTPStarty: number = 0;
    static modExStartX: number = 0;
    static modExStartY: number = 0;
    static modExGapY: number = 0;

    // initializes the menu class
    static init(player: Player, hazardManager: HazardManager, modifierManager: ModifierManager) {
        // save references to the main game objects for encapsulation
        Menu.player = player;
        Menu.hazardManager = hazardManager;
        Menu.modifierManager = modifierManager;

        // find the centre dimensions of the canvas
        Menu.centreX = GAME_CONFIG.VIRTUAL_WIDTH / 2;
        Menu.centreY = GAME_CONFIG.VIRTUAL_HEIGHT / 2;

        // initialize the how to play section
        let totalHTPHeight: number = MENU_CONFIG.HTPVerSizeFactor * GAME_CONFIG.VIRTUAL_HEIGHT;
        Menu.HTPGapY = totalHTPHeight / (MENU_CONFIG.numHTPInstructions - 1);
        Menu.HTPx = GAME_CONFIG.VIRTUAL_WIDTH * MENU_CONFIG.HTPHorCentreFactor;
        Menu.HTPStarty = Menu.centreY - (totalHTPHeight / 2)
        Menu.HTPy = Menu.HTPStarty;

        // initialize the modifier explanation section
        let totalModExHeight: number = MENU_CONFIG.modExVertSizeFactor * GAME_CONFIG.VIRTUAL_HEIGHT;
        Menu.modExGapY = totalModExHeight / (Object.keys(MOD_GEN_INITS).length - 1);
        Menu.modExStartY = Menu.centreY - (totalModExHeight / 2);
        Menu.modExStartX = GAME_CONFIG.VIRTUAL_WIDTH * MENU_CONFIG.modExHorCentreFactor;

        // create the menu objects that come alive when the game starts
        Menu.createMenuObjects();
    }

    // creates the menu objects that are live when the game starts
    static createMenuObjects() {
        // create menu hazard
        if (!Menu.hazardManager) throw new Error("Menu.hazardManager has not been initialized!");
        else Menu.menuHazard = Menu.hazardManager.createHazard(0, 0, HAZ_GEN_INITS.w, HAZ_GEN_INITS.h, HAZ_GEN_INITS.colour);
        // create the menu modifiers
        if (!Menu.modifierManager) throw new Error("Menu.modifierManager has not been initialized!");
        else {
            let i = 0;
            for (const [modifierType, config] of Object.entries(MOD_GEN_INITS)) {
                Menu.modifierManager.createModifier(modifierType as MODIFIER_TYPE, 
                    Menu.modExStartX, Menu.modExStartY + i * Menu.modExGapY);
                i++
            }
        }
    }

    // draws the how to play instructions
    static drawHowToPlay(ctx: CanvasRenderingContext2D) {
        // draw the title
        ctx.font = MENU_CONFIG.HTPTitleFont;
        ctx.fillStyle = MENU_CONFIG.HTPTextColour;
        ctx.textAlign = "center";
        ctx.fillText(MENU_CONFIG.HTPTitle, Menu.HTPx, Menu.HTPy);
        Menu.HTPy += Menu.HTPGapY;

        // draw the player square
        if (!Menu.player) throw new Error("Menu.player has not been initialized!");
        else {
            Menu.player.setPositionByCentre(Menu.HTPx, Menu.HTPy - MENU_CONFIG.HTPPlayerDiscYOffset);
            Menu.player.draw(ctx, Menu.player.colour);
        }
        // draw the player controls description
        ctx.fillStyle = MENU_CONFIG.HTPTextColour;
        ctx.font = MENU_CONFIG.HTPTextFont;
        ctx.fillText(MENU_CONFIG.HTPPlayerText, 
            Menu.HTPx, Menu.HTPy + MENU_CONFIG.HTPPlayerDiscYOffset);
        Menu.HTPy += Menu.HTPGapY;

        // draw a hazard square and description
        if (!Menu.menuHazard) throw new Error("Menu.menuHazard has not been initialized!");
        else {
            Menu.menuHazard.setPositionByCentre(Menu.HTPx, Menu.HTPy - MENU_CONFIG.HTPHazardDiscYOffset);
            Menu.menuHazard.draw(ctx, Menu.menuHazard.colour);
        }
        ctx.fillStyle = MENU_CONFIG.HTPTextColour;
        ctx.font = MENU_CONFIG.HTPTextFont;
        ctx.fillText(MENU_CONFIG.HTPHazardText, Menu.HTPx, Menu.HTPy + MENU_CONFIG.HTPHazardDiscYOffset);
        Menu.HTPy += Menu.HTPGapY;

        // draw the 3 lives explenation
        ctx.fillText(MENU_CONFIG.HTP3LivesText, Menu.HTPx, Menu.HTPy);
        Menu.HTPy += Menu.HTPGapY;

        // draw the pause instruction
        ctx.fillText(MENU_CONFIG.HTPPauseText, Menu.HTPx, Menu.HTPy);
        Menu.HTPy += Menu.HTPGapY;

        // draw the game objective description
        ctx.font = MENU_CONFIG.HTPObjectiveFont;
        ctx.fillText(MENU_CONFIG.HTPObjectiveText, Menu.HTPx, Menu.HTPy);
        Menu.HTPy += Menu.HTPGapY;

        // reset the Y position for the next frame
        Menu.HTPy = Menu.HTPStarty;
    }

    // draws the start game prompt
    static drawStartPrompt(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = MENU_CONFIG.startPromptTextColour;
        ctx.font = MENU_CONFIG.startPromptFont;
        ctx.textAlign = "center";
        ctx.fillText(MENU_CONFIG.startPrompt, Menu.centreX, Menu.centreY);
    }

    // draws the menu modifiers and their descriptions
    static drawModifierExplanations(ctx: CanvasRenderingContext2D) {
        // draw the menu modifiers
        if (!Menu.modifierManager) throw new Error("Menu.modifierManager has not been initialized!");
        else Menu.modifierManager.drawModifiers(ctx);
        // draw the descriptions
        ctx.font = MENU_CONFIG.modExFont;
        ctx.fillStyle = MENU_CONFIG.modExTextColour;
        ctx.textAlign = "left";
        let i = 0;
        for (const [modifierType, config] of Object.entries(MOD_GEN_INITS)) {
            ctx.fillText(config.description, 
                Menu.modExStartX + MENU_CONFIG.modExDescriptionXOffset, 
                Menu.modExStartY + i * Menu.modExGapY + 7);
            i++
        }
    }

    // draws the menu
    static draw(ctx: CanvasRenderingContext2D): void {
        drawBackground();
        Menu.drawStartPrompt(ctx);
        Menu.drawHowToPlay(ctx);
        Menu.drawModifierExplanations(ctx);
    }

    // reset's the menu
    static reset(): void {
        Menu.createMenuObjects();
    }
}
