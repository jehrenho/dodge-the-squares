export const SCALING_CONFIG = {
    virtualWidth: 1912,
    virtualHeight: 954,
};

export const VIEWPORT_CONFIG = {
    letterboxColour: "black"
};

export const BACKGROUND_CONFIG = {
    backgroundColour: "moccasin",
};

export const STATUS_BAR_CONFIG = {
    fontColour: "black",
    font: "25px Arial"
};

export const PAUSE_CONFIG = {
    fontColour: "black",
    titleFont: "32px Arial",
    pauseTitle: "Game Paused",
    messageFont: "26px Arial",
    pauseMessage: "Press Space to Continue"
};

export const MENU_CONFIG = {
    HTPHorCentreFactor: 0.22, // aligns the how to play section horizontally
    HTPVerSizeFactor: 0.7, // sets the vertical size for the how to play section
    HTPPlayerDiscYOffset: 25, // set how far apart the player and player description is
    HTPHazardDiscYOffset: 30, // set how far apart the hazard and hazard description is
    numHTPInstructions: 6, // sets the how to play instruction spacing
    modExHorCentreFactor: 0.74, // aligns the modifier explanation section horizontally
    modExVertSizeFactor: 0.7, // sets the vertical size for the modifier explanation section
    modExDescriptionXOffset: 140, // sets the horizontal offset for the modifier description text
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
    modExFont: "18px Arial",
    modExTextColour: "black",
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
    gameOverPrompt: "Press Enter to continue",
    tableTitleFont: "29px Arial",
    tableHeaderFont: "22px Arial",
    tableHighScoreFont: "21px Arial",
    tableRowFont: "18px Arial",
    tableFontColour: "black",
    tablePlayerFontColour: "green",
    leaderboardTitle: "Leaderboard",
    rowSpacing: 40,
    titleSpacing: 22,
    headerSpacing: 5,
    columnSpacing: 165,
    windowWidthFactor: 0.2,
    numTopScores: 3
};