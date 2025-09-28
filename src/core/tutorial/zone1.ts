import { Zone1ProgressFlags } from '../../types/game.js';

export interface TutorialUpdateContext {
  command: string | null;
  args: string[];
  success: boolean;
  previousPath: string;
  currentPath: string;
}

export const createInitialZone1Flags = (): Zone1ProgressFlags => ({
  listedRoot: false,
  enteredZone1: false,
  listedZone1: false,
  readReadme: false,
  enteredTmp: false,
  listedTmp: false,
  removedVirus: false,
  enteredLogs: false,
  listedLogs: false,
  revealedHidden: false,
  enteredHidden: false,
  listedHidden: false,
  removedMalware: false,
  enteredZone2: false,
  lastZone1Directory: ''
});

const hasAllOption = (args: string[]): boolean =>
  args.some((arg) => {
    if (arg === '-a' || arg === '--all') {
      return true;
    }
    return arg.startsWith('-') && arg.includes('a');
  });

export const updateZone1Flags = (flags: Zone1ProgressFlags, ctx: TutorialUpdateContext): void => {
  const { command, args, success, currentPath } = ctx;

  if (currentPath.startsWith('/zone1')) {
    flags.enteredZone1 = true;
    flags.lastZone1Directory = currentPath;
  }

  if (!command || !success) {
    if (currentPath.startsWith('/zone2')) {
      flags.enteredZone2 = true;
    }
    return;
  }

  const lowerCommand = command.toLowerCase();

  if (lowerCommand === 'cd') {
    flags.lastZone1Directory = currentPath;

    if (currentPath.startsWith('/zone1')) {
      flags.enteredZone1 = true;
    }
    if (currentPath === '/zone1/tmp') {
      flags.enteredTmp = true;
    }
    if (currentPath === '/zone1/logs') {
      flags.enteredLogs = true;
    }
    if (currentPath === '/zone1/logs/.hidden') {
      flags.enteredHidden = true;
    }
    if (currentPath.startsWith('/zone2')) {
      flags.enteredZone2 = true;
    }
  }

  if (lowerCommand === 'ls') {
    switch (currentPath) {
      case '/':
        flags.listedRoot = true;
        break;
      case '/zone1':
        flags.listedZone1 = true;
        break;
      case '/zone1/tmp':
        flags.listedTmp = true;
        break;
      case '/zone1/logs':
        flags.listedLogs = true;
        if (hasAllOption(args)) {
          flags.revealedHidden = true;
        }
        break;
      case '/zone1/logs/.hidden':
        flags.listedHidden = true;
        break;
      default:
        break;
    }
  }

  if (lowerCommand === 'cat' && args[0]) {
    const target = args[0];
    const normalized = target.startsWith('./') ? target.slice(2) : target;
    if (currentPath.startsWith('/zone1') && (normalized === 'README.txt' || normalized.endsWith('/README.txt'))) {
      flags.readReadme = true;
    }
  }

  if (lowerCommand === 'rm' && args[0]) {
    const target = args[0];
    if (target === 'virus.exe') {
      flags.removedVirus = true;
    }
    if (target === 'malware.dat') {
      flags.removedMalware = true;
    }
  }

  if (currentPath.startsWith('/zone2')) {
    flags.enteredZone2 = true;
  }
};

export const getZone1Hint = (flags: Zone1ProgressFlags): string | null => {
  if (flags.lastZone1Directory == null) {
    flags.lastZone1Directory = '';
  }

  if (!flags.enteredZone1) {
    if (!flags.listedRoot) {
      return 'lsAtRoot';
    }
    return 'cdZone1FromRoot';
  }

  if (!flags.listedZone1) {
    if (flags.lastZone1Directory === '/zone1') {
      return 'lsAtZone1';
    }
    return 'cdZone1';
  }

  if (!flags.readReadme) {
    if (flags.lastZone1Directory === '/zone1') {
      return 'catReadme';
    }
    return 'cdZone1AndCatReadme';
  }

  if (!flags.enteredTmp) {
    if (flags.lastZone1Directory === '/zone1') {
      return 'cdTmpFromZone1';
    }
    return 'cdTmp';
  }

  if (!flags.listedTmp) {
    if (flags.lastZone1Directory === '/zone1/tmp') {
      return 'lsAtTmp';
    }
    return 'cdTmp';
  }

  if (!flags.removedVirus) {
    if (flags.lastZone1Directory === '/zone1/tmp') {
      return 'rmVirus';
    }
    return 'cdTmp';
  }

  if (!flags.enteredLogs) {
    if (flags.lastZone1Directory === '/zone1/tmp') {
      return 'cdZone1AfterVirusRemoved';
    }
    if (flags.lastZone1Directory === '/zone1') {
      return 'cdLogsFromZone1';
    }
    return 'cdLogs';
  }

  if (!flags.listedLogs) {
    if (flags.lastZone1Directory === '/zone1/logs') {
      return 'lsAtLogs';
    }
    return 'cdLogs';
  }

  if (!flags.revealedHidden) {
    if (flags.lastZone1Directory === '/zone1/logs') {
      return 'lsAllAtLogs';
    }
    return 'cdLogs';
  }

  if (!flags.enteredHidden) {
    if (flags.lastZone1Directory === '/zone1/logs') {
      return 'cdHiddenFromLogs';
    }
    return 'cdHidden';
  }

  if (!flags.listedHidden) {
    if (flags.lastZone1Directory === '/zone1/logs/.hidden') {
      return 'lsAtHidden';
    }
    return 'cdHidden';
  }

  if (!flags.removedMalware) {
    if (flags.lastZone1Directory === '/zone1/logs/.hidden') {
      return 'rmMalware';
    }
    return 'cdHidden';
  }

  if (!flags.enteredZone2) {    
    if (flags.lastZone1Directory === '/') {
      return 'cdZone2';
    }
    return 'cdRootAfterMalwareRemoved';
  }

  return null;
};
