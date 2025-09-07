export type FileType = 'file' | 'directory' | 'symlink' | 'archive';

export interface FilePermissions {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  other: { read: boolean; write: boolean; execute: boolean };
}

export interface VirtualFile {
  name: string;
  type: FileType;
  content?: string;
  size: number;
  permissions: FilePermissions;
  owner: string;
  group: string;
  modified: Date;
  created: Date;
  isHidden: boolean;
  isCorrupted?: boolean;
  threatLevel?: number;
  linkTarget?: string;
}

export interface VirtualDirectory {
  name: string;
  path: string;
  files: Map<string, VirtualFile>;
  subdirectories: Map<string, VirtualDirectory>;
  parent?: VirtualDirectory;
  description?: string;
  isExplored: boolean;
}