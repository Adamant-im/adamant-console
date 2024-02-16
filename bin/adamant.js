#!/usr/bin/env node

import { program, CommanderError } from 'commander';
import chalk from 'chalk';
import { parse as parseShell } from 'shell-quote';

import { satisfies } from 'semver';
import leven from 'leven';

import prompt from '../prompt/index.js';

import { log } from '../utils/log.js';
import config from '../utils/config.js';

import packageInfo from '../package.json' assert { type: 'json' };

import installAccountCommands from '../lib/account.js';
import installGetCommands from '../lib/get.js';
import installNodeCommands from '../lib/node.js';
import installSendCommands from '../lib/send.js';
import installRpcServerCommands from '../lib/rpc.js';
import installDelegateCommands from '../lib/delegate.js';
import installVoteCommands from '../lib/vote.js';

const INTERACTIVE_MODE = process.argv.length < 3;

if (INTERACTIVE_MODE) {
  program.exitOverride();
}

const requiredVersion = packageInfo.engines.node;

const checkNodeVersion = (wanted, id) => {
  if (!satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(
      chalk.red(
        `You are using Node ${process.version}, but this version of ${id}` +
          ` requires Node ${wanted}.\nPlease upgrade your Node version.`,
      ),
    );

    process.exit(1);
  }
};

checkNodeVersion(requiredVersion, 'adamant-console');

const suggestCommands = (unknownCommand) => {
  const availableCommands = program.commands.map((cmd) => cmd._name);

  let suggestion;

  availableCommands.forEach((cmd) => {
    const isBestMatch =
      leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand);

    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });

  if (suggestion) {
    console.log();
    console.log(`  ${chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`)}`);
  }
};

program
  .name('adm')
  .version(`adm ${packageInfo.version}`)
  .usage('<type> <command> [options]')
  .option('-p, --passphrase <phrase>', 'account passphrase');

installAccountCommands(program);
installGetCommands(program);
installNodeCommands(program);
installSendCommands(program);
installRpcServerCommands(program);
installDelegateCommands(program);
installVoteCommands(program);

const client = program.command('client');

client.command('version').action(() => {
  log({
    success: true,
    version: packageInfo.version,
  });
});

program.on('option:passphrase', () => {
  config.passphrase = program.opts().passphrase;
});

// output help information on unknown commands
program.on('command:*', ([cmd]) => {
  program.outputHelp();

  console.log(`  ${chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`);

  suggestCommands(cmd);

  process.exitCode = 1;
});

// add some useful info on help
program.on('--help', () => {
  console.log();
  console.log(
    `  Run ${chalk.cyan('adm <command> --help')} for detailed usage of given command.`,
  );
  console.log();
});

if (INTERACTIVE_MODE) {
  prompt(async (command) => {
    try {
      await program.parseAsync(parseShell(command), { from: 'user' });
    } catch (err) {
      if (!(err instanceof CommanderError)) {
        console.log(err);
      }
    }
  });
} else {
  program.parse(process.argv);
}
