// Creates create-nes-game.conf with all of the defined configuration in the game folder.

const fs = require('fs'),
    path = require('path');

function createConfig(game, directory) {
    fs.writeFileSync(path.join(directory, '.create-nes-game.config.json'), game.toString());
}

createConfig.stepName = 'main.asm';

module.exports = createConfig;