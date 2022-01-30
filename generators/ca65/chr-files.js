// Creates graphics files used in the examples

const fs = require('fs'),
    path = require('path');

function createConfig(game, directory) {
    fs.copyFileSync(path.join(__dirname, './background.template.chr'), path.join(directory, 'graphics', 'background.chr'));
    fs.copyFileSync(path.join(__dirname, './sprite.template.chr'), path.join(directory, 'graphics', 'sprite.chr'));
}

createConfig.stepName = 'chr (graphics) files';

module.exports = createConfig;