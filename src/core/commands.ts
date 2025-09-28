import { VirtualFileSystem } from './filesystem.js';
import { GameState } from '../types/game.js';
import { messages } from '../i18n/messages.js';
import { formatWithMarkup, getFileColor, addHintKey } from '../utils/formatting.js';
import chalk from 'chalk';

export interface CommandResult {
  output: string;
  success: boolean;
  energyCost: number;
  shouldExit?: boolean;
}

interface TutorialHintInfo {
  description: string;
  key?: string;
}

export class CommandParser {
  private filesystem: VirtualFileSystem;
  private availableCommands: Set<string>;
  private locale: 'ja' | 'en';
  private tutorialProvider: (() => TutorialHintInfo | null) | null;
  private showHintKeys: boolean;

  constructor(filesystem: VirtualFileSystem, locale: 'ja' | 'en' = 'en') {
    this.filesystem = filesystem;
    this.locale = locale;
    
    // Start with basic commands for tutorial
    this.availableCommands = new Set([
      'ls', 'cd', 'pwd', 'cat', 'rm', 'help', 'clear'
    ]);
    this.tutorialProvider = null;
    this.showHintKeys = false;
  }

  async execute(input: string, _gameState: GameState): Promise<CommandResult> {
    const parts = input.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    if (!this.availableCommands.has(command)) {
      const msg = messages[this.locale as 'ja'];
      return {
        output: chalk.red(`${msg.commands.notFound}: ${command}. Type 'help' for available commands.`),
        success: false,
        energyCost: 1
      };
    }

    try {
      switch (command) {
        case 'ls':
          return this.ls(args);
        case 'cd':
          return this.cd(args);
        case 'pwd':
          return this.pwd();
        case 'cat':
          return this.cat(args);
        case 'rm':
          return await this.rm(args);
        case 'help':
          return this.help();
        case 'clear':
          return { output: '\x1Bc', success: true, energyCost: 0 };
        default:
          return {
            output: chalk.red(`Command not implemented: ${command}`),
            success: false,
            energyCost: 1
          };
      }
    } catch (error) {
      return {
        output: chalk.red(`Error executing ${command}: ${error}`),
        success: false,
        energyCost: 1
      };
    }
  }

  private ls(args: string[]): CommandResult {
    const showHidden = args.includes('-a') || args.includes('-la');
    const longFormat = args.includes('-l') || args.includes('-la');
    
    const items = this.filesystem.listDirectory();
    let output = '';

    for (const item of items) {
      if (!showHidden && item.name.startsWith('.')) {
        continue;
      }

      if (longFormat) {
        if (item.type === 'directory') {
          output += `drwxr-xr-x  agent cluster     - ${item.name}/\n`;
        } else {
          const file = item as any;
          const perms = this.formatPermissions(file.permissions);
          const size = file.size.toString().padStart(5);
          const color = getFileColor(file);
          output += `${perms} agent cluster ${size} ${color(file.name)}`;
          if (file.isCorrupted) output += chalk.red(' [CORRUPTED]');
          if (file.threatLevel) output += chalk.yellow(` [THREAT:${file.threatLevel}]`);
          output += '\n';
        }
      } else {
        if (item.type === 'directory') {
          output += `${item.name}/  `;
        } else {
          const file = item as any;
          const color = getFileColor(file);
          output += color(file.name) + '  ';
        }
      }
    }

    if (!longFormat) output += '\n';
    
    return {
      output: output || 'Directory is empty\n',
      success: true,
      energyCost: 2
    };
  }

  private cd(args: string[]): CommandResult {
    const path = args[0] || '/';
    const success = this.filesystem.changeDirectory(path);

    if (success) {
      return {
        output: '',
        success: true,
        energyCost: 1
      };
    } else {
      return {
        output: chalk.red(`cd: ${path}: No such directory`),
        success: false,
        energyCost: 1
      };
    }
  }

  private pwd(): CommandResult {
    return {
      output: this.filesystem.pwd(),
      success: true,
      energyCost: 1
    };
  }

