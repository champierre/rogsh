# ShellQuest

Unix command-line learning roguelike game

## Overview

ShellQuest (rogsh) is an educational roguelike game that teaches Unix command-line skills through dungeon exploration. Players navigate a virtual filesystem-based dungeon using real Unix commands, battling corrupted processes and solving system problems.

## Installation

```bash
# Install dependencies
npm install

# Run in development mode (with intro animation skipped)
npm run dev

# Run with full intro animation
npm start

# Run directly with skip option
node dist/index-simple.js --skip-intro

# Build for production
npm run build
```

## How to Play

### Basic Commands

- `ls` - List directory contents
- `cd <dir>` - Change directory
- `pwd` - Print working directory
- `cat <file>` - Display file contents
- `ps` - List processes
- `kill <pid>` - Terminate process
- `help` - Show available commands
- `man <command>` - Show command manual

### Game Mechanics

- Each Unix command costs Energy Points (EP)
- Monitor your HP (System Integrity) and Threat Level
- Kill hostile processes to reduce threat
- Explore directories to find resources and complete objectives
- Follow the tutorial to learn the basics

## Game Status Display

```
rogsh:[HP=50 EP=40 THR=7 /srv/cluster/zone1]$
```

- **HP**: System Integrity (health)
- **EP**: Energy Points (action points)
- **THR**: Threat Level (danger level)
- **Path**: Current location in the filesystem

## Enemy Types

- **ZombieProcess**: Low HP, leaves threat if not killed
- **LogLeech**: Consumes disk space through log inflation
- **ForkSprite**: Spawns child processes over time

## Tips

- Conserve energy by using efficient commands
- Kill high-threat processes first
- Explore thoroughly to find hidden files and resources
- Read log files for clues about system problems
- Keep threat level below 20 to avoid game over

## Development

```bash
# Run tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## License

MIT