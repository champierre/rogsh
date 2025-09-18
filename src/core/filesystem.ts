import { VirtualDirectory, VirtualFile, FilePermissions, FileType } from '../types/filesystem.js';
import { messages } from '../i18n/messages.js';

export class VirtualFileSystem {
  private root: VirtualDirectory;
  private currentDirectory: VirtualDirectory;
  private locale: 'ja' | 'en';
  private zone2: VirtualDirectory | null = null;
  private zone3: VirtualDirectory | null = null;
  private quantumDir: VirtualDirectory | null = null;
  private deletedHostileFiles: Set<string> = new Set();

  constructor(locale: 'ja' | 'en' = 'en') {
    this.locale = locale;
    this.root = this.createDirectory('/', '/');
    this.currentDirectory = this.root;
    this.initializeFilesystem();
  }

  private createDirectory(name: string, path: string): VirtualDirectory {
    return {
      name,
      path,
      files: new Map(),
      subdirectories: new Map(),
      isExplored: false
    };
  }

  private createFile(
    name: string,
    type: FileType = 'file',
    content: string = '',
    options: Partial<VirtualFile> = {}
  ): VirtualFile {
    const defaultPermissions: FilePermissions = {
      owner: { read: true, write: true, execute: false },
      group: { read: true, write: false, execute: false },
      other: { read: true, write: false, execute: false }
    };

    return {
      name,
      type,
      content,
      size: content.length,
      permissions: options.permissions || defaultPermissions,
      owner: options.owner || 'agent',
      group: options.group || 'cluster',
      modified: options.modified || new Date(),
      created: options.created || new Date(),
      isHidden: name.startsWith('.'),
      isCorrupted: options.isCorrupted || false,
      threatLevel: options.threatLevel || 0,
      linkTarget: options.linkTarget
    };
  }

