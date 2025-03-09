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