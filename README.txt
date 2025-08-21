Dodge Game

Dodge is a browser-based Javascript/Typescript game where players avoid moving obstacles as long as they can. 
The progressively increasing difficulty and variety of modifiers make dodge a fun challenge!

## Features
- a How to Play screen helps new players learn the controls and game objective
- Player can move left and right using arrow keys
- Hazards are randomly generated and decrease the player's health when touched
- Modifiers change certain elements of the game to make the game interesting and aesthetic 
    - The Enlarge Hazard modifier makes the hazards larger for a short period of time
    - The Shrink Hazard modifier makes the hazards smaller for a short period of time
    - The Ice Rink modifier significantly decreases the player's acceleration
    - The Invincibility modifier makes the player invincible for a short period of time
    - The Extra Life modifier gives the player an extra life
- Difficulty increases over time
- The time spent in game is recorded and reported to the player when the game is over
- The game automatically adjusts it's dimensions depending on the size of the window it is in

## Technologies
- Javascript
- Typecript
- HTML5 Canvas
- CSS

## Controls
- Arrow Left / Right / Up / Down: Move player
- Enter: Start game and return to menu

## Future improvements
- MODIFIER - blind (Black) - put up a blinder of some kind
- MODIFIER - RAIN (darker blue) - randomize the speed of the incoming hazards, dampens down to nothing
- MODIFIER - WAVE (very dark blue) - makes the hazards wave in the y dimension sinusodally, dampens down to nothing
- MODIFIER - SHIELD (silver) - gives the player a shield that pops some hazards
- Make the player colour flash before modifier effects ware off completely
- Add a backend and make a leaderboard