# Dogfight Project Information

## Commands

### Development
```bash
# Run the development server
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Preview the production build
cd frontend && npm run preview
```

## Project Structure
- `/frontend/`: Frontend application
  - `/src/js/`: JavaScript source files
  - `/public/`: Static assets
  - `/dist/`: Production build (generated)

## Technology Stack
- Three.js for 3D rendering
- Vite for development and building

## Best Practices
- UPDATE README.md for significant features

### After Each Task
- MAINTAIN Linux line endings (LF, not CRLF)
- RUN linting and tests for significant changes
- GIT add and commit all changed files
- ENSURE newline at end of files

## Documentation Rules
- PROMPT_HISTORY files are numbered sequentially (001, 002, etc.)
- CHECK file length BEFORE adding to prompt history
- CREATE new file when current exceeds 150 lines
- ALWAYS update prompt history with:
  1. Task heading (###)
  2. User prompt in "User Prompt:" section
  3. Claude's actions in "Claude:" section
- UPDATE README.md for significant features