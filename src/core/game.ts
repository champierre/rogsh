import { GameState, GameEvent, Zone1Step, Zone2Step } from '../types/game.js';
import { VirtualFileSystem } from './filesystem.js';
import { CommandParser } from './commands.js';
import { SaveManager, SaveData } from './saveManager.js';
import { messages } from '../i18n/messages.js';
import { getLocale } from '../i18n/locale.js';
import chalk from 'chalk';
import * as readline from 'readline/promises';

export class Game {
  private state: GameState;
  private filesystem: VirtualFileSystem;
  private commandParser: CommandParser;
  private events: GameEvent[];
  private tutorialSteps: Zone1Step[];
  private zone2Steps: Zone2Step[];
  private currentTutorialStep: number;
  private currentZone2Step: number;
  private isTutorialMode: boolean;
  private isInZone2Mode: boolean;
  private locale: 'ja' | 'en';
  private saveManager: SaveManager;
  private completedZones: string[];
  private unlockedCommands: string[];

  constructor() {
    this.locale = getLocale();
    this.filesystem = new VirtualFileSystem(this.locale);
    this.commandParser = new CommandParser(this.filesystem, this.locale);
    this.saveManager = new SaveManager(this.locale);
    this.events = [];
    this.tutorialSteps = this.createZone1Steps();
    this.zone2Steps = this.createZone2Steps();
    this.currentTutorialStep = 0;
    this.currentZone2Step = 0;
    this.isTutorialMode = true;
    this.isInZone2Mode = false;
    this.completedZones = [];
    this.unlockedCommands = ['ls', 'cd', 'pwd', 'cat', 'rm', 'help', 'clear'];

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
      currentPath: '/',
      turnCount: 0,
      isGameOver: false,
      isPaused: false
    };
  }

  private createZone1Steps(): Zone1Step[] {
    const msg = messages[this.locale];
    return [
      {
        id: 'welcome',
        description: msg.zone1.welcome.description,
        expectedCommand: 'ls',
        hint: msg.zone1.welcome.hint
      },
      {
        id: 'explore_detailed',
        description: msg.zone1.exploreDetailed.description,
        expectedCommand: 'cd zone1',
        hint: msg.zone1.exploreDetailed.hint
      },
      {
        id: 'confirm_location',
        description: msg.zone1.confirmLocation.description,
        expectedCommand: 'ls',
        hint: msg.zone1.confirmLocation.hint
      },
      {
        id: 'read_readme',
        description: msg.zone1.readReadme.description,
        expectedCommand: 'cat README.txt',
        hint: msg.zone1.readReadme.hint
      },
      {
        id: 'navigate_to_tmp',
        description: msg.zone1.navigateToTmp.description,
        expectedCommand: 'cd tmp',
        hint: msg.zone1.navigateToTmp.hint
      },
      {
        id: 'confirm_tmp_location',
        description: msg.zone1.confirmTmpLocation.description,
        expectedCommand: 'ls',
        hint: msg.zone1.confirmTmpLocation.hint
      },
      {
        id: 'return_to_zone1',
        description: msg.zone1.returnToZone1.description,
        expectedCommand: 'rm virus.exe',
        hint: msg.zone1.returnToZone1.hint
      },
      {
        id: 'navigate_to_logs',
        description: msg.zone1.navigateToLogs.description,
        expectedCommand: 'cd ..',
        hint: msg.zone1.navigateToLogs.hint
      },
      {
        id: 'confirm_back_to_zone1',
        description: msg.zone1.confirmBackToZone1.description,
        expectedCommand: 'ls',
        hint: msg.zone1.confirmBackToZone1.hint
      },
      {
        id: 'scan_for_hidden',
        description: msg.zone1.scanForHidden.description,
        expectedCommand: 'cd logs',
        hint: msg.zone1.scanForHidden.hint
      },
      {
        id: 'confirm_logs_location',
        description: msg.zone1.confirmLogsLocation.description,
        expectedCommand: 'ls',
        hint: msg.zone1.confirmLogsLocation.hint
      },
      {
        id: 'enter_hidden_dir',
        description: msg.zone1.enterHiddenDir.description,
        expectedCommand: 'ls -a',
        hint: msg.zone1.enterHiddenDir.hint
      },
      {
        id: 'remove_malware',
        description: msg.zone1.removeMalware.description,
        expectedCommand: 'cd .hidden',
        hint: msg.zone1.removeMalware.hint
      },
      {
        id: 'confirm_hidden_location',
        description: msg.zone1.confirmHiddenLocation.description,
        expectedCommand: 'ls',
        hint: msg.zone1.confirmHiddenLocation.hint
      },
      {
        id: 'check_processes',
        description: msg.zone1.checkProcesses.description,
        expectedCommand: 'rm malware.dat',
        hint: msg.zone1.checkProcesses.hint
      },
      {
        id: 'tutorial_complete',
        description: msg.zone1.complete.description,
        expectedCommand: 'cd /',
        hint: msg.zone1.complete.hint
      },
      {
        id: 'move_to_root',
        description: msg.zone1.moveToRoot.description,
        expectedCommand: 'ls',
        hint: msg.zone1.moveToRoot.hint
      },
      {
        id: 'confirm_root_location',
        description: msg.zone1.confirmRootLocation.description,
        expectedCommand: 'cd zone2',
        hint: msg.zone1.confirmRootLocation.hint
      }
    ];
  }

  private createZone2Steps(): Zone2Step[] {
    const msg = messages[this.locale];
    return [
      {
        id: 'zone2_welcome',
        description: msg.zone2.welcome.description,
        expectedCommand: 'ls', // Add expected command to see available directories
        hint: msg.zone2.welcome.hint
      },
      {
        id: 'read_instructions',
        description: msg.zone2.readInstructions.description,
        expectedCommand: 'cat README.txt',
        hint: msg.zone2.readInstructions.hint
      },
      {
        id: 'follow_primes',
        description: msg.zone2.followPrimes.description,
        expectedCommand: 'cd 2',
        hint: msg.zone2.followPrimes.hint
      },
      {
        id: 'find_hidden',
        description: msg.zone2.findHidden.description,
        expectedCommand: 'ls -a',
        hint: msg.zone2.findHidden.hint
      },
      {
        id: 'eliminate_target',
        description: msg.zone2.eliminateTarget.description,
        expectedCommand: 'rm quantum_virus.exe',
        hint: msg.zone2.eliminateTarget.hint
      }
    ];
  }

  async processCommand(input: string): Promise<{output: string, shouldExit?: boolean, attackEffect?: 'medium' | 'high'}> {
    if (this.state.isGameOver) {
      return {output: chalk.red('Game Over. Restart to play again.')};
    }

    // Execute command
    const result = await this.commandParser.execute(input, this.state);

    // Check if we should exit (zone2 reached)
    if (result.shouldExit) {
      return {output: result.output, shouldExit: true, attackEffect: result.attackEffect};
    }

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
    } else if (this.isInZone2Mode) {
      this.checkZone2Progress(input);
    }

    // Check if entering zone2 for the first time (and zone2 is not completed)
    if (!this.isTutorialMode && !this.isInZone2Mode &&
        this.state.currentPath.startsWith('/zone2') &&
        !this.completedZones.includes('zone2')) {
      this.isInZone2Mode = true;
      this.currentZone2Step = 0;
      const step = this.zone2Steps[this.currentZone2Step];
      this.addEvent({
        type: 'tutorial',
        message: `\n${step.description}`,
        severity: 'info',
        timestamp: new Date()
      });
    }


    // Check game over conditions
    this.checkGameOver();

    return {output: result.output, attackEffect: result.attackEffect};
  }

  private processTurn(): void {
    // Regenerate energy
    this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + 2);

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
          message: `\n${nextStep.description}`,
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

  private checkZone2Progress(input: string): void {
    if (this.currentZone2Step >= this.zone2Steps.length) {
      return;
    }

    const currentStep = this.zone2Steps[this.currentZone2Step];

    // Check if the command matches the expected command for this step
    if (currentStep.expectedCommand && input.trim() === currentStep.expectedCommand) {
      this.currentZone2Step++;

      if (this.currentZone2Step < this.zone2Steps.length) {
        const nextStep = this.zone2Steps[this.currentZone2Step];
        this.addEvent({
          type: 'tutorial',
          message: `\n${nextStep.description}`,
          severity: 'info',
          timestamp: new Date()
        });
      } else {
        // Zone2 completed
        this.completeZone2();
      }
    }

    // Special handling for quantum virus deletion (can complete zone2 directly)
    if (input.trim() === 'rm quantum_virus.exe' && this.filesystem.isZone2Completed()) {
      this.completeZone2();
    }
  }

  private completeZone2(): void {
    this.isInZone2Mode = false;
    this.currentZone2Step = this.zone2Steps.length;

    if (!this.completedZones.includes('zone2')) {
      this.completedZones.push('zone2');
    }

    this.addEvent({
      type: 'tutorial',
      message: chalk.green.bold(`\n${messages[this.locale].zone2.complete.description}`),
      severity: 'success',
      timestamp: new Date()
    });
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

  getTutorialMessage(): { description: string; hint: string } | null {
    // Zone1 tutorial
    if (this.isTutorialMode && this.currentTutorialStep < this.tutorialSteps.length) {
      const step = this.tutorialSteps[this.currentTutorialStep];
      return {
        description: step.description,
        hint: step.hint || ''
      };
    }

    // Zone2 tutorial
    if (this.isInZone2Mode && this.currentZone2Step < this.zone2Steps.length) {
      const step = this.zone2Steps[this.currentZone2Step];
      return {
        description: step.description,
        hint: step.hint || ''
      };
    }

    return null;
  }

  getLastEvent(): GameEvent | null {
    return this.events.length > 0 ? this.events[this.events.length - 1] : null;
  }

  isInTutorial(): boolean {
    return this.isTutorialMode || this.isInZone2Mode;
  }

  setReadlineInterface(rl: readline.Interface): void {
    this.saveManager.setReadlineInterface(rl);
  }

  async loadFromSave(rl: readline.Interface): Promise<boolean> {
    this.saveManager.setReadlineInterface(rl);

    const saveExists = await this.saveManager.saveExists();
    if (!saveExists) {
      return false;
    }

    const shouldLoad = await this.saveManager.askToLoadSave();
    if (!shouldLoad) {
      return false;
    }

    const saveData = await this.saveManager.load();
    if (!saveData) {
      console.log(chalk.red('Failed to load save data.'));
      return false;
    }

    this.applyLoadedData(saveData);
    const successMessage = this.locale === 'ja'
      ? 'セーブデータを読み込みました。'
      : 'Progress loaded successfully!';
    console.log(chalk.green(successMessage));
    return true;
  }

  private applyLoadedData(saveData: SaveData): void {
    // Apply saved game state
    if (saveData.gameState) {
      this.state = {
        ...this.state,
        ...saveData.gameState,
        isGameOver: false,
        isPaused: false
      } as GameState;
    }

    // Apply tutorial progress
    this.currentTutorialStep = saveData.tutorialStep || 0;
    this.currentZone2Step = saveData.zone2Step || 0;
    this.isTutorialMode = saveData.isTutorialMode !== undefined ? saveData.isTutorialMode : true;
    this.isInZone2Mode = saveData.isInZone2Mode !== undefined ? saveData.isInZone2Mode : false;

    // Apply completed zones and unlocked commands
    this.completedZones = saveData.completedZones || [];
    this.unlockedCommands = saveData.unlockedCommands || ['ls', 'cd', 'pwd', 'cat', 'rm', 'help', 'clear'];

    // Restore filesystem state
    const deletedFiles = saveData.deletedHostileFiles || [];
    this.filesystem.setDeletedHostileFiles(deletedFiles);

    // Explicitly unlock zone2 if needed (handle backward compatibility)
    const isZone2Unlocked = saveData.isZone2Unlocked !== undefined
      ? saveData.isZone2Unlocked
      : this.filesystem.areAllHostileFilesDeleted();

    if (isZone2Unlocked && !this.filesystem.isZone2Unlocked()) {
      this.filesystem.unlockZone2();
    }

    // Update filesystem path if needed
    if (saveData.gameState?.currentPath) {
      this.filesystem.changeDirectory(saveData.gameState.currentPath);
    }
  }

  async saveProgress(): Promise<boolean> {
    // Mark zone1 as completed if tutorial is finished
    if (!this.isTutorialMode && !this.completedZones.includes('zone1')) {
      this.completedZones.push('zone1');
    }

    return await this.saveManager.save(
      this.state,
      this.currentTutorialStep,
      this.currentZone2Step,
      this.isTutorialMode,
      this.isInZone2Mode,
      this.completedZones,
      this.unlockedCommands,
      this.filesystem.getDeletedHostileFiles(),
      this.filesystem.isZone2Unlocked()
    );
  }

  getCompletedZones(): string[] {
    return [...this.completedZones];
  }

  getUnlockedCommands(): string[] {
    return [...this.unlockedCommands];
  }

  async setupDebugZone(zone: string): Promise<void> {
    switch (zone) {
      case 'zone1':
        // Reset to zone1 start
        this.isTutorialMode = true;
        this.isInZone2Mode = false;
        this.currentTutorialStep = 0;
        this.currentZone2Step = 0;
        this.completedZones = [];
        this.filesystem.changeDirectory('/');
        break;

      case 'zone2':
        // Set up for zone2 start
        this.isTutorialMode = false;
        this.isInZone2Mode = true;
        this.currentTutorialStep = this.tutorialSteps.length;
        this.currentZone2Step = 0;
        this.completedZones = ['zone1'];
        // Unlock zone2 and set deleted files to allow access
        this.filesystem.setDeletedHostileFiles(['virus.exe', 'malware.dat']);
        this.filesystem.unlockZone2();
        this.filesystem.changeDirectory('/zone2');
        break;

      case 'zone3':
        // Set up for zone3 start (future implementation)
        this.isTutorialMode = false;
        this.isInZone2Mode = false;
        this.currentTutorialStep = this.tutorialSteps.length;
        this.currentZone2Step = this.zone2Steps.length;
        this.completedZones = ['zone1', 'zone2'];
        // Unlock zone2 and set all hostile files as deleted
        this.filesystem.setDeletedHostileFiles(['virus.exe', 'malware.dat', 'quantum_virus.exe']);
        this.filesystem.unlockZone2();
        this.filesystem.changeDirectory('/');
        break;

      default:
        console.log(`Unknown zone: ${zone}. Defaulting to zone1.`);
        await this.setupDebugZone('zone1');
        break;
    }

    // Update current path in state
    this.state.currentPath = this.filesystem.pwd();
  }

}