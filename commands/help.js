const appConfiguration = require('../config/app-configuration');

function run() {

// 80 column marker                                                             |
// 100 column marker                                                                                |

    console.info(`
${appConfiguration.binaryName}
Version: ${require('../package.json').version}

Utility to create and build NES games using cc65/ca65 and other tools.
Usage: ${appConfiguration.binaryName} [command]

Available game commands: 

  create - Create a new game. Automatically called if not in a ${appConfiguration.binaryName} 
           project folder.
  build - Build your game (assumes you are in the game's base folder)
  download-dependencies - Install needed tools to build and run your game (Use 
                          this after cloning from git)
  run - Run the configured emulator with your game
  test - Run unit tests for your game (if you opted to enable them)
  clean - Remove all temporary files and roms created by the tool

Miscellaneous commands:

  install - install create-nes-game globally, so you can use it anywhere
  check-update - Check for a newer version of create-nes-game manually.
  update - Replace the current binary with the latest version from github

Advanced commands:

  Individual build steps:

    compile - Compile all C code to assembly (noop in assembly projects)
    assemble - Assemble assembly & compiled c into object files
    link - Combine all object files into a nes rom your emulator can run
    stats - Show stats for the current rom, including free space
    rle - Run-length encode .chr, .nam, and .bin files in the graphics/ folder
`
    );

    return Promise.resolve();
}

module.exports = {run};