  private initializeFilesystem(): void {
    // Create zone1 structure directly under root
    const zone1 = this.createDirectory('zone1', '/zone1');

    // Add zone1 to root
    this.root.subdirectories.set('zone1', zone1);
    zone1.parent = this.root;

    // Create zone2 structure but don't add to root yet (unlocked when hostile files are deleted)
    this.zone2 = this.createDirectory('zone2', '/zone2');

    // Create zone3 structure but don't add to root yet (unlocked when quantum_virus.exe is deleted)
    this.zone3 = this.createDirectory('zone3', '/zone3');

    // Add zone3 README
    const zone3ReadmeContent = this.locale === 'ja'
      ? `ZONE 3 - DEEP LAYER ACCESS
=============================

Agent-7, Zone 3へようこそ。

現在この領域は開発中です。
今後のアップデートをお待ちください。

TO BE CONTINUED...`
      : `ZONE 3 - DEEP LAYER ACCESS
=============================

Agent-7, welcome to Zone 3.

This area is currently under development.
Please wait for future updates.

TO BE CONTINUED...`;

    this.zone3.files.set('README.txt', this.createFile(
      'README.txt',
      'file',
      zone3ReadmeContent
    ));

    // Create numbered directories in zone2 (prime number puzzle)
    // Path: 2 -> 3 -> 5 (all primes) -> hidden folder with enemy
    const dir2 = this.createDirectory('2', '/zone2/2');
    const dir4 = this.createDirectory('4', '/zone2/4');
    const dir6 = this.createDirectory('6', '/zone2/6');

    this.zone2.subdirectories.set('2', dir2);
    this.zone2.subdirectories.set('4', dir4);
    this.zone2.subdirectories.set('6', dir6);

    dir2.parent = this.zone2;
    dir4.parent = this.zone2;
    dir6.parent = this.zone2;

    // Second level: from dir2 (prime)
    const dir3 = this.createDirectory('3', '/zone2/2/3');
    const dir8 = this.createDirectory('8', '/zone2/2/8');

    dir2.subdirectories.set('3', dir3);
    dir2.subdirectories.set('8', dir8);

    dir3.parent = dir2;
    dir8.parent = dir2;

    // Third level: from dir3 (prime) - this is the deepest level
    const dir5 = this.createDirectory('5', '/zone2/2/3/5');
    const dir9 = this.createDirectory('9', '/zone2/2/3/9');

    dir3.subdirectories.set('5', dir5);
    dir3.subdirectories.set('9', dir9);

    dir5.parent = dir3;
    dir9.parent = dir3;

    // Hidden directory in dir5 (prime path: 2->3->5)
    const quantumDir = this.createDirectory('.quantum', '/zone2/2/3/5/.quantum');
    dir5.subdirectories.set('.quantum', quantumDir);
    quantumDir.parent = dir5;

    // Add zone2 files
    this.zone2.files.set('README.txt', this.createFile(
      'README.txt',
      'file',
      messages[this.locale].zones.zone2readme
    ));

    // Add enemy files in hidden directory
    quantumDir.files.set('quantum_virus.exe', this.createFile(
      'quantum_virus.exe',
      'file',
      `[QUANTUM VIRUS DETECTED]
THREAT LEVEL: MAXIMUM
This advanced malware has breached quantum containment.
Immediate removal required to prevent cascade failure.`,
      { isCorrupted: true, threatLevel: 10 }
    ));

    // Store reference to quantum directory for later access
    this.quantumDir = quantumDir;

    
    // Create tutorial directories in zone1
    const logs = this.createDirectory('logs', '/zone1/logs');
    const tmp = this.createDirectory('tmp', '/zone1/tmp');
    
    zone1.subdirectories.set('logs', logs);
    zone1.subdirectories.set('tmp', tmp);
    
    logs.parent = zone1;
    tmp.parent = zone1;
    
    // Add tutorial files
    zone1.files.set('README.txt', this.createFile(
      'README.txt',
      'file',
      messages[this.locale].zones.readme
    ));
    
    
    // Add log files
    logs.files.set('system.log', this.createFile(
      'system.log',
      'file',
      `[INFO] System startup initiated
[WARN] Unusual process activity detected
[ERROR] Zombie process spawned - PID 114
[INFO] Authentication module loaded
[WARN] Disk usage increasing`
    ));
    
    logs.files.set('error.log', this.createFile(
      'error.log',
      'file',
      `[ERROR] Failed to cleanup temporary files
[ERROR] Process 114 not responding
[ERROR] Corruption detected in tmp/virus.exe`
    ));
    
    // Create hidden directory in logs
    const hiddenDir = this.createDirectory('.hidden', '/zone1/logs/.hidden');
    logs.subdirectories.set('.hidden', hiddenDir);
    hiddenDir.parent = logs;
    
    // Move malware.dat to hidden directory
    hiddenDir.files.set('malware.dat', this.createFile(
      'malware.dat',
      'file',
      `[MALICIOUS DATA FILE]
THREAT LEVEL: HIGH
This file contains dangerous payloads.
Eliminate using rm command.`,
      { isCorrupted: true, threatLevel: 4 }
    ));
    
    // Add enemy files for tutorial mission
    tmp.files.set('virus.exe', this.createFile(
      'virus.exe',
      'file',
      `[HOSTILE FILE - VIRUS DETECTED]
This file is corrupting the system!
Remove immediately to secure Zone 1.`,
      { isCorrupted: true, threatLevel: 5 }
    ));
    
    
    // Start at root directory
    this.currentDirectory = this.root;
  }

  changeDirectory(path: string): boolean {
    if (path === '/') {
      this.currentDirectory = this.root;
      return true;
    }

    if (path === '..') {
      if (this.currentDirectory.parent) {
        this.currentDirectory = this.currentDirectory.parent;
        return true;
      }
      return false;
    }

    if (path === '.') {
      return true;
    }

    // Handle absolute paths
    if (path.startsWith('/')) {
      return this.navigateAbsolute(path);
    }

    // Handle relative paths
    return this.navigateRelative(path);
  }

  private navigateAbsolute(path: string): boolean {
    const parts = path.split('/').filter(p => p);
    let current = this.root;

    for (const part of parts) {
      const subdir = current.subdirectories.get(part);
      if (!subdir) {
        return false;
      }
      current = subdir;
    }

    this.currentDirectory = current;
    current.isExplored = true;
    return true;
  }

  private navigateRelative(path: string): boolean {
    const parts = path.split('/').filter(p => p);
    let current = this.currentDirectory;

    for (const part of parts) {
      if (part === '..') {
        if (current.parent) {
          current = current.parent;
        } else {
          return false;
        }
      } else if (part !== '.') {
        const subdir = current.subdirectories.get(part);
        if (!subdir) {
          return false;
        }
        current = subdir;
      }
    }

    this.currentDirectory = current;
    current.isExplored = true;
    return true;
  }

