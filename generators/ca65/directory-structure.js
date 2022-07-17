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
    const neededDirs = ['config', 'source', 'source/assembly', 'graphics', 'rom', 'tools', 'tools/emulators', 'temp'];
    if (game.includeC) { neededDirs.push('source/c'); }
    if (game.includeCLibrary === 'neslib with famitracker' || game.includeCLibrary === 'neslib with famitone2') {
        neededDirs.push('sound');
    }

    neededDirs.forEach(thisDirectory => {
        try {
            fs.mkdirSync(path.join(directory, thisDirectory));
        } catch (e) {
            logger.error('Failed midway through creating directory structure.', e);
            throw new Error('Unable to create directory structure for game, partial structure in place.');
        }
    })
}
createConfig.stepName = 'directory structure'

module.exports = createConfig;