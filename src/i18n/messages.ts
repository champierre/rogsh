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
  };
  help: {
    title: string;
    navigation: string;
    fileOperations: string;
    processManagement: string;
    helpSection: string;
    commands: {
      ls: string;
      cd: string;
      pwd: string;
      cat: string;
      head: string;
      find: string;
      grep: string;
      chmod: string;
      ps: string;
      kill: string;
      help: string;
      man: string;
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
      subtitle: '',
      description1: 'You are a maintenance agent in the Ω-Cluster.',
      description2: 'Navigate the filesystem dungeon using Unix commands.',
      helpHint: 'Type "help" for available commands.',
      exitHint: 'Type "exit" or "quit" to leave the game.'
    },
    tutorial: {
      welcome: {
        title: 'Welcome to ShellQuest',
        description: 'You are a maintenance agent in the Ω-Cluster. Your mission is to clean corrupted processes and restore system stability.\n\nFirst, let\'s explore your current location. Type "ls" (list) to see all files and directories here.',
        hint: 'Type: ls'
      },
      exploreDetailed: {
        title: 'Detailed Exploration',
        description: 'Good! You can see several directories. Now use "ls -la" (list with long format and all files) to see hidden files (starting with .) and detailed information like permissions and file sizes.',
        hint: 'Type: ls -la'
      },
      readReadme: {
        title: 'Understanding Objectives',
        description: 'Let\'s read the zone objectives. Use "cat README.zone" (concatenate/display) to read and show the entire contents of the README.zone file.',
        hint: 'Type: cat README.zone'
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
        description: 'The log mentions a corrupted file. Go back to zone1 with "cd .." then use "find -name corrupted.tmp" to locate it.',
        hint: 'First type: cd .. then type: find -name corrupted.tmp'
      },
      makeExecutable: {
        title: 'Prepare Cleanup Script',
        description: 'Navigate to bin directory with "cd bin" and make cleanup.sh executable with "chmod +x cleanup.sh".',
        hint: 'First: cd bin, then: chmod +x cleanup.sh'
      },
      complete: {
        title: 'Tutorial Complete!',
        description: 'Excellent! You\'ve learned the basics:\n- Navigation (ls, cd)\n- File reading (cat)\n- Process management (ps, kill)\n- File search (find)\n- Permissions (chmod)\n\nYou\'re ready to continue exploring the Ω-Cluster!',
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
      tutorialComplete: '🎉 Tutorial Complete! You are now free to explore.'
    },
    help: {
      title: 'Available Commands:',
      navigation: 'Navigation:',
      fileOperations: 'File Operations:',
      processManagement: 'Process Management:',
      helpSection: 'Help:',
      commands: {
        ls: 'List directory contents (shows files and folders)',
        cd: 'Change directory',
        pwd: 'Print working directory',
        cat: 'Display file contents (read and show entire file)',
        head: 'Display first lines of file',
        find: 'Find files matching pattern',
        grep: 'Search pattern in file',
        chmod: 'Make file executable',
        ps: 'List processes',
        kill: 'Terminate process',
        help: 'Show this help',
        man: 'Show command manual',
        clear: 'Clear screen'
      }
    },
    zones: {
      readme: `Zone1 Tutorial Objective:
- Learn basic navigation with ls and cd
- Discover the corrupted.tmp file
- Terminate the zombie process
- Reduce threat level below 5
- Secure the cleanup.sh script

Type 'help' for available commands.`
    }
  },
  ja: {
    welcome: {
      title: 'ShellQuest v0.1.0',
      subtitle: '',
      description1: 'あなたはΩクラスタのメンテナンスエージェントです。',
      description2: 'Unixコマンドを使用してファイルシステムダンジョンを探索してください。',
      helpHint: '使用可能なコマンドを見るには「help」と入力してください。',
      exitHint: 'ゲームを終了するには「exit」または「quit」と入力してください。'
    },
    tutorial: {
      welcome: {
        title: 'ShellQuestへようこそ',
        description: 'あなたはΩクラスタのメンテナンスエージェントです。腐敗したプロセスを除去し、システムの安定性を回復することがミッションです。\n\nまず、現在の場所を探索しましょう。「ls」（list：リスト）と入力して、ここにあるすべてのファイルとディレクトリを表示してください。',
        hint: '入力: ls'
      },
      exploreDetailed: {
        title: '詳細な探索',
        description: 'よくできました！いくつかのディレクトリが見えますね。「ls -la」（list with long format and all：詳細形式ですべて）を使用して隠しファイル（.で始まる）と権限やファイルサイズなどの詳細情報を表示してみましょう。',
        hint: '入力: ls -la'
      },
      readReadme: {
        title: '目標の理解',
        description: 'ゾーンの目標を読みましょう。「cat README.zone」（concatenate/display：連結・表示）を使用してREADME.zoneファイルの全内容を読み取り表示してください。',
        hint: '入力: cat README.zone'
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
        description: 'ログに破損ファイルの記載があります。「cd ..」でzone1に戻り、「find -name corrupted.tmp」を使用して場所を特定してください。',
        hint: 'まず入力: cd .. 次に入力: find -name corrupted.tmp'
      },
      makeExecutable: {
        title: 'クリーンアップスクリプトの準備',
        description: '「cd bin」でbinディレクトリに移動し、「chmod +x cleanup.sh」でcleanup.shを実行可能にしてください。',
        hint: 'まず: cd bin、次に: chmod +x cleanup.sh'
      },
      complete: {
        title: 'チュートリアル完了！',
        description: '素晴らしい！基本を習得しました：\n- ナビゲーション（ls、cd）\n- ファイル読み取り（cat）\n- プロセス管理（ps、kill）\n- ファイル検索（find）\n- パーミッション（chmod）\n\nΩクラスタの探索を続ける準備ができました！',
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
      tutorialComplete: '🎉 チュートリアル完了！自由に探索できるようになりました。'
    },
    help: {
      title: '使用可能なコマンド：',
      navigation: 'ナビゲーション：',
      fileOperations: 'ファイル操作：',
      processManagement: 'プロセス管理：',
      helpSection: 'ヘルプ：',
      commands: {
        ls: 'ディレクトリ内容をリスト（ファイルとフォルダを表示）',
        cd: 'ディレクトリを変更',
        pwd: '現在のディレクトリを表示',
        cat: 'ファイル内容を表示（ファイル全体を読み込み表示）',
        head: 'ファイルの最初の行を表示',
        find: 'パターンに一致するファイルを検索',
        grep: 'ファイル内でパターンを検索',
        chmod: 'ファイルを実行可能にする',
        ps: 'プロセスをリスト',
        kill: 'プロセスを終了',
        help: 'このヘルプを表示',
        man: 'コマンドマニュアルを表示',
        clear: '画面をクリア'
      }
    },
    zones: {
      readme: `ゾーン1 チュートリアル目標：
- lsとcdで基本的なナビゲーションを学ぶ
- corrupted.tmpファイルを発見する
- ゾンビプロセスを終了する
- 脅威レベルを5以下に減らす
- cleanup.shスクリプトを確保する

使用可能なコマンドを見るには「help」と入力してください。`
    }
  }
};