  listDirectory(dir?: VirtualDirectory): Array<VirtualFile | { name: string; type: 'directory' }> {
    const targetDir = dir || this.currentDirectory;
    const items: Array<VirtualFile | { name: string; type: 'directory' }> = [];

    // Add subdirectories
    for (const [name, _subdir] of targetDir.subdirectories) {
      items.push({ name, type: 'directory' });
    }

    // Add files
    for (const [_name, file] of targetDir.files) {
      items.push(file);
    }

    return items.sort((a, b) => {
      // Directories first, then files
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });
  }

  getFile(path: string): VirtualFile | null {
    const parts = path.split('/');
    const filename = parts.pop();
    
    if (!filename) return null;

    let dir = this.currentDirectory;
    
    if (path.startsWith('/')) {
      // Absolute path
      dir = this.root;
      const dirPath = parts.filter(p => p).join('/');
      if (dirPath) {
        const targetDir = this.navigateToDirectory(dirPath, dir);
        if (!targetDir) {
          return null;
        }
        dir = targetDir;
      }
    } else if (parts.length > 0) {
      // Relative path with directory
      const dirPath = parts.join('/');
      const savedDir = this.currentDirectory;
      if (!this.changeDirectory(dirPath)) {
        return null;
      }
      dir = this.currentDirectory;
      this.currentDirectory = savedDir; // Restore original directory
    }

    return dir.files.get(filename) || null;
  }

  private navigateToDirectory(path: string, from: VirtualDirectory): VirtualDirectory | null {
    const parts = path.split('/').filter(p => p);
    let current = from;

    for (const part of parts) {
      const subdir = current.subdirectories.get(part);
      if (!subdir) {
        return null;
      }
      current = subdir;
    }

    return current;
  }

  pwd(): string {
    return this.currentDirectory.path;
  }

  deleteFile(filename: string): boolean {
    const file = this.currentDirectory.files.get(filename);
    const success = this.currentDirectory.files.delete(filename);

    // Track hostile file deletions
    if (success && file && (filename === 'virus.exe' || filename === 'malware.dat' || filename === 'quantum_virus.exe' || filename === 'data_corruptor.bin' || filename === 'system_leech.dll')) {
      this.deletedHostileFiles.add(filename);

      // Check if zone1 hostile files have been deleted to unlock zone2
      if (this.deletedHostileFiles.has('virus.exe') && this.deletedHostileFiles.has('malware.dat')) {
        this.unlockZone2();
      }

      // Special handling for quantum_virus.exe deletion - add corrupted directories
      if (filename === 'quantum_virus.exe') {
        this.addCorruptedDirectories();
      }

      // Special handling for data_corruptor.bin deletion - add final corrupted directories
      if (filename === 'data_corruptor.bin') {
        this.addFinalCorruptedDirectories();
      }

      // Check if all zone2 hostile files have been deleted to unlock zone3 and add prime directories
      if (this.deletedHostileFiles.has('quantum_virus.exe') && this.deletedHostileFiles.has('data_corruptor.bin') && this.deletedHostileFiles.has('system_leech.dll')) {
        this.unlockZone3();
        this.addPrimeDirectories();
      }
    }

    return success;
  }

  unlockZone2(): void {
    if (this.zone2 && !this.root.subdirectories.has('zone2')) {
      this.root.subdirectories.set('zone2', this.zone2);
      this.zone2.parent = this.root;
    }
  }

  unlockZone3(): void {
    if (this.zone3 && !this.root.subdirectories.has('zone3')) {
      this.root.subdirectories.set('zone3', this.zone3);
      this.zone3.parent = this.root;
    }
  }

  addPrimeDirectories(): void {
    if (!this.quantumDir || this.quantumDir.subdirectories.size > 0) {
      return; // Already added or quantum directory not available
    }

    // Add new directories with hidden prime numbers
    // These contain 2-digit and 3-digit primes mixed with other characters
    const primeDir1 = this.createDirectory('zU17xq71egh', '/zone2/2/3/5/.quantum/zU17xq71egh'); // contains 17, 71
    const primeDir2 = this.createDirectory('m23nP101wz', '/zone2/2/3/5/.quantum/m23nP101wz');   // contains 23, 101

    this.quantumDir.subdirectories.set('zU17xq71egh', primeDir1);
    this.quantumDir.subdirectories.set('m23nP101wz', primeDir2);

    primeDir1.parent = this.quantumDir;
    primeDir2.parent = this.quantumDir;


  }

