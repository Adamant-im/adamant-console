import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { configFileName, configDirPath } from '../utils/config.js';
import { addHelp } from '../utils/help.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Registers the `init` command that copies the default config into a target directory.
 *
 * @param {import('commander').Command} program Commander program or subcommand
 * @returns {void}
 */
export default (program) => {
  addHelp(
    program.command('init'),
    `
Examples:
  $ adm init
  $ adm init ./adm-config
`,
  )
    .description(
      `Copies default config file into the given path directory or inside ${configDirPath}`,
    )
    .argument('[path]', 'directory path to copy config into')
    .action(async (targetDirectory = configDirPath) => {
      if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true });
      }

      const defaultConfigPath = path.join(__dirname, '../config.default.jsonc');
      const targetFilePath = path.resolve(targetDirectory, configFileName);

      if (fs.existsSync(targetFilePath)) {
        console.error(
          `Error: The file ${configFileName} already exists in '${targetDirectory}'. Please remove or rename it.`,
        );
        return;
      }

      fs.copyFile(defaultConfigPath, targetFilePath, (error) => {
        if (error) {
          console.error('Error copying the config file:', error);
        } else {
          console.log(
            `Config was successfully initialized in ${targetFilePath}`,
          );
          console.log('Edit it using the following command:');
          console.log(`    nano '${targetFilePath}'`);
        }
      });
    });
};
