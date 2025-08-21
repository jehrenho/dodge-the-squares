import { GAME_CONFIG, MODIFIER_TYPE, MOD_GEN_INITS, HAZ_GEN_INITS } from './config.js';
import { Player } from './player.js';
import { HazardManager, Hazard } from './hazardManager.js';
import { drawBackground } from './game.js';
import { ModifierManager } from './modifierManager.js';

export class Menu {
    static menuHazard: Hazard | null = null;
    static player: Player | null = null;
    static hazardManager: HazardManager | null = null;
    static modifierManager: ModifierManager | null = null;

    static HTPHorCentreFactor = 0.22;
    static HTPVerSizeFactor = 0.7;
    static HTPPlayerDiscYOffset = 25;
    static HTPHazardDiscYOffset = 30;

    static HTPx = 0;
    static HTPy = 0;
    static HTPGapY = 0;
    static HTPStarty = 0;

    // how much vertical space to fill with the modifier explanations
    // consider increasing if adding new modifiers
    static modExHorCentreFactor = 0.74;
    static modExVertSizeFactor = 0.7;
    static modExDescriptionXOffset = 140;

    static centreX = 0;
    static centreY = 0;
    static modExStartX = 0;
    static modExStartY = 0;
    static modExGapY = 0;

    // initializes the menu class
    static init(player: Player, hazardManager: HazardManager, modifierManager: ModifierManager) {
        // save references to the main game objects for encapsulation purposes
        Menu.player = player;
        Menu.hazardManager = hazardManager;
        Menu.modifierManager = modifierManager;

        // find the centre dimensions of the canvas
        Menu.centreX = GAME_CONFIG.VIRTUAL_WIDTH / 2;
        Menu.centreY = GAME_CONFIG.VIRTUAL_HEIGHT / 2;

        let numHTPInstructions = 6;
        let totalHTPHeight = Menu.HTPVerSizeFactor * GAME_CONFIG.VIRTUAL_HEIGHT;

        Menu.HTPGapY = totalHTPHeight / (numHTPInstructions - 1);
        Menu.HTPx = GAME_CONFIG.VIRTUAL_WIDTH * Menu.HTPHorCentreFactor;
        Menu.HTPStarty = Menu.centreY - (totalHTPHeight / 2)
        Menu.HTPy = Menu.HTPStarty;

        // calcs for the modifier explanation dimensions
        let numModifiers = Object.keys(MOD_GEN_INITS).length;
        let totalModExHeight = Menu.modExVertSizeFactor * GAME_CONFIG.VIRTUAL_HEIGHT;

        // sets the variables needed to print the modifier explanations
        Menu.modExGapY = totalModExHeight / (numModifiers - 1);
        Menu.modExStartY = Menu.centreY - (totalModExHeight / 2);
        Menu.modExStartX = GAME_CONFIG.VIRTUAL_WIDTH * Menu.modExHorCentreFactor;
        
        // create the menu objects that are live when the game starts
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
                Menu.modifierManager.createModifier(modifierType as MODIFIER_TYPE, Menu.modExStartX, Menu.modExStartY + i * Menu.modExGapY);
                i++
            }
        }
    }

    // draws the how to play instruction
    static drawHowToPlay(ctx: CanvasRenderingContext2D) {
        // draw the title
        ctx.font = "bold 26px Arial";
        ctx.textAlign = "center";
        ctx.fillText("How to Play", Menu.HTPx, 
            Menu.HTPy);
            console.log(Menu.HTPGapY);
        Menu.HTPy += Menu.HTPGapY;

        // draw the player square and description
        if (!Menu.player) throw new Error("Menu.player has not been initialized!");
        else {
            Menu.player.setPositionByCentre(Menu.HTPx, Menu.HTPy - Menu.HTPPlayerDiscYOffset);
            Menu.player.draw(ctx, Menu.player.colour);
        }
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.fillText("Move your green player square with the arrow keys", 
            Menu.HTPx, Menu.HTPy + Menu.HTPPlayerDiscYOffset);
        Menu.HTPy += Menu.HTPGapY;

        // draw a hazard square and description
        if (!Menu.menuHazard) throw new Error("Menu.menuHazard has not been initialized!");
        else {
            Menu.menuHazard.setPositionByCentre(Menu.HTPx, Menu.HTPy - Menu.HTPHazardDiscYOffset);
            Menu.menuHazard.draw(ctx, Menu.menuHazard.colour);
        }
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.fillText("Avoid the red hazard squares", Menu.HTPx, Menu.HTPy + Menu.HTPHazardDiscYOffset);
        Menu.HTPy += Menu.HTPGapY;

        // draw the 3 lives explenation
        ctx.fillText("You have 3 lives. Avoid hazards to keep them", Menu.HTPx, Menu.HTPy);
        Menu.HTPy += Menu.HTPGapY;

        // draw the pause instruction
        ctx.fillText("Press space to Pause", Menu.HTPx, Menu.HTPy);
        Menu.HTPy += Menu.HTPGapY;

        // draw the game objective description
        ctx.font = "20px Arial";
        ctx.fillText("SURVIVE AS LONG AS YOU CAN", Menu.HTPx, Menu.HTPy);
        Menu.HTPy += Menu.HTPGapY;

        // reset the Y position for the next frame
        Menu.HTPy = Menu.HTPStarty;
    }

    // draws the start game prompt
    static drawStartPrompt(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = GAME_CONFIG.fontColour;
        ctx.font = GAME_CONFIG.menuFont;
        ctx.textAlign = "center";
        ctx.fillText("Press Enter to Start Game", Menu.centreX, Menu.centreY);
    }

    // draws the menu modifiers and their descriptions
    static drawModifierExplanations(ctx: CanvasRenderingContext2D) {
        // draw the menu modifiers
        if (!Menu.modifierManager) throw new Error("Menu.modifierManager has not been initialized!");
        else Menu.modifierManager.drawModifiers(ctx);
        // draw the descriptions
        ctx.font = "18px Arial";
        ctx.textAlign = "left";
        let i = 0;
        for (const [modifierType, config] of Object.entries(MOD_GEN_INITS)) {
            // draw the descriptions
            ctx.fillStyle = GAME_CONFIG.fontColour;
            ctx.fillText(config.description, Menu.modExStartX + Menu.modExDescriptionXOffset, Menu.modExStartY + i * Menu.modExGapY + 7);
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