  addCorruptedDirectories(): void {
    if (!this.quantumDir) {
      return; // Quantum directory not available
    }

    // Add the 4 corrupted directories: D41a&, a!Lrt56b, yu75a, pQ234+a
    const corruptedDir1 = this.createDirectory('D41a&', '/zone2/2/3/5/.quantum/D41a&'); // contains prime 41
    const corruptedDir2 = this.createDirectory('a!Lrt56b', '/zone2/2/3/5/.quantum/a!Lrt56b');
    const corruptedDir3 = this.createDirectory('yu75a', '/zone2/2/3/5/.quantum/yu75a');
    const corruptedDir4 = this.createDirectory('pQ234+a', '/zone2/2/3/5/.quantum/pQ234+a');

    this.quantumDir.subdirectories.set('D41a&', corruptedDir1);
    this.quantumDir.subdirectories.set('a!Lrt56b', corruptedDir2);
    this.quantumDir.subdirectories.set('yu75a', corruptedDir3);
    this.quantumDir.subdirectories.set('pQ234+a', corruptedDir4);

    corruptedDir1.parent = this.quantumDir;
    corruptedDir2.parent = this.quantumDir;
    corruptedDir3.parent = this.quantumDir;
    corruptedDir4.parent = this.quantumDir;

    // Add subdirectories under D41a&: U78%a, y%@77e, wQ43au
    const subDir1 = this.createDirectory('U78%a', '/zone2/2/3/5/.quantum/D41a&/U78%a');
    const subDir2 = this.createDirectory('y%@77e', '/zone2/2/3/5/.quantum/D41a&/y%@77e');
    const subDir3 = this.createDirectory('wQ43au', '/zone2/2/3/5/.quantum/D41a&/wQ43au'); // contains prime 43

    corruptedDir1.subdirectories.set('U78%a', subDir1);
    corruptedDir1.subdirectories.set('y%@77e', subDir2);
    corruptedDir1.subdirectories.set('wQ43au', subDir3);

    subDir1.parent = corruptedDir1;
    subDir2.parent = corruptedDir1;
    subDir3.parent = corruptedDir1;

    // Add directories under wQ43au: one prime and some dummy non-prime folders
    const primeDir = this.createDirectory('p127x', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x'); // contains prime 127
    const dummyDir1 = this.createDirectory('n24k', '/zone2/2/3/5/.quantum/D41a&/wQ43au/n24k'); // 24 is not prime
    const dummyDir2 = this.createDirectory('m35j', '/zone2/2/3/5/.quantum/D41a&/wQ43au/m35j'); // 35 is not prime
    const dummyDir3 = this.createDirectory('q49z', '/zone2/2/3/5/.quantum/D41a&/wQ43au/q49z'); // 49 is not prime

    subDir3.subdirectories.set('p127x', primeDir);
    subDir3.subdirectories.set('n24k', dummyDir1);
    subDir3.subdirectories.set('m35j', dummyDir2);
    subDir3.subdirectories.set('q49z', dummyDir3);

    primeDir.parent = subDir3;
    dummyDir1.parent = subDir3;
    dummyDir2.parent = subDir3;
    dummyDir3.parent = subDir3;

    // Add .quantum directory under p127x with data_corruptor.bin
    const p127xQuantumDir = this.createDirectory('.quantum', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x/.quantum');
    primeDir.subdirectories.set('.quantum', p127xQuantumDir);
    p127xQuantumDir.parent = primeDir;

    // Add data_corruptor.bin to p127x/.quantum
    p127xQuantumDir.files.set('data_corruptor.bin', this.createFile(
      'data_corruptor.bin',
      'file',
      Buffer.from('DATA CORRUPTION ENGINE ACTIVE').toString('base64')
    ));
  }

  isZone2Unlocked(): boolean {
    return this.root.subdirectories.has('zone2');
  }

  addFinalCorruptedDirectories(): void {
    // This function is called after data_corruptor.bin is deleted
    // It adds the final puzzle: lol (101) -> Zll (211) -> lBl (181) -> .quantum -> system_leech.dll

    // Find the p127x/.quantum directory
    const zone2Dir = this.root.subdirectories.get('zone2');
    if (!zone2Dir) return;

    const dir2 = zone2Dir.subdirectories.get('2');
    if (!dir2) return;

    const dir3 = dir2.subdirectories.get('3');
    if (!dir3) return;

    const dir5 = dir3.subdirectories.get('5');
    if (!dir5) return;

    const quantumDir = dir5.subdirectories.get('.quantum');
    if (!quantumDir) return;

    const d41aDir = quantumDir.subdirectories.get('D41a&');
    if (!d41aDir) return;

    const wQ43auDir = d41aDir.subdirectories.get('wQ43au');
    if (!wQ43auDir) return;

    const p127xDir = wQ43auDir.subdirectories.get('p127x');
    if (!p127xDir) return;

    const p127xQuantumDir = p127xDir.subdirectories.get('.quantum');
    if (!p127xQuantumDir) return;

    // Add lol (101 - prime), lool (non-prime), 110 (non-prime) directories
    const lolDir = this.createDirectory('lol', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x/.quantum/lol'); // 101 is prime
    const loolDir = this.createDirectory('lool', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x/.quantum/lool'); // not prime
    const dir110 = this.createDirectory('110', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x/.quantum/110'); // 110 is not prime

    p127xQuantumDir.subdirectories.set('lol', lolDir);
    p127xQuantumDir.subdirectories.set('lool', loolDir);
    p127xQuantumDir.subdirectories.set('110', dir110);

    lolDir.parent = p127xQuantumDir;
    loolDir.parent = p127xQuantumDir;
    dir110.parent = p127xQuantumDir;

    // Under lol (101), add 22 (not prime), Zll (211 - prime), llZo (not prime)
    const dir22 = this.createDirectory('22', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x/.quantum/lol/22'); // not prime
    const zllDir = this.createDirectory('Zll', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x/.quantum/lol/Zll'); // 211 is prime
    const llZoDir = this.createDirectory('llZo', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x/.quantum/lol/llZo'); // not prime

    lolDir.subdirectories.set('22', dir22);
    lolDir.subdirectories.set('Zll', zllDir);
    lolDir.subdirectories.set('llZo', llZoDir);

    dir22.parent = lolDir;
    zllDir.parent = lolDir;
    llZoDir.parent = lolDir;

    // Under Zll (211), add lZB (not prime), Bl (not prime), 80 (not prime), lBl (181 - prime)
    const lZBDir = this.createDirectory('lZB', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x/.quantum/lol/Zll/lZB'); // not prime
    const blDir = this.createDirectory('Bl', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x/.quantum/lol/Zll/Bl'); // not prime
    const dir80 = this.createDirectory('80', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x/.quantum/lol/Zll/80'); // not prime
    const lBlDir = this.createDirectory('lBl', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x/.quantum/lol/Zll/lBl'); // 181 is prime

    zllDir.subdirectories.set('lZB', lZBDir);
    zllDir.subdirectories.set('Bl', blDir);
    zllDir.subdirectories.set('80', dir80);
    zllDir.subdirectories.set('lBl', lBlDir);

    lZBDir.parent = zllDir;
    blDir.parent = zllDir;
    dir80.parent = zllDir;
    lBlDir.parent = zllDir;

    // Add .quantum under lBl with system_leech.dll
    const finalQuantumDir = this.createDirectory('.quantum', '/zone2/2/3/5/.quantum/D41a&/wQ43au/p127x/.quantum/lol/Zll/lBl/.quantum');
    lBlDir.subdirectories.set('.quantum', finalQuantumDir);
    finalQuantumDir.parent = lBlDir;

    // Add system_leech.dll to the final .quantum directory
    finalQuantumDir.files.set('system_leech.dll', this.createFile(
      'system_leech.dll',
      'file',
      `[SYSTEM RESOURCE DRAIN]
THREAT LEVEL: CRITICAL
Consuming system resources at exponential rate.
Must be eliminated to complete zone clearance.`,
      { isCorrupted: true, threatLevel: 9 }
    ));
  }

  areAllHostileFilesDeleted(): boolean {
    return this.deletedHostileFiles.has('virus.exe') && this.deletedHostileFiles.has('malware.dat');
  }

  isZone2Completed(): boolean {
    return this.deletedHostileFiles.has('quantum_virus.exe') && this.deletedHostileFiles.has('data_corruptor.bin') && this.deletedHostileFiles.has('system_leech.dll');
  }

  getDeletedHostileFiles(): string[] {
    return Array.from(this.deletedHostileFiles);
  }

  setDeletedHostileFiles(deletedFiles: string[]): void {
    this.deletedHostileFiles = new Set(deletedFiles);

    // Check if zone2 should be unlocked based on loaded state
    if (this.areAllHostileFilesDeleted()) {
      this.unlockZone2();
    }

    // Check if zone3 should be unlocked based on loaded state
    if (this.deletedHostileFiles.has('quantum_virus.exe') && this.deletedHostileFiles.has('data_corruptor.bin') && this.deletedHostileFiles.has('system_leech.dll')) {
      this.unlockZone3();
      this.addPrimeDirectories();
    }
  }
}
