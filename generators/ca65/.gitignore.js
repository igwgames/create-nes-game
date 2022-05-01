// Creates a gitignore file, for anyone using git to ignore the tooling/etc we install
const fs = require('fs'),
    path = require('path');

function createConfig(game, directory) {
    let gitignore = `
tools/cc65
tools/emulators
tools/nes-test
temp
nes.sh
nes.bat
./create-nes-game.exe
./create-nes-game-win.exe
./create-nes-game
./create-nes-game-*
*.nes
    `
    fs.writeFileSync(path.join(directory, '.gitignore'), gitignore);
}

createConfig.stepName = '.gitignore';

module.exports = createConfig;