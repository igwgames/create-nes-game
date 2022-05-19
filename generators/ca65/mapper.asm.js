// Creates main assembly file for ca65 assembly projects (no cc65)

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers');

function createConfig(game, directory) {
    const mapper = mappers[game.mapper];
    // nrom is effectively the 'no mapper' mapper. 
    if (game.mapper !== 'NROM') {
        fs.writeFileSync(path.join(directory, 'source', 'assembly', 'mapper.asm'), eta.render(fs.readFileSync(path.join(__dirname, 'mapper.template.asm')).toString(), {game, mapper}));
    } else {
        logger.debug('Skipping mapper.asm for nrom mapper');
    }
}

createConfig.stepName = 'mapper.asm';

module.exports = createConfig;