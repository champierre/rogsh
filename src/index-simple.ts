#!/usr/bin/env node

import chalk from 'chalk';
import { Game } from './core/game.js';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

class ShellQuest {
  private game: Game;
  private rl: readline.Interface;
  private isRunning: boolean = true;

  constructor() {
    this.game = new Game();
    this.rl = readline.createInterface({ 
      input, 
      output,
      terminal: true
    });
  }

  async start(): Promise<void> {
    this.displayWelcome();
    this.displayTutorial();
    
    while (this.isRunning) {
      try {
        // Display prompt and get input
        const prompt = this.game.getPrompt();
        const input = await this.rl.question(prompt);
        
        // Handle exit commands
        if (input.trim() === 'exit' || input.trim() === 'quit') {
          this.exit();
          break;
        }

        // Process command
        const output = await this.game.processCommand(input.trim());
        
        // Display output
        if (output) {
          console.log(output);
        }

        // Display any events
        const event = this.game.getLastEvent();
        if (event && event.type === 'tutorial') {
          console.log(event.message);
        }

        // Check if game is over
        if (this.game.getState().isGameOver) {
          this.displayGameOver();
          this.exit();
          break;
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Handle Ctrl+C
          this.exit();
          break;
        }
        console.error(chalk.red('Error:'), error);
      }
    }
  }

  private displayWelcome(): void {
    console.clear();
    console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║      ███████╗██╗  ██╗███████╗██╗     ██╗             ║
║      ██╔════╝██║  ██║██╔════╝██║     ██║             ║
║      ███████╗███████║█████╗  ██║     ██║             ║
║      ╚════██║██╔══██║██╔══╝  ██║     ██║             ║
║      ███████║██║  ██║███████╗███████╗███████╗        ║
║      ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝        ║
║                                                       ║
║           ██████╗ ██╗   ██╗███████╗███████╗████████╗ ║
║          ██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝ ║
║          ██║   ██║██║   ██║█████╗  ███████╗   ██║    ║
║          ██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║    ║
║          ╚██████╔╝╚██████╔╝███████╗███████║   ██║    ║
║           ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
`));
    
    console.log(chalk.gray('Unix Command Learning Roguelike v0.1.0\n'));
    console.log(chalk.yellow('You are a maintenance agent in the Ω-Cluster.'));
    console.log(chalk.yellow('Navigate the filesystem dungeon using Unix commands.\n'));
    console.log(chalk.green('Type "help" for available commands.'));
    console.log(chalk.green('Type "exit" or "quit" to leave the game.\n'));
  }

  private displayTutorial(): void {
    const tutorial = this.game.getTutorialMessage();
    if (tutorial) {
      console.log(tutorial);
      console.log();
    }
  }

  private displayGameOver(): void {
    const state = this.game.getState();
    console.log(chalk.red.bold('\n════════════════════════════════'));
    console.log(chalk.red.bold('           GAME OVER            '));
    console.log(chalk.red.bold('════════════════════════════════\n'));
    
    console.log(chalk.white('Final Statistics:'));
    console.log(chalk.gray(`  Turns Survived: ${state.turnCount}`));
    console.log(chalk.gray(`  Knowledge Gained: ${state.knowledge}`));
    console.log(chalk.gray(`  Final Threat Level: ${state.threatLevel}`));
    console.log(chalk.gray(`  Depth Reached: ${state.currentDepth}\n`));
    
    console.log(chalk.yellow('Thank you for playing ShellQuest!\n'));
  }

  private exit(): void {
    console.log(chalk.cyan('\nExiting ShellQuest. Goodbye!\n'));
    this.isRunning = false;
    this.rl.close();
  }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log(chalk.cyan('\n\nExiting ShellQuest. Goodbye!\n'));
  process.exit(0);
});

// Start the game
const game = new ShellQuest();
game.start().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});