import { GameState, GameEvent, TutorialStep } from '../types/game.js';
import { VirtualFileSystem } from './filesystem.js';
import { ProcessManager } from './processes.js';
import { CommandParser } from './commands.js';
import { messages } from '../i18n/messages.js';
import { getLocale } from '../i18n/locale.js';
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
  private locale: 'ja' | 'en';

  constructor() {
    this.locale = getLocale();
    this.filesystem = new VirtualFileSystem(this.locale);
    this.processManager = new ProcessManager();
    this.commandParser = new CommandParser(this.filesystem, this.processManager, this.locale);
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
    const msg = messages[this.locale];
    return [
      {
        id: 'welcome',
        title: msg.tutorial.welcome.title,
        description: msg.tutorial.welcome.description,
        expectedCommand: 'ls',
        hint: msg.tutorial.welcome.hint
      },
      {
        id: 'explore_detailed',
        title: msg.tutorial.exploreDetailed.title,
        description: msg.tutorial.exploreDetailed.description,
        expectedCommand: 'ls -la',
        hint: msg.tutorial.exploreDetailed.hint
      },
      {
        id: 'read_readme',
        title: msg.tutorial.readReadme.title,
        description: msg.tutorial.readReadme.description,
        expectedCommand: 'cat README.zone',
        hint: msg.tutorial.readReadme.hint
      },
      {
        id: 'check_processes',
        title: msg.tutorial.checkProcesses.title,
        description: msg.tutorial.checkProcesses.description,
        expectedCommand: 'ps',
        hint: msg.tutorial.checkProcesses.hint
      },
      {
        id: 'kill_zombie',
        title: msg.tutorial.killZombie.title,
        description: msg.tutorial.killZombie.description,
        expectedCommand: 'kill 114',
        hint: msg.tutorial.killZombie.hint
      },
      {
        id: 'explore_logs',
        title: msg.tutorial.exploreLogs.title,
        description: msg.tutorial.exploreLogs.description,
        expectedCommand: 'cd logs',
        hint: msg.tutorial.exploreLogs.hint
      },
      {
        id: 'check_errors',
        title: msg.tutorial.checkErrors.title,
        description: msg.tutorial.checkErrors.description,
        expectedCommand: 'cat error.log',
        hint: msg.tutorial.checkErrors.hint
      },
      {
        id: 'find_corrupted',
        title: msg.tutorial.findCorrupted.title,
        description: msg.tutorial.findCorrupted.description,
        expectedCommand: 'find -name corrupted.tmp',
        hint: msg.tutorial.findCorrupted.hint
      },
      {
        id: 'make_executable',
        title: msg.tutorial.makeExecutable.title,
        description: msg.tutorial.makeExecutable.description,
        expectedCommand: 'chmod +x cleanup.sh',
        hint: msg.tutorial.makeExecutable.hint
      },
      {
        id: 'tutorial_complete',
        title: msg.tutorial.complete.title,
        description: msg.tutorial.complete.description,
        expectedCommand: '',
        hint: msg.tutorial.complete.hint
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
          message: chalk.green.bold(`\n${messages[this.locale].game.tutorialComplete}`),
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
    const msg = messages[this.locale];
    
    if (this.state.hp <= 0) {
      this.state.isGameOver = true;
      this.addEvent({
        type: 'system',
        message: chalk.red.bold(msg.game.systemPanic),
        severity: 'error',
        timestamp: new Date()
      });
    }

    if (this.state.diskUsage >= this.state.maxDiskUsage) {
      this.state.isGameOver = true;
      this.addEvent({
        type: 'system',
        message: chalk.red.bold(msg.game.diskFull),
        severity: 'error',
        timestamp: new Date()
      });
    }

    if (this.state.threatLevel >= 20) {
      this.state.isGameOver = true;
      this.addEvent({
        type: 'system',
        message: chalk.red.bold(msg.game.threatCritical),
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