  private cat(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        output: chalk.red('cat: missing operand'),
        success: false,
        energyCost: 1
      };
    }

    const file = this.filesystem.getFile(args[0]);
    if (!file) {
      return {
        output: chalk.red(`cat: ${args[0]}: No such file`),
        success: false,
        energyCost: 2
      };
    }

    if (file.type === 'directory') {
      return {
        output: chalk.red(`cat: ${args[0]}: Is a directory`),
        success: false,
        energyCost: 1
      };
    }

    let output = file.content || '';
    if (file.isCorrupted) {
      output = chalk.red(`[CORRUPTED FILE - THREAT LEVEL ${file.threatLevel}]\n`) + 
               chalk.gray(output);
    }

    return {
      output,
      success: true,
      energyCost: 2
    };
  }


  private async rm(args: string[]): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: chalk.red('rm: missing operand'),
        success: false,
        energyCost: 1
      };
    }

    const filename = args[0];
    const file = this.filesystem.getFile(filename);
    
    if (!file) {
      return {
        output: chalk.red(`rm: cannot remove '${filename}': No such file or directory`),
        success: false,
        energyCost: 2
      };
    }

    if (file.type === 'directory') {
      return {
        output: chalk.red(`rm: cannot remove '${filename}': Is a directory`),
        success: false,
        energyCost: 1
      };
    }

    // Remove the file
    const success = this.filesystem.deleteFile(filename);
    
    if (success) {
      // Display elimination animation
      const animationOutput = await this.displayEliminationAnimation();
      let output = animationOutput;
      output += chalk.green(`\n\n[OK] File '${filename}' removed successfully`);
      
      // Add special messages for enemy files
      if (filename === 'virus.exe' || filename === 'malware.dat') {
        output += chalk.green(`\n[MISSION UPDATE] Hostile file eliminated! Zone 1 is more secure.`);

        // Reduce threat level when enemy files are removed
        if (file.threatLevel) {
          output += chalk.green(`\nThreat level reduced by ${file.threatLevel}`);
        }

        // Check if zone2 is now unlocked
        if (this.filesystem.areAllHostileFilesDeleted()) {
          if (this.locale === 'ja') {
            output += chalk.cyan(`\n\n[システムアラート] 全ての敵対ファイルを排除完了！Zone 2ゲートウェイが起動しました！`);
          } else {
            output += chalk.cyan(`\n\n[SYSTEM ALERT] All hostile files eliminated! Zone 2 gateway activated!`);
          }
        }

        return {
          output,
          success: true,
          energyCost: 3
        };
      } else if ((filename === 'quantum_virus.exe') || (filename === 'data_corruptor.bin')) {

        if (this.locale === 'ja') {
          output += chalk.green(`\n\n[ミッション更新] 量子ウイルスを除去完了！`);
          output += chalk.yellow(`\n\n[警告] 量子ウイルスの削除により、歪んだディレクトリ構造が出現しました！`);
          output += chalk.cyan(`\n\n新しいディレクトリが .hidden 下に検出されました。`);
          output += chalk.cyan(`\nこの歪んだ空間を探索してください。`);
        } else {
          output += chalk.green(`\n\n[MISSION UPDATE] Quantum virus eliminated!`);
          output += chalk.yellow(`\n\n[WARNING] Quantum virus deletion has caused corrupted directory structures to appear!`);
          output += chalk.cyan(`\n\nNew directories detected under .hidden.`);
          output += chalk.cyan(`\nExplore this distorted space.`);
        }

        // Check if all zone2 files are deleted to show completion message
        if (this.filesystem.isZone2Completed()) {
          if (this.locale === 'ja') {
            output += chalk.green(`\nZone 2をクリアしました！`);
            output += chalk.cyan(`\n\nおめでとうございます！量子ブリーチ封じ込め成功！`);
            output += chalk.cyan(`\n\n[システムアラート] Zone 3ゲートウェイが起動しました！`);
            output += chalk.cyan(`\n新たなる深層エリアへのアクセスが可能になりました。`);
            output += chalk.cyan(`\n「cd /」でルートディレクトリに移動し、zone3を探索してください。`);
          } else {
            output += chalk.green(`\nZone 2 cleared!`);
            output += chalk.cyan(`\n\nCongratulations! Quantum breach containment successful!`);
            output += chalk.cyan(`\n\n[SYSTEM ALERT] Zone 3 gateway activated!`);
            output += chalk.cyan(`\nAccess to new deep layer areas is now available.`);
            output += chalk.cyan(`\nUse "cd /" to return to root directory and explore zone3.`);
          }
        }
      } else if (filename === 'system_leech.dll') {

        if (this.locale === 'ja') {
          output += chalk.cyan(`\n\n[ミッション更新] システムリーチを除去完了！`);
        } else {
          output += chalk.cyan(`\n\n[MISSION UPDATE] System leech eliminated!`);
        }

        // Check if all zone2 files are deleted to show completion message
        if (this.filesystem.isZone2Completed()) {
          if (this.locale === 'ja') {
            output += chalk.green(`\nZone 2をクリアしました！`);
            output += chalk.cyan(`\n\nおめでとうございます！量子ブリーチ封じ込め成功！`);
            output += chalk.cyan(`\n\n[システムアラート] Zone 3ゲートウェイが起動しました！`);
            output += chalk.cyan(`\n\n新たなる深層エリアへのアクセスが可能になりました。`);
            output += chalk.cyan(`\n「cd /」でルートディレクトリに移動し、zone3を探索してください。`);
          } else {
            output += chalk.green(`\nZone 2 cleared!`);
            output += chalk.cyan(`\n\nCongratulations! Quantum breach containment successful!`);
            output += chalk.cyan(`\n\n[SYSTEM ALERT] Zone 3 gateway activated!`);
            output += chalk.cyan(`\nAccess to new deep layer areas is now available.`);
            output += chalk.cyan(`\nUse "cd /" to return to root directory and explore zone3.`);
          }
        }

        // Reduce threat level when enemy files are removed
        if (file.threatLevel) {
          output += chalk.green(`\nThreat level reduced by ${file.threatLevel}`);
        }

        return {
          output,
          success: true,
          energyCost: 3
        };
      }

      return {
        output,
        success: true,
        energyCost: 3
      };
    } else {
      return {
        output: chalk.red(`rm: cannot remove '${filename}': Permission denied`),
        success: false,
        energyCost: 2
      };
    }
  }

  private help(): CommandResult {
    const msg = messages[this.locale as 'ja'];
    const tutorial = this.tutorialProvider ? this.tutorialProvider() : null;

    if (tutorial) {
      const description = tutorial.description.trim();
      const base = (value: string) => chalk.cyan(value);
      const emphasis = (value: string) => chalk.cyan.bold(value);
      let output = formatWithMarkup(description, base, emphasis);
      output = addHintKey(output, tutorial.key, this.showHintKeys);
      return {
        output,
        success: true,
        energyCost: 0
      };
    }

    const fallback = msg.help.noHints;

    const base = (value: string) => chalk.cyan(value);
    const emphasis = (value: string) => chalk.cyan.bold(value);
    return {
      output: formatWithMarkup(fallback, base, emphasis),
      success: true,
      energyCost: 0
    };
  }


  private formatPermissions(perms: any): string {
    const format = (p: any) => 
      `${p.read ? 'r' : '-'}${p.write ? 'w' : '-'}${p.execute ? 'x' : '-'}`;
    
    return `-${format(perms.owner)}${format(perms.group)}${format(perms.other)}`;
  }

  getAvailableCommands(): string[] {
    return Array.from(this.availableCommands);
  }

  setTutorialProvider(provider: (() => TutorialHintInfo | null) | null): void {
    this.tutorialProvider = provider;
  }

  setTutorialDebug(showKeys: boolean): void {
    this.showHintKeys = showKeys;
  }

  private async displayEliminationAnimation(): Promise<string> {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Display initial message
    process.stdout.write(chalk.cyan('\n>>> ELIMINATION IN PROGRESS <<<\n'));

    // Progressive progress bar
    const progressLength = 24;
    for (let i = 0; i <= progressLength; i++) {
      const filled = '█'.repeat(i);
      const empty = ' '.repeat(progressLength - i);
      const percentage = Math.round((i / progressLength) * 100);

      // Clear line and display progress
      process.stdout.write(`\r${chalk.cyan(`[${filled}${empty}] ${percentage}%`)}`);

      // Small delay for animation
      await sleep(50);
    }

    // Move to next line and add completion message
    process.stdout.write('\n' + chalk.cyan('>>> TARGET NEUTRALIZED <<<'));

    // Return empty string since we've already written to stdout
    return '';
  }

}
