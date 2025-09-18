export interface Messages {
  welcome: {
    title: string;
    subtitle: string;
    description1: string;
    description2: string;
    helpHint: string;
    exitHint: string;
  };
  zone1: {
    welcome: string;
    exploreDetailed: string;
    confirmLocation: string;
    readReadme: string;
    returnToZone1Readme: string;
    navigateToTmp: string;
    confirmTmpLocation: string;
    returnToZone1: string;
    navigateToLogs: string;
    confirmBackToZone1: string;
    scanForHidden: string;
    confirmLogsLocation: string;
    enterHiddenDir: string;
    removeMalware: string;
    confirmHiddenLocation: string;
    checkProcesses: string;
    deleteFinalMalware: string;
    exploreLogs: string;
    complete: string;
    moveToRoot: string;
    confirmRootLocation: string;
  };
  zone2: {
    welcome: {
      description: string;
      hint: string;
    };
    readInstructions: {
      description: string;
      hint: string;
    };
    followPrimes: {
      description: string;
      hint: string;
    };
    findHidden: {
      description: string;
      hint: string;
    };
    eliminateTarget: {
      description: string;
      hint: string;
    };
    complete: {
      description: string;
      hint: string;
    };
  };
  commands: {
    notFound: string;
    notImplemented: string;
    error: string;
    missingOperand: string;
    noSuchFile: string;
    noSuchDirectory: string;
    isDirectory: string;
    invalidProcessId: string;
    noSuchProcess: string;
    processTerminated: string;
    fileNotExecutable: string;
    invalidMode: string;
    noMatches: string;
    directoryEmpty: string;
  };
  game: {
    gameOver: string;
    finalStats: string;
    turnsSurvived: string;
    knowledgeGained: string;
    finalThreatLevel: string;
    depthReached: string;
    thankYou: string;
    exitMessage: string;
    systemPanic: string;
    diskFull: string;
    threatCritical: string;
    tutorialComplete: string;
  };
  help: {
    title: string;
    navigation: string;
    fileOperations: string;
    processManagement: string;
    helpSection: string;
    systemStatus: string;
    hudExplanation: string;
    threatLevel: string;
    noHints: string;
    commands: {
      ls: string;
      cd: string;
      pwd: string;
      cat: string;
      rm: string;
      help: string;
      clear: string;
    };
  };
  zones: {
    readme: string;
    zone2readme: string;
  };
}

