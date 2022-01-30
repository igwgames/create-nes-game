// Creates graphics files used in the examples

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers');

function createConfig(game, directory) {
    const mapper = mappers[game.mapper];
    fs.copyFileSync(path.join(__dirname, './background.template.chr'), path.join(directory, 'graphics', 'background.chr'));
    fs.copyFileSync(path.join(__dirname, './sprite.template.chr'), path.join(directory, 'graphics', 'sprite.chr'));
    fs.writeFileSync(path.join(directory, 'source', 'assembly', 'main.asm'), eta.render(fs.readFileSync(path.join(__dirname, 'main.template.asm')).toString(), {game, mapper}));
}

createConfig.stepName = 'chr (graphics) files';

module.exports = createConfig;