import { VirtualFileSystem } from './filesystem.js';
import { ProcessManager } from './processes.js';
import { GameState } from '../types/game.js';
import { messages } from '../i18n/messages.js';
import chalk from 'chalk';

export interface CommandResult {
  output: string;
  success: boolean;
  energyCost: number;
}

export class CommandParser {
  private filesystem: VirtualFileSystem;
  private processManager: ProcessManager;
  private availableCommands: Set<string>;
  private locale: 'ja' | 'en';
  private gameInstance: any; // Will be set by the Game class

  constructor(filesystem: VirtualFileSystem, processManager: ProcessManager, locale: 'ja' | 'en' = 'en') {
    this.filesystem = filesystem;
    this.processManager = processManager;
    this.locale = locale;
    
    // Start with basic commands for tutorial
    this.availableCommands = new Set([
      'ls', 'cd', 'pwd', 'cat', 'rm', 'help', 'clear',
      'quest', 'debug', 'debug-quest', 'debug-skip'
    ]);
  }

  async execute(input: string, gameState: GameState): Promise<CommandResult> {
    const parts = input.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    if (!this.availableCommands.has(command)) {
      const msg = messages[this.locale];
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
          return this.rm(args);
        case 'help':
          return this.help();
        case 'clear':
          return { output: '\x1Bc', success: true, energyCost: 0 };
        case 'quest':
          return this.quest(gameState);
        case 'debug':
          return this.debug();
        case 'debug-quest':
          return this.debugQuest(args, gameState);
        case 'debug-skip':
          return this.debugSkip(gameState);
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
          output += chalk.blue(`drwxr-xr-x  agent cluster     - ${item.name}/\n`);
        } else {
          const file = item as any;
          const perms = this.formatPermissions(file.permissions);
          const size = file.size.toString().padStart(5);
          const color = file.isCorrupted ? chalk.red : 
                        file.name.endsWith('.sh') ? chalk.green :
                        file.isHidden ? chalk.gray : chalk.white;
          output += `${perms} agent cluster ${size} ${color(file.name)}`;
          if (file.isCorrupted) output += chalk.red(' [CORRUPTED]');
          if (file.threatLevel) output += chalk.yellow(` [THREAT:${file.threatLevel}]`);
          output += '\n';
        }
      } else {
        if (item.type === 'directory') {
          output += chalk.blue(`${item.name}/  `);
        } else {
          const file = item as any;
          const color = file.isCorrupted ? chalk.red : 
                        file.name.endsWith('.sh') ? chalk.green :
                        file.isHidden ? chalk.gray : chalk.white;
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
      const newPath = this.filesystem.pwd();
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


  private rm(args: string[]): CommandResult {
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
      let output = chalk.green(`[OK] File '${filename}' removed successfully`);
      
      // Add special messages for enemy files
      if (filename === 'virus.exe' || filename === 'malware.dat') {
        output += chalk.cyan(`\n[MISSION UPDATE] Hostile file eliminated! Zone 1 is more secure.`);
        
        // Reduce threat level when enemy files are removed
        if (file.threatLevel) {
          output += chalk.green(`\nThreat level reduced by ${file.threatLevel}`);
        }
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
    const msg = messages[this.locale];
    const output = chalk.bold(`${msg.help.title}\n\n`) +
      chalk.green(`${msg.help.navigation}\n`) +
      `  ls [-a]         - ${msg.help.commands.ls}\n` +
      `  cd <dir>        - ${msg.help.commands.cd}\n` +
      `  pwd             - ${msg.help.commands.pwd}\n\n` +
      chalk.green(`${msg.help.fileOperations}\n`) +
      `  cat <file>      - ${msg.help.commands.cat}\n` +
      `  rm <file>       - ${msg.help.commands.rm}\n\n` +
      chalk.green(`${msg.help.helpSection}\n`) +
      `  help            - ${msg.help.commands.help}\n` +
      `  clear           - ${msg.help.commands.clear}\n` +
      `  quest           - ${msg.help.commands.quest}\n\n` +
      chalk.green(`Debug Commands:\n`) +
      `  debug           - ${msg.help.commands.debug}\n` +
      `  debug-quest <id> - ${msg.help.commands['debug-quest']}\n` +
      `  debug-skip      - ${msg.help.commands['debug-skip']}\n`;

    return {
      output,
      success: true,
      energyCost: 0
    };
  }


  private formatPermissions(perms: any): string {
    const format = (p: any) => 
      `${p.read ? 'r' : '-'}${p.write ? 'w' : '-'}${p.execute ? 'x' : '-'}`;
    
    return `-${format(perms.owner)}${format(perms.group)}${format(perms.other)}`;
  }

  unlockCommand(command: string): void {
    this.availableCommands.add(command);
  }

  getAvailableCommands(): string[] {
    return Array.from(this.availableCommands);
  }

  setGameInstance(gameInstance: any): void {
    this.gameInstance = gameInstance;
  }

  private quest(gameState: GameState): CommandResult {
    const msg = messages[this.locale];
    
    if (!this.gameInstance) {
      return {
        output: chalk.red('Quest system not available'),
        success: false,
        energyCost: 0
      };
    }

    const currentQuest = this.gameInstance.getCurrentQuest();
    
    if (currentQuest) {
      return {
        output: `${chalk.cyan.bold(`[進行中のクエスト]`)}\n${chalk.yellow.bold(currentQuest.title)}\n${currentQuest.description}\n\n${chalk.green('目標:')}\n${currentQuest.objectives.map((obj: string, i: number) => `  ${i + 1}. ${obj}`).join('\n')}`,
        success: true,
        energyCost: 0
      };
    } else {
      return {
        output: chalk.blue(msg.quests.noActiveQuest),
        success: true,
        energyCost: 0
      };
    }
  }

  private debug(): CommandResult {
    const msg = messages[this.locale];
    return {
      output: chalk.yellow(`${msg.debug.debugMode}\n${msg.debug.questList}`),
      success: true,
      energyCost: 0
    };
  }

  private debugQuest(args: string[], gameState: GameState): CommandResult {
    const msg = messages[this.locale];
    
    if (!this.gameInstance) {
      return {
        output: chalk.red('Quest system not available'),
        success: false,
        energyCost: 0
      };
    }

    if (args.length === 0) {
      return {
        output: chalk.yellow(msg.debug.questList),
        success: true,
        energyCost: 0
      };
    }

    const questId = args[0];
    const success = this.gameInstance.startQuest(questId);
    
    if (success) {
      return {
        output: chalk.green(msg.debug.questStarted.replace('{questId}', questId)),
        success: true,
        energyCost: 0
      };
    } else {
      return {
        output: chalk.red(msg.debug.invalidQuest),
        success: false,
        energyCost: 0
      };
    }
  }

  private debugSkip(gameState: GameState): CommandResult {
    const msg = messages[this.locale];
    return {
      output: chalk.green(msg.debug.questSkipped),
      success: true,
      energyCost: 0
    };
  }
}