const readline = require('readline');
const History = require('./history');
const packageInfo = require('../package.json');

module.exports = (callback) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
  });

  const history = new History();

  console.log(`Welcome to ADM CLI v${packageInfo.version}.`);
  console.log('Type "help" for more information.');

  process.stdin.on('keypress', (eventName, key) => {
    if (key.name === 'up') {
      const line = history.back(rl.line);

      if (line) {
        rl.write(null, { ctrl: true, name: 'u' });

        rl.write(line);
      }
    }

    if (key.name === 'down') {
      rl.write(null, { ctrl: true, name: 'u' });

      rl.write(history.next(rl.line));
    }
  });

  let isTryingToExit = false;

  rl.on('SIGINT', () => {
    if (rl.line !== '') {
      console.log();
      rl.write(null, { ctrl: true, name: 'u' });
      rl.prompt();
    } else if (isTryingToExit) {
      process.exit();
    } else {
      isTryingToExit = true;

      console.log('\n(To exit, press Ctrl+C again)');
      rl.prompt(true);
    }
  });

  rl.on('line', async (line) => {
    isTryingToExit = false;

    history.add(line);

    if (line === 'clear') {
      console.clear();
    } else {
      rl.pause();

      try {
        await callback(line);
      } catch (err) {
        console.error(err);
        console.log();
      }
    }

    rl.prompt(true);
  });

  rl.prompt(true);
};
