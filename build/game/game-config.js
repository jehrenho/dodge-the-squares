;
export const GAME_STATE_CONFIG = {
    fps: 60,
    fpm: 3600
};
// game configuration constants
export const GAME_CONFIG = {
    backgroundColour: "moccasin",
    letterboxColour: "black",
    fontColour: "black",
    menuFont: "25px Arial",
    statusBarFont: "25px Arial",
    pausedFontColour: "black",
    pausedFont: "25px Arial",
    VIRTUAL_WIDTH: 1912,
    VIRTUAL_HEIGHT: 954,
    pauseTitle: "Game Paused",
    pauseMessage: "Press Space to Continue",
};
// input event types
export var InputEventType;
(function (InputEventType) {
    InputEventType["KEYDOWN"] = "keydown";
    InputEventType["KEYUP"] = "keyup";
    InputEventType["RESIZE"] = "resize";
})(InputEventType || (InputEventType = {}));
// keyboard keys
export const KEYS = {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    ENTER: "Enter",
    SPACE: " "
};
// menu constants
export const MENU_CONFIG = {
    // How to Play constants
    HTPHorCentreFactor: 0.22, // aligns the how to play section horizontally
    HTPVerSizeFactor: 0.7, // sets the vertical size for the how to play section
    HTPPlayerDiscYOffset: 25, // set how far apart the player and player description is
    HTPHazardDiscYOffset: 30, // set how far apart the hazard and hazard description is
    numHTPInstructions: 6, // sets the how to play instruction spacing
    // modifier explanation constants
    modExHorCentreFactor: 0.74, // aligns the modifier explanation section horizontally
    modExVertSizeFactor: 0.7, // sets the vertical size for the modifier explanation section
    modExDescriptionXOffset: 140, // sets the horizontal offset for the modifier description text
    // How to Play font size, colour, and descriptions
    HTPTitle: "How to Play",
    HTPTitleFont: "bold 26px Arial",
    HTPTextFont: "18px Arial",
    HTPTextColour: "black",
    HTPPlayerText: "Move your green player square with the arrow keys",
    HTPHazardText: "Avoid the red hazard squares",
    HTP3LivesText: "You have 3 lives - avoid hazards to keep them",
    HTPPauseText: "Press space to pause the game",
    HTPObjectiveText: "Survive as long as you can",
    HTPObjectiveFont: "bold 21px Arial",
    // modifier description font size and colour
    modExFont: "18px Arial",
    modExTextColour: "black",
    // start prompt font size, colour, and description
    startPrompt: "Press Enter to Start Game",
    startPromptFont: "20px Arial",
    startPromptTextColour: "black",
    titleTextColour: "black",
    titleFont: "bold 36px Arial",
    titleText: "Dodge the Squares",
    titleYScale: 0.1
};
export const GAME_OVER_CONFIG = {
    fontColour: "black",
    titleFont: "32px Arial",
    gameOverTitle: "Game Over",
    messagingFont: "26px Arial",
    gameOverMessage: "You Survived for: {time}s",
    promptFont: "20px Arial",
    gameOverPrompt: "Press Enter to continue"
};
