import { GameState, GameEvent, TutorialStep } from '../types/game.js';
import { VirtualFileSystem } from './filesystem.js';
import { ProcessManager } from './processes.js';
import { CommandParser } from './commands.js';
import chalk from 'chalk';

export class Game {
  private state: GameState;
  private filesystem: VirtualFileSystem;
  private processManager: ProcessManager;
  private commandParser: CommandParser;
  private events: GameEvent[];
  private tutorialSteps: TutorialStep[];
  private currentTutorialStep: number;
  private isTutorialMode: boolean;

  constructor() {
    this.filesystem = new VirtualFileSystem();
    this.processManager = new ProcessManager();
    this.commandParser = new CommandParser(this.filesystem, this.processManager);
    this.events = [];
    this.tutorialSteps = this.createTutorialSteps();
    this.currentTutorialStep = 0;
    this.isTutorialMode = true;

    this.state = {
      hp: 50,
      maxHp: 50,
      energy: 40,
      maxEnergy: 40,
      diskUsage: 30,
      maxDiskUsage: 100,
      threatLevel: 7,
      knowledge: 0,
      currentDepth: 1,
      currentPath: '/srv/cluster/zone1',
      turnCount: 0,
      isGameOver: false,
      isPaused: false
    };
  }

  private createTutorialSteps(): TutorialStep[] {
    return [
      {
        id: 'welcome',
        title: 'Welcome to ShellQuest',
        description: 'You are a maintenance agent in the Ω-Cluster. Your mission is to clean corrupted processes and restore system stability.\n\nFirst, let\'s explore your current location. Type "ls" to list files.',
        expectedCommand: 'ls',
        hint: 'Type: ls'
      },
      {
        id: 'explore_detailed',
        title: 'Detailed Exploration',
        description: 'Good! You can see several directories. Now use "ls -la" to see hidden files and detailed information.',
        expectedCommand: 'ls -la',
        hint: 'Type: ls -la'
      },
      {
        id: 'read_readme',
        title: 'Understanding Objectives',
        description: 'Let\'s read the zone objectives. Use "cat README.zone" to display the file contents.',
        expectedCommand: 'cat README.zone',
        hint: 'Type: cat README.zone'
      },
      {
        id: 'check_processes',
        title: 'Process Monitoring',
        description: 'There are hostile processes running. Use "ps" to list all processes.',
        expectedCommand: 'ps',
        hint: 'Type: ps'
      },
      {
        id: 'kill_zombie',
        title: 'Terminate Threat',
        description: 'The ZombieProcess (PID 114) is a threat. Use "kill 114" to terminate it.',
        expectedCommand: 'kill 114',
        hint: 'Type: kill 114'
      },
      {
        id: 'explore_logs',
        title: 'Investigate Logs',
        description: 'Good work! Now navigate to the logs directory. Use "cd logs" to change directory.',
        expectedCommand: 'cd logs',
        hint: 'Type: cd logs'
      },
      {
        id: 'check_errors',
        title: 'Check Error Log',
        description: 'Let\'s see what errors are occurring. Use "cat error.log" to read the error log.',
        expectedCommand: 'cat error.log',
        hint: 'Type: cat error.log'
      },
      {
        id: 'find_corrupted',
        title: 'Find Corrupted Files',
        description: 'The log mentions a corrupted file. Go back to zone1 with "cd .." then use "find -name corrupted.tmp" to locate it.',
        expectedCommand: 'find -name corrupted.tmp',
        hint: 'First type: cd .. then type: find -name corrupted.tmp'
      },
      {
        id: 'make_executable',
        title: 'Prepare Cleanup Script',
        description: 'Navigate to bin directory with "cd bin" and make cleanup.sh executable with "chmod +x cleanup.sh".',
        expectedCommand: 'chmod +x cleanup.sh',
        hint: 'First: cd bin, then: chmod +x cleanup.sh'
      },
      {
        id: 'tutorial_complete',
        title: 'Tutorial Complete!',
        description: 'Excellent! You\'ve learned the basics:\n- Navigation (ls, cd)\n- File reading (cat)\n- Process management (ps, kill)\n- File search (find)\n- Permissions (chmod)\n\nYou\'re ready to continue exploring the Ω-Cluster!',
        expectedCommand: '',
        hint: ''
      }
    ];
  }

  async processCommand(input: string): Promise<string> {
    if (this.state.isGameOver) {
      return chalk.red('Game Over. Restart to play again.');
    }

    // Execute command
    const result = await this.commandParser.execute(input, this.state);
    
    // Update game state
    this.state.energy = Math.max(0, this.state.energy - result.energyCost);
    this.state.turnCount++;
    
    // Update current path
    this.state.currentPath = this.filesystem.pwd();

    // Process turn effects
    this.processTurn();

    // Check tutorial progress
    if (this.isTutorialMode) {
      this.checkTutorialProgress(input);
    }

    // Update threat level from processes
    this.state.threatLevel = this.processManager.getTotalThreatLevel();

    // Check game over conditions
    this.checkGameOver();

    return result.output;
  }

