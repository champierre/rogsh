import chalk from 'chalk';

/**
 * Formats text with markup, applying base color and emphasis color to marked sections
 * Markup format: **text** for emphasis
 */
export function formatWithMarkup(
  text: string,
  baseColor: (input: string) => string,
  emphasisColor: (input: string) => string
): string {
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  return segments
    .filter(segment => segment.length > 0)
    .map(segment => {
      if (segment.startsWith('**') && segment.endsWith('**')) {
        const inner = segment.slice(2, -2);
        return emphasisColor(inner);
      }
      return baseColor(segment);
    })
    .join('');
}

/**
 * Formats text with cyan base and cyan bold emphasis
 */
export function formatCyanWithBold(text: string): string {
  return formatWithMarkup(
    text,
    (value: string) => chalk.cyan(value),
    (value: string) => chalk.cyan.bold(value)
  );
}

/**
 * Formats text with green base and green bold emphasis
 */
export function formatGreenWithBold(text: string): string {
  return formatWithMarkup(
    text,
    (value: string) => chalk.green(value),
    (value: string) => chalk.green.bold(value)
  );
}

/**
 * Adds hint key to output if showKey is true
 */
export function addHintKey(output: string, key: string | undefined, showKey: boolean): string {
  if (showKey && key) {
    return output + `\n\n${chalk.gray(`[hint key: ${key}]`)}`;
  }
  return output;
}

/**
 * Gets appropriate color for a file based on its properties
 * Only colors corrupted/threat files, others remain uncolored
 */
export function getFileColor(file: any): (input: string) => string {
  // Only color threat/corrupted files in red
  if (file.isCorrupted) return chalk.red;
  if (file.name === 'data_corruptor.bin') return chalk.red;
  if (file.name === 'virus.exe') return chalk.red;
  if (file.name === 'malware.dat') return chalk.red;
  if (file.name === 'quantum_virus.exe') return chalk.red;
  if (file.name === 'system_leech.dll') return chalk.red;

  // All other files (including error.log, system.log, README.txt, .sh files, etc.)
  // remain uncolored - return identity function for no color
  return (text: string) => text;
}