import { Zone2ProgressFlags } from '../../types/game.js';
import { messages } from '../../i18n/messages.js';

import type { TutorialUpdateContext } from './zone1.js';

export const createInitialZone2Flags = (): Zone2ProgressFlags => ({
  enteredZone2: false,
  shownHelpNotification: false,
  listedZone2Root: false,
  readInstructions: false,
  enteredPrimePath: false,
  enteredDir2: false,
  enteredDir3: false,
  enteredDir5: false,
  listedDir5: false,
  revealedQuantumHidden: false,
  enteredHidden: false,
  listedHidden: false,
  removedQuantumVirus: false,
  exploredCorrupted: false,
  foundDataCorruptor: false,
  removedDataCorruptor: false,
  foundSystemLeech: false,
  removedSystemLeech: false,
  currentPath: ''
});

const hasAllOption = (args: string[]): boolean =>
  args.some((arg) => {
    if (arg === '-a' || arg === '--all') {
      return true;
    }
    return arg.startsWith('-') && arg.includes('a');
  });

export const updateZone2Flags = (flags: Zone2ProgressFlags, ctx: TutorialUpdateContext): void => {
  const { command, args, success, currentPath } = ctx;

  // Always track current path
  flags.currentPath = currentPath;

  // Passive tracking even on failures
  if (currentPath.startsWith('/zone2')) {
    flags.enteredZone2 = true;
  }

  if (!command || !success) {
    return;
  }

  const lowerCommand = command.toLowerCase();

  if (lowerCommand === 'ls') {
    if (currentPath === '/zone2') {
      flags.listedZone2Root = true;
    }
    if (currentPath === '/zone2/2/3/5') {
      flags.listedDir5 = true;
    }
    if (currentPath.startsWith('/zone2/2/3/5') && hasAllOption(args)) {
      flags.revealedQuantumHidden = true;
    }
    if (currentPath === '/zone2/2/3/5/.hidden') {
      flags.listedHidden = true;
    }
    // Check if exploring corrupted directories
    if (currentPath.includes('/.hidden/') && currentPath !== '/zone2/2/3/5/.hidden') {
      flags.exploredCorrupted = true;
    }
  }

  if (lowerCommand === 'cd') {
    if (currentPath === '/zone2/2') {
      flags.enteredDir2 = true;
      flags.enteredPrimePath = true;
    }
    if (currentPath === '/zone2/2/3') {
      flags.enteredDir3 = true;
    }
    if (currentPath === '/zone2/2/3/5') {
      flags.enteredDir5 = true;
    }
    if (currentPath === '/zone2/2/3/5/.hidden') {
      flags.enteredHidden = true;
    }
  }

  if (lowerCommand === 'cat' && args[0]) {
    const target = args[0];
    const normalized = target.startsWith('./') ? target.slice(2) : target;
    if (currentPath === '/zone2' && (normalized === 'README.txt' || normalized.endsWith('/README.txt'))) {
      flags.readInstructions = true;
    }
  }

  if (lowerCommand === 'rm' && args[0]) {
    const target = args[0];
    if (target === 'quantum_virus.exe') {
      flags.removedQuantumVirus = true;
    }
    if (target === 'data_corruptor.bin') {
      flags.removedDataCorruptor = true;
    }
    if (target === 'system_leech.dll') {
      flags.removedSystemLeech = true;
    }
  }
};

export const getZone2Hint = (flags: Zone2ProgressFlags, locale: 'ja' | 'en') => {
  if (!flags.enteredZone2) {
    return null;
  }

  const msg = messages[locale].zone2;

  // Step 1: List files first
  if (!flags.listedZone2Root) {
    return { description: msg.welcome, key: 'zone2.welcome' };
  }

  // Step 2: Read README
  if (!flags.readInstructions) {
    return { description: msg.readInstructions, key: 'zone2.readInstructions' };
  }

  // Step 3: Enter first prime directory
  if (!flags.enteredDir2) {
    return { description: msg.followPrimes, key: 'zone2.followPrimes' };
  }

  // Step 4: Continue to next prime
  if (!flags.enteredDir3) {
    return { description: msg.nextPrime3, key: 'zone2.nextPrime3' };
  }

  // Step 5: Continue to next prime
  if (!flags.enteredDir5) {
    return { description: msg.nextPrime5, key: 'zone2.nextPrime5' };
  }

  // Step 6: List directory 5
  if (!flags.listedDir5) {
    return { description: msg.explorePrime5, key: 'zone2.explorePrime5' };
  }

  // Step 7: Find hidden directory
  if (!flags.revealedQuantumHidden) {
    return { description: msg.findHidden, key: 'zone2.findHidden' };
  }

  // Step 8: Enter hidden directory
  if (!flags.enteredHidden) {
    return { description: msg.enterHidden, key: 'zone2.enterHidden' };
  }

  // Step 9: List hidden directory contents
  if (!flags.listedHidden) {
    return { description: msg.exploreHidden, key: 'zone2.exploreHidden' };
  }

  // Step 10: First virus elimination
  if (!flags.removedQuantumVirus) {
    return { description: msg.eliminateTarget, key: 'zone2.eliminateTarget' };
  }

  // Step 11: Explore corrupted directories
  if (!flags.exploredCorrupted) {
    return { description: msg.exploreCorrupted, key: 'zone2.exploreCorrupted' };
  }

  // Step 12: Find and remove remaining threats
  if (!flags.removedDataCorruptor) {
    return { description: msg.findMoreThreats, key: 'zone2.findMoreThreats' };
  }

  // Step 13: Final threat
  if (!flags.removedSystemLeech) {
    return { description: msg.finalThreat, key: 'zone2.finalThreat' };
  }

  return null;
};
