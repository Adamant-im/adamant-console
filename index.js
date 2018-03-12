#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const admConsole = require('vorpal')()

const opsDir = path.join(__dirname, 'ops')

fs.readdirSync(opsDir).forEach((operation) => {
    const operationPath = path.join(opsDir, operation)
    const operationComponent = require(operationPath)
    admConsole.use(operationComponent)
});

admConsole.find('help').alias('?')
admConsole.find('exit').alias('q')

if (process.argv.length > 2) {
  admConsole
  .parse(process.argv);

}
else {
  admConsole
  .delimiter('adm:')
  .show()
  .parse(process.argv)
}