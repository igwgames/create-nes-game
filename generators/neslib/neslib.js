// Creates neslib library files

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers');

function createConfig(game, directory) {
    const mapper = mappers[game.mapper];

    switch (game.includeCLibrary) {
        case 'none':
            logger.debug('No neslib lib required, doing nothing.');
            return;
        case 'neslib with famitone2':
            fs.writeFileSync(path.join(directory, 'source', 'c', 'neslib.h'), eta.render(fs.readFileSync(path.join(__dirname, 'neslib.template.h')).toString(), {game, mapper}));
            fs.writeFileSync(path.join(directory, 'source', 'assembly', 'neslib.asm'), eta.render(fs.readFileSync(path.join(__dirname, 'neslib.template.asm')).toString(), {game, mapper}));
            fs.writeFileSync(path.join(directory, 'source', 'assembly', 'neslib-system.asm'), eta.render(fs.readFileSync(path.join(__dirname, 'neslib-system.template.asm')).toString(), {game, mapper}));
            fs.writeFileSync(path.join(directory, 'source', 'assembly', 'famitone2.asm'), eta.render(fs.readFileSync(path.join(__dirname, 'famitone2.template.asm')).toString(), {game, mapper}));
            fs.writeFileSync(path.join(directory, 'sound', 'music.asm'), eta.render(fs.readFileSync(path.join(__dirname, 'music.template.asm')).toString(), {game, mapper}));
            fs.writeFileSync(path.join(directory, 'sound', 'sfx.asm'), eta.render(fs.readFileSync(path.join(__dirname, 'sfx.template.asm')).toString(), {game, mapper}));


            break;

        case 'neslib with famitracker':
            throw new Error('unimplemented');
            break;
        default:
            throw new Error('Unknown neslib derivative: ' + game.ciProvider);
    }

}

createConfig.stepName = 'ci-config';

module.exports = createConfig;