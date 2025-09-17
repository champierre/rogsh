#!/usr/bin/env node

import chalk from 'chalk';
import { Game } from './core/game.js';
import { messages } from './i18n/messages.js';
import { getLocale } from './i18n/locale.js';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

class rogsh {
  private game: Game;
  private rl: readline.Interface;
  private isRunning: boolean = true;
  private locale: 'ja' | 'en';
  private isDevelopmentMode: boolean;

  constructor() {
    this.locale = getLocale();
    this.isDevelopmentMode = process.argv.includes('--skip-intro') ||
                            process.argv.includes('--dev') ||
                            process.env.NODE_ENV === 'development';
    this.game = new Game();
    this.rl = readline.createInterface({
      input,
      output,
      terminal: true
    });
  }

  async start(): Promise<void> {
    // Set readline interface for save manager
    this.game.setReadlineInterface(this.rl);

    // Check for debug zone start options
    const startZoneArg = process.argv.find(arg => arg.startsWith('--start-zone='));
    if (startZoneArg) {
      const zone = startZoneArg.split('=')[1];
      await this.startFromZone(zone);
      return;
    }

    // Try to load save data
    const loadedFromSave = await this.game.loadFromSave(this.rl);

    if (!loadedFromSave) {
      if (!this.isDevelopmentMode) {
        await this.displayWelcome();
      } else {
        // Show minimal welcome for dev mode
        console.clear();
        console.log(chalk.cyan.bold('ROGSH - Development Mode'));
        console.log(chalk.gray('(演出スキップ済み)\n'));
      }

      await this.displayTutorial();
    } else {
      // If loaded from save, show current status
      const welcomeMessage = this.locale === 'ja'
        ? 'rogshへようこそ！'
        : 'Welcome back to rogsh!';
      const continueMessage = this.locale === 'ja'
        ? '前回の続きから開始します...'
        : 'Continuing from your saved progress...';
      console.log(chalk.cyan(`\n${welcomeMessage}`));
      console.log(chalk.gray(`${continueMessage}\n`));

      // Show tutorial if still in tutorial mode
      if (this.game.isInTutorial()) {
        await this.displayTutorial();
      }
    }
    
    while (this.isRunning) {
      try {
        // Display prompt and get input
        const prompt = this.game.getPrompt();
        const input = await this.rl.question(prompt);
        
        // Handle exit commands
        if (input.trim() === 'exit' || input.trim() === 'quit') {
          await this.exit();
          break;
        }

        // Process command
        const result = await this.game.processCommand(input.trim());

        // Handle attack effect if requested
        if (result.attackEffect) {
          await this.displayAttackEffect(result.attackEffect);
        }

        // Display output
        if (result.output) {
          console.log(result.output);
        }

        // Check if we should exit (zone2 reached)
        if (result.shouldExit) {
          await this.exit();
          break;
        }

        // Display any events
        const event = this.game.getLastEvent();
        if (event && event.type === 'tutorial') {
          // Display tutorial event in same format as displayTutorial
          await this.displayTutorialEvent();
        }

        // Check if game is over
        if (this.game.getState().isGameOver) {
          this.displayGameOver();
          await this.exit();
          break;
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Handle Ctrl+C
          await this.exit();
          break;
        }
        console.error(chalk.red('Error:'), error);
      }
    }
  }

  private async startFromZone(zone: string): Promise<void> {
    console.clear();
    console.log(chalk.cyan.bold(`ROGSH - Debug Mode: Starting from ${zone}`));
    console.log(chalk.gray('(デバッグモード)\n'));

    // Set up game state for the specified zone
    await this.game.setupDebugZone(zone);

    // Show tutorial if in tutorial mode
    if (this.game.isInTutorial()) {
      await this.displayTutorial();
    }

    // Start main game loop
    while (this.isRunning) {
      try {
        // Display prompt and get input
        const prompt = this.game.getPrompt();
        const input = await this.rl.question(prompt);

        // Handle exit commands
        if (input.trim() === 'exit' || input.trim() === 'quit') {
          await this.exit();
          break;
        }

        // Process command
        const result = await this.game.processCommand(input.trim());

        // Handle attack effect if requested
        if (result.attackEffect) {
          await this.displayAttackEffect(result.attackEffect);
        }

        // Display output
        if (result.output) {
          console.log(result.output);
        }

        // Check if we should exit
        if (result.shouldExit) {
          await this.exit();
          break;
        }

        // Display any events
        const event = this.game.getLastEvent();
        if (event && event.type === 'tutorial') {
          await this.displayTutorialEvent();
        }

        // Check if game is over
        if (this.game.getState().isGameOver) {
          this.displayGameOver();
          await this.exit();
          break;
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          await this.exit();
          break;
        }
        console.error(chalk.red('Error:'), error);
      }
    }
  }

