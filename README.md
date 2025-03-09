# Dogfight

A simple 3D web game using Three.js. This is a browser-based 3D dogfighting game where players can control aircraft and engage in aerial combat.

## Features

- Minecraft-style minimal graphics
- Realistic WW2 Spitfire-style aircraft with:
  - Elliptical wings
  - Three-blade propeller
  - Cockpit and engine details
  - RAF roundels
- Procedurally generated terrain with:
  - Minecraft-style cube trees
  - Randomly placed rivers
- Third-person camera that follows the plane
- Keyboard controls for flying the plane

## Project Structure

The project is organized into separate frontend and (future) backend components:

- `/frontend/`: Contains the Three.js web application
- `/docs/`: Documentation files
  - `/prompt_history/`: Records of development prompts and actions
- Future backend will be added as needed

## Project Setup

This project uses:
- Three.js for 3D rendering
- Vite for development and building

### Installation

```bash
# Install frontend dependencies
cd frontend && npm install
```

### Development

```bash
# Run the frontend development server
cd frontend && npm run dev
```

### Building for Production

```bash
# Build frontend for production
cd frontend && npm run build

# Preview the production build
cd frontend && npm run preview
```

## Controls

- T: Increase speed
- G: Decrease speed
- Up Arrow: Pitch up
- Down Arrow: Pitch down
- Left Arrow: Roll left
- Right Arrow: Roll right
- Space: Fire bullets from wings
- C: Fire rockets from wings

## Documentation

The project maintains documentation of the development process:
- Prompt history files in `/docs/prompt_history/` record the development conversation
- Each file is numbered sequentially and contains user prompts and Claude's actions
- New history files are created when the current one exceeds 150 lines

## License

See the [LICENSE](LICENSE) file for details.