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

export interface Zone1Step {
  id: string;
  description: string;
  expectedCommand?: string;
  hint?: string;
  onComplete?: () => void;
}