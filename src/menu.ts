import { GAME_CONFIG, MODIFIER_TYPE, MOD_GEN_INITS, HAZ_GEN_INITS, MENU_CONFIG } from './config.js';
import { Player } from './player.js';
import { HazardManager, Hazard } from './hazardManager.js';
import { Artist } from './artist.js';
import { ModifierManager } from './modifierManager.js';

// menu class for managing the game menu
export class Menu {
    static ctx: CanvasRenderingContext2D;
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

    // initializes the menu based on the size of the window
    static init(ctx: CanvasRenderingContext2D, player: Player, hazardManager: HazardManager, modifierManager: ModifierManager) {
        // save references to the main game objects for encapsulation
        Menu.ctx = ctx;
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
        else Menu.menuHazard = Menu.hazardManager.createHazard(0, 0, HAZ_GEN_INITS.w, HAZ_GEN_INITS.h, 
            HAZ_GEN_INITS.fillColour, HAZ_GEN_INITS.borderColour);
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
    static drawHowToPlay() {
        // draw the title
        Menu.ctx.font = MENU_CONFIG.HTPTitleFont;
        Menu.ctx.fillStyle = MENU_CONFIG.HTPTextColour;
        Menu.ctx.textAlign = "center";
        Menu.ctx.fillText(MENU_CONFIG.HTPTitle, Menu.HTPx, Menu.HTPy);
        Menu.HTPy += Menu.HTPGapY;

        // draw the player square
        if (!Menu.player) throw new Error("Menu.player has not been initialized!");
        else {
            Menu.player.setPositionByCentre(Menu.HTPx, Menu.HTPy - MENU_CONFIG.HTPPlayerDiscYOffset);
            Menu.player.draw(Menu.ctx);
        }
        // draw the player controls description
        Menu.ctx.fillStyle = MENU_CONFIG.HTPTextColour;
        Menu.ctx.font = MENU_CONFIG.HTPTextFont;
        Menu.ctx.fillText(MENU_CONFIG.HTPPlayerText, 
            Menu.HTPx, Menu.HTPy + MENU_CONFIG.HTPPlayerDiscYOffset);
        Menu.HTPy += Menu.HTPGapY;

        // draw a hazard square and description
        if (!Menu.menuHazard) throw new Error("Menu.menuHazard has not been initialized!");
        else {
            Menu.menuHazard.setPositionByCentre(Menu.HTPx, Menu.HTPy - MENU_CONFIG.HTPHazardDiscYOffset);
            Menu.menuHazard.draw(Menu.ctx);
        }
        Menu.ctx.fillStyle = MENU_CONFIG.HTPTextColour;
        Menu.ctx.font = MENU_CONFIG.HTPTextFont;
        Menu.ctx.fillText(MENU_CONFIG.HTPHazardText, Menu.HTPx, Menu.HTPy + MENU_CONFIG.HTPHazardDiscYOffset);
        Menu.HTPy += Menu.HTPGapY;

        // draw the 3 lives explenation
        Menu.ctx.fillText(MENU_CONFIG.HTP3LivesText, Menu.HTPx, Menu.HTPy);
        Menu.HTPy += Menu.HTPGapY;

        // draw the pause instruction
        Menu.ctx.fillText(MENU_CONFIG.HTPPauseText, Menu.HTPx, Menu.HTPy);
        Menu.HTPy += Menu.HTPGapY;

        // draw the game objective description
        Menu.ctx.font = MENU_CONFIG.HTPObjectiveFont;
        Menu.ctx.fillText(MENU_CONFIG.HTPObjectiveText, Menu.HTPx, Menu.HTPy);
        Menu.HTPy += Menu.HTPGapY;

        // reset the Y position for the next frame
        Menu.HTPy = Menu.HTPStarty;
    }

    // draws the start game prompt
    static drawStartPrompt() {
        Menu.ctx.fillStyle = MENU_CONFIG.startPromptTextColour;
        Menu.ctx.font = MENU_CONFIG.startPromptFont;
        Menu.ctx.textAlign = "center";
        Menu.ctx.fillText(MENU_CONFIG.startPrompt, Menu.centreX, Menu.centreY);
    }

    // draws the menu modifiers and their descriptions
    static drawModifierExplanations() {
        // draw the menu modifiers
        if (!Menu.modifierManager) throw new Error("Menu.modifierManager has not been initialized!");
        else Menu.modifierManager.drawModifiers(Menu.ctx);
        // draw the descriptions
        Menu.ctx.font = MENU_CONFIG.modExFont;
        Menu.ctx.fillStyle = MENU_CONFIG.modExTextColour;
        Menu.ctx.textAlign = "left";
        let i = 0;
        for (const [modifierType, config] of Object.entries(MOD_GEN_INITS)) {
            Menu.ctx.fillText(config.description,
                Menu.modExStartX + MENU_CONFIG.modExDescriptionXOffset,
                Menu.modExStartY + i * Menu.modExGapY + 7);
            i++
        }
    }

    // draws the menu
    static draw(): void {
        Artist.drawBackground();
        Menu.drawStartPrompt();
        Menu.drawHowToPlay();
        Menu.drawModifierExplanations();
    }

    // resets the menu
    static reset(): void {
        Menu.createMenuObjects();
    }
}