export const messages: { en: Messages; ja: Messages } = {
  en: {
    welcome: {
      title: 'Unix Command Learning Roguelike v0.1.0',
      subtitle: '═══ SYSTEM INITIALIZATION ═══',
      description1: 'CLASSIFIED BRIEFING - CLEARANCE LEVEL: OMEGA\n\nThe year is 2087. The Ω(Omega)-Cluster, humanity\'s most advanced quantum computing network, has suffered a catastrophic system breach. Corrupted processes are spreading like a digital plague, threatening to collapse the entire infrastructure that keeps our civilization running.\n\nYou are Agent-7 (Agent Seven), an elite maintenance operative trained in ancient Unix protocols - skills thought obsolete until now.',
      description2: '🚨 MISSION BRIEFING:\nCorrupted entities have infiltrated the filesystem layers. Your neural interface has been calibrated to translate system commands into direct environmental manipulation. Every Unix command you execute will reshape reality within the digital realm.\n\n🖥️ HUD INTERFACE: Your neural HUD (Heads-Up Display) projects critical survival metrics directly into your field of vision:\n• HP: System Integrity (health)\n• EP: CPU Quota (energy for commands)\n• THR: Threat Level (corruption intensity)\n• Current digital location path\n\n⚠️ WARNING: Higher threat levels spawn more dangerous entities and destabilize the environment. Monitor your HUD constantly and eliminate corrupted processes to reduce the threat.\n\nTime is running out. The corruption spreads with each passing cycle.',
      helpHint: '💡 Neural link established. Type **help** to access your command protocols.',
      exitHint: '⚠️ Emergency extraction: Type **exit** or **quit** to abort mission.'
    },
    zone1: {
      welcome: 'You are a maintenance agent in the Ω(Omega)-Cluster. Your mission is to clean corrupted processes and restore system stability.\n\nFirst, let\'s explore your current location. Type **ls** (list) to see all files and directories here.',
      exploreDetailed: 'Good! You can see Zone 1. This is the training area.\n\nUse **cd zone1** (change directory) to enter Zone 1.',
      confirmLocation: 'You\'ve entered Zone 1! After moving to a directory, check the files within that directory to understand the situation. Type **ls** to see what files and directories are available in this zone.',
      readReadme: 'Excellent! You found the README.txt file. This file contains mission details. Use **cat README.txt** (concatenate/display) to read the mission briefing.',
      returnToZone1Readme: 'Return to zone1 using the absolute path **cd /zone1** and review README.txt before proceeding deeper.',
      navigateToTmp: 'Perfect! You\'ve read the mission details. According to README.txt, virus.exe is in the tmp directory. Use **cd tmp** (change directory) to move to the tmp directory.',
      confirmTmpLocation: 'You\'ve entered the tmp directory! After moving to a directory, check the files within that directory to understand the situation. Use **ls** to see the contents of this directory and find the virus.exe file.',
      returnToZone1: 'Perfect! You found the virus.exe file. This is the hostile file. Use **rm virus.exe** (remove) to eliminate this file.',
      navigateToLogs: 'Excellent! First target eliminated. Now return to zone1 directory. Use **cd ..** (where .. means parent directory) to go back up one level.',
      confirmBackToZone1: 'You\'re back in zone1! After moving to a directory, check the files within that directory to understand the situation. Use **ls** to see available directories. You should see the logs directory.',
      scanForHidden: 'Good! Now navigate to the logs directory where the second enemy file is hidden. Use **cd logs**.',
      confirmLogsLocation: 'You\'ve entered the logs directory! After moving to a directory, check the files within that directory to understand the situation. Use **ls** to see the contents of this directory.',
      enterHiddenDir: 'You\'ve checked the logs directory contents. However, the target is concealed. Use **ls -a** to reveal hidden files and directories (those starting with a dot).',
      removeMalware: 'Excellent! You found the hidden directory ".hidden". Navigate into it to locate the final target. Use **cd .hidden**.',
      confirmHiddenLocation: 'You\'ve entered the hidden directory! After moving to a directory, check the files within that directory to understand the situation. Use **ls** to see what\'s in this directory.',
      checkProcesses: 'Perfect! You found the malware.dat file. This is the final target. Use **rm malware.dat** to eliminate the final hostile file and complete your mission.',
      deleteFinalMalware: 'Perfect! You\'re now in the hidden directory. Use **rm malware.dat** to eliminate the final hostile file and complete your mission.',
      exploreLogs: 'Good work! Now navigate to the logs directory. Use **cd logs** to change directory.',
      complete: 'Excellent! You\'ve mastered the basics:\n- Navigation (ls, cd)\n- File reading (cat)\n- File removal (rm)\n\nYou\'re ready to continue exploring the Ω(Omega)-Cluster!',
      moveToRoot: 'You\'re back at the root directory! First, let\'s check the current situation.',
      confirmRootLocation: 'Perfect! The zone2 directory has been unlocked. It\'s time to enter zone2.'
    },
    zone2: {
      welcome: {
        description: 'Zone 2 - Quantum Layer. Advanced challenge activated.',
        hint: 'Type: help'
      },
      readInstructions: {
        description: 'Study the encrypted directive carefully.',
        hint: 'Type: help'
      },
      followPrimes: {
        description: 'Navigate through numbered directories. Mathematical intuition required.',
        hint: 'Type: help'
      },
      findHidden: {
        description: 'Search for concealed quantum anomalies.',
        hint: 'Type: help'
      },
      eliminateTarget: {
        description: 'Quantum virus detected. Immediate elimination required.',
        hint: 'Type: help'
      },
      complete: {
        description: 'Zone 2 secured. Quantum containment restored.',
        hint: 'Mission accomplished'
      }
    },
    commands: {
      notFound: 'Command not found',
      notImplemented: 'Command not implemented',
      error: 'Error executing',
      missingOperand: 'missing operand',
      noSuchFile: 'No such file',
      noSuchDirectory: 'No such directory',
      isDirectory: 'Is a directory',
      invalidProcessId: 'invalid process id',
      noSuchProcess: 'No such process',
      processTerminated: 'terminated. Threat',
      fileNotExecutable: 'Made executable',
      invalidMode: 'invalid mode',
      noMatches: 'no matches for',
      directoryEmpty: 'Directory is empty'
    },
    game: {
      gameOver: 'GAME OVER',
      finalStats: 'Final Statistics:',
      turnsSurvived: 'Turns Survived',
      knowledgeGained: 'Knowledge Gained',
      finalThreatLevel: 'Final Threat Level',
      depthReached: 'Depth Reached',
      thankYou: 'Thank you for playing rogsh!',
      exitMessage: 'Exiting rogsh. Goodbye!',
      systemPanic: 'SYSTEM PANIC: Integrity critical. Game Over.',
      diskFull: 'DISK FULL: System unresponsive. Game Over.',
      threatCritical: 'THREAT CRITICAL: System compromised. Game Over.',
      tutorialComplete: '🎉 Tutorial Complete! You are now free to explore.'
    },
    help: {
      title: 'Available Commands:',
      navigation: 'Navigation:',
      fileOperations: 'File Operations:',
      processManagement: 'Process Management:',
      helpSection: 'Help:',
      systemStatus: 'System Status:',
      hudExplanation: 'HUD Display: Your neural interface projects vital stats - HP (System Integrity), EP (CPU Quota), THR (Threat Level), and current location. Monitor these carefully to survive the digital realm.',
      threatLevel: 'THR (Threat Level): Indicates system corruption intensity. Higher levels mean more dangerous entities and unstable environment. Reduce threat by eliminating corrupted processes and cleaning infected files.',
      noHints: 'No mission hints available right now. Explore the system and experiment.',
      commands: {
        ls: 'List directory contents (use -a to show hidden files/directories)',
        cd: 'Change directory (use "cd .." to go up one level, ".." = parent directory)',
        pwd: 'Print working directory',
        cat: 'Display file contents (read and show entire file)',
        rm: 'Remove/delete files',
        help: 'Show this help',
        clear: 'Clear screen'
      }
    },
    zones: {
      readme: `MISSION BRIEFING - ZONE 1
=====================

Agent-7, enemy files have been detected in our system:

TARGET LOCATIONS:
- /srv/cluster/zone1/tmp/virus.exe
- /srv/cluster/zone1/logs/[HIDDEN LOCATION]/malware.dat

MISSION OBJECTIVE:
Eliminate these hostile files using the 'rm' command.

Navigation Commands:
- ls: List files and directories
- ls -a: List ALL files and directories (including hidden)
- cd: Change directory (use 'cd ..' to go up)
- cat: Display file contents
- rm: Remove/delete files

INTEL: Second target is concealed. Use advanced scanning.

Complete your mission to secure Zone 1.`,
      zone2readme: `QUANTUM BREACH CONTAINMENT PROTOCOL
===================================

Agent-7, the quantum layer has been compromised.

ENCRYPTED DIRECTIVE [CLEARANCE: OMEGA]:
"When numbers dance in digital space,
Seek those untouched by division's embrace.
Where pure integers stand alone and true,
The path to salvation reveals to you.

Follow the sacred sequence deep,
Until no children directories you keep.
In shadows hidden from casual sight,
Quantum corruption awaits your might."

WARNING: Navigation requires mathematical intuition.
Standard protocols insufficient.
Think beyond the obvious.

[END TRANSMISSION]`
    }
  },
  ja: {
    welcome: {
      title: 'ROGSH v0.1.0',
      subtitle: '═══ システム初期化 ═══',
      description1: '機密ブリーフィング - クリアランスレベル：OMEGA\n\n西暦2087年。人類最高峰の量子計算ネットワーク「Ω（オメガ）クラスタ」に致命的なシステム侵害が発生した。破損したプロセスがデジタル癌のように蔓延し、我々の文明を支える全インフラの崩壊が迫っている。\n\n君はエージェント-7（セブン）、古代のUnixプロトコルを修得したエリートメンテナンス工作員だ。今まで時代遅れとされていたそのスキルが、今こそ必要とされている。',
      description2: 'ミッション概要：\n破損したエンティティがファイルシステム層に侵入している。君の神経インターフェースは、システムコマンドを直接的な環境操作に変換するよう調整済みだ。実行するUnixコマンドの全てが、デジタル領域内の現実を再構成する。\n\nHUDインターフェース：神経HUD（ヘッドアップディスプレイ）が重要な生存指標を視野に直接投影する：\n- HP：システム整合性（体力）\n- EP：CPUクォータ（コマンド実行エネルギー）\n- THR：脅威レベル（汚染強度）\n- 現在のデジタル位置パス\n\n警告：脅威レベルが高いほど危険なエンティティが出現し、環境が不安定化する。HUDを常時監視し、破損プロセスの排除により脅威を軽減せよ。\n\n時間は限られている。汚染は刻々と拡散している。',
      helpHint: '神経リンク確立。コマンドプロトコルにアクセスするには**help**と入力。',
      exitHint: '緊急脱出：ミッション中止は「exit」または「quit」。'
    },
    zone1: {
      welcome: 'あなたはΩ（オメガ）クラスタのルートディレクトリにいます。\n\nまず、現在地のディレクトリを確認しましょう。**ls**（list：リスト）と入力して、利用可能なゾーンを表示してください。',
      exploreDetailed: 'よくできました！Zone 1が見えます。これは訓練エリアです。\n\n**cd zone1**（change directory：ディレクトリ変更）と入力してZone 1に入りましょう。',
      confirmLocation: 'Zone 1に入りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。**ls**と入力して、このゾーンにあるファイルとディレクトリを表示してください。',
      readReadme: '素晴らしい！README.txtファイルが見つかりました。このファイルにはミッションの詳細が記載されています。**cat README.txt**（concatenate/display：連結・表示）を使用してミッションの詳細を確認しましょう。',
      returnToZone1Readme: '**cd /zone1**（/zone1 は絶対パス）でゾーン1の入口に戻り、README.txtで状況を確認してください。',
      navigateToTmp: '完璧です！ミッション詳細を確認しました。README.txtに書かれている通り、virus.exeがtmpディレクトリにあります。**cd tmp**（change directory：ディレクトリ変更）でtmpディレクトリに移動しましょう。',
      confirmTmpLocation: 'tmpディレクトリに入りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。**ls**でこのディレクトリの内容を確認してみましょう。virus.exeファイルがあるかどうか見つけてください。',
      returnToZone1: '完璧です！virus.exeファイルが見つかりました。これが敵対ファイルです。**rm virus.exe**（remove：削除）を使用してこのファイルを排除してください。',
      navigateToLogs: '優秀です！第一ターゲットを排除しました。zone1ディレクトリに戻りましょう。**cd ..**（..は親ディレクトリ）を使用して一つ上のレベルに戻ってください。',
      confirmBackToZone1: 'zone1に戻りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。**ls**で利用可能なディレクトリを確認してください。logsディレクトリが見えるはずです。',
      scanForHidden: 'よくできました！次に第二の敵ファイルが隠されているlogsディレクトリに移動してください。**cd logs**を使用してください。',
      confirmLogsLocation: 'logsディレクトリに入りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。**ls**で内容を確認してみてください。',
      enterHiddenDir: 'logsディレクトリの内容を確認しました。しかし、ターゲットは隠蔽されています。**ls -a**を使用して隠しファイルとディレクトリ（ドットで始まるもの）を表示してください。',
      removeMalware: '素晴らしい！隠しディレクトリ「.hidden」を発見しました。その中に移動して最終ターゲットを見つけてください。**cd .hidden**を使用してください。',
      confirmHiddenLocation: '隠しディレクトリに入りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。**ls**でこのディレクトリに何があるか確認してください。',
      checkProcesses: '完璧です！malware.datファイルが見つかりました。これが最終ターゲットです。**rm malware.dat**を使用して最終の敵対ファイルを排除し、ミッションを完了してください。',
      deleteFinalMalware: '完璧です！隠しディレクトリにいます。**rm malware.dat**を使用して最終の敵対ファイルを排除し、ミッションを完了してください。',
      exploreLogs: 'よくできました！次にlogsディレクトリに移動しましょう。**cd logs**を使用してディレクトリを変更してください。',
      complete: '素晴らしい！基本を習得しました：\n- ナビゲーション（ls、cd）\n- ファイル読み取り（cat）\n- ファイル削除（rm）\n\nΩ（オメガ）クラスタの探索を続ける準備ができました！',
      moveToRoot: 'ルートディレクトリに戻りました！まず現在の状況を確認しましょう。',
      confirmRootLocation: '完璧です！zone2ディレクトリが開放されています。いよいよzone2に進入する時です。'
    },
    zone2: {
      welcome: {
        description: 'ゾーン2の入口で **ls** を実行し、配置されているファイルを確認してください。',
        hint: '**ls**'
      },
      readInstructions: {
        description: 'まずは **cat README.txt** でミッションブリーフィングを確認しましょう。',
        hint: '**cat README.txt**'
      },
      followPrimes: {
        description: '素数ディレクトリを辿ります。まずは **cd 2** で進んでください。',
        hint: '**cd 2**'
      },
      findHidden: {
        description: '量子異常を暴くには **ls -a** で隠しファイルを表示します。',
        hint: '**ls -a**'
      },
      eliminateTarget: {
        description: '量子ウイルスを **rm quantum_virus.exe** で除去してください。',
        hint: '**rm quantum_virus.exe**'
      },
      complete: {
        description: 'ゾーン2の封じ込めに成功しました。',
        hint: '**mission complete**'
      }
    },
    commands: {
      notFound: 'コマンドが見つかりません',
      notImplemented: 'コマンドは実装されていません',
      error: '実行エラー',
      missingOperand: 'オペランドがありません',
      noSuchFile: 'そのようなファイルはありません',
      noSuchDirectory: 'そのようなディレクトリはありません',
      isDirectory: 'ディレクトリです',
      invalidProcessId: '無効なプロセスID',
      noSuchProcess: 'そのようなプロセスはありません',
      processTerminated: 'を終了しました。脅威',
      fileNotExecutable: 'を実行可能にしました',
      invalidMode: '無効なモード',
      noMatches: 'に一致するものがありません',
      directoryEmpty: 'ディレクトリは空です'
    },
    game: {
      gameOver: 'ゲームオーバー',
      finalStats: '最終統計：',
      turnsSurvived: '生存ターン数',
      knowledgeGained: '獲得知識',
      finalThreatLevel: '最終脅威レベル',
      depthReached: '到達深度',
      thankYou: 'rogshをプレイしていただきありがとうございました！',
      exitMessage: 'rogshを終了します。さようなら！',
      systemPanic: 'システムパニック：整合性がクリティカル。ゲームオーバー。',
      diskFull: 'ディスクフル：システムが応答しません。ゲームオーバー。',
      threatCritical: '脅威クリティカル：システムが侵害されました。ゲームオーバー。',
      tutorialComplete: '🎉 チュートリアル完了！自由に探索できるようになりました。'
    },
    help: {
      title: '使用可能なコマンド：',
      navigation: 'ナビゲーション：',
      fileOperations: 'ファイル操作：',
      processManagement: 'プロセス管理：',
      helpSection: 'ヘルプ：',
      systemStatus: 'システム状態：',
      hudExplanation: 'HUD表示：神経インターフェースにより重要な統計が投影される - HP（システム整合性）、EP（CPUクォータ）、THR（脅威レベル）、現在位置。デジタル領域での生存にはこれらの監視が不可欠。',
      threatLevel: 'THR（脅威レベル）：システムの汚染度を示します。レベルが高いほど危険なエンティティが存在し、環境が不安定になります。破損したプロセスの排除と感染ファイルの除去により脅威を軽減できます。',
      noHints: '現在利用できるヒントはありません。自分の判断でシステムを探索してください。',
      commands: {
        ls: 'ディレクトリ内容をリスト（-aで隠しファイル・ディレクトリも表示）',
        cd: 'ディレクトリを変更（**cd ..**で一つ上の階層へ移動、「..」は親ディレクトリ）',
        pwd: '現在のディレクトリを表示',
        cat: 'ファイル内容を表示（ファイル全体を読み込み表示）',
        rm: 'ファイルの削除',
        help: 'このヘルプを表示',
        clear: '画面をクリア'
      }
    },
    zones: {
      readme: `ミッション・ブリーフィング - ゾーン1
========================

エージェント-7（セブン）、我々のシステム内で敵ファイルを検出：

ターゲット位置：
- /zone1/tmp/virus.exe
- /zone1/logs/[隠し場所]/malware.dat

ミッション目標：
'rm'コマンドを使用してこれらの敵対ファイルを除去せよ。

ナビゲーションコマンド：
- ls: ファイルとディレクトリをリスト
- ls -a: 全ファイル・ディレクトリをリスト（隠しファイル含む）
- cd: ディレクトリ変更（'cd ..'で上へ移動）
- cat: ファイル内容を表示
- rm: ファイルの削除

情報：第二ターゲットは隠蔽されている。高度スキャン(ls -a)を使用せよ。

ゾーン1の確保のため任務を完遂せよ。`,
      zone2readme: `量子ブリーチ封じ込めプロトコル
===============================

エージェント-7、量子レイヤーが侵害されました。

暗号化指令 [クリアランス: OMEGA]:
「デジタル空間で踊る数字たち、
素の心を持ち、1と自身のみに心を開く数を発見せよ。
純粋なる整数が孤高に立つ処、
救済への道が汝に現れん。

神聖なる数列を深く追い、
子のディレクトリなき場所まで。
目に見えぬ影の奥に潜みて、
量子の腐敗が汝を待ちぬ。」

警告: ナビゲーションには数学的直感が必要。
標準プロトコルでは不十分。
自明を超えて思考せよ。

[送信終了]`
    }
  }
};
