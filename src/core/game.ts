import { GameState, GameEvent, GameProgressFlags } from '../types/game.js';
import { VirtualFileSystem } from './filesystem.js';
import { CommandParser } from './commands.js';
import { SaveManager, SaveData } from './saveManager.js';
import { messages } from '../i18n/messages.js';
import { getLocale } from '../i18n/locale.js';
import { formatWithMarkup } from '../utils/formatting.js';
import {
  createInitialZone1Flags,
  updateZone1Flags,
  getZone1Hint,
  TutorialUpdateContext
} from './tutorial/zone1.js';
import {
  createInitialZone2Flags,
  updateZone2Flags,
  getZone2Hint
} from './tutorial/zone2.js';
import chalk from 'chalk';
import * as readline from 'readline/promises';

interface GameOptions {
  showHintKeys?: boolean;
}

export class Game {
  private state: GameState;
  private filesystem: VirtualFileSystem;
  private commandParser: CommandParser;
  private events: GameEvent[];
  private locale: 'ja' | 'en';
  private saveManager: SaveManager;
  private completedZones: string[];
  private eventFlags: GameProgressFlags;

  constructor(options: GameOptions = {}) {
    // ゲーム依存と初期ステートをまとめて構築する
    this.locale = getLocale();
    this.filesystem = new VirtualFileSystem(this.locale);
    this.commandParser = new CommandParser(this.filesystem, this.locale);
    this.commandParser.setTutorialProvider(() => this.getTutorialMessage());
    this.commandParser.setTutorialDebug(Boolean(options.showHintKeys));
    this.saveManager = new SaveManager(this.locale);
    this.events = [];
    this.completedZones = [];
    this.eventFlags = {
      zone1: createInitialZone1Flags(),
      zone2: createInitialZone2Flags()
    };

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

  async processCommand(input: string): Promise<{output: string, shouldExit?: boolean, success: boolean}> {
    // プレイヤー入力を解釈し状態更新やチュートリアル進行を処理する
    if (this.state.isGameOver) {
      return {output: chalk.red('Game Over. Restart to play again.'), success: false};
    }

    const trimmed = input.trim();
    const parts = trimmed.length > 0 ? trimmed.split(/\s+/) : [];
    const command = parts.length > 0 ? parts[0] : null;
    const args = parts.slice(1);
    const previousPath = this.state.currentPath;

    // コマンドの実行を試みる
    const result = await this.commandParser.execute(input, this.state);

    // ゾーン2到達などで終了すべきか確認する
    if (result.shouldExit) {
      return {output: result.output, shouldExit: true, success: result.success};
    }

    // コマンド実行後のステータスを更新する
    this.state.energy = Math.max(0, this.state.energy - result.energyCost);
    this.state.turnCount++;

    // 現在パスを仮想ファイルシステムから取得する
    this.state.currentPath = this.filesystem.pwd();

    const tutorialContext: TutorialUpdateContext = {
      command,
      args,
      success: result.success,
      previousPath,
      currentPath: this.state.currentPath
    };

    updateZone1Flags(this.eventFlags.zone1, tutorialContext);
    updateZone2Flags(this.eventFlags.zone2, tutorialContext);
    this.syncProgressFlags();
    this.trackZoneProgress();

    // ターン経過時の定常処理を行う
    this.processTurn();

    // ゲームオーバー条件をチェックする
    this.checkGameOver();

    return {output: result.output, success: result.success};
  }

  private processTurn(): void {
    // ターン経過時の自動回復や脅威レベル調整を行う
    // エネルギーを回復させる
    this.state.energy = Math.min(this.state.maxEnergy, this.state.energy + 2);

    // 脅威レベルを減衰させる
    if (this.state.threatLevel > 0) {
      this.state.threatLevel = Math.max(0, this.state.threatLevel - 0.5);
    }
  }

  private syncProgressFlags(): void {
    const currentPath = this.state.currentPath;

    if (currentPath.startsWith('/zone1')) {
      this.eventFlags.zone1.enteredZone1 = true;
      this.eventFlags.zone1.lastZone1Directory = currentPath;
    }
    if (currentPath === '/') {
      this.eventFlags.zone1.returnedRoot = true;
    }
    if (currentPath.startsWith('/zone2')) {
      this.eventFlags.zone1.enteredZone2 = true;
      this.eventFlags.zone2.enteredZone2 = true;
    }

    if (!this.eventFlags.zone1.removedVirus) {
      const virus = this.filesystem.getFile('/zone1/tmp/virus.exe');
      if (!virus) {
        this.eventFlags.zone1.removedVirus = true;
        this.eventFlags.zone1.enteredZone1 = true;
      }
    }

    if (!this.eventFlags.zone1.removedMalware) {
      const malware = this.filesystem.getFile('/zone1/logs/.hidden/malware.dat');
      if (!malware) {
        this.eventFlags.zone1.removedMalware = true;
        this.eventFlags.zone1.enteredZone1 = true;
      }
    }

    if (!this.eventFlags.zone2.removedQuantumVirus) {
      const quantumVirus = this.filesystem.getFile('/zone2/2/3/5/.hidden/quantum_virus.exe');
      if (!quantumVirus) {
        this.eventFlags.zone2.removedQuantumVirus = true;
        this.eventFlags.zone2.enteredZone2 = true;
      }
    }

    if (!this.eventFlags.zone2.removedDataCorruptor) {
      const dataCorruptor = this.filesystem.getFile('/zone2/2/3/5/.hidden/D41a&/wQ43au/p127x/.hidden/data_corruptor.bin');
      if (!dataCorruptor) {
        this.eventFlags.zone2.removedDataCorruptor = true;
        this.eventFlags.zone2.enteredZone2 = true;
      }
    }

    if (!this.eventFlags.zone2.removedSystemLeech) {
      const systemLeech = this.filesystem.getFile('/zone2/2/3/5/.hidden/D41a&/wQ43au/p127x/.hidden/lol/Zll/lBl/.hidden/system_leech.dll');
      if (!systemLeech) {
        this.eventFlags.zone2.removedSystemLeech = true;
        this.eventFlags.zone2.enteredZone2 = true;
      }
    }
  }

  private trackZoneProgress(): void {
    if (!this.completedZones.includes('zone1') && this.eventFlags.zone1.removedMalware) {
      this.completedZones.push('zone1');
      this.addEvent({
        type: 'tutorial',
        message: chalk.green.bold(`\n${messages[this.locale].game.tutorialComplete}`),
        severity: 'success',
        timestamp: new Date()
      });
    }

    if (!this.completedZones.includes('zone2') && this.filesystem.isZone2Completed()) {
      this.completedZones.push('zone2');
      this.addEvent({
        type: 'tutorial',
        message: chalk.green.bold(`\n${messages[this.locale].zone2.complete}`),
        severity: 'success',
        timestamp: new Date()
      });
    }
  }

  private checkGameOver(): void {
    // 各種閾値からゲームオーバー判定を行いイベントを記録する
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
    // イベントログに新しいイベントを追加する
    this.events.push(event);
  }

  getPrompt(): string {
    // ステータスをカラー表示したプロンプト文字列を返す
    const hp = chalk.green(`HP=${this.state.hp}`);
    const ep = chalk.yellow(`EP=${this.state.energy}`);
    const threat = this.state.threatLevel > 10 ? chalk.red(`THR=${this.state.threatLevel}`) :
                   this.state.threatLevel > 5 ? chalk.yellow(`THR=${this.state.threatLevel}`) :
                   chalk.green(`THR=${this.state.threatLevel}`);
    const path = chalk.cyan(this.state.currentPath);
    
    return `rogsh:[${hp} ${ep} ${threat} ${path}]$ `;
  }

  getState(): GameState {
    // 現在のゲームステートをコピーして返す
    return { ...this.state };
  }

  isInZone1(): boolean {
    return this.state.currentPath === '/' || this.state.currentPath.startsWith('/zone1');
  }

  getZone1HintFormatted(): string | null {
    // zone1にいる場合のみヒントを返す
    if (!this.isInZone1()) {
      return null;
    }

    const hint = getZone1Hint(this.eventFlags.zone1, this.locale);
    if (!hint) {
      return null;
    }

    return formatWithMarkup(
      hint.description,
      (text: string) => chalk.cyan(text),
      (text: string) => chalk.cyan.bold(text)
    );
  }

  getZone2HelpNotification(): string | null {
    // zone2で初回のみ表示
    const inZone2 = this.state.currentPath.startsWith('/zone2');
    if (!inZone2 || this.eventFlags.zone2.shownHelpNotification) {
      return null;
    }

    // 初回表示後はフラグを立てる
    this.eventFlags.zone2.shownHelpNotification = true;

    const msg = this.locale === 'ja'
      ? 'Zone 2では自動ヒントは表示されません。**help** コマンドでヒントを確認できます。'
      : 'Zone 2 no longer shows automatic hints. Use **help** command to view hints.';

    return chalk.blue('[HINT] ') + formatWithMarkup(
      msg,
      (text: string) => chalk.cyan(text),
      (text: string) => chalk.cyan.bold(text)
    );
  }

  getTutorialMessage(): { description: string; hint?: string } | null {
    const zone1Hint = getZone1Hint(this.eventFlags.zone1, this.locale);
    if (zone1Hint) {
      return zone1Hint;
    }

    const zone2Available = this.filesystem.isZone2Unlocked() || this.eventFlags.zone2.enteredZone2;
    if (zone2Available) {
      const zone2Hint = getZone2Hint(this.eventFlags.zone2, this.locale);
      if (zone2Hint) {
        return zone2Hint;
      }
    }

    return null;
  }

  getLastEvent(): GameEvent | null {
    // 直近に発生したイベントを返す
    return this.events.length > 0 ? this.events[this.events.length - 1] : null;
  }

  isInTutorial(): boolean {
    // チュートリアル進行中かを判定する
    return !this.completedZones.includes('zone2');
  }

  setReadlineInterface(rl: readline.Interface): void {
    // セーブマネージャーに readline インターフェースを共有する
    this.saveManager.setReadlineInterface(rl);
  }

  async loadFromSave(rl: readline.Interface): Promise<boolean> {
    // 保存データの存在確認からロードまでを対話的に行う
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
    // 保存されていたゲームステートを適用する
    if (saveData.gameState) {
      this.state = {
        ...this.state,
        ...saveData.gameState,
        isGameOver: false,
        isPaused: false
      } as GameState;
    }

    // クリア済みゾーンを復元する
    this.completedZones = saveData.completedZones || [];

    // 仮想ファイルシステムの敵ファイル削除状況を復元する
    const deletedFiles = saveData.deletedHostileFiles || [];
    this.filesystem.setDeletedHostileFiles(deletedFiles);

    // 後方互換のため必要に応じてゾーン2を再ロック解除する
    const isZone2Unlocked = saveData.isZone2Unlocked !== undefined
      ? saveData.isZone2Unlocked
      : this.filesystem.areAllHostileFilesDeleted();

    if (isZone2Unlocked && !this.filesystem.isZone2Unlocked()) {
      this.filesystem.unlockZone2();
    }

    // 保存ステートが持つカレントパスへ移動する
    if (saveData.gameState?.currentPath) {
      this.filesystem.changeDirectory(saveData.gameState.currentPath);
    }

    // イベントフラグを復元する
    const zone1Flags = createInitialZone1Flags();
    const zone2Flags = createInitialZone2Flags();

    if (saveData.eventFlags) {
      const raw = saveData.eventFlags as any;
      if (raw.zone1) {
        Object.assign(zone1Flags, raw.zone1);
      }
      if (raw.zone2) {
        Object.assign(zone2Flags, raw.zone2);
      }
      if (typeof raw.hasEnteredZone1 === 'boolean') {
        zone1Flags.enteredZone1 = raw.hasEnteredZone1;
      }
    }

    if (this.completedZones.includes('zone1')) {
      zone1Flags.enteredZone1 = true;
      zone1Flags.removedVirus = true;
      zone1Flags.removedMalware = true;
      zone1Flags.returnedRoot = true;
      zone1Flags.enteredZone2 = zone1Flags.enteredZone2 || this.filesystem.isZone2Unlocked();
    }

    if (this.filesystem.isZone2Completed()) {
      zone2Flags.enteredZone2 = true;
      zone2Flags.removedQuantumVirus = true;
      zone2Flags.removedDataCorruptor = true;
      zone2Flags.removedSystemLeech = true;
    }

    this.eventFlags = {
      zone1: zone1Flags,
      zone2: zone2Flags
    };

    this.state.currentPath = this.filesystem.pwd();
    this.syncProgressFlags();
    this.trackZoneProgress();
  }

  async saveProgress(): Promise<boolean> {
    this.trackZoneProgress();

    return await this.saveManager.save(
      this.state,
      this.completedZones,
      this.filesystem.getDeletedHostileFiles(),
      this.filesystem.isZone2Unlocked(),
      this.eventFlags
    );
  }

  async setupDebugZone(zone: string): Promise<void> {
    // 開発用に指定ゾーンの状態へセットアップする
    switch (zone) {
      case 'zone1':
        // ゾーン1開始時点へリセットする
        this.completedZones = [];
        this.filesystem.changeDirectory('/');
        this.eventFlags.zone1 = createInitialZone1Flags();
        this.eventFlags.zone2 = createInitialZone2Flags();
        this.syncProgressFlags();
        break;

      case 'zone2':
        // ゾーン2開始状態をセットアップする
        this.completedZones = ['zone1'];
        // ゾーン2を解放し敵ファイル削除状態を調整する
        this.filesystem.setDeletedHostileFiles(['virus.exe', 'malware.dat']);
        this.filesystem.unlockZone2();
        this.filesystem.changeDirectory('/zone2');
        this.eventFlags.zone1 = {
          ...createInitialZone1Flags(),
          listedRoot: true,
          enteredZone1: true,
          listedZone1: true,
          readReadme: true,
          enteredTmp: true,
          listedTmp: true,
          removedVirus: true,
          enteredLogs: true,
          listedLogs: true,
          revealedHidden: true,
          enteredHidden: true,
          listedHidden: true,
          removedMalware: true,
          returnedRoot: true,
          enteredZone2: true
        };
        this.eventFlags.zone2 = createInitialZone2Flags();
        this.eventFlags.zone2.enteredZone2 = true;
        this.syncProgressFlags();
        break;

      case 'zone3':
        // ゾーン3開始想定の暫定セットアップを行う
        this.completedZones = ['zone1', 'zone2'];
        // ゾーン2を解放し敵ファイル全削除扱いにする
        this.filesystem.setDeletedHostileFiles(['virus.exe', 'malware.dat', 'quantum_virus.exe']);
        this.filesystem.unlockZone2();
        this.filesystem.changeDirectory('/');
        this.eventFlags.zone1 = {
          ...createInitialZone1Flags(),
          listedRoot: true,
          enteredZone1: true,
          listedZone1: true,
          readReadme: true,
          enteredTmp: true,
          listedTmp: true,
          removedVirus: true,
          enteredLogs: true,
          listedLogs: true,
          revealedHidden: true,
          enteredHidden: true,
          listedHidden: true,
          removedMalware: true,
          returnedRoot: true,
          enteredZone2: true
        };
        this.eventFlags.zone2 = {
          ...createInitialZone2Flags(),
          enteredZone2: true,
          listedZone2Root: true,
          readInstructions: true,
          enteredPrimePath: true,
          revealedQuantumHidden: true,
          removedQuantumVirus: true,
          removedDataCorruptor: true,
          removedSystemLeech: true
        };
        this.syncProgressFlags();
        break;

      default:
        console.log(`Unknown zone: ${zone}. Defaulting to zone1.`);
        await this.setupDebugZone('zone1');
        break;
    }

    // 状態のカレントパスを最新化する
    this.state.currentPath = this.filesystem.pwd();
  }

  getAvailableCommands(): string[] {
    // コマンドパーサーが扱えるコマンドを列挙する
    return this.commandParser.getAvailableCommands();
  }

  getFileCompletions(partial: string): string[] {
    // ファイル名補完に使う候補を現在ディレクトリから集める
    // カレントディレクトリの項目を取得する
    const items = this.filesystem.listDirectory();
    const matches: string[] = [];

    for (const item of items) {
      if (item.name.startsWith(partial)) {
        if (item.type === 'directory') {
          matches.push(item.name + '/');
        } else {
          matches.push(item.name);
        }
      }
    }

    return matches;
  }

}
