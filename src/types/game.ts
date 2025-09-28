export interface GameState {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  diskUsage: number;
  maxDiskUsage: number;
  threatLevel: number;
  knowledge: number;
  currentDepth: number;
  currentPath: string;
  turnCount: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export interface Process {
  pid: number;
  name: string;
  type: ProcessType;
  threatLevel: number;
  hp: number;
  maxHp: number;
  cmd: string;
  status: 'active' | 'zombie' | 'sleeping';
}

export type ProcessType = 
  | 'ZombieProcess' 
  | 'LogLeech' 
  | 'ForkSprite' 
  | 'PermissionWraith' 
  | 'PortSpecter' 
  | 'CryptoCrawler'
  | 'System';

export interface GameEvent {
  type: 'combat' | 'discovery' | 'system' | 'tutorial' | 'quest';
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
}

export interface Zone1ProgressFlags {
  listedRoot: boolean;
  enteredZone1: boolean;
  listedZone1: boolean;
  readReadme: boolean;
  enteredTmp: boolean;
  listedTmp: boolean;
  removedVirus: boolean;
  enteredLogs: boolean;
  listedLogs: boolean;
  revealedHidden: boolean;
  enteredHidden: boolean;
  listedHidden: boolean;
  removedMalware: boolean;
  enteredZone2: boolean;
  lastZone1Directory: string;
}

export interface Zone2ProgressFlags {
  enteredZone2: boolean;
  shownHelpNotification: boolean;
  listedZone2Root: boolean;
  readInstructions: boolean;
  enteredPrimePath: boolean;
  enteredDir2: boolean;
  enteredDir3: boolean;
  enteredDir5: boolean;
  listedDir5: boolean;
  revealedQuantumHidden: boolean;
  enteredHidden: boolean;
  listedHidden: boolean;
  removedQuantumVirus: boolean;
  exploredCorrupted: boolean;
  foundDataCorruptor: boolean;
  removedDataCorruptor: boolean;
  foundSystemLeech: boolean;
  removedSystemLeech: boolean;
  currentPath: string;
}

export interface GameProgressFlags {
  zone1: Zone1ProgressFlags;
  zone2: Zone2ProgressFlags;
}
