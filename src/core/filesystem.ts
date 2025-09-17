import { VirtualDirectory, VirtualFile, FilePermissions, FileType } from '../types/filesystem.js';
import { messages } from '../i18n/messages.js';

export class VirtualFileSystem {
  private root: VirtualDirectory;
  private currentDirectory: VirtualDirectory;
  private locale: 'ja' | 'en';
  private zone2: VirtualDirectory | null = null;
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

    // Create directories in zone2
    const zone2_data = this.createDirectory('data', '/zone2/data');
    const zone2_cache = this.createDirectory('cache', '/zone2/cache');
    const zone2_system = this.createDirectory('system', '/zone2/system');

    this.zone2.subdirectories.set('data', zone2_data);
    this.zone2.subdirectories.set('cache', zone2_cache);
    this.zone2.subdirectories.set('system', zone2_system);

    zone2_data.parent = this.zone2;
    zone2_cache.parent = this.zone2;
    zone2_system.parent = this.zone2;

    // Add zone2 files
    this.zone2.files.set('README.txt', this.createFile(
      'README.txt',
      'file',
      `ZONE 2 STATUS REPORT
====================

Agent-7, welcome to Zone 2 operations area.

CURRENT THREAT ASSESSMENT:
- Multiple corrupted processes detected
- System stability at 67%
- Advanced malware signatures present

OBJECTIVES:
- Investigate data corruption in /data directory
- Neutralize hostile processes
- Restore system integrity above 85%

Zone 2 contains more sophisticated threats.
Proceed with enhanced caution protocols.`
    ));

    // Add corrupted files in zone2
    zone2_data.files.set('corrupt.db', this.createFile(
      'corrupt.db',
      'file',
      `[DATABASE CORRUPTION DETECTED]
CRITICAL: Core data compromised
This file contains infected database entries.
Advanced removal protocols required.`,
      { isCorrupted: true, threatLevel: 7 }
    ));

    zone2_cache.files.set('malware.cache', this.createFile(
      'malware.cache',
      'file',
      `[MALWARE CACHE DETECTED]
WARNING: Persistent threat vector
Automated replication system active
Requires immediate elimination.`,
      { isCorrupted: true, threatLevel: 6 }
    ));
    
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
    if (success && file && (filename === 'virus.exe' || filename === 'malware.dat')) {
      this.deletedHostileFiles.add(filename);

      // Check if both hostile files have been deleted
      if (this.deletedHostileFiles.has('virus.exe') && this.deletedHostileFiles.has('malware.dat')) {
        this.unlockZone2();
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

  isZone2Unlocked(): boolean {
    return this.root.subdirectories.has('zone2');
  }

  areAllHostileFilesDeleted(): boolean {
    return this.deletedHostileFiles.has('virus.exe') && this.deletedHostileFiles.has('malware.dat');
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
  }
}