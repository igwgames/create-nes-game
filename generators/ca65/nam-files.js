// Creates graphics files used in the examples

const fs = require('fs'),
    path = require('path'),
    mappers = require('../../data/mappers');

function createConfig(game, directory) {
    fs.copyFileSync(path.join(__dirname, './example.template.nam'), path.join(directory, 'graphics', 'example.nam'));
    fs.copyFileSync(path.join(__dirname, './example.template.pal'), path.join(directory, 'graphics', 'example.pal'));
}

createConfig.stepName = 'nam (graphics/nametable) files';

module.exports = createConfig;