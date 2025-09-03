# Dodge the Squares Game

A browser-based game built with **TypeScript, JavaScript, HTML5 Canvas, and CSS**.  
Players dodge hazards and adapt to dynamic modifiers while difficulty ramps up over time!

This project demonstrates:  
- **Proficiency in TypeScript/JavaScript**  
- **Object-oriented design and modular architecture**  
- **Game loop and state management**  
- **Problem-solving with scalable systems** (collision-action matrix)

---

## 🎮 Play the Game!

[Play Dodge the Squares in your browser](https://jehrenho.github.io/dodge-game/)

---

## Features

- **Interactive tutorial:** “How to Play” screen introduces controls and objectives  
- **Responsive controls:** Move with arrow keys within game boundaries  
- **Dynamic hazards:** Randomly generated obstacles that damage player health  
- **Modifiers system:**  
  - **Enlarge Hazard:** temporary hazard size increase  
  - **Shrink Hazard:** temporary hazard size decrease  
  - **Ice Rink:** reduced acceleration  
  - **Invincibility:** temporary immunity  
  - **Extra Life:** grants bonus health  
- **Visual feedback:** Flash effects for collisions and modifier expiration  
- **Difficulty scaling:** Logarithmic increase in challenge over time  
- **Pause/resume:** Spacebar toggles pause  
- **Adaptive canvas:** Automatically resizes to fit the browser window  

---

## Technologies

- TypeScript / JavaScript  
- HTML5 Canvas  
- CSS  
- Git + Bash (via MinGW64) for version control  

---

## File Structure

DODGE/
├── client/                                 # Front-end source code and public assets
│   ├── public/                             # Static files served to the browser
│   │   ├── dist/                           # Bundled JS output from Rollup
│   │   └── index.html                      # Main HTML entry point
│   └── src/                                # TypeScript source files
│       ├── game/                           # Core game logic
│       │   ├── game-config.ts              # Game configuration constants
│       │   ├── game-states.ts              # Tracks current game state (time, score, etc.)
│       │   └── game.ts                     # Main game loop and orchestration
│       ├── graphics/                       # Graphics rendering and UI
│       │   ├── graphics-config.ts          # Graphics-related configuration (colors, fonts, dimensions)
│       │   ├── graphics.ts                 # Graphics renderer
│       │   ├── menu.ts                     # Menu rendering and logic
│       │   └── viewport.ts                 # Handles canvas scaling and viewport adjustments
│       ├── input/                          # Input handling
│       │   ├── input-config.ts             # Key/mouse bindings and input settings
│       │   └── input-manager.ts            # Processes and manages user input
│       └── world/                          # Game world entities and mechanics
│           ├── collision/                  # Collision handling
│           │   ├── collision-config.ts     # Collision-related constants and settings
│           │   ├── collision-flasher.ts    # Handles collision visual effects
│           │   └── collision-manager.ts    # Manages collision detection
│           ├── entities/                   # In game objects
│           │   ├── effect-manager.ts       # Handles visual effects for entities
│           │   ├── effect.ts               # Single effect class
│           │   ├── entities-config.ts      # Entity-specific constants
│           │   ├── hazard-manager.ts       # Manages hazards
│           │   ├── hazard.ts               # Hazard entity
│           │   ├── modifier-manager.ts     # Manages modifiers (power-ups/debuffs)
│           │   ├── modifier.ts             # Modifier entity
│           │   ├── player.ts               # Player entity
│           │   └── visibleShape.ts         # Base class for drawable shapes/entities
│           └── world.ts                    # World-level orchestration
├── server/                                 # Back-end server code
│   ├── dist/                               # Compiled JS output
│   └── src/                                # TypeScript source files
│       ├── config.ts                       # Server configuration constants
│       └── index.ts                        # Server entry point
├── package.json                            # npm dependencies and scripts
├── package-lock.json                       # Exact npm package versions
├── rollup.config.js                        # Front-end Rollup bundler configuration
├── tsconfig.json                           # TypeScript configuration for the project
├── server/tsconfig.json                    # TypeScript configuration for the server
└── README.md                               # Project documentation (this file)

---

## Challenges

### Collision-Action Matrix
Managing interactions between multiple simultaneous modifiers was a major design challenge.  
For example, colliding with an **Ice Rink** effect should:  
- Activate if no effect is active  
- Reset if Ice Rink is already active  
- Be ignored if Invincibility is active  

Hard-coding all cases would be unscalable.  

**Solution:** Implemented a strongly-typed collision–action matrix in `config.ts`, structured as:

```ts
collisionMatrix[role: CollisionRole][oldType: ModifierType][newType: ModifierType]
```

This approach ensures clarity, scalability, and type safety when adding new effects

### Collision Detection
Every frame, the game checks whether the **player square** collides with any of the **Hazard squares** or **Modifiers circles**

**Solution:** To handle this efficiently, two classic algorithms are used: 

- **AABB (Axis-Aligned Bounding Box)** → for player–hazard collisions 
- **Circle–AABB** → for player–modifier collisions 

This ensures fast, reliable collision checks even as the number of hazards and modifiers increases.

### Scaling
One of the main challenges I faced while developing this project was not planning for modularity early on. Initially, I wrote large, tightly coupled files without considering how to keep modules short, simple, and isolated. This made the code harder to maintain and extend. As the project grew, I had to refactor significant portions to improve encapsulation and decoupling, which ultimately led to a cleaner, more modular structure.

---

## Future Improvements

- New modifiers: 
  - Blind — temporary screen obstruction 
  - Rain — randomize hazard speed with gradual damping 
  - Wave — sinusoidal hazard movement with gradual damping 
  - Shield — temporary hazard resistance 
- Adjust modifier spawn frequency based on survival time. 
- Leaderboard backend with score submission and display.