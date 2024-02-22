import os from 'os';
import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';

const homeDir = os.homedir();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (program) => {
  program
    .command('init')
    .description(
      'Copies default config file into the given path directory or inside ~/.adm',
    )
    .argument('[path]', 'directory path to copy config into')
    .action(async (targetDirectory = path.join(homeDir, '.adm')) => {
      if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true });
      }

      const defaultConfigPath = path.join(__dirname, '../config.default.jsonc');
      const targetFilePath = path.resolve(targetDirectory, 'config.jsonc');

      if (fs.existsSync(targetFilePath)) {
        console.error(
          `Error: The file config.jsonc already exists in ${targetDirectory}. Please remove or rename it.`,
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
