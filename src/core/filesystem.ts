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

    // Add enemy file in hidden directory
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

  getCurrentDirectory(): VirtualDirectory {
    return this.currentDirectory;
  }

  getRoot(): VirtualDirectory {
    return this.root;
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
      if (dirPath && !this.navigateToDirectory(dirPath, dir)) {
        return null;
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

  findFiles(pattern: string, dir?: VirtualDirectory): VirtualFile[] {
    const results: VirtualFile[] = [];
    const searchDir = dir || this.currentDirectory;

    const searchRecursive = (currentDir: VirtualDirectory) => {
      for (const [name, file] of currentDir.files) {
        if (name.includes(pattern)) {
          results.push(file);
        }
      }

      for (const [, subdir] of currentDir.subdirectories) {
        searchRecursive(subdir);
      }
    };

    searchRecursive(searchDir);
    return results;
  }

  updateFilePermissions(filename: string, permissions: Partial<FilePermissions>): boolean {
    const file = this.currentDirectory.files.get(filename);
    if (!file) return false;

    file.permissions = { ...file.permissions, ...permissions };
    return true;
  }

  deleteFile(filename: string): boolean {
    const file = this.currentDirectory.files.get(filename);
    const success = this.currentDirectory.files.delete(filename);

    // Track hostile file deletions
    if (success && file && (filename === 'virus.exe' || filename === 'malware.dat' || filename === 'quantum_virus.exe')) {
      this.deletedHostileFiles.add(filename);

      // Check if zone1 hostile files have been deleted to unlock zone2
      if (this.deletedHostileFiles.has('virus.exe') && this.deletedHostileFiles.has('malware.dat')) {
        this.unlockZone2();
      }

      // Check if quantum_virus.exe has been deleted to unlock zone3 and add prime directories
      if (this.deletedHostileFiles.has('quantum_virus.exe')) {
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
    const primeDir3 = this.createDirectory('k41fR139j9', '/zone2/2/3/5/.quantum/k41fR139j9');   // contains 41, 139
    const primeDir4 = this.createDirectory('x67hT211qv', '/zone2/2/3/5/.quantum/x67hT211qv');   // contains 67, 211

    this.quantumDir.subdirectories.set('zU17xq71egh', primeDir1);
    this.quantumDir.subdirectories.set('m23nP101wz', primeDir2);
    this.quantumDir.subdirectories.set('k41fR139j9', primeDir3);
    this.quantumDir.subdirectories.set('x67hT211qv', primeDir4);

    primeDir1.parent = this.quantumDir;
    primeDir2.parent = this.quantumDir;
    primeDir3.parent = this.quantumDir;
    primeDir4.parent = this.quantumDir;

    // Add README files in each prime directory with cryptic clues
    const primeClue = this.locale === 'ja'
      ? `深層数学的パターン検出システム

エージェント-7、このディレクトリ名には数学的意味が隠されています。

ヒント: 除数を持たない純粋な整数を探せ
より大きな素数が、より深い真実へと導く`
      : `DEEP MATHEMATICAL PATTERN DETECTION SYSTEM

Agent-7, this directory name contains mathematical significance.

HINT: Seek pure integers that have no divisors
Larger primes lead to deeper truths`;

    primeDir1.files.set('analysis.log', this.createFile(
      'analysis.log',
      'file',
      primeClue
    ));

    primeDir2.files.set('analysis.log', this.createFile(
      'analysis.log',
      'file',
      primeClue
    ));

    primeDir3.files.set('analysis.log', this.createFile(
      'analysis.log',
      'file',
      primeClue
    ));

    primeDir4.files.set('analysis.log', this.createFile(
      'analysis.log',
      'file',
      primeClue
    ));
  }

  isZone2Unlocked(): boolean {
    return this.root.subdirectories.has('zone2');
  }

  isZone3Unlocked(): boolean {
    return this.root.subdirectories.has('zone3');
  }

  areAllHostileFilesDeleted(): boolean {
    return this.deletedHostileFiles.has('virus.exe') && this.deletedHostileFiles.has('malware.dat');
  }

  isZone2Completed(): boolean {
    return this.deletedHostileFiles.has('quantum_virus.exe');
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
    if (this.deletedHostileFiles.has('quantum_virus.exe')) {
      this.unlockZone3();
      this.addPrimeDirectories();
    }
  }
}