  private async displayWelcome(): Promise<void> {
    console.clear();
    console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║       ██████╗  ██████╗  ██████╗ ███████╗██╗  ██╗     ║
║       ██╔══██╗██╔═══██╗██╔════╝ ██╔════╝██║  ██║     ║
║       ██████╔╝██║   ██║██║  ███╗███████╗███████║     ║
║       ██╔══██╗██║   ██║██║   ██║╚════██║██╔══██║     ║
║       ██║  ██║╚██████╔╝╚██████╔╝███████║██║  ██║     ║
║       ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
`));
    
    const msg = messages[this.locale];
    console.log(chalk.cyan(`${msg.welcome.title}\n`));
    
    // Wait for Enter before starting the briefing
    await this.waitForEnter();
    
    // Split description1 into paragraphs and display gradually
    const paragraphs = msg.welcome.description1.split('\n\n');
    
    // Display title with dramatic build-up effect
    const [title, ...story] = paragraphs;
    
    // Build-up effect with dots
    console.log();
    await this.sleep(500);
    process.stdout.write(chalk.cyan('システム初期化中'));
    for (let i = 0; i < 3; i++) {
      await this.sleep(500);
      process.stdout.write(chalk.cyan('.'));
    }
    await this.sleep(500);
    console.log();
    console.log();
    
    // Display security level warning
    await this.sleep(800);
    console.log(chalk.cyan.bold('警告: 最高機密情報'));
    await this.sleep(1200);
    console.log();
    
    // Display the title with dramatic effect
    for (let char of title) {
      process.stdout.write(chalk.cyan.bold(char));
      await this.sleep(50); // Slower reveal for title
    }
    console.log();
    console.log();
    await this.waitForEnter();
    
    // Display each paragraph with typewriter effect and wait for Enter
    for (let i = 0; i < story.length; i++) {
      // Add suspenseful lead-in for each paragraph
      await this.sleep(500);
      console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      await this.sleep(300);
      
      await this.typewriterEffect(story[i], chalk.cyan, 35);
      console.log();
      
      // Wait for Enter after each paragraph
      await this.waitForEnter();
    }
    
    // Dramatic pause before mission briefing
    console.log();
    await this.sleep(500);
    console.log(chalk.cyan('>>> ミッション詳細をロード中 <<<'));
    await this.sleep(1500);
    console.log();
    
    // Display description2 with typewriter effect
    await this.typewriterEffect(msg.welcome.description2, chalk.cyan, 25);
    console.log();
    
    console.log(chalk.green(msg.welcome.helpHint));
    console.log(chalk.green(`${msg.welcome.exitHint}\n`));
  }
  
  private async waitForEnter(): Promise<void> {
    console.log();
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    
    const msg = this.locale === 'ja' ?
      chalk.cyan.bold('       ▶▶▶  Enterキーを押して続ける  ◀◀◀       ') :
      chalk.cyan.bold('       ▶▶▶  Press Enter to continue  ◀◀◀       ');
    
    console.log(msg);
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    
    // Wait for Enter key press
    await this.rl.question('');
    
    // Clear the "Press Enter" message (5 lines up and clear them)
    process.stdout.write('\x1b[5A\x1b[J');
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async typewriterEffect(text: string, chalkFn: any, speed: number = 30): Promise<void> {
    const lines = text.split('\n');
    for (const line of lines) {
      // Regular typewriter effect for all text
      for (let i = 0; i < line.length; i++) {
        process.stdout.write(chalkFn(line[i]));
        await this.sleep(speed);
      }
      console.log(); // New line after each line
    }
  }

  private async displayTutorial(): Promise<void> {
    const tutorial = this.game.getTutorialMessage();
    if (tutorial) {
      await this.waitForEnter();

      // Display description with typewriter effect - handle multi-paragraph descriptions
      console.log();
      const paragraphs = tutorial.description.split('\n\n');
      for (const paragraph of paragraphs) {
        if (paragraph.trim()) {
          const speed = this.isDevelopmentMode ? 5 : 25;
          await this.typewriterEffect(paragraph.trim(), chalk.cyan, speed);
          console.log();
        }
      }

      // Display hint with typewriter effect in cyan if present
      if (tutorial.hint) {
        await this.sleep(300);
        console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        const hintSpeed = this.isDevelopmentMode ? 5 : 30;
        await this.typewriterEffect(`       ▶▶▶  ${tutorial.hint}  ◀◀◀       `, chalk.cyan.bold, hintSpeed);
        console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log();
      }
    }
  }

  private async displayTutorialEvent(): Promise<void> {
    const tutorial = this.game.getTutorialMessage();
    if (tutorial) {
      // Display description with typewriter effect - handle multi-paragraph descriptions
      console.log();
      const paragraphs = tutorial.description.split('\n\n');
      for (const paragraph of paragraphs) {
        if (paragraph.trim()) {
          const speed = this.isDevelopmentMode ? 5 : 25;
          await this.typewriterEffect(paragraph.trim(), chalk.cyan, speed);
          console.log();
        }
      }

      // Display hint with typewriter effect in cyan if present
      if (tutorial.hint) {
        await this.sleep(300);
        console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        const hintSpeed = this.isDevelopmentMode ? 5 : 30;
        await this.typewriterEffect(`       ▶▶▶  ${tutorial.hint}  ◀◀◀       `, chalk.cyan.bold, hintSpeed);
        console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log();
      }
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

  private async exit(): Promise<void> {
    // Save progress before exiting (only if not game over)
    if (!this.game.getState().isGameOver) {
      await this.game.saveProgress();
    }

    const msg = messages[this.locale];
    console.log(chalk.cyan(`\n${msg.game.exitMessage}\n`));
    this.isRunning = false;
    this.rl.close();
  }

  private async displayAttackEffect(intensity: 'medium' | 'high'): Promise<void> {
    if (intensity === 'medium') {
      console.log(chalk.cyan('>>> ELIMINATION IN PROGRESS <<<'));
      await this.sleep(500);

      // Animated progress bar
      await this.displayProgressBar('[', ']', 24);

      await this.sleep(300);
      console.log(chalk.cyan('>>> TARGET NEUTRALIZED <<<'));
      await this.sleep(500);
    } else {
      console.log(chalk.cyan.bold('>>> QUANTUM ELIMINATION PROTOCOL <<<'));
      await this.sleep(500);

      // Animated progress bar
      await this.displayProgressBar('[', ']', 30);

      await this.sleep(300);
      console.log(chalk.cyan('     ✦ * ✧ '));
      await this.sleep(200);
      console.log(chalk.cyan('   * ✦ BOOM ✧ *'));
      await this.sleep(200);
      console.log(chalk.cyan('     ✧ * ✦'));
      await this.sleep(300);
      console.log(chalk.cyan.bold('>>> QUANTUM VIRUS PURGED <<<'));
      await this.sleep(500);
    }

    console.log(); // Add newline after effect
  }

  private async displayProgressBar(start: string, end: string, length: number): Promise<void> {
    const progressChar = '█';
    const emptyChar = ' ';

    for (let i = 0; i <= length; i++) {
      const filled = progressChar.repeat(i);
      const empty = emptyChar.repeat(length - i);
      const percentage = Math.round((i / length) * 100);

      process.stdout.write(`\r${chalk.cyan(start + filled + empty + end)} ${chalk.cyan(percentage + '%')}`);

      // Slow down the progress animation
      await this.sleep(100);
    }

    console.log(); // Move to next line after progress bar completes
  }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  const msg = messages[getLocale()];
  console.log(chalk.cyan(`\n\n${msg.game.exitMessage}\n`));
  process.exit(0);
});

// Start the game
const game = new rogsh();
game.start().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});