  private processTurn(): void {
    // Regenerate energy
    this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + 2);

    // Process manager updates
    this.processManager.updateProcesses();

    // Random events
    if (Math.random() < 0.1 && !this.isTutorialMode) {
      this.triggerRandomEvent();
    }

    // Threat decay
    if (this.state.threatLevel > 0) {
      this.state.threatLevel = Math.max(0, this.state.threatLevel - 0.5);
    }
  }

  private checkTutorialProgress(input: string): void {
    if (this.currentTutorialStep >= this.tutorialSteps.length) {
      this.isTutorialMode = false;
      return;
    }

    const currentStep = this.tutorialSteps[this.currentTutorialStep];
    
    // Check if command matches expected
    if (currentStep.expectedCommand && input.trim() === currentStep.expectedCommand) {
      this.currentTutorialStep++;
      
      if (this.currentTutorialStep < this.tutorialSteps.length) {
        const nextStep = this.tutorialSteps[this.currentTutorialStep];
        this.addEvent({
          type: 'tutorial',
          message: `\n${chalk.cyan.bold(`[Tutorial: ${nextStep.title}]`)}\n${nextStep.description}`,
          severity: 'info',
          timestamp: new Date()
        });
      } else {
        this.isTutorialMode = false;
        this.addEvent({
          type: 'tutorial',
          message: chalk.green.bold('\n🎉 Tutorial Complete! You are now free to explore.'),
          severity: 'success',
          timestamp: new Date()
        });
      }
    }
  }

  private triggerRandomEvent(): void {
    const events = [
      'A new LogLeech process has spawned!',
      'Disk usage is increasing rapidly!',
      'System integrity degraded by 5 HP',
      'A corrupted file has been detected!'
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    this.addEvent({
      type: 'system',
      message: chalk.yellow(`[SYSTEM EVENT] ${event}`),
      severity: 'warning',
      timestamp: new Date()
    });

    // Apply event effects
    if (event.includes('LogLeech')) {
      this.processManager.spawnProcess('LogLeech', 3);
    } else if (event.includes('Disk usage')) {
      this.state.diskUsage = Math.min(this.state.maxDiskUsage, this.state.diskUsage + 10);
    } else if (event.includes('integrity')) {
      this.state.hp = Math.max(0, this.state.hp - 5);
    }
  }

  private checkGameOver(): void {
    if (this.state.hp <= 0) {
      this.state.isGameOver = true;
      this.addEvent({
        type: 'system',
        message: chalk.red.bold('SYSTEM PANIC: Integrity critical. Game Over.'),
        severity: 'error',
        timestamp: new Date()
      });
    }

    if (this.state.diskUsage >= this.state.maxDiskUsage) {
      this.state.isGameOver = true;
      this.addEvent({
        type: 'system',
        message: chalk.red.bold('DISK FULL: System unresponsive. Game Over.'),
        severity: 'error',
        timestamp: new Date()
      });
    }

    if (this.state.threatLevel >= 20) {
      this.state.isGameOver = true;
      this.addEvent({
        type: 'system',
        message: chalk.red.bold('THREAT CRITICAL: System compromised. Game Over.'),
        severity: 'error',
        timestamp: new Date()
      });
    }
  }

  private addEvent(event: GameEvent): void {
    this.events.push(event);
  }

  getPrompt(): string {
    const hp = chalk.green(`HP=${this.state.hp}`);
    const ep = chalk.yellow(`EP=${this.state.energy}`);
    const threat = this.state.threatLevel > 10 ? chalk.red(`THR=${this.state.threatLevel}`) :
                   this.state.threatLevel > 5 ? chalk.yellow(`THR=${this.state.threatLevel}`) :
                   chalk.green(`THR=${this.state.threatLevel}`);
    const path = chalk.cyan(this.state.currentPath);
    
    return `rogsh:[${hp} ${ep} ${threat} ${path}]$ `;
  }

  getState(): GameState {
    return { ...this.state };
  }

  getTutorialMessage(): string {
    if (!this.isTutorialMode || this.currentTutorialStep >= this.tutorialSteps.length) {
      return '';
    }

    const step = this.tutorialSteps[this.currentTutorialStep];
    return chalk.cyan.bold(`\n[Tutorial: ${step.title}]`) + '\n' + 
           step.description + '\n' +
           (step.hint ? chalk.gray(`Hint: ${step.hint}`) : '');
  }

  getLastEvent(): GameEvent | null {
    return this.events.length > 0 ? this.events[this.events.length - 1] : null;
  }

  isInTutorial(): boolean {
    return this.isTutorialMode;
  }
}