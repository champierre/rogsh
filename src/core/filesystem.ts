import { VirtualDirectory, VirtualFile, FilePermissions, FileType } from '../types/filesystem.js';

export class VirtualFileSystem {
  private root: VirtualDirectory;
  private currentDirectory: VirtualDirectory;

  constructor() {
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
    // Create /srv/cluster/zone1 structure for tutorial
    const srv = this.createDirectory('srv', '/srv');
    const cluster = this.createDirectory('cluster', '/srv/cluster');
    const zone1 = this.createDirectory('zone1', '/srv/cluster/zone1');
    
    // Add directories to root
    this.root.subdirectories.set('srv', srv);
    srv.parent = this.root;
    
    // Add cluster to srv
    srv.subdirectories.set('cluster', cluster);
    cluster.parent = srv;
    
    // Add zone1 to cluster
    cluster.subdirectories.set('zone1', zone1);
    zone1.parent = cluster;
    
    // Create tutorial directories in zone1
    const bin = this.createDirectory('bin', '/srv/cluster/zone1/bin');
    const logs = this.createDirectory('logs', '/srv/cluster/zone1/logs');
    const auth = this.createDirectory('auth', '/srv/cluster/zone1/auth');
    const tmp = this.createDirectory('tmp', '/srv/cluster/zone1/tmp');
    
    zone1.subdirectories.set('bin', bin);
    zone1.subdirectories.set('logs', logs);
    zone1.subdirectories.set('auth', auth);
    zone1.subdirectories.set('tmp', tmp);
    
    bin.parent = zone1;
    logs.parent = zone1;
    auth.parent = zone1;
    tmp.parent = zone1;
    
    // Add tutorial files
    zone1.files.set('README.zone', this.createFile(
      'README.zone',
      'file',
      `Zone1 Tutorial Objective:
- Learn basic navigation with ls and cd
- Discover the corrupted.tmp file
- Terminate the zombie process
- Reduce threat level below 5
- Secure the cleanup.sh script

Type 'help' for available commands.`
    ));
    
    // Add files to bin directory
    bin.files.set('cleanup.sh', this.createFile(
      'cleanup.sh',
      'file',
      `#!/bin/bash
# Cleanup script for zone maintenance
echo "Cleaning temporary files..."
rm -f /tmp/*.tmp
echo "Cleanup complete!"`,
      {
        permissions: {
          owner: { read: true, write: true, execute: false },
          group: { read: true, write: false, execute: false },
          other: { read: false, write: false, execute: false }
        }
      }
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
[ERROR] Corruption detected in tmp/corrupted.tmp`
    ));
    
    // Add corrupted file in tmp
    tmp.files.set('corrupted.tmp', this.createFile(
      'corrupted.tmp',
      'file',
      `@#$%^&*()_+{}|:"<>?~corrupted data~@#$%^&*()`,
      { isCorrupted: true, threatLevel: 3 }
    ));
    
    // Add auth files
    auth.files.set('.creds.enc', this.createFile(
      '.creds.enc',
      'file',
      `-----BEGIN PGP MESSAGE-----
[Encrypted credentials]
-----END PGP MESSAGE-----`,
      { isHidden: true }
    ));
    
    // Set current directory to zone1 for tutorial
    this.currentDirectory = zone1;
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
    for (const [name, subdir] of targetDir.subdirectories) {
      items.push({ name, type: 'directory' });
    }

    // Add files
    for (const [name, file] of targetDir.files) {
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
    return this.currentDirectory.files.delete(filename);
  }
}