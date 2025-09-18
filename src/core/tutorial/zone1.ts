import { Zone1ProgressFlags } from '../../types/game.js';
import { messages } from '../../i18n/messages.js';

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
  returnedRoot: false,
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
    // Even on failed commands, update passive path-based flags
    if (currentPath === '/') {
      flags.returnedRoot = true;
    }
    if (currentPath.startsWith('/zone2')) {
      flags.enteredZone2 = true;
    }
    return;
  }

  const lowerCommand = command.toLowerCase();

  if (lowerCommand === 'cd') {
    if (currentPath.startsWith('/zone1')) {
      flags.enteredZone1 = true;
      flags.lastZone1Directory = currentPath;
    }
    if (currentPath === '/zone1/tmp') {
      flags.enteredTmp = true;
    }
    if (currentPath === '/zone1/logs') {
      flags.enteredLogs = true;
    }
    if (currentPath === '/zone1/logs/.hidden') {
      flags.enteredHidden = true;
      flags.revealedHidden = true;
    }
    if (currentPath === '/') {
      flags.returnedRoot = true;
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
      flags.revealedHidden = true;
    }
  }

  // Passive updates after handling command specifics
  if (currentPath === '/') {
    flags.returnedRoot = true;
  }
  if (currentPath.startsWith('/zone2')) {
    flags.enteredZone2 = true;
  }
};

export const getZone1Hint = (flags: Zone1ProgressFlags, locale: 'ja' | 'en') => {
  const msg = messages[locale].zone1;

  if (flags.lastZone1Directory == null) {
    flags.lastZone1Directory = '';
  }

  if (!flags.enteredZone1) {
    if (!flags.listedRoot) {
      return { description: msg.welcome, key: 'zone1.welcome' };
    }
    return { description: msg.exploreDetailed, key: 'zone1.exploreDetailed' };
  }

  if (!flags.listedZone1 && !flags.enteredTmp && !flags.removedVirus) {
    return { description: msg.confirmLocation, key: 'zone1.confirmLocation' };
  }

  if (!flags.readReadme && !flags.removedVirus) {
    if (flags.lastZone1Directory !== '/zone1') {
      return { description: msg.returnToZone1Readme, key: 'zone1.returnToZone1Readme' };
    }
    return { description: msg.readReadme, key: 'zone1.readReadme' };
  }

  if (!flags.removedVirus) {
    const inTmp = flags.lastZone1Directory === '/zone1/tmp';
    if (!flags.enteredTmp) {
      return { description: msg.navigateToTmp, key: 'zone1.navigateToTmp' };
    }
    if (inTmp && !flags.listedTmp) {
      return { description: msg.confirmTmpLocation, key: 'zone1.confirmTmpLocation' };
    }
    if (inTmp) {
      return { description: msg.returnToZone1, key: 'zone1.returnToZone1' };
    }
    return { description: msg.navigateToTmp, key: 'zone1.navigateToTmp' };
  }

  if (!flags.enteredLogs) {
    return { description: msg.scanForHidden, key: 'zone1.scanForHidden' };
  }

  if (!flags.listedLogs) {
    return { description: msg.confirmLogsLocation, key: 'zone1.confirmLogsLocation' };
  }

  if (!flags.revealedHidden) {
    return { description: msg.enterHiddenDir, key: 'zone1.enterHiddenDir' };
  }

  if (!flags.enteredHidden) {
    return { description: msg.removeMalware, key: 'zone1.removeMalware' };
  }

  if (!flags.listedHidden) {
    return { description: msg.confirmHiddenLocation, key: 'zone1.confirmHiddenLocation' };
  }

  if (!flags.removedMalware) {
    return { description: msg.checkProcesses, key: 'zone1.checkProcesses' };
  }

  if (!flags.returnedRoot) {
    return { description: msg.complete, key: 'zone1.complete' };
  }

  if (!flags.enteredZone2) {
    return { description: msg.confirmRootLocation, key: 'zone1.confirmRootLocation' };
  }

  return null;
};
