// Creates main assembly file for ca65 assembly projects (no cc65)

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers');

function createConfig(game, directory) {
    const mapper = mappers[game.mapper];
    // nrom is effectively the 'no mapper' mapper. 
    if (game.includeC && game.mapper !== 'nrom') {
        fs.writeFileSync(path.join(directory, 'source', 'c', 'mapper.h'), eta.render(fs.readFileSync(path.join(__dirname, 'mapper.template.h')).toString(), {game, mapper}));
    } else {
        logger.debug('Skipping mapper.h for nrom mapper and/or assembly project');
    }
}

createConfig.stepName = 'mapper.h';

module.exports = createConfig;