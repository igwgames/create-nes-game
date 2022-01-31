// Creates graphics files used in the examples

const copyFileSync = require('../../util/copy-file-sync'),
    path = require('path');

function createConfig(game, directory) {
    copyFileSync(path.join(__dirname, './example.template.nam'), path.join(directory, 'graphics', 'example.nam'));
    copyFileSync(path.join(__dirname, './example.template.pal'), path.join(directory, 'graphics', 'example.pal'));
}

createConfig.stepName = 'nam (graphics/nametable) files';

module.exports = createConfig;