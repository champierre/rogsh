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
    welcome: {
      description: string;
      hint: string;
    };
    exploreDetailed: {
      description: string;
      hint: string;
    };
    confirmLocation: {
      description: string;
      hint: string;
    };
    readReadme: {
      description: string;
      hint: string;
    };
    navigateToTmp: {
      description: string;
      hint: string;
    };
    confirmTmpLocation: {
      description: string;
      hint: string;
    };
    returnToZone1: {
      description: string;
      hint: string;
    };
    navigateToLogs: {
      description: string;
      hint: string;
    };
    confirmBackToZone1: {
      description: string;
      hint: string;
    };
    scanForHidden: {
      description: string;
      hint: string;
    };
    confirmLogsLocation: {
      description: string;
      hint: string;
    };
    enterHiddenDir: {
      description: string;
      hint: string;
    };
    removeMalware: {
      description: string;
      hint: string;
    };
    confirmHiddenLocation: {
      description: string;
      hint: string;
    };
    checkProcesses: {
      description: string;
      hint: string;
    };
    deleteFinalMalware: {
      description: string;
      hint: string;
    };
    exploreLogs: {
      description: string;
      hint: string;
    };
    complete: {
      description: string;
      hint: string;
    };
    moveToRoot: {
      description: string;
      hint: string;
    };
    confirmRootLocation: {
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
  };
}

