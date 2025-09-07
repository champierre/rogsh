import { Process, ProcessType } from '../types/game.js';

export interface KillResult {
  success: boolean;
  processType?: ProcessType;
  threatReduction: number;
}

export class ProcessManager {
  private processes: Map<number, Process>;
  private nextPid: number;

  constructor() {
    this.processes = new Map();
    this.nextPid = 100;
    this.initializeTutorialProcesses();
  }

  private initializeTutorialProcesses(): void {
    // Add system processes
    this.addProcess({
      pid: 1,
      name: 'init',
      type: 'System',
      threatLevel: 0,
      hp: 100,
      maxHp: 100,
      cmd: '/sbin/init',
      status: 'active'
    });

    // Add tutorial enemy process
    this.addProcess({
      pid: 114,
      name: 'zombie_handler',
      type: 'ZombieProcess',
      threatLevel: 4,
      hp: 20,
      maxHp: 20,
      cmd: '[defunct]',
      status: 'zombie'
    });

    // Add LogLeech
    this.addProcess({
      pid: 203,
      name: 'log_monitor',
      type: 'LogLeech',
      threatLevel: 3,
      hp: 30,
      maxHp: 30,
      cmd: 'tail -f error.log',
      status: 'active'
    });
  }

  addProcess(process: Process): void {
    this.processes.set(process.pid, process);
  }

  killProcess(pid: number): KillResult {
    const process = this.processes.get(pid);
    
    if (!process) {
      return { success: false, threatReduction: 0 };
    }

    if (process.type === 'System') {
      return { success: false, threatReduction: 0 };
    }

    const threatReduction = process.threatLevel;
    this.processes.delete(pid);

    return {
      success: true,
      processType: process.type,
      threatReduction
    };
  }

  listProcesses(): Process[] {
    return Array.from(this.processes.values());
  }

  getProcess(pid: number): Process | undefined {
    return this.processes.get(pid);
  }

  spawnProcess(type: ProcessType, threatLevel: number): Process {
    const pid = this.nextPid++;
    
    const processTemplates: Record<ProcessType, Partial<Process>> = {
      ZombieProcess: {
        name: 'zombie_proc',
        hp: 20,
        maxHp: 20,
        cmd: '[defunct]',
        status: 'zombie'
      },
      LogLeech: {
        name: 'log_leech',
        hp: 30,
        maxHp: 30,
        cmd: 'tail -f *.log',
        status: 'active'
      },
      ForkSprite: {
        name: 'fork_sprite',
        hp: 25,
        maxHp: 25,
        cmd: 'spawn_child.sh',
        status: 'active'
      },
      PermissionWraith: {
        name: 'perm_wraith',
        hp: 40,
        maxHp: 40,
        cmd: 'chmod_daemon',
        status: 'active'
      },
      PortSpecter: {
        name: 'port_specter',
        hp: 35,
        maxHp: 35,
        cmd: 'bind :8080',
        status: 'active'
      },
      CryptoCrawler: {
        name: 'crypto_crawler',
        hp: 45,
        maxHp: 45,
        cmd: 'encrypt.bin',
        status: 'active'
      },
      System: {
        name: 'system',
        hp: 100,
        maxHp: 100,
        cmd: 'system',
        status: 'active'
      }
    };

    const template = processTemplates[type];
    const newProcess: Process = {
      pid,
      type,
      threatLevel,
      ...template
    } as Process;

    this.addProcess(newProcess);
    return newProcess;
  }

  updateProcesses(): void {
    // Update process states each turn
    for (const [pid, process] of this.processes) {
      // ForkSprite spawns children
      if (process.type === 'ForkSprite' && Math.random() < 0.15) {
        this.spawnProcess('ForkSprite', 2);
      }
    }
  }

  getTotalThreatLevel(): number {
    let total = 0;
    for (const process of this.processes.values()) {
      if (process.type !== 'System') {
        total += process.threatLevel;
      }
    }
    return total;
  }
}