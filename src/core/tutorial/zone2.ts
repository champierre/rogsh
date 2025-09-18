import { Zone2ProgressFlags } from '../../types/game.js';
import { messages } from '../../i18n/messages.js';

import type { TutorialUpdateContext } from './zone1.js';

export const createInitialZone2Flags = (): Zone2ProgressFlags => ({
  enteredZone2: false,
  listedZone2Root: false,
  readInstructions: false,
  enteredPrimePath: false,
  revealedQuantumHidden: false,
  removedQuantumVirus: false,
  removedDataCorruptor: false,
  removedSystemLeech: false
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

    if (currentPath.startsWith('/zone2/2/3/5') && hasAllOption(args)) {
      flags.revealedQuantumHidden = true;
    }
  }

  if (lowerCommand === 'cd') {
    if (currentPath === '/zone2/2' || currentPath.startsWith('/zone2/2/')) {
      flags.enteredPrimePath = true;
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

  if (!flags.readInstructions) {
    return { description: msg.readInstructions.description, hint: msg.readInstructions.hint, key: 'zone2.readInstructions' };
  }

  if (!flags.listedZone2Root && !flags.removedQuantumVirus) {
    return { description: msg.welcome.description, hint: msg.welcome.hint, key: 'zone2.welcome' };
  }

  if (!flags.enteredPrimePath && !flags.removedQuantumVirus) {
    return { description: msg.followPrimes.description, hint: msg.followPrimes.hint, key: 'zone2.followPrimes' };
  }

  if (!flags.revealedQuantumHidden && !flags.removedQuantumVirus) {
    return { description: msg.findHidden.description, hint: msg.findHidden.hint, key: 'zone2.findHidden' };
  }

  if (!flags.removedQuantumVirus) {
    return { description: msg.eliminateTarget.description, hint: msg.eliminateTarget.hint, key: 'zone2.eliminateTarget' };
  }

  return null;
};
