import { getVersion } from '../utils/version.js';

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
    lsAtRoot: string;
    cdZone1FromRoot: string;
    cdZone1: string;
    lsAtZone1: string;
    catReadme: string;
    cdZone1AndCatReadme: string;
    cdTmpFromZone1: string;
    cdTmp: string;
    lsAtTmp: string;
    rmVirus: string;
    cdZone1AfterVirusRemoved: string;
    cdLogs: string;
    cdLogsFromZone1: string;
    lsAtLogs: string;
    lsAllAtLogs: string;
    cdHiddenFromLogs: string;
    cdHidden: string;
    lsAtHidden: string;
    rmMalware: string;
    cdRootAfterMalwareRemoved: string;
    cdZone2: string;
  };
  zone2: {
    welcome: string;
    readInstructions: string;
    followPrimes: string;
    nextPrime3: string;
    nextPrime5: string;
    explorePrime5: string;
    findHidden: string;
    enterHidden: string;
    exploreHidden: string;
    eliminateTarget: string;
    exploreCorrupted: string;
    findMoreThreats: string;
    finalThreat: string;
    complete: string;
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

export const messages: { ja: Messages } = {
  ja: {
    welcome: {
      title: `ROGSH v${getVersion()}`,
      subtitle: '═══ システム初期化 ═══',
      description1: '機密ブリーフィング - クリアランスレベル：OMEGA\n\n\n西暦2087年。人類最高峰の量子計算ネットワーク「Ω（オメガ）クラスタ」に致命的なシステム侵害が発生した。破損したプロセスがデジタル癌のように蔓延し、我々の文明を支える全インフラの崩壊が迫っている。\n\n\n君はエージェント-7（セブン）、古代のUnixプロトコルを修得したエリートメンテナンス工作員だ。今まで時代遅れとされていたそのスキルが、今こそ必要とされている。',
      description2: 'ミッション概要：\n破損したエンティティがファイルシステム層に侵入している。君の神経インターフェースは、システムコマンドを直接的な環境操作に変換するよう調整済みだ。実行するUnixコマンドの全てが、デジタル領域内の現実を再構成する。\n\nHUDインターフェース：神経HUD（ヘッドアップディスプレイ）が重要な生存指標を視野に直接投影する：\n- HP：システム整合性（体力）\n- EP：CPUクォータ（コマンド実行エネルギー）\n- THR：脅威レベル（汚染強度）\n- 現在のデジタル位置パス\n\n警告：脅威レベルが高いほど危険なエンティティが出現し、環境が不安定化する。HUDを常時監視し、破損プロセスの排除により脅威を軽減せよ。\n\n時間は限られている。汚染は刻々と拡散している。',
      helpHint: '神経リンク確立。ヒントを表示するには **help** と入力。',
      exitHint: '緊急脱出：ミッション中止は **exit** または **quit**。'
    },
    zone1: {
      lsAtRoot: 'あなたはΩ（オメガ）クラスタのルートディレクトリにいます。\n\nまず、現在の場所から移動できるディレクトリを確認しましょう。**ls**（list：リスト）と入力してください。',
      cdZone1FromRoot: 'Zone 1に移動できます。\n\n**cd zone1**（change directory：ディレクトリ変更）と入力してZone 1に入りましょう。',
      cdZone1: '**cd /zone1**（change directory：ディレクトリ変更）と入力してZone 1に移動しましょう。',
      lsAtZone1: 'Zone 1に入りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。**ls**と入力して、このゾーンにあるファイルとディレクトリを表示してください。',
      catReadme: 'README.txtファイルが見つかりました。このファイルにはミッションの詳細が記載されています。**cat README.txt**（concatenate/display：連結・表示）を使用してミッションの詳細を確認しましょう。',
      cdZone1AndCatReadme: '**cd /zone1**（/zone1 は絶対パス）でゾーン1の入口に戻り、README.txtでミッションの詳細を確認してください。',
      cdTmpFromZone1: '完璧です！ミッション詳細を確認しました。README.txtに書かれている通り、virus.exeがtmpディレクトリにあります。**cd tmp**（change directory：ディレクトリ変更）でtmpディレクトリに移動しましょう。',
      cdTmp: 'README.txtに書かれている通り、virus.exeがtmpディレクトリにあります。**cd /zone1/tmp**（change directory：ディレクトリ変更）でtmpディレクトリに移動しましょう。',
      lsAtTmp: 'tmpディレクトリに入りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。**ls**でこのディレクトリの内容を確認してみましょう。virus.exeファイルがあるかどうか見つけてください。',
      rmVirus: '完璧です！virus.exeファイルが見つかりました。これが敵対ファイルです。**rm virus.exe**（remove：削除）を使用してこのファイルを排除してください。',
      cdZone1AfterVirusRemoved: '優秀です！第一ターゲットを排除しました。zone1ディレクトリに戻りましょう。**cd ..**（..は親ディレクトリ）を使用して一つ上のレベルに戻ってください。',
      cdLogs: '第二の敵ファイルが隠されているlogsディレクトリに移動してください。**cd /zone1/logs**を使用してください。',
      cdLogsFromZone1: '第二の敵ファイルが隠されているlogsディレクトリに移動してください。**cd logs**を使用してください。',
      lsAtLogs: 'logsディレクトリに入りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。**ls**で内容を確認してみてください。',
      lsAllAtLogs: 'logsディレクトリの内容を確認しました。しかし、ターゲットは隠蔽されています。**ls -a**を使用して隠しファイルとディレクトリ（ドットで始まるもの）を表示してください。',
      cdHiddenFromLogs: '素晴らしい！隠しディレクトリ「.hidden」を発見しました。その中に移動して最終ターゲットを見つけてください。**cd .hidden**を使用してください。',
      cdHidden: '**cd /zone1/logs/.hidden**で隠しディレクトリ「.hidden」に移動してください。',
      lsAtHidden: '隠しディレクトリに入りました！移動後はそのディレクトリ下にあるファイルを確認して状況を確認しましょう。**ls**でこのディレクトリに何があるか確認してください。',
      rmMalware: '完璧です！malware.datファイルが見つかりました。これが最終ターゲットです。**rm malware.dat**を使用して最終の敵対ファイルを排除し、ミッションを完了してください。',
      cdRootAfterMalwareRemoved: '素晴らしい。zone1のミッションをクリアしました。**cd /**で最初のスタート地点(ルートディレクトリ)に戻りましょう。',
      cdZone2: 'おめでとうございます！zone1のミッションをクリアしたため、zone2ディレクトリが開放されています。**cd zone2**でzone2に進入する時です。'
    },
    zone2: {
      welcome: 'ゾーン2 - 量子層へようこそ。\n\nまず **ls** でディレクトリ構造を確認してください。',
      readInstructions: 'よくできました！README.txtが見つかりました。\n\n**cat README.txt** でゾーン2のミッション詳細を読みましょう。',
      followPrimes: 'READMEによると、素数が鍵となっています。\n\n番号付きディレクトリが見えますね？**cd 2** から始めましょう（2は最初の素数）。',
      nextPrime3: '素晴らしい！ディレクトリ2に入りました。\n\n素数の道を進み続けて **cd 3** を実行してください（3は次の素数）。',
      nextPrime5: '完璧です！ディレクトリ3に到達しました。\n\n**cd 5** で続けてください（3の次の素数は5）。',
      explorePrime5: 'ディレクトリ5に到達しました！\n\n**ls** で何があるか確認しましょう。',
      findHidden: 'ディレクトリは空に見えますが、量子異常は隠されていることが多いです。\n\n**ls -a** で隠しファイルとディレクトリを表示してください。',
      enterHidden: '素晴らしい！.hiddenディレクトリを発見しました。\n\n**cd .hidden** で入りましょう。',
      exploreHidden: '隠された量子空間に入りました。\n\n**ls** で潜む脅威を確認してください。',
      eliminateTarget: '量子ウイルスを検出しました！\n\n**rm quantum_virus.exe** で除去してください。',
      exploreCorrupted: 'ウイルス除去により歪んだディレクトリが出現しました！\n\n**ls** と **cd** で探索し、残りの脅威を見つけてください。',
      findMoreThreats: '歪んだディレクトリにさらなる脅威が隠されています。\n\n迷路のような構造を探索して、見つけ出して除去してください。',
      finalThreat: 'あと少しです！最後の脅威が残っています。\n\nsystem_leech.dllを見つけて除去し、ゾーン2を完了してください。',
      complete: 'ゾーン2の封じ込めに成功しました。'
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
      tutorialComplete: '[成功] チュートリアル完了！自由に探索できるようになりました。'
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
