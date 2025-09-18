import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { GameState, GameProgressFlags } from '../types/game.js';
import chalk from 'chalk';
import * as readline from 'readline/promises';

export interface SaveData {
  version: string;
  timestamp: string;
  gameState: Partial<GameState>;
  completedZones: string[];
  deletedHostileFiles: string[];
  isZone2Unlocked: boolean;
  eventFlags?: GameProgressFlags & { hasEnteredZone1?: boolean };
  tutorialStep?: number;
  zone2Step?: number;
  isTutorialMode?: boolean;
  isInZone2Mode?: boolean;
}

export class SaveManager {
  private saveFileName = '.rogsh_save.json';
  private saveFilePath: string;
  private rl: readline.Interface | null = null;
  private locale: 'ja' | 'en';

  constructor(locale: 'ja' | 'en' = 'en') {
    this.locale = locale;
    // Save file in user's home directory
    this.saveFilePath = path.join(os.homedir(), this.saveFileName);
  }

  setReadlineInterface(rl: readline.Interface): void {
    this.rl = rl;
  }

  async saveExists(): Promise<boolean> {
    try {
      await fs.access(this.saveFilePath);
      return true;
    } catch {
      return false;
    }
  }

  async askPermissionToSave(): Promise<boolean> {
    if (!this.rl) {
      console.error(chalk.red('Readline interface not set'));
      return false;
    }

    const exists = await this.saveExists();
    const message = exists
      ? (this.locale === 'ja'
          ? chalk.cyan('\nセーブファイルが存在します。上書きしますか？ (Y/n): ')
          : chalk.cyan('\nSave file exists. Overwrite? (Y/n): '))
      : (this.locale === 'ja'
          ? chalk.cyan('\n進行状況を保存しますか？ (Y/n): ')
          : chalk.cyan('\nWould you like to save your progress? (Y/n): '));

    const answer = await this.rl.question(message);
    const trimmedAnswer = answer.trim().toLowerCase();

    // Default to 'yes' if empty (Enter key pressed)
    if (trimmedAnswer === '') {
      return true;
    }

    return trimmedAnswer === 'y' || trimmedAnswer === 'yes';
  }

  async save(
    gameState: GameState,
    completedZones: string[] = [],
    deletedHostileFiles: string[] = [],
    isZone2Unlocked: boolean = false,
    eventFlags: GameProgressFlags,
    legacyFields: Partial<Pick<SaveData, 'tutorialStep' | 'zone2Step' | 'isTutorialMode' | 'isInZone2Mode'>> = {}
  ): Promise<boolean> {
    try {
      const hasPermission = await this.askPermissionToSave();
      if (!hasPermission) {
        const notSavedMessage = this.locale === 'ja'
          ? '進行状況を保存しませんでした。'
          : 'Progress not saved.';
        console.log(chalk.gray(notSavedMessage));
        return false;
      }

      const saveData: SaveData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        gameState: {
          hp: gameState.hp,
          maxHp: gameState.maxHp,
          energy: gameState.energy,
          maxEnergy: gameState.maxEnergy,
          diskUsage: gameState.diskUsage,
          maxDiskUsage: gameState.maxDiskUsage,
          threatLevel: gameState.threatLevel,
          knowledge: gameState.knowledge,
          currentDepth: gameState.currentDepth,
          currentPath: gameState.currentPath,
          turnCount: gameState.turnCount
        },
        completedZones,
        deletedHostileFiles,
        isZone2Unlocked,
        eventFlags
      };

      if (legacyFields.tutorialStep !== undefined) {
        saveData.tutorialStep = legacyFields.tutorialStep;
      }
      if (legacyFields.zone2Step !== undefined) {
        saveData.zone2Step = legacyFields.zone2Step;
      }
      if (legacyFields.isTutorialMode !== undefined) {
        saveData.isTutorialMode = legacyFields.isTutorialMode;
      }
      if (legacyFields.isInZone2Mode !== undefined) {
        saveData.isInZone2Mode = legacyFields.isInZone2Mode;
      }

      await fs.writeFile(
        this.saveFilePath,
        JSON.stringify(saveData, null, 2),
        'utf-8'
      );

      const successMessage = this.locale === 'ja'
        ? `進行状況を保存しました: ${this.saveFilePath}`
        : `Progress saved to ${this.saveFilePath}`;
      console.log(chalk.green(successMessage));
      return true;
    } catch (error) {
      console.error(chalk.red('Failed to save progress:'), error);
      return false;
    }
  }

  async load(): Promise<SaveData | null> {
    try {
      const exists = await this.saveExists();
      if (!exists) {
        return null;
      }

      const data = await fs.readFile(this.saveFilePath, 'utf-8');
      const saveData = JSON.parse(data) as SaveData;

      // Validate save data version
      if (!saveData.version) {
        console.log(chalk.yellow('⚠️  Old save file format detected.'));
        return null;
      }

      return saveData;
    } catch (error) {
      console.error(chalk.red('Failed to load save file:'), error);
      return null;
    }
  }

  async askToLoadSave(): Promise<boolean> {
    if (!this.rl) {
      console.error(chalk.red('Readline interface not set'));
      return false;
    }

    const message = this.locale === 'ja'
      ? '\nセーブファイルが見つかりました。前回の続きから始めますか？ (Y/n): '
      : '\nSave file found. Continue from previous progress? (Y/n): ';

    const answer = await this.rl.question(chalk.cyan(message));
    const trimmedAnswer = answer.trim().toLowerCase();

    // Default to 'yes' if empty (Enter key pressed)
    if (trimmedAnswer === '') {
      return true;
    }

    return trimmedAnswer === 'y' || trimmedAnswer === 'yes';
  }

}
