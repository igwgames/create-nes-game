const appConfiguration = require('../config/app-configuration');

function run() {

    console.info(`
${appConfiguration.binaryName}
Version: ${require('../package.json').version}

Utility to create and build NES games using cc65/ca65 and other tools.

Available subcommands: 

  create - Create a new game. Automatically called if not in ${appConfiguration.binaryName} project folder.
  build - Build the game in this directory
  download-dependencies - Install any needed tools to build and run your game (Use this after cloning from git)
  run - Run the configured emulator with your game
  test - Run unit tests for your game (if you opted to enable them)
  clean - Remove all temporary files and roms created by the tool
  install - install create-nes-game globally, so you can use it anywhere

Advanced commands:

  Individual build steps:

    compile - Compile any C in the project to assembly (noop in assembly projects)
    assemble - Assemble assembly in the project & any compiled c into object files
    link - Assemble all object files into a nes rom your emulator can run
    stats - Show stats for the current rom, including free space
`
    );

    return Promise.resolve();
}

module.exports = {run};