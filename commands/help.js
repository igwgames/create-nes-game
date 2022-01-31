const appConfiguration = require('../config/app-configuration');

function run() {

    console.info(`
${appConfiguration.binaryName}
Version: ${require('../package.json').version}

Utility to create and build NES games using cc65/ca65 and other tools.

Available subcommands: 

  create - Create a new game. Automatically called if not in ${appConfiguration.binaryName} project folder.
  build - Build the game in this directory
  run - Run the configured emulator with your game
`
    );

    return Promise.resolve();
}

module.exports = {run};