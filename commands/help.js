module.exports = function() {

    console.info(`
create-nes-game
Version: ${require('../package.json').version}

Utility to create and build NES games using cc65/ca65 and other tools.

Available subcommands: 

  create - Create a new game. Automatically called if not in create-nes-game project folder.
  build - Build the game in this directory
  run - Run the configured emulator with your game
`
    );
}
