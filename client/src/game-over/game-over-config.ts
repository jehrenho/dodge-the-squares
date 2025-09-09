export const enum GameOverPhase { 
    WAITING_FOR_RANK,
    NAME_INPUT,
    SUBMITTING,
    WAITING_TO_CONTINUE
};

export const GAME_OVER_CONFIG = {
    fontColour: "black",
    titleFont: "34px Arial",
    gameOverTitle: "Game Over",
    messagingFont: "26px Arial",
    gameOverMessage: "You Survived for: {time}s",
    promptFont: "20px Arial",
    gameOverPrompt: "Press Enter to continue",
    mainTitleHeightFactor: 0.2,
    mainScoreSpacing: 40,
    continuePromptSpacing: 80,
    continuePromptFont: "20px Arial",
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