import { VirtualFileSystem } from './filesystem.js';
import { ProcessManager } from './processes.js';
import { GameState } from '../types/game.js';
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

  constructor(filesystem: VirtualFileSystem, processManager: ProcessManager) {
    this.filesystem = filesystem;
    this.processManager = processManager;
    
    // Start with basic commands for tutorial
    this.availableCommands = new Set([
      'ls', 'cd', 'pwd', 'cat', 'head', 'ps', 'kill', 
      'find', 'grep', 'chmod', 'help', 'man', 'clear'
    ]);
  }

  async execute(input: string, gameState: GameState): Promise<CommandResult> {
    const parts = input.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    if (!this.availableCommands.has(command)) {
      return {
        output: chalk.red(`Command not found: ${command}. Type 'help' for available commands.`),
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
        case 'head':
          return this.head(args);
        case 'ps':
          return this.ps(args);
        case 'kill':
          return this.kill(args, gameState);
        case 'find':
          return this.find(args);
        case 'grep':
          return this.grep(args);
        case 'chmod':
          return this.chmod(args);
        case 'help':
          return this.help();
        case 'man':
          return this.man(args);
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

  private head(args: string[]): CommandResult {
    const lines = 10; // Default head lines
    
    if (args.length === 0) {
      return {
        output: chalk.red('head: missing operand'),
        success: false,
        energyCost: 1
      };
    }

    const file = this.filesystem.getFile(args[0]);
    if (!file) {
      return {
        output: chalk.red(`head: ${args[0]}: No such file`),
        success: false,
        energyCost: 2
      };
    }

    const content = file.content || '';
    const contentLines = content.split('\n').slice(0, lines).join('\n');

    return {
      output: contentLines,
      success: true,
      energyCost: 2
    };
  }

  private ps(args: string[]): CommandResult {
    const processes = this.processManager.listProcesses();
    let output = chalk.bold('PID  TYPE            THRT  CMD\n');

    for (const proc of processes) {
      const typeColor = proc.type === 'ZombieProcess' ? chalk.gray :
                       proc.type === 'LogLeech' ? chalk.yellow :
                       proc.type === 'ForkSprite' ? chalk.magenta :
                       proc.type === 'System' ? chalk.green : chalk.white;
      
      output += `${proc.pid.toString().padEnd(4)} ${typeColor(proc.type.padEnd(15))} `;
      output += `${proc.threatLevel.toString().padEnd(5)} ${proc.cmd}\n`;
    }

    return {
      output,
      success: true,
      energyCost: 3
    };
  }

  private kill(args: string[], gameState: GameState): CommandResult {
    if (args.length === 0) {
      return {
        output: chalk.red('kill: missing operand'),
        success: false,
        energyCost: 1
      };
    }

    const pid = parseInt(args[0]);
    if (isNaN(pid)) {
      return {
        output: chalk.red(`kill: ${args[0]}: invalid process id`),
        success: false,
        energyCost: 1
      };
    }

    const result = this.processManager.killProcess(pid);
    if (result.success) {
      return {
        output: chalk.green(`[OK] ${result.processType} terminated. Threat -${result.threatReduction} (now ${gameState.threatLevel - result.threatReduction})`),
        success: true,
        energyCost: 4
      };
    } else {
      return {
        output: chalk.red(`kill: (${pid}) - No such process`),
        success: false,
        energyCost: 2
      };
    }
  }

  private find(args: string[]): CommandResult {
    const nameIndex = args.indexOf('-name');
    if (nameIndex === -1 || nameIndex === args.length - 1) {
      return {
        output: chalk.red('find: -name option requires an argument'),
        success: false,
        energyCost: 1
      };
    }

    const pattern = args[nameIndex + 1];
    const files = this.filesystem.findFiles(pattern);
    
    let output = '';
    for (const file of files) {
      output += `${file.name}`;
      if (file.isCorrupted) output += chalk.red(' [CORRUPTED]');
      output += '\n';
    }

    return {
      output: output || `find: no files matching '${pattern}'`,
      success: true,
      energyCost: 5
    };
  }

  private grep(args: string[]): CommandResult {
    if (args.length < 2) {
      return {
        output: chalk.red('grep: missing pattern or file'),
        success: false,
        energyCost: 1
      };
    }

    const pattern = args[0];
    const filename = args[1];
    
    const file = this.filesystem.getFile(filename);
    if (!file) {
      return {
        output: chalk.red(`grep: ${filename}: No such file`),
        success: false,
        energyCost: 2
      };
    }

    const lines = (file.content || '').split('\n');
    const matches = lines.filter(line => line.includes(pattern));
    
    const output = matches.map(line => {
      const highlighted = line.replace(
        new RegExp(pattern, 'g'),
        chalk.red.bold(pattern)
      );
      return highlighted;
    }).join('\n');

    return {
      output: output || `grep: no matches for '${pattern}'`,
      success: true,
      energyCost: 3
    };
  }

  private chmod(args: string[]): CommandResult {
    if (args.length < 2) {
      return {
        output: chalk.red('chmod: missing operand'),
        success: false,
        energyCost: 1
      };
    }

    const mode = args[0];
    const filename = args[1];

    if (mode === '+x') {
      const success = this.filesystem.updateFilePermissions(filename, {
        owner: { read: true, write: true, execute: true }
      });

      if (success) {
        return {
          output: chalk.green(`[OK] Made ${filename} executable`),
          success: true,
          energyCost: 2
        };
      } else {
        return {
          output: chalk.red(`chmod: ${filename}: No such file`),
          success: false,
          energyCost: 1
        };
      }
    }

    return {
      output: chalk.red(`chmod: invalid mode: ${mode}`),
      success: false,
      energyCost: 1
    };
  }

  private help(): CommandResult {
    const output = chalk.bold('Available Commands:\n\n') +
      chalk.green('Navigation:\n') +
      '  ls [-la]        - List directory contents\n' +
      '  cd <dir>        - Change directory\n' +
      '  pwd             - Print working directory\n\n' +
      chalk.green('File Operations:\n') +
      '  cat <file>      - Display file contents\n' +
      '  head <file>     - Display first lines of file\n' +
      '  find -name <p>  - Find files matching pattern\n' +
      '  grep <p> <file> - Search pattern in file\n' +
      '  chmod +x <file> - Make file executable\n\n' +
      chalk.green('Process Management:\n') +
      '  ps              - List processes\n' +
      '  kill <pid>      - Terminate process\n\n' +
      chalk.green('Help:\n') +
      '  help            - Show this help\n' +
      '  man <command>   - Show command manual\n' +
      '  clear           - Clear screen\n';

    return {
      output,
      success: true,
      energyCost: 0
    };
  }

  private man(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        output: chalk.red('What manual page do you want?'),
        success: false,
        energyCost: 0
      };
    }

    const command = args[0];
    const manuals: Record<string, string> = {
      ls: 'NAME\n    ls - list directory contents\n\nSYNOPSIS\n    ls [OPTION]... [FILE]...\n\nDESCRIPTION\n    List information about files and directories.\n\nOPTIONS\n    -a    show hidden files\n    -l    use long listing format\n\nGAME TIP\n    Use ls -la to reveal hidden threats and corrupted files.',
      cd: 'NAME\n    cd - change directory\n\nSYNOPSIS\n    cd [DIRECTORY]\n\nDESCRIPTION\n    Change the current directory to DIRECTORY.\n    If no argument given, changes to root (/).\n\nGAME TIP\n    Navigate carefully - unexplored directories may contain threats.',
      ps: 'NAME\n    ps - report process status\n\nSYNOPSIS\n    ps\n\nDESCRIPTION\n    Display information about active processes.\n\nGAME TIP\n    Monitor threat levels - high threat processes should be terminated quickly.',
      kill: 'NAME\n    kill - terminate processes\n\nSYNOPSIS\n    kill PID\n\nDESCRIPTION\n    Send termination signal to process with given PID.\n\nGAME TIP\n    Killing processes reduces threat level and consumes energy.'
    };

    const manual = manuals[command];
    if (!manual) {
      return {
        output: chalk.red(`No manual entry for ${command}`),
        success: false,
        energyCost: 0
      };
    }

    return {
      output: manual,
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
}