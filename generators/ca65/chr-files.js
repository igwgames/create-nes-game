// Creates graphics files used in the examples

const copyFileSync = require('../../util/copy-file-sync'),
    path = require('path');

function createConfig(game, directory) {
    copyFileSync(path.join(__dirname, './background.template.chr'), path.join(directory, 'graphics', 'background.chr'));
    copyFileSync(path.join(__dirname, './sprite.template.chr'), path.join(directory, 'graphics', 'sprite.chr'));
}

createConfig.stepName = 'chr (graphics) files';

module.exports = createConfig;