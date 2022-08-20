// Creates main assembly file for ca65 assembly projects (no cc65)

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers');

function createConfig(game, directory) {
    if (game.useTutorial) {
        logger.debug('Tutorial detected, skipping graphics config files');
        return;
    }

    const mapper = mappers[game.mapper];
    fs.writeFileSync(path.join(directory, 'graphics', 'graphics.config.asm'), eta.render(fs.readFileSync(path.join(__dirname, 'graphics.config.template.asm')).toString(), {game, mapper}));

    if (game.includeC) {
        fs.writeFileSync(path.join(directory, 'graphics', 'graphics.config.h'), eta.render(fs.readFileSync(path.join(__dirname, 'graphics.config.template.h')).toString(), {game, mapper}));
    }
}

createConfig.stepName = 'graphics.config.asm';

module.exports = createConfig;