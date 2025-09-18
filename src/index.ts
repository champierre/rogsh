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
    this.game = new Game({ showHintKeys: this.isDevelopmentMode });
    this.rl = readline.createInterface({
      input,
      output,
      terminal: true,
      completer: this.tabCompleter.bind(this)
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


        // Display output
        if (result.output) {
          // Remove trailing newlines to avoid double spacing
          const trimmedOutput = result.output.replace(/\n+$/, '');
          console.log(trimmedOutput);
        }

        // Zone1の場合は自動的にヒントを表示（コマンド出力の後）
        // ただし、helpコマンドの場合は重複を避けるため表示しない
        const isHelpCommand = input.trim().toLowerCase() === 'help';
        const zone1Hint = this.game.getZone1HintFormatted();
        if (zone1Hint && !isHelpCommand) {
          console.log(); // コマンド出力とヒントの間に空行
          console.log(zone1Hint);
        }

        // Zone2の場合は初回のみヘルプ案内を表示
        const zone2Notification = this.game.getZone2HelpNotification();
        if (zone2Notification) {
          console.log(); // コマンド出力との間に空行
          console.log(zone2Notification);
        }

        // 常に空行を追加（コマンド実行後）
        if (result.output || zone1Hint || zone2Notification || result.success) {
          console.log();
        }

        // Check if we should exit (zone2 reached)
        if (result.shouldExit) {
          await this.exit();
          break;
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


        // Display output
        if (result.output) {
          // Remove trailing newlines to avoid double spacing
          const trimmedOutput = result.output.replace(/\n+$/, '');
          console.log(trimmedOutput);
        }

        // Zone1の場合は自動的にヒントを表示（コマンド出力の後）
        // ただし、helpコマンドの場合は重複を避けるため表示しない
        const isHelpCommand = input.trim().toLowerCase() === 'help';
        const zone1Hint = this.game.getZone1HintFormatted();
        if (zone1Hint && !isHelpCommand) {
          console.log(); // コマンド出力とヒントの間に空行
          console.log(zone1Hint);
        }

        // Zone2の場合は初回のみヘルプ案内を表示
        const zone2Notification = this.game.getZone2HelpNotification();
        if (zone2Notification) {
          console.log(); // コマンド出力との間に空行
          console.log(zone2Notification);
        }

        // 常に空行を追加（コマンド実行後）
        if (result.output || zone1Hint || zone2Notification || result.success) {
          console.log();
        }

        // Check if we should exit
        if (result.shouldExit) {
          await this.exit();
          break;
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
    
    console.log(this.formatWithMarkup(msg.welcome.helpHint,
      (text: string) => chalk.green(text),
      (text: string) => chalk.green.bold(text)));
    console.log(this.formatWithMarkup(msg.welcome.exitHint,
      (text: string) => chalk.green(text),
      (text: string) => chalk.green.bold(text)));
    console.log();
  }
  
  private async waitForEnter(): Promise<void> {
    // Hide cursor
    process.stdout.write('\x1b[?25l');

    // Start blinking ↵ symbol
    let blinkInterval: NodeJS.Timeout | null = null;
    let visible = true;

    const startBlinking = () => {
      // Initial display
      process.stdout.write(chalk.cyan('↵'));

      blinkInterval = setInterval(() => {
        // Move cursor back one character and either show or hide the symbol
        process.stdout.write('\x1b[1D');
        if (visible) {
          process.stdout.write(' ');
        } else {
          process.stdout.write(chalk.cyan('↵'));
        }
        visible = !visible;
      }, 500);
    };

    startBlinking();

    // Wait for Enter key press
    await this.rl.question('');

    // Stop blinking and clear the line
    if (blinkInterval) {
      clearInterval(blinkInterval);
    }

    // Show cursor again
    process.stdout.write('\x1b[?25h');

    // Clear the ↵ symbol (2 lines up and clear them)
    process.stdout.write('\x1b[2A\x1b[J');
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private formatWithMarkup(
    text: string,
    baseColor: (input: string) => string,
    emphasisColor: (input: string) => string
  ): string {
    const segments = text.split(/(\*\*[^*]+\*\*)/g);
    return segments
      .filter(segment => segment.length > 0)
      .map(segment => {
        if (segment.startsWith('**') && segment.endsWith('**')) {
          const inner = segment.slice(2, -2);
          return emphasisColor(inner);
        }
        return baseColor(segment);
      })
      .join('');
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

  private tabCompleter(line: string): [string[], string] {
    const parts = line.trim().split(/\s+/);
    const command = parts[0];
    const currentArg = parts[parts.length - 1] || '';

    // Get available commands from the game
    const availableCommands = this.game.getAvailableCommands();

    if (parts.length === 1) {
      // Complete command names
      const matches = availableCommands.filter((cmd: string) => cmd.startsWith(currentArg));
      return [matches, currentArg];
    } else if (command === 'cd' || command === 'ls' || command === 'cat' || command === 'rm') {
      // Complete file/directory names for these commands
      const matches = this.game.getFileCompletions(currentArg);
      return [matches, currentArg];
    }

    // No completions available
    return [[], currentArg];
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
