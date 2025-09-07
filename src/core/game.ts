import { GameState, GameEvent, TutorialStep } from '../types/game.js';
import { VirtualFileSystem } from './filesystem.js';
import { ProcessManager } from './processes.js';
import { CommandParser } from './commands.js';
import { messages } from '../i18n/messages.js';
import { getLocale } from '../i18n/locale.js';
import chalk from 'chalk';

interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  rewards: {
    knowledge: number;
    commands?: string[];
  };
  isCompleted: boolean;
  isActive: boolean;
}

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
  private quests: Quest[];
  private currentQuest: Quest | null;

  constructor() {
    this.locale = getLocale();
    this.filesystem = new VirtualFileSystem(this.locale);
    this.processManager = new ProcessManager();
    this.commandParser = new CommandParser(this.filesystem, this.processManager, this.locale);
    this.commandParser.setGameInstance(this);
    this.events = [];
    this.tutorialSteps = this.createTutorialSteps();
    this.currentTutorialStep = 0;
    this.isTutorialMode = true;
    this.quests = this.createQuests();
    this.currentQuest = null;

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
        id: 'read_readme',
        title: msg.tutorial.readReadme.title,
        description: msg.tutorial.readReadme.description,
        expectedCommand: 'cat README.txt',
        hint: msg.tutorial.readReadme.hint
      },
      {
        id: 'navigate_to_tmp',
        title: msg.tutorial.navigateToTmp.title,
        description: msg.tutorial.navigateToTmp.description,
        expectedCommand: 'cd tmp',
        hint: msg.tutorial.navigateToTmp.hint
      },
      {
        id: 'remove_virus',
        title: msg.tutorial.removeVirus.title,
        description: msg.tutorial.removeVirus.description,
        expectedCommand: 'rm virus.exe',
        hint: msg.tutorial.removeVirus.hint
      },
      {
        id: 'return_to_zone1',
        title: msg.tutorial.returnToZone1.title,
        description: msg.tutorial.returnToZone1.description,
        expectedCommand: 'cd ..',
        hint: msg.tutorial.returnToZone1.hint
      },
      {
        id: 'navigate_to_logs',
        title: msg.tutorial.navigateToLogs.title,
        description: msg.tutorial.navigateToLogs.description,
        expectedCommand: 'cd logs',
        hint: msg.tutorial.navigateToLogs.hint
      },
      {
        id: 'scan_for_hidden',
        title: msg.tutorial.scanForHidden.title,
        description: msg.tutorial.scanForHidden.description,
        expectedCommand: 'ls -a',
        hint: msg.tutorial.scanForHidden.hint
      },
      {
        id: 'enter_hidden_dir',
        title: msg.tutorial.enterHiddenDir.title,
        description: msg.tutorial.enterHiddenDir.description,
        expectedCommand: 'cd .hidden',
        hint: msg.tutorial.enterHiddenDir.hint
      },
      {
        id: 'remove_malware',
        title: msg.tutorial.removeMalware.title,
        description: msg.tutorial.removeMalware.description,
        expectedCommand: 'rm malware.dat',
        hint: msg.tutorial.removeMalware.hint
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

  private createQuests(): Quest[] {
    const msg = messages[this.locale];
    return [
      {
        id: 'first',
        title: msg.quests.first.title,
        description: msg.quests.first.description,
        objectives: msg.quests.first.objectives,
        rewards: {
          knowledge: 10,
          commands: ['tail', 'du']
        },
        isCompleted: false,
        isActive: false
      },
      {
        id: 'deeperCorruption',
        title: msg.quests.deeperCorruption.title,
        description: msg.quests.deeperCorruption.description,
        objectives: msg.quests.deeperCorruption.objectives,
        rewards: {
          knowledge: 25,
          commands: ['netstat', 'ss']
        },
        isCompleted: false,
        isActive: false
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
        
        // Add zone2 navigation message after tutorial completion
        const msg = messages[this.locale];
        this.addEvent({
          type: 'system',
          message: chalk.cyan.bold(`\n[${msg.game.zone2Access}]`) + 
                   chalk.white(`\n\n${msg.game.zone2Navigation}`),
          severity: 'info',
          timestamp: new Date()
        });
        
        // Start the first quest after tutorial completion
        this.startQuest('first');
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

  startQuest(questId: string): boolean {
    const quest = this.quests.find(q => q.id === questId);
    if (!quest || quest.isCompleted) {
      return false;
    }

    // Deactivate current quest if any
    if (this.currentQuest) {
      this.currentQuest.isActive = false;
    }

    quest.isActive = true;
    this.currentQuest = quest;

    this.addEvent({
      type: 'quest',
      message: `\n${chalk.cyan.bold(`[クエスト開始]`)}\n${chalk.yellow.bold(quest.title)}\n${quest.description}\n\n${chalk.green('目標:')}\n${quest.objectives.map((obj, i) => `  ${i + 1}. ${obj}`).join('\n')}`,
      severity: 'info',
      timestamp: new Date()
    });

    // Unlock new commands if any
    if (quest.rewards.commands) {
      quest.rewards.commands.forEach(cmd => {
        this.commandParser.unlockCommand(cmd);
      });
    }

    return true;
  }

  getCurrentQuest(): Quest | null {
    return this.currentQuest;
  }

  getQuests(): Quest[] {
    return this.quests;
  }

  completeQuest(questId: string): boolean {
    const quest = this.quests.find(q => q.id === questId && q.isActive);
    if (!quest) {
      return false;
    }

    quest.isCompleted = true;
    quest.isActive = false;
    this.currentQuest = null;

    // Apply rewards
    this.state.knowledge += quest.rewards.knowledge;

    this.addEvent({
      type: 'quest',
      message: chalk.green.bold(`\n[クエスト完了] ${quest.title}\n知識ポイント獲得: ${quest.rewards.knowledge}`),
      severity: 'success',
      timestamp: new Date()
    });

    return true;
  }
}