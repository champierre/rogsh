#!/usr/bin/env node

import chalk from 'chalk';
import { Game } from './core/game.js';
import { messages } from './i18n/messages.js';
import { getLocale } from './i18n/locale.js';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

class ShellQuest {
  private game: Game;
  private rl: readline.Interface;
  private isRunning: boolean = true;
  private locale: 'ja' | 'en';

  constructor() {
    this.locale = getLocale();
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
    
    const msg = messages[this.locale];
    console.log(chalk.gray(`${msg.welcome.title}\n`));
    console.log(chalk.yellow(msg.welcome.description1));
    console.log(chalk.yellow(`${msg.welcome.description2}\n`));
    console.log(chalk.green(msg.welcome.helpHint));
    console.log(chalk.green(`${msg.welcome.exitHint}\n`));
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
    const msg = messages[this.locale];
    
    console.log(chalk.red.bold('\n════════════════════════════════'));
    console.log(chalk.red.bold(`           ${msg.game.gameOver}            `));
    console.log(chalk.red.bold('════════════════════════════════\n'));
    
    console.log(chalk.white(`${msg.game.finalStats}:`));
    console.log(chalk.gray(`  ${msg.game.turnsSurvived}: ${state.turnCount}`));
    console.log(chalk.gray(`  ${msg.game.knowledgeGained}: ${state.knowledge}`));
    console.log(chalk.gray(`  ${msg.game.finalThreatLevel}: ${state.threatLevel}`));
    console.log(chalk.gray(`  ${msg.game.depthReached}: ${state.currentDepth}\n`));
    
    console.log(chalk.yellow(`${msg.game.thankYou}\n`));
  }

  private exit(): void {
    const msg = messages[this.locale];
    console.log(chalk.cyan(`\n${msg.game.exitMessage}\n`));
    this.isRunning = false;
    this.rl.close();
  }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  const msg = messages[getLocale()];
  console.log(chalk.cyan(`\n\n${msg.game.exitMessage}\n`));
  process.exit(0);
});

// Start the game
const game = new ShellQuest();
game.start().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});