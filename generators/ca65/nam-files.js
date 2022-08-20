// Creates graphics files used in the examples

const copyFileSync = require('../../util/copy-file-sync'),
    path = require('path');

function createConfig(game, directory) {
    if (game.useTutorial) {
        logger.debug('Tutorial detected, skipping nam/pal files');
        return;
    }
    if (game.includeC) {
            // C Code includes this inline or in header files, so no need to create these.
        logger.debug('Game using C, no need for ram nam/pal files');
        return;
    }

    copyFileSync(path.join(__dirname, './example.template.nam'), path.join(directory, 'graphics', 'example.nam'));
    copyFileSync(path.join(__dirname, './example.template.pal'), path.join(directory, 'graphics', 'example.pal'));
}

createConfig.stepName = 'nam (graphics/nametable) files';

module.exports = createConfig;