import { GamePhase, GAME_CONFIG, MODIFIER_TYPE, MOD_GEN_INITS } from './config.js';
import { InputManager } from './input.js';
import { Player } from './player.js';
import { HazardManager } from './hazardManager.js';
import { GameState } from './game';

export class Menu {
    static howToStartX = 200;
    static howToStartY = 100;

    static modExStartY = 120;
    static modExGapY = 150;
    static modExStartX = 1400;
    static modExDescriptionOffsetX = 130;

    // initializes the menu
    static init(player: Player, hazardManager: HazardManager) {
        // TODO: dynamically centre the how to and mod descriptions based on the window size
    }

    // draws the menu
    static draw(ctx: CanvasRenderingContext2D, 
    player: Player, 
    inputManager: InputManager, 
    gameState: GameState): void {
        // draw the press enter to start prompt
        ctx.fillStyle = GAME_CONFIG.fontColour;
        ctx.font = GAME_CONFIG.menuFont;
        ctx.fillText("Press Enter to Start", GAME_CONFIG.VIRTUAL_WIDTH / 2 - 100, GAME_CONFIG.VIRTUAL_HEIGHT / 2);

        // draw the how to play poster
        ctx.font = "bold 24px Arial";
        ctx.fillText("How to Play", Menu.howToStartX, Menu.howToStartY);

        // draw the player square and description
        player.draw(ctx, player.colour);
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.fillText("Move your green player square with the arrow keys", 260, 180);

        // draw a hazard square and description
        ctx.fillStyle = "red";
        ctx.fillRect(190, 250, 50, 50);
        ctx.strokeStyle = "darkred";
        ctx.lineWidth = 1;
        ctx.strokeRect(190, 250, 50, 50);
        ctx.fillStyle = "black";
        ctx.fillText("Avoid the red hazard squares!", 260, 280);
        
        // draw the 3 lives explenation
        ctx.fillText("You have 3 lives. Avoid hazards to keep them!", 260, 400);

        // draw the game objective description
        ctx.fillText("SURVIVE AS LONG AS YOU CAN", 260, 480);

        // FUTURE: press space bar to pause the game

        let i = 0;
        // draw each modifier circle and description
        for (const [modifierType, config] of Object.entries(MOD_GEN_INITS)) {
            // fill the modifier circle
            ctx.beginPath();
            ctx.arc(Menu.modExStartX, Menu.modExStartY + i * Menu.modExGapY, config.radius, 0, Math.PI * 2);
            ctx.fillStyle = config.fillColour;
            ctx.fill();

            // draw the modifier outline
            ctx.strokeStyle = config.outlineColour;
            ctx.lineWidth = 2;
            ctx.stroke();

            // draw the description
            ctx.fillStyle = GAME_CONFIG.fontColour;
            ctx.fillText(config.description, Menu.modExStartX + Menu.modExDescriptionOffsetX, Menu.modExStartY + i * Menu.modExGapY + 7);
            i++
        }

        // start the game when Enter is pressed
        if (inputManager.isEnterPressedAndReleased()) gameState.setPhase(GamePhase.INGAME);
    }
}