export const messages: { en: Messages; ja: Messages } = {
  en: {
    welcome: {
      title: 'Unix Command Learning Roguelike v0.1.0',
      subtitle: '═══ SYSTEM INITIALIZATION ═══',
      description1: 'CLASSIFIED BRIEFING - CLEARANCE LEVEL: OMEGA\n\nThe year is 2087. The Ω(Omega)-Cluster, humanity\'s most advanced quantum computing network, has suffered a catastrophic system breach. Corrupted processes are spreading like a digital plague, threatening to collapse the entire infrastructure that keeps our civilization running.\n\nYou are Agent-7 (Agent Seven), an elite maintenance operative trained in ancient Unix protocols - skills thought obsolete until now.',
      description2: '🚨 MISSION BRIEFING:\nCorrupted entities have infiltrated the filesystem layers. Your neural interface has been calibrated to translate system commands into direct environmental manipulation. Every Unix command you execute will reshape reality within the digital realm.\n\n🖥️ HUD INTERFACE: Your neural HUD (Heads-Up Display) projects critical survival metrics directly into your field of vision:\n• HP: System Integrity (health)\n• EP: CPU Quota (energy for commands)\n• THR: Threat Level (corruption intensity)\n• Current digital location path\n\n⚠️ WARNING: Higher threat levels spawn more dangerous entities and destabilize the environment. Monitor your HUD constantly and eliminate corrupted processes to reduce the threat.\n\nTime is running out. The corruption spreads with each passing cycle.',
      helpHint: '💡 Neural link established. Type "help" to access your command protocols.',
      exitHint: '⚠️ Emergency extraction: Type "exit" or "quit" to abort mission.'
    },
    zone1: {
      welcome: {
        description: 'You are a maintenance agent in the Ω(Omega)-Cluster. Your mission is to clean corrupted processes and restore system stability.\n\nFirst, let\'s explore your current location. Type "ls" (list) to see all files and directories here.',
        hint: 'Type: ls'
      },
      exploreDetailed: {
        description: 'Good! You can see Zone 1. This is the training area.\n\nUse "cd zone1" (change directory) to enter Zone 1.',
        hint: 'Type: cd zone1'
      },
      confirmLocation: {
        description: 'You\'ve entered Zone 1! After moving to a directory, check the files within that directory to understand the situation. Type "ls" to see what files and directories are available in this zone.',
        hint: 'Type: ls'
      },
      readReadme: {
        description: 'Excellent! You found the README.txt file. This file contains mission details. Use "cat README.txt" (concatenate/display) to read the mission briefing.',
        hint: 'Type: cat README.txt'
      },
      navigateToTmp: {
        description: 'Perfect! You\'ve read the mission details. According to README.txt, virus.exe is in the tmp directory. Use "cd tmp" (change directory) to move to the tmp directory.',
        hint: 'Type: cd tmp'
      },
      confirmTmpLocation: {
        description: 'You\'ve entered the tmp directory! After moving to a directory, check the files within that directory to understand the situation. Use "ls" to see the contents of this directory and find the virus.exe file.',
        hint: 'Type: ls'
      },
      returnToZone1: {
        description: 'Perfect! You found the virus.exe file. This is the hostile file. Use "rm virus.exe" (remove) to eliminate this file.',
        hint: 'Type: rm virus.exe'
      },
      navigateToLogs: {
        description: 'Excellent! First target eliminated. Now return to zone1 directory. Use "cd .." (where .. means parent directory) to go back up one level.',
        hint: 'Type: cd ..'
      },
      confirmBackToZone1: {
        description: 'You\'re back in zone1! After moving to a directory, check the files within that directory to understand the situation. Use "ls" to see available directories. You should see the logs directory.',
        hint: 'Type: ls'
      },
      scanForHidden: {
        description: 'Good! Now navigate to the logs directory where the second enemy file is hidden. Use "cd logs".',
        hint: 'Type: cd logs'
      },
      confirmLogsLocation: {
        description: 'You\'ve entered the logs directory! After moving to a directory, check the files within that directory to understand the situation. Use "ls" to see the contents of this directory.',
        hint: 'Type: ls'
      },
      enterHiddenDir: {
        description: 'You\'ve checked the logs directory contents. However, the target is concealed. Use "ls -a" to reveal hidden files and directories (those starting with a dot).',
        hint: 'Type: ls -a'
      },
      removeMalware: {
        description: 'Excellent! You found the hidden directory ".hidden". Navigate into it to locate the final target. Use "cd .hidden".',
        hint: 'Type: cd .hidden'
      },
      confirmHiddenLocation: {
        description: 'You\'ve entered the hidden directory! After moving to a directory, check the files within that directory to understand the situation. Use "ls" to see what\'s in this directory.',
        hint: 'Type: ls'
      },
      checkProcesses: {
        description: 'Perfect! You found the malware.dat file. This is the final target. Use "rm malware.dat" to eliminate the final hostile file and complete your mission.',
        hint: 'Type: rm malware.dat'
      },
      deleteFinalMalware: {
        description: 'Perfect! You\'re now in the hidden directory. Use "rm malware.dat" to eliminate the final hostile file and complete your mission.',
        hint: 'Type: rm malware.dat'
      },
      exploreLogs: {
        description: 'Good work! Now navigate to the logs directory. Use "cd logs" to change directory.',
        hint: 'Type: cd logs'
      },
      complete: {
        description: 'Excellent! You\'ve mastered the basics:\n- Navigation (ls, cd)\n- File reading (cat)\n- File removal (rm)\n\nYou\'re ready to continue exploring the Ω(Omega)-Cluster!',
        hint: 'Use cd / to move to the root directory'
      },
      moveToRoot: {
        description: 'You\'re back at the root directory! First, let\'s check the current situation.',
        hint: 'Type ls to see the contents of the current directory'
      },
      confirmRootLocation: {
        description: 'Perfect! The zone2 directory has been unlocked. It\'s time to enter zone2.',
        hint: 'Type cd zone2 to move to zone2'
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
      thankYou: 'Thank you for playing ShellQuest!',
      exitMessage: 'Exiting ShellQuest. Goodbye!',
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

Complete your mission to secure Zone 1.`
    }
  },
  ja: {
    welcome: {
      title: 'ShellQuest v0.1.0',
      subtitle: '═══ システム初期化 ═══',
      description1: '機密ブリーフィング - クリアランスレベル：OMEGA\n\n西暦2087年。人類最高峰の量子計算ネットワーク「Ω（オメガ）クラスタ」に致命的なシステム侵害が発生した。破損したプロセスがデジタル癌のように蔓延し、我々の文明を支える全インフラの崩壊が迫っている。\n\n君はエージェント-7（セブン）、古代のUnixプロトコルを修得したエリートメンテナンス工作員だ。今まで時代遅れとされていたそのスキルが、今こそ必要とされている。',
      description2: 'ミッション概要：\n破損したエンティティがファイルシステム層に侵入している。君の神経インターフェースは、システムコマンドを直接的な環境操作に変換するよう調整済みだ。実行するUnixコマンドの全てが、デジタル領域内の現実を再構成する。\n\nHUDインターフェース：神経HUD（ヘッドアップディスプレイ）が重要な生存指標を視野に直接投影する：\n- HP：システム整合性（体力）\n- EP：CPUクォータ（コマンド実行エネルギー）\n- THR：脅威レベル（汚染強度）\n- 現在のデジタル位置パス\n\n警告：脅威レベルが高いほど危険なエンティティが出現し、環境が不安定化する。HUDを常時監視し、破損プロセスの排除により脅威を軽減せよ。\n\n時間は限られている。汚染は刻々と拡散している。',
      helpHint: '神経リンク確立。コマンドプロトコルにアクセスするには「help」と入力。',
      exitHint: '緊急脱出：ミッション中止は「exit」または「quit」。'
    },
    zone1: {
      welcome: {
        description: 'あなたはΩ（オメガ）クラスタのルートディレクトリにいます。\n\nまず、現在地のディレクトリを確認しましょう。「ls」（list：リスト）と入力して、利用可能なゾーンを表示してください。',
        hint: '入力: ls'
      },
      exploreDetailed: {
        description: 'よくできました！Zone 1が見えます。これは訓練エリアです。\n\n「cd zone1」（change directory：ディレクトリ変更）と入力してZone 1に入りましょう。',
        hint: '入力: cd zone1'
      },
      confirmLocation: {
        description: 'Zone 1に入りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。「ls」と入力して、このゾーンにあるファイルとディレクトリを表示してください。',
        hint: '入力: ls'
      },
      readReadme: {
        description: '素晴らしい！README.txtファイルが見つかりました。このファイルにはミッションの詳細が記載されています。「cat README.txt」（concatenate/display：連結・表示）を使用してミッションの詳細を確認しましょう。',
        hint: '入力: cat README.txt'
      },
      navigateToTmp: {
        description: '完璧です！ミッション詳細を確認しました。README.txtに書かれている通り、virus.exeがtmpディレクトリにあります。「cd tmp」（change directory：ディレクトリ変更）でtmpディレクトリに移動しましょう。',
        hint: '入力: cd tmp'
      },
      confirmTmpLocation: {
        description: 'tmpディレクトリに入りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。「ls」でこのディレクトリの内容を確認してみましょう。virus.exeファイルがあるかどうか見つけてください。',
        hint: '入力: ls'
      },
      returnToZone1: {
        description: '完璧です！virus.exeファイルが見つかりました。これが敵対ファイルです。「rm virus.exe」（remove：削除）を使用してこのファイルを排除してください。',
        hint: '入力: rm virus.exe'
      },
      navigateToLogs: {
        description: '優秀です！第一ターゲットを排除しました。zone1ディレクトリに戻りましょう。「cd ..」（..は親ディレクトリ）を使用して一つ上のレベルに戻ってください。',
        hint: '入力: cd ..'
      },
      confirmBackToZone1: {
        description: 'zone1に戻りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。「ls」で利用可能なディレクトリを確認してください。logsディレクトリが見えるはずです。',
        hint: '入力: ls'
      },
      scanForHidden: {
        description: 'よくできました！次に第二の敵ファイルが隠されているlogsディレクトリに移動してください。「cd logs」を使用してください。',
        hint: '入力: cd logs'
      },
      confirmLogsLocation: {
        description: 'logsディレクトリに入りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。「ls」で内容を確認してみてください。',
        hint: '入力: ls'
      },
      enterHiddenDir: {
        description: 'logsディレクトリの内容を確認しました。しかし、ターゲットは隠蔽されています。「ls -a」を使用して隠しファイルとディレクトリ（ドットで始まるもの）を表示してください。',
        hint: '入力: ls -a'
      },
      removeMalware: {
        description: '素晴らしい！隠しディレクトリ「.hidden」を発見しました。その中に移動して最終ターゲットを見つけてください。「cd .hidden」を使用してください。',
        hint: '入力: cd .hidden'
      },
      confirmHiddenLocation: {
        description: '隠しディレクトリに入りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。「ls」でこのディレクトリに何があるか確認してください。',
        hint: '入力: ls'
      },
      checkProcesses: {
        description: '完璧です！malware.datファイルが見つかりました。これが最終ターゲットです。「rm malware.dat」を使用して最終の敵対ファイルを排除し、ミッションを完了してください。',
        hint: '入力: rm malware.dat'
      },
      deleteFinalMalware: {
        description: '完璧です！隠しディレクトリにいます。「rm malware.dat」を使用して最終の敵対ファイルを排除し、ミッションを完了してください。',
        hint: '入力: rm malware.dat'
      },
      exploreLogs: {
        description: 'よくできました！次にlogsディレクトリに移動しましょう。「cd logs」を使用してディレクトリを変更してください。',
        hint: '入力: cd logs'
      },
      complete: {
        description: '素晴らしい！基本を習得しました：\n- ナビゲーション（ls、cd）\n- ファイル読み取り（cat）\n- ファイル削除（rm）\n\nΩ（オメガ）クラスタの探索を続ける準備ができました！',
        hint: '入力: cd /'
      },
      moveToRoot: {
        description: 'ルートディレクトリに戻りました！まず現在の状況を確認しましょう。',
        hint: '入力: ls'
      },
      confirmRootLocation: {
        description: '完璧です！zone2ディレクトリが開放されています。いよいよzone2に進入する時です。',
        hint: '入力: cd zone2'
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
      thankYou: 'ShellQuestをプレイしていただきありがとうございました！',
      exitMessage: 'ShellQuestを終了します。さようなら！',
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
      commands: {
        ls: 'ディレクトリ内容をリスト（-aで隠しファイル・ディレクトリも表示）',
        cd: 'ディレクトリを変更（「cd ..」で一つ上の階層へ移動、「..」は親ディレクトリ）',
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

情報：第二ターゲットは隠蔽されている。高度スキャンを使用せよ。

ゾーン1の確保のため任務を完遂せよ。`
    }
  }
};
