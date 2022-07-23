// Creates a gitignore file, for anyone using git to ignore the tooling/etc we install
const fs = require('fs'),
    path = require('path');

function createConfig(game, directory) {
    let gitignore = `
# Tools are installed by the download-dependencies sub-command
tools/cc65
tools/emulators
tools/nes-test
temp
# If you have this tool in the folder, don't commit it!
./create-nes-game.exe
./create-nes-game-win.exe
./create-nes-game
./create-nes-game-*
*.nes
# Run-length encoded files
graphics/*.rle.nam
graphics/*.rle.bin
graphics/*.rle.chr
# Automatically generated music files
sound/music.asm
sound/sfx.asm
    `
    fs.writeFileSync(path.join(directory, '.gitignore'), gitignore);
}

createConfig.stepName = '.gitignore';

module.exports = createConfig;