import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Get the version from package.json
 */
export function getVersion(): string {
  try {
    // Get the directory of the current module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Navigate up to find package.json (from src/utils to root)
    const packageJsonPath = join(__dirname, '..', '..', 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    return packageJson.version || '0.0.0';
  } catch (error) {
    // Fallback version if package.json cannot be read
    return '0.2.1';
  }
}