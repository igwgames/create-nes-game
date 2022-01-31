const appConfiguration = require('../config/app-configuration');

function run() {

    console.info(`
${appConfiguration.binaryName}
Version: ${require('../package.json').version}

Utility to create and build NES games using cc65/ca65 and other tools.

Available subcommands: 

  create - Create a new game. Automatically called if not in ${appConfiguration.binaryName} project folder.
  build - Build the game in this directory
  install - Install any needed tools to build and run your game (Use this after cloning from git)
  run - Run the configured emulator with your game
  clean - Remove all temporary files and roms created by the tool

Advanced commands:

  Individual build steps:

    compile - Compile any C in the project to assembly (noop in assembly projects)
    assemble - Assemble assembly in the project & any compiled c into object files
    link - Assemble all object files into a nes rom your emulator can run
`
    );

    return Promise.resolve();
}

module.exports = {run};