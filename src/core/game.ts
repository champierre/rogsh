import { GameState, GameEvent, Zone1Step, Zone2Step, GameProgressFlags } from '../types/game.js';
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
  private eventFlags: GameProgressFlags;

  constructor() {
    // ゲーム依存と初期ステートをまとめて構築する
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
    this.eventFlags = { hasEnteredZone1: false };

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
    // ゾーン1チュートリアルの進行ステップを生成する
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
    // ゾーン2チュートリアルの進行ステップを生成する
    const msg = messages[this.locale];
    return [
      {
        id: 'zone2_welcome',
        description: msg.zone2.welcome.description,
        expectedCommand: 'ls', // 利用可能なディレクトリを確認するために ls を期待する
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
    // プレイヤー入力を解釈し状態更新やチュートリアル進行を処理する
    if (this.state.isGameOver) {
      return {output: chalk.red('Game Over. Restart to play again.')};
    }

    // コマンドの実行を試みる
    const result = await this.commandParser.execute(input, this.state);

    // ゾーン2到達などで終了すべきか確認する
    if (result.shouldExit) {
      return {output: result.output, shouldExit: true, attackEffect: result.attackEffect};
    }

    // コマンド実行後のステータスを更新する
    this.state.energy = Math.max(0, this.state.energy - result.energyCost);
    this.state.turnCount++;

    // 現在パスを仮想ファイルシステムから取得する
    this.state.currentPath = this.filesystem.pwd();

    // ゲーム開始後に初めて zone1 に入ったかどうかを記録する
    if (!this.eventFlags.hasEnteredZone1 && this.state.currentPath.startsWith('/zone1')) {
      this.eventFlags.hasEnteredZone1 = true;
    }

    // ターン経過時の定常処理を行う
    this.processTurn();

    // チュートリアルの進捗を判定する
    if (this.isTutorialMode) {
      this.checkTutorialProgress(input);
    } else if (this.isInZone2Mode) {
      this.checkZone2Progress(input);
    }

    // ゾーン2へ初めて入ったタイミングを検知する
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


    // ゲームオーバー条件をチェックする
    this.checkGameOver();

    return {output: result.output, attackEffect: result.attackEffect};
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

  private checkTutorialProgress(input: string): void {
    // ゾーン1チュートリアルの達成状況をコマンドから判断する
    if (this.currentTutorialStep >= this.tutorialSteps.length) {
      this.isTutorialMode = false;
      return;
    }

    const currentStep = this.tutorialSteps[this.currentTutorialStep];
    
    // 入力コマンドが期待値と一致するか確認する
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

    // ゾーン2ステップで期待するコマンドと一致するか確認する
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
        // ゾーン2をクリアとして扱う
        this.completeZone2();
      }
    }

    // 敵ファイル削除でのゾーン2クリアを明示的に検出する
    if (this.filesystem.isZone2Completed() && !this.completedZones.includes('zone2')) {
      this.completeZone2();
    }
  }

  private completeZone2(): void {
    // ゾーン2クリア時の状態更新と通知をまとめて行う
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

  getTutorialMessage(): { description: string; hint: string } | null {
    // アクティブなチュートリアルメッセージとヒントを取得する
    // ゾーン1チュートリアル
    if (this.isTutorialMode && this.currentTutorialStep < this.tutorialSteps.length) {
      const step = this.tutorialSteps[this.currentTutorialStep];
      return {
        description: step.description,
        hint: step.hint || ''
      };
    }

    // ゾーン2チュートリアル
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
    // 直近に発生したイベントを返す
    return this.events.length > 0 ? this.events[this.events.length - 1] : null;
  }

  isInTutorial(): boolean {
    // チュートリアル進行中かを判定する
    return this.isTutorialMode || this.isInZone2Mode;
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

    // チュートリアルの進捗情報を復元する
    this.currentTutorialStep = saveData.tutorialStep || 0;
    this.currentZone2Step = saveData.zone2Step || 0;
    this.isTutorialMode = saveData.isTutorialMode !== undefined ? saveData.isTutorialMode : true;
    this.isInZone2Mode = saveData.isInZone2Mode !== undefined ? saveData.isInZone2Mode : false;

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
    const savedZone1Flag = saveData.eventFlags?.hasEnteredZone1;
    const derivedZone1Flag = savedZone1Flag !== undefined
      ? savedZone1Flag
      : (this.completedZones.includes('zone1') || this.state.currentPath.startsWith('/zone1'));

    this.eventFlags = {
      hasEnteredZone1: derivedZone1Flag
    };
  }

  async saveProgress(): Promise<boolean> {
    // 現状をセーブファイルへ保存する
    // チュートリアルが終わっていればゾーン1クリアを記録する
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
        this.isTutorialMode = true;
        this.isInZone2Mode = false;
        this.currentTutorialStep = 0;
        this.currentZone2Step = 0;
        this.completedZones = [];
        this.filesystem.changeDirectory('/');
        this.eventFlags.hasEnteredZone1 = false;
        break;

      case 'zone2':
        // ゾーン2開始状態をセットアップする
        this.isTutorialMode = false;
        this.isInZone2Mode = true;
        this.currentTutorialStep = this.tutorialSteps.length;
        this.currentZone2Step = 0;
        this.completedZones = ['zone1'];
        // ゾーン2を解放し敵ファイル削除状態を調整する
        this.filesystem.setDeletedHostileFiles(['virus.exe', 'malware.dat']);
        this.filesystem.unlockZone2();
        this.filesystem.changeDirectory('/zone2');
        this.eventFlags.hasEnteredZone1 = true;
        break;

      case 'zone3':
        // ゾーン3開始想定の暫定セットアップを行う
        this.isTutorialMode = false;
        this.isInZone2Mode = false;
        this.currentTutorialStep = this.tutorialSteps.length;
        this.currentZone2Step = this.zone2Steps.length;
        this.completedZones = ['zone1', 'zone2'];
        // ゾーン2を解放し敵ファイル全削除扱いにする
        this.filesystem.setDeletedHostileFiles(['virus.exe', 'malware.dat', 'quantum_virus.exe']);
        this.filesystem.unlockZone2();
        this.filesystem.changeDirectory('/');
        this.eventFlags.hasEnteredZone1 = true;
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
