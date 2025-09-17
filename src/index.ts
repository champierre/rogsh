#!/usr/bin/env node

import readline from 'readline';
import chalk from 'chalk';
import { Game } from './core/game.js';

class rogsh {
  private game: Game;
  private rl: readline.Interface;

  constructor() {
    this.game = new Game();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this.game.getPrompt(),
      terminal: true,
      historySize: 100
    });

    // Set raw mode for better input handling
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  }

  async start(): Promise<void> {
    this.displayWelcome();
    this.displayTutorial();
    
    // Ensure stdin is properly configured
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    this.rl.prompt();

    this.rl.on('line', async (input: string) => {
      // Clear any trailing characters
      const cleanInput = input.trim();
      
      if (cleanInput === 'exit' || cleanInput === 'quit') {
        this.exit();
        return;
      }

      // Process command
      const output = await this.game.processCommand(cleanInput);
      
      // Display output
      if (output) {
        console.log(output);
      }

      // Display any events
      const event = this.game.getLastEvent();
      if (event && event.type === 'tutorial') {
        // Display tutorial event in same format as displayTutorial
        this.displayTutorialEvent();
      }

      // Check if game is over
      if (this.game.getState().isGameOver) {
        this.displayGameOver();
        this.exit();
        return;
      }

      // Update and display prompt
      this.rl.setPrompt(this.game.getPrompt());
      this.rl.prompt();
    });

    this.rl.on('SIGINT', () => {
      this.exit();
    });
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
      // Display description in gray - handle multi-paragraph descriptions
      console.log();
      const paragraphs = tutorial.description.split('\n\n');
      for (const paragraph of paragraphs) {
        if (paragraph.trim()) {
          console.log(chalk.gray(paragraph.trim()));
          console.log();
        }
      }

      // Display hint in cyan if present with same format as Enter prompt
      if (tutorial.hint) {
        console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log(chalk.cyan.bold(`       ▶▶▶  ${tutorial.hint}  ◀◀◀       `));
        console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log();
      }
    }
  }

  private displayTutorialEvent(): void {
    const tutorial = this.game.getTutorialMessage();
    if (tutorial) {
      // Display description in gray - handle multi-paragraph descriptions
      console.log();
      const paragraphs = tutorial.description.split('\n\n');
      for (const paragraph of paragraphs) {
        if (paragraph.trim()) {
          console.log(chalk.gray(paragraph.trim()));
          console.log();
        }
      }

      // Display hint in cyan if present with same format as Enter prompt
      if (tutorial.hint) {
        console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log(chalk.cyan.bold(`       ▶▶▶  ${tutorial.hint}  ◀◀◀       `));
        console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log();
      }
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
    
    console.log(chalk.yellow('Thank you for playing rogsh!\n'));
  }

  private exit(): void {
    console.log(chalk.cyan('\nExiting rogsh. Goodbye!\n'));
    this.rl.close();
    process.exit(0);
  }
}

// Start the game
const game = new rogsh();
game.start().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});