// Creates main assembly file for ca65 assembly projects (no cc65)

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers');

function createConfig(game, directory) {
    const mapper = mappers[game.mapper];
    fs.writeFileSync(path.join(directory, 'src', 'assembly', 'main.asm'), eta.render(fs.readFileSync(path.join(__dirname, 'main.template.asm')).toString(), {game, mapper}));
}

createConfig.stepName = 'main.asm';

module.exports = createConfig;