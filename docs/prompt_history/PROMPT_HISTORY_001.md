# Dogfight Prompt History

## Project Development History

### Initialize Three.js Repository

**User Prompt:**
We will be making a simple 3D web game using three.js; Initialize this repository accordingly, but don't create the game yet.

**Claude:**
- Initialized Node.js project with `npm init -y`
- Installed Three.js and Vite dependencies
- Created basic project structure with HTML/CSS/JS
- Updated package.json with proper scripts and metadata
- Created basic HTML structure with canvas setup
- Added main.js with Three.js import
- Added .gitignore for Node.js project
- Updated README.md with project details
- Created CLAUDE.md for project notes
- Committed changes

### Restructure Project

**User Prompt:**
We might need a backend at some point, so move the frontend into a "frontend" folder. Persist the following in your CLAUDE.md: - UPDATE README.md for significant features

## After Each Task
- MAINTAIN Linux line endings (LF, not CRLF)
- RUN linting and tests for significant changes
- GIT add and commit all changed files
- ENSURE newline at end of files

**Claude:**
- Created frontend directory
- Moved frontend files (index.html, package.json, package-lock.json, src)
- Created frontend/.gitignore
- Updated CLAUDE.md with new commands and project structure
- Updated README.md with new project organization
- Updated root .gitignore for multi-package structure
- Verified line endings
- Committed changes

### Documentation Rules

**User Prompt:**
Follow and persist the following rules: ## Documentation Rules
- PROMPT_HISTORY files are numbered sequentially (001, 002, etc.)
- CHECK file length BEFORE adding to prompt history
- CREATE new file when current exceeds 150 lines
- ALWAYS update prompt history with:
  1. Task heading (###)
  2. User prompt in "User Prompt:" section
  3. Claude's actions in "Claude:" section
- UPDATE README.md for significant features

**Claude:**
- Updated CLAUDE.md with documentation rules
- Created docs/prompt_history directory
- Created PROMPT_HISTORY_001.md with history of all tasks so far

### Implement Basic Dogfight Game

**User Prompt:**
Let's starting creating the game: The user controls a plane, the view is from outside the plane but follows it. Keep the graphics very minimal: "Minecraft" style, no texture, just the plane (World War 2 Spitfire style), the ground and the sky for now.

**Claude:**
- Implemented basic 3D game with Three.js
- Created a Minecraft-style WW2 Spitfire plane using basic geometries
- Added a flat green ground plane
- Added basic sky (blue background)
- Implemented keyboard controls (WASD/arrows for movement)
- Added camera that follows the plane from behind
- Added basic lighting
- Implemented animation loop with plane movement and camera updates

### Update Plane Controls

**User Prompt:**
Make the plane to always move forward. Controls: "T" to move faster, "G" to move slower. Up arrow to make the plane pitch up, Down arrow to pitch down, Left arrow to pitch left and Right arrow to pitch right.

**Claude:**
- Modified plane to always move forward at a constant speed
- Implemented T/G keys to increase/decrease speed
- Updated control scheme to use arrow keys for pitch and roll
- Added rotating propeller that spins based on plane speed
- Expanded ground size for longer flights
- Updated README with new control scheme

### Invert Left/Right Controls

**User Prompt:**
Invert left and right arrow controls

**Claude:**
- Inverted the left and right arrow controls for more intuitive rolling
- Left arrow now rolls right, right arrow now rolls left

### Add Weapons System

**User Prompt:**
Space bar makes the place fire bullets from the wings; "C" makes it fire a rocket, also from the wings

**Claude:**
- Implemented weapons system with bullets and rockets
- Added space bar control to fire bullets from both wings
- Added C key control to fire rockets from both wings
- Added cooldown system for both weapon types
- Created projectile physics with automatic cleanup
- Updated README with new weapon controls

### Fix Weapon Direction

**User Prompt:**
The bullets and rockets are going backwards. They should go forward.

**Claude:**
- Fixed the direction of bullets and rockets to travel forward
- Changed the projectile movement system to use direction vectors
- Added proper forward direction calculation based on plane orientation
- Ensured projectiles move in the correct direction regardless of plane rotation