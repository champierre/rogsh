export interface Messages {
  welcome: {
    title: string;
    subtitle: string;
    description1: string;
    description2: string;
    helpHint: string;
    exitHint: string;
  };
  tutorial: {
    welcome: {
      title: string;
      description: string;
      hint: string;
    };
    exploreDetailed: {
      title: string;
      description: string;
      hint: string;
    };
    readReadme: {
      title: string;
      description: string;
      hint: string;
    };
    navigateToTmp: {
      title: string;
      description: string;
      hint: string;
    };
    removeVirus: {
      title: string;
      description: string;
      hint: string;
    };
    returnToZone1: {
      title: string;
      description: string;
      hint: string;
    };
    navigateToLogs: {
      title: string;
      description: string;
      hint: string;
    };
    scanForHidden: {
      title: string;
      description: string;
      hint: string;
    };
    enterHiddenDir: {
      title: string;
      description: string;
      hint: string;
    };
    removeMalware: {
      title: string;
      description: string;
      hint: string;
    };
    checkProcesses: {
      title: string;
      description: string;
      hint: string;
    };
    killZombie: {
      title: string;
      description: string;
      hint: string;
    };
    exploreLogs: {
      title: string;
      description: string;
      hint: string;
    };
    checkErrors: {
      title: string;
      description: string;
      hint: string;
    };
    findCorrupted: {
      title: string;
      description: string;
      hint: string;
    };
    makeExecutable: {
      title: string;
      description: string;
      hint: string;
    };
    complete: {
      title: string;
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
    zone2Access: string;
    zone2Navigation: string;
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
      quest: string;
      debug: string;
      'debug-quest': string;
      'debug-skip': string;
    };
  };
  debug: {
    questList: string;
    questStarted: string;
    questSkipped: string;
    invalidQuest: string;
    debugMode: string;
  };
  quests: {
    questAvailable: string;
    questComplete: string;
    noActiveQuest: string;
    first: {
      title: string;
      description: string;
      objectives: string[];
      completion: string;
    };
    deeperCorruption: {
      title: string;
      description: string;
      objectives: string[];
      completion: string;
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
    tutorial: {
      welcome: {
        title: 'Welcome to ShellQuest',
        description: 'You are a maintenance agent in the Ω(Omega)-Cluster. Your mission is to clean corrupted processes and restore system stability.\n\nFirst, let\'s explore your current location. Type "ls" (list) to see all files and directories here.',
        hint: 'Type: ls'
      },
      exploreDetailed: {
        title: 'Detailed Exploration',
        description: 'Good! You can see several directories. Now use "ls -la" (list with long format and all files) to see hidden files (starting with .) and detailed information like permissions and file sizes.',
        hint: 'Type: ls -la'
      },
      readReadme: {
        title: 'Understanding Objectives',
        description: 'Let\'s read the mission briefing. Use "cat README.txt" (concatenate/display) to read and show the entire contents of the README.txt file.',
        hint: 'Type: cat README.txt'
      },
      navigateToTmp: {
        title: 'Navigate to Target Directory',
        description: 'Perfect! You can see the enemy file locations in the mission briefing. First, navigate to the tmp directory where virus.exe is located. Use "cd tmp" (change directory).',
        hint: 'Type: cd tmp'
      },
      removeVirus: {
        title: 'Eliminate First Target',
        description: 'Great! You\'re now in the tmp directory. You should see the virus.exe file. Use "rm virus.exe" (remove) to eliminate this hostile file.',
        hint: 'Type: rm virus.exe'
      },
      returnToZone1: {
        title: 'Return to Base Directory',
        description: 'Excellent! First target eliminated. Now return to the zone1 directory. Use "cd .." (where .. means parent directory) to go back up one level.',
        hint: 'Type: cd ..'
      },
      navigateToLogs: {
        title: 'Navigate to Second Target',
        description: 'Good! Now navigate to the logs directory where the second enemy file is hidden. Use "cd logs".',
        hint: 'Type: cd logs'
      },
      scanForHidden: {
        title: 'Advanced Scanning Required',
        description: 'You\'re in the logs directory, but the target is concealed. According to intel, you need to use advanced scanning. Use "ls -a" to reveal hidden files and directories (those starting with a dot).',
        hint: 'Type: ls -a'
      },
      enterHiddenDir: {
        title: 'Enter Hidden Directory',
        description: 'Excellent! You found the hidden directory ".hidden". Navigate into it to locate the final target. Use "cd .hidden".',
        hint: 'Type: cd .hidden'
      },
      removeMalware: {
        title: 'Eliminate Final Target',
        description: 'Perfect! You\'re now in the hidden directory. Use "rm malware.dat" to eliminate the final hostile file and complete your mission.',
        hint: 'Type: rm malware.dat'
      },
      checkProcesses: {
        title: 'Process Monitoring',
        description: 'There are hostile processes running. Use "ps" to list all processes.',
        hint: 'Type: ps'
      },
      killZombie: {
        title: 'Terminate Threat',
        description: 'The ZombieProcess (PID 114) is a threat. Use "kill 114" to terminate it.',
        hint: 'Type: kill 114'
      },
      exploreLogs: {
        title: 'Investigate Logs',
        description: 'Good work! Now navigate to the logs directory. Use "cd logs" to change directory.',
        hint: 'Type: cd logs'
      },
      checkErrors: {
        title: 'Check Error Log',
        description: 'Let\'s see what errors are occurring. Use "cat error.log" to read the error log.',
        hint: 'Type: cat error.log'
      },
      findCorrupted: {
        title: 'Find Corrupted Files',
        description: 'The log mentions a corrupted file. Go back to zone1 with "cd .." (where ".." means parent directory - one level up) then use "find -name corrupted.tmp" to locate it.',
        hint: 'First type: cd .. then type: find -name corrupted.tmp'
      },
      makeExecutable: {
        title: 'Prepare Cleanup Script',
        description: 'Navigate to bin directory with "cd bin" and make cleanup.sh executable with "chmod +x cleanup.sh".',
        hint: 'First: cd bin, then: chmod +x cleanup.sh'
      },
      complete: {
        title: 'Tutorial Complete!',
        description: 'Excellent! You\'ve learned the basics:\n- Navigation (ls, cd)\n- File reading (cat)\n- Process management (ps, kill)\n- File search (find)\n- Permissions (chmod)\n\nYou\'re ready to continue exploring the Ω(Omega)-Cluster!\n\n📋 NEW QUEST AVAILABLE - Type "quest" to view your first real mission.',
        hint: ''
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
      tutorialComplete: '🎉 Tutorial Complete! You are now free to explore.',
      zone2Access: 'SYSTEM UPDATE: Zone 2 access granted!',
      zone2Navigation: '▶ ARIA: "Outstanding work, Agent-7! Zone 1 is now secure."\n\n▶ SYSTEM VOICE: "Zone 2 coordinates unlocked. Navigate to /srv/cluster/zone2 for next mission phase."\n\n▶ ARIA: "Be advised: Zone 2 contains more advanced threats. Use \'cd ..\' to go up, then \'cd zone2\' to enter Zone 2."'
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
        clear: 'Clear screen',
        quest: 'Show current quest status and objectives',
        debug: 'Debug commands: debug-quest <id>, debug-skip',
        'debug-quest': 'Start specific quest (debug): debug-quest first|deeperCorruption',
        'debug-skip': 'Skip current tutorial/quest (debug mode)'
      }
    },
    debug: {
      questList: '🔧 DEBUG: Available quests: first, deeperCorruption',
      questStarted: '🔧 DEBUG: Quest started - {questId}',
      questSkipped: '🔧 DEBUG: Current phase skipped',
      invalidQuest: '🔧 DEBUG: Invalid quest ID. Use: first, deeperCorruption',
      debugMode: '🔧 DEBUG MODE ACTIVE - Additional commands available'
    },
    quests: {
      questAvailable: '📋 NEW QUEST AVAILABLE - Type "quest" to view objectives',
      questComplete: '✅ QUEST COMPLETED - Well done, Agent-7!',
      noActiveQuest: '📋 No active quest. Continue exploring the Ω(Omega)-Cluster.',
      first: {
        title: '🔍 SECTOR RECONNAISSANCE',
        description: '▶ ARIA: "Agent-7, tutorial phase complete. Your first real mission begins now."\n\n▶ SYSTEM VOICE: "Primary objective: Conduct deep reconnaissance of Zone-2. Intelligence suggests advanced corruption vectors have manifested."\n\n▶ ARIA: "Navigate to Zone-2, assess the threat level, and neutralize any hostile entities. The cluster\'s stability depends on your success."',
        objectives: [
          'Navigate to Zone-2 (/srv/cluster/zone2)',
          'Scan for corrupted processes (ps)',
          'Eliminate all hostile entities',
          'Locate and analyze system logs',
          'Reduce threat level below 3'
        ],
        completion: '▶ SYSTEM VOICE: "Sector reconnaissance complete. Outstanding work, Agent-7."\n\n▶ ARIA: "Zone-2 secured! Your tactical assessment has provided valuable intelligence. The corruption patterns are more complex than anticipated..."'
      },
      deeperCorruption: {
        title: '⚠️ DEEP CORRUPTION PROTOCOL',
        description: '▶ ARIA: "Agent-7, we\'ve detected anomalous readings from the system core. The corruption is evolving."\n\n▶ SYSTEM VOICE: "ALERT: Advanced threat signatures detected. Implement deep corruption protocol immediately."\n\n▶ ARIA: "This is unlike anything we\'ve encountered. The corruption has developed defensive mechanisms. Proceed with extreme caution."',
        objectives: [
          'Investigate system core (/srv/cluster/core)',
          'Identify mutation vectors',
          'Deploy advanced countermeasures',
          'Purge root corruption sources',
          'Restore system integrity to 90%+'
        ],
        completion: '▶ SYSTEM VOICE: "Deep corruption protocol successful. System integrity restored."\n\n▶ ARIA: "Incredible work, Agent-7. You\'ve uncovered the source of the corruption. The Ω-Cluster is stable... for now."'
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
      description1: '機密ブリーフィング - クリアランスレベル：OMEGA\n\n西暦2087年。人類最高峰の量子計算ネットワーク「Ω（オメガ）クラスタ」に致命的なシステム侵害が発生した。破損したプロセスがデジタルペストのように蔓延し、我々の文明を支える全インフラの崩壊が迫っている。\n\n君はエージェント-7（セブン）、古代のUnixプロトコルを修得したエリートメンテナンス工作員だ。今まで時代遅れとされていたそのスキルが、今こそ必要とされている。',
      description2: '🚨 ミッション概要：\n破損したエンティティがファイルシステム層に侵入している。君の神経インターフェースは、システムコマンドを直接的な環境操作に変換するよう調整済みだ。実行するUnixコマンドの全てが、デジタル領域内の現実を再構成する。\n\n🖥️ HUDインターフェース：神経HUD（ヘッドアップディスプレイ）が重要な生存指標を視野に直接投影する：\n• HP：システム整合性（体力）\n• EP：CPUクォータ（コマンド実行エネルギー）\n• THR：脅威レベル（汚染強度）\n• 現在のデジタル位置パス\n\n⚠️ 警告：脅威レベルが高いほど危険なエンティティが出現し、環境が不安定化する。HUDを常時監視し、破損プロセスの排除により脅威を軽減せよ。\n\n時間は限られている。汚染は刻々と拡散している。',
      helpHint: '💡 神経リンク確立。コマンドプロトコルにアクセスするには「help」と入力。',
      exitHint: '⚠️ 緊急脱出：ミッション中止は「exit」または「quit」。'
    },
    tutorial: {
      welcome: {
        title: 'ShellQuestへようこそ',
        description: 'あなたはΩ（オメガ）クラスタのメンテナンスエージェントです。腐敗したプロセスを除去し、システムの安定性を回復することがミッションです。\n\nまず、現在の場所を探索しましょう。「ls」（list：リスト）と入力して、ここにあるすべてのファイルとディレクトリを表示してください。',
        hint: '入力: ls'
      },
      exploreDetailed: {
        title: '詳細な探索',
        description: 'よくできました！いくつかのディレクトリが見えますね。「ls -la」（list with long format and all：詳細形式ですべて）を使用して隠しファイル（.で始まる）と権限やファイルサイズなどの詳細情報を表示してみましょう。',
        hint: '入力: ls -la'
      },
      readReadme: {
        title: '目標の理解',
        description: 'ミッションブリーフィングを読みましょう。「cat README.txt」（concatenate/display：連結・表示）を使用してREADME.txtファイルの全内容を読み取り表示してください。',
        hint: '入力: cat README.txt'
      },
      navigateToTmp: {
        title: 'ターゲットディレクトリへ移動',
        description: '完璧です！ミッションブリーフィングで敵ファイルの位置を確認できました。まず、virus.exeが存在するtmpディレクトリに移動してください。「cd tmp」（change directory：ディレクトリ変更）を使用してください。',
        hint: '入力: cd tmp'
      },
      removeVirus: {
        title: '第一ターゲットの排除',
        description: '素晴らしい！tmpディレクトリにいます。virus.exeファイルが見えるはずです。「rm virus.exe」（remove：削除）を使用してこの敵対ファイルを排除してください。',
        hint: '入力: rm virus.exe'
      },
      returnToZone1: {
        title: 'ベースディレクトリに戻る',
        description: '優秀です！第一ターゲットを排除しました。zone1ディレクトリに戻りましょう。「cd ..」（..は親ディレクトリ）を使用して一つ上のレベルに戻ってください。',
        hint: '入力: cd ..'
      },
      navigateToLogs: {
        title: '第二ターゲットへ移動',
        description: 'よくできました！次に第二の敵ファイルが隠されているlogsディレクトリに移動してください。「cd logs」を使用してください。',
        hint: '入力: cd logs'
      },
      scanForHidden: {
        title: '高度スキャン必要',
        description: 'logsディレクトリにいますが、ターゲットは隠蔽されています。情報によると高度スキャンが必要です。「ls -a」を使用して隠しファイルとディレクトリ（ドットで始まるもの）を表示してください。',
        hint: '入力: ls -a'
      },
      enterHiddenDir: {
        title: '隠しディレクトリに入る',
        description: '素晴らしい！隠しディレクトリ「.hidden」を発見しました。その中に移動して最終ターゲットを見つけてください。「cd .hidden」を使用してください。',
        hint: '入力: cd .hidden'
      },
      removeMalware: {
        title: '最終ターゲットの排除',
        description: '完璧です！隠しディレクトリにいます。「rm malware.dat」を使用して最終の敵対ファイルを排除し、ミッションを完了してください。',
        hint: '入力: rm malware.dat'
      },
      checkProcesses: {
        title: 'プロセスの監視',
        description: '敵対的なプロセスが実行されています。「ps」を使用してすべてのプロセスをリストしてください。',
        hint: '入力: ps'
      },
      killZombie: {
        title: '脅威の終了',
        description: 'ZombieProcess（PID 114）は脅威です。「kill 114」を使用して終了させてください。',
        hint: '入力: kill 114'
      },
      exploreLogs: {
        title: 'ログの調査',
        description: 'よくできました！次にlogsディレクトリに移動しましょう。「cd logs」を使用してディレクトリを変更してください。',
        hint: '入力: cd logs'
      },
      checkErrors: {
        title: 'エラーログの確認',
        description: 'どのようなエラーが発生しているか見てみましょう。「cat error.log」を使用してエラーログを読んでください。',
        hint: '入力: cat error.log'
      },
      findCorrupted: {
        title: '破損ファイルの検索',
        description: 'ログに破損ファイルの記載があります。「cd ..」（「..」は親ディレクトリ、つまり一つ上の階層を意味します）でzone1に戻り、「find -name corrupted.tmp」を使用して場所を特定してください。',
        hint: 'まず入力: cd .. 次に入力: find -name corrupted.tmp'
      },
      makeExecutable: {
        title: 'クリーンアップスクリプトの準備',
        description: '「cd bin」でbinディレクトリに移動し、「chmod +x cleanup.sh」でcleanup.shを実行可能にしてください。',
        hint: 'まず: cd bin、次に: chmod +x cleanup.sh'
      },
      complete: {
        title: 'チュートリアル完了！',
        description: '素晴らしい！基本を習得しました：\n- ナビゲーション（ls、cd）\n- ファイル読み取り（cat）\n- ファイル削除（rm）\n\nΩ（オメガ）クラスタの探索を続ける準備ができました！',
        hint: ''
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
      tutorialComplete: '🎉 チュートリアル完了！自由に探索できるようになりました。',
      zone2Access: 'システム更新：ゾーン2アクセス許可！',
      zone2Navigation: '▶ ARIA：「見事な働きです、エージェント-7（セブン）！ゾーン1は安全になりました。」\n\n▶ システム音声：「ゾーン2座標がアンロック。次のミッション段階のため /srv/cluster/zone2 に移動してください。」\n\n▶ ARIA：「注意：ゾーン2には更に高度な脅威が存在します。\'cd ..\'で上に行き、その後\'cd zone2\'でゾーン2に入ってください。」'
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
        clear: '画面をクリア',
        quest: '現在のクエスト状況と目標を表示',
        debug: 'デバッグコマンド: debug-quest <id>, debug-skip',
        'debug-quest': '特定のクエストを開始（デバッグ）: debug-quest first|deeperCorruption',
        'debug-skip': '現在のチュートリアル/クエストをスキップ（デバッグモード）'
      }
    },
    debug: {
      questList: '🔧 デバッグ: 利用可能なクエスト: first, deeperCorruption',
      questStarted: '🔧 デバッグ: クエスト開始 - {questId}',
      questSkipped: '🔧 デバッグ: 現在のフェーズをスキップしました',
      invalidQuest: '🔧 デバッグ: 無効なクエストID。使用可能: first, deeperCorruption',
      debugMode: '🔧 デバッグモード有効 - 追加コマンドが利用可能'
    },
    quests: {
      questAvailable: '📋 新しいクエスト利用可能 - 目標を確認するには「quest」と入力',
      questComplete: '✅ クエスト完了 - よくやった、エージェント-7（セブン）！',
      noActiveQuest: '📋 アクティブなクエストはありません。Ω（オメガ）クラスタの探索を続けてください。',
      first: {
        title: '🔍 セクター偵察',
        description: '▶ ARIA：「エージェント-7（セブン）、チュートリアル・フェーズ完了。君の最初の実戦ミッションが始まる。」\n\n▶ システム音声：「主要目標：ゾーン2の深度偵察を実施せよ。情報によると、高度な汚染ベクターが発現している。」\n\n▶ ARIA：「ゾーン2に進入し、脅威レベルを評価、敵対エンティティを無力化せよ。クラスタの安定性は君の成功にかかっている。」',
        objectives: [
          'ゾーン2へ進入（/srv/cluster/zone2）',
          '破損プロセスをスキャン（ps）',
          'すべての敵対エンティティを排除',
          'システムログを特定・解析',
          '脅威レベルを3未満まで軽減'
        ],
        completion: '▶ システム音声：「セクター偵察完了。見事な働きだ、エージェント-7（セブン）。」\n\n▶ ARIA：「ゾーン2確保完了！君の戦術評価により貴重な情報を得た。汚染パターンは予想以上に複雑だ...」'
      },
      deeperCorruption: {
        title: '⚠️ ディープ汚染プロトコル',
        description: '▶ ARIA：「エージェント-7（セブン）、システム・コアから異常な読み取り値を検出。汚染が進化している。」\n\n▶ システム音声：「アラート：高度脅威シグネチャ検出。ディープ汚染プロトコルを即座に実行せよ。」\n\n▶ ARIA：「これまでに遭遇したことのない事象だ。汚染が防御機構を発達させている。最大限の警戒で進め。」',
        objectives: [
          'システム・コアを調査（/srv/cluster/core）',
          '変異ベクターを特定',
          '高度対抗手段を配備',
          '根源汚染ソースを除去',
          'システム整合性を90%以上まで回復'
        ],
        completion: '▶ システム音声：「ディープ汚染プロトコル成功。システム整合性回復。」\n\n▶ ARIA：「驚異的な働きだ、エージェント-7（セブン）。汚染の根源を突き止めた。Ω（オメガ）クラスタは安定している...今のところは。」'
      }
    },
    zones: {
      readme: `ミッション・ブリーフィング - ゾーン1
========================

エージェント-7（セブン）、我々のシステム内で敵ファイルを検出：

ターゲット位置：
- /srv/cluster/zone1/tmp/virus.exe
- /srv/cluster/zone1/logs/[隠し場所]/malware.dat

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