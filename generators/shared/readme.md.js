// Creates main assembly file for ca65 assembly projects (no cc65)

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers');

function createConfig(game, directory) {
    const mapper = mappers[game.mapper];
    fs.writeFileSync(path.join(directory, 'README.md'), eta.render(fs.readFileSync(path.join(__dirname, 'README.template.md')).toString(), {game, mapper}));
}

createConfig.stepName = 'README.md';

module.exports = createConfig;