// Creates ca65 configuration for building the game

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers');

function createConfig(game, directory) {
    const mapper = mappers[game.mapper];
    fs.writeFileSync(path.join(directory, 'config', 'ca65.cfg'), eta.render(fs.readFileSync(path.join(__dirname, 'ca65.template.cfg')).toString(), {game, mapper}, {autoTrim: false}));
}

createConfig.stepName = 'ca65.cfg';

module.exports = createConfig;