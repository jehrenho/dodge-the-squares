Dodge the Squares Game


## Description
Dodge the Squares is a browser-based Javascript/Typescript game where players avoid moving obstacles as long as 
they can. 
The progressively increasing difficulty and variety of modifiers make dodge a fun challenge!


## Play the Game!
Visit https://jehrenho.github.io/dodge/ to play the game in your browser


## Features
- a How to Play screen helps new players learn the controls and game objective
    - The How to Play screen "comes to life" when the game starts
- Player can move up, down, left, and right within the game boundaries using the arrow keys
- Hazards are randomly generated and decrease the player's health when touched
- Modifiers change certain elements of the game to make the game fun and aesthetic 
    - The Enlarge Hazard modifier makes the hazards larger for a short period of time
    - The Shrink Hazard modifier makes the hazards smaller for a short period of time
    - The Ice Rink modifier significantly decreases the player's acceleration
    - The Invincibility modifier makes the player invincible for a short period of time
    - The Extra Life modifier gives the player an extra life
- The player's colour flashes when an effect is wearing off
- When the player collides with an object, the player and the object flash momentarily
- The game's difficulty logarithmically increases over time
- The game can be paused at any time by pressing the space key
- The time spent in game is recorded and reported to the player when the game is over
- The game automatically adjusts it's dimensions depending on the size of the window it is in


## Technologies
- Typecript/JavaScript
- HTML5 Canvas
- CSS


## File Structure

game.ts
Contains the main game loop that generates a single frame of the game.
Contains the GameState class that contains stores what phase the game is in and the game timer.

artist.ts
Contains the Artist class which is draws the game.

menu.ts 
Contains the Menu class which generates the menu.

collisionFlasher.ts
Contains the CollisionFlasher class which flashes game elements.

visibleShape.ts
Contains the abstract VisibleGameShape class that holds properties that all hazards, modifiers, and the player 
have in common

player.ts
Conatins the player class which represents the player square nad it's state.

hazardManager.ts
Contains the Hazard class which represents a single hazard in the game.
Contains the HazardManager class which generates, moves, and destroys all hazards in the game.

modifierManager.ts
Contains the Modifier class which represents a single modifier circle in the game.
Contains the ModifierGroup class which represents all modifiers of a specific type in the game.
Contains the ModifierManager class which generates, moves, and destroys all modifiers in the game.

modifierEffect.ts
Contains the ModifierEffect class which represents a single effect the player can have.

input.ts 
Contains the InputManager class which listens for user input and stores it's state.

config.ts
Contains all the configuration constants the game needs to function.


## Challenges

--- The Collision-Action Matrix --

PROBLEM: Every effect interacts with all the other effects in unique ways. For example, when the player 
collides with an Ice Rink effect:
    - the Ice Rink effect is activated if the player has no active effects
    - the Ice Rink effect does nothing if the player already has the invincibility effect
    - the Ice Rink effect resets the player's Ice Rink effect if the player already has the Ice Rink effect
    - the Ice Rink effect might stack with an effect that is implemented in future development
Effect interactions are complex and it would be difficult to hard code this logic.

SOLUTION: Create a strongly typed collision matrix that verbosely describes how to handle every effect interaction.
The collision matrix is implemented in the config.ts file. The matrix is declared and initialized such that:

collisionMatrix[role: CollisionRole][oldType: ModifierType][newType: ModifierType] 

is the action that must be taken for either an already active effect or a new effect upon the player colliding with
a new modifier where:
    -"role" specifies weather the action is for the new effect or the old effect
    -"oldType" is the type of an effect that is already active 
    -"newType" is the type of the new effect of a modifier the player just collided with

Implementing matrices like the collisionMatrix in Dodge The Squares requires a robust understanding of TypeScript
to create strongly typed iterable structures that scale easily.


## Future improvements
- Prevent the game from stretching when the window size is adjusted
- MODIFIER - blind (Black) - put up a blinder of some kind
- MODIFIER - RAIN (darker blue) - randomize the speed of the incoming hazards, dampens down to nothing
- MODIFIER - WAVE (very dark blue) - makes the hazards wave in the y dimension sinusodally, dampens down to nothing
- MODIFIER - SHIELD (silver) - gives the player a shield that pops some hazards
- Adjust modifier generation frequencies as a function of time survived
- Build a backend that allows players to submit their name and score to leaderboard
    - Add a submission field to the game over screen
    - Add the leaderboard to the Menu