#!/usr/bin/env node

const { program, CommanderError } = require('commander');
const chalk = require('chalk');
const parseShell = require('shell-quote').parse;

const semver = require('semver');
const leven = require('leven');

const prompt = require('../prompt/index');

const log = require('../utils/log');
const config = require('../utils/config');

const packageInfo = require('../package.json');
const enhanceErrorMessages = require('../utils/enhanceErrorMessages');

const requiredVersion = packageInfo.engines.node;

const checkNodeVersion = (wanted, id) => {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(chalk.red(
      `You are using Node ${process.version}, but this version of ${id}`
      + ` requires Node ${wanted}.\nPlease upgrade your Node version.`,
    ));

    process.exit(1);
  }
};

checkNodeVersion(requiredVersion, 'adamant-console');

const suggestCommands = (unknownCommand) => {
  const availableCommands = program.commands.map((cmd) => cmd._name);

  let suggestion;

  availableCommands.forEach((cmd) => {
    const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand);

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
  .version(`adm ${packageInfo.version}`)
  .usage('<type> <command> [options]')
  .option('-p, --passPhrase <phrase>', 'account pass phrase');

const installAccountCommands = require('../lib/account');
const installGetCommands = require('../lib/get');
const installNodeCommands = require('../lib/node');
const installSendCommands = require('../lib/send');
const installRpcServerCommands = require('../lib/rpc');
const installDelegateCommands = require('../lib/delegate');
const installVoteCommands = require('../lib/vote');

installAccountCommands(program);
installGetCommands(program);
installNodeCommands(program);
installSendCommands(program);
installRpcServerCommands(program);
installDelegateCommands(program);
installVoteCommands(program);

const client = program.command('client');

client
  .command('version')
  .action(() => {
    log.log({
      success: true,
      version: packageInfo.version,
    });
  });

program.on('option:passPhrase', () => {
  config.passPhrase = program.opts().passPhrase;
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
  console.log(`  Run ${chalk.cyan('adm <command> --help')} for detailed usage of given command.`);
  console.log();
});

program.commands.forEach((command) => command.on('--help', () => console.log()));

enhanceErrorMessages('missingArgument', (argName) => (
  `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
));

enhanceErrorMessages('unknownCommand', () => `Unknown command.`);

enhanceErrorMessages('unknownOption', (optionName) => (
  `Unknown option ${chalk.yellow(optionName)}.`
));

enhanceErrorMessages('optionMissingArgument', (option, flag) => (
  `Missing required argument for option ${chalk.yellow(option.flags)}${flag ? `, got ${chalk.yellow(flag)}` : ''}`
));

const INTERACTIVE_MODE = process.argv.length < 3;

if (INTERACTIVE_MODE) {
  // enhance common error messages

  program.exitOverride();

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
