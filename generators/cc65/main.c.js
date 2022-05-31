// Creates main assembly file for ca65 assembly projects (no cc65)

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers');

function createConfig(game, directory) {
    const mapper = mappers[game.mapper];
    if (game.includeCLibrary === 'none') {
        fs.writeFileSync(path.join(directory, 'source', 'c', 'main.c'), eta.render(fs.readFileSync(path.join(__dirname, 'main.template.c')).toString(), {game, mapper}));
    } else {
        fs.writeFileSync(path.join(directory, 'source', 'c', 'main.c'), eta.render(fs.readFileSync(path.join(__dirname, 'main-neslib.template.c')).toString(), {game, mapper}));
    }
}

createConfig.stepName = 'main.c';

module.exports = createConfig;