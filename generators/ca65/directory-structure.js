// Creates a directory structure for ca65 games

const fs = require('fs'),
    path = require('path');

function createConfig(game, directory) {

    // First create the top-level directory. If that fails we need a specialized warning
    try {
        fs.mkdirSync(directory);
    } catch (e) {
        logger.error('Unable to create directory structure for game. File permission or other directory error', e);
        throw new Error('Unable to create directory structure for game. File permission or other directory error');
    }

    // Now let's make a few more...
    const neededDirs = ['src', 'src/assembly', 'graphics', 'tools', 'tools/emulators', 'sound', 'temp'];
    if (game.includeC) { neededDirs.push('src/c'); }

    neededDirs.forEach(thisDirectory => {
        try {
            fs.mkdirSync(path.join(directory, thisDirectory));
        } catch (e) {
            logger.error('Failed midway through creating directory structure.', e);
            throw new Error('Unable to create directory structure for game, partial structure in place.');
        }
    })
}

module.exports = createConfig;