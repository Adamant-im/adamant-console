import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Parsed root package metadata used by CLI version and engine checks.
 *
 * @type {object}
 */
export const packageInfo = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'),
);
