// Creates neslib library files

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers'),
    copyFileSync = require('../../util/copy-file-sync');

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
            fs.writeFileSync(path.join(directory, 'sound', 'music.txt'), eta.render(fs.readFileSync(path.join(__dirname, 'music.template.txt')).toString(), {game, mapper}));
            copyFileSync(path.join(__dirname, 'sfx.template.nsf'), path.join(directory, 'sound', 'sfx.nsf'));
            copyFileSync(path.join(__dirname, 'example-music.template.ftm'), path.join(directory, 'sound', 'example-music.ftm'));
            copyFileSync(path.join(__dirname, 'example-sfx.template.ftm'), path.join(directory, 'sound', 'example-sfx.ftm'));
            copyFileSync(path.join(__dirname, 'example-music.template.ftm'), path.join(directory, 'sound', 'example-music.ftm'));
            break;

        case 'neslib with famitracker':
            fs.writeFileSync(path.join(directory, 'source', 'c', 'neslib.h'), eta.render(fs.readFileSync(path.join(__dirname, 'neslib-famitracker.template.h')).toString(), {game, mapper}));
            fs.writeFileSync(path.join(directory, 'source', 'assembly', 'neslib.asm'), eta.render(fs.readFileSync(path.join(__dirname, 'neslib-famitracker.template.asm')).toString(), {game, mapper}));
            fs.writeFileSync(path.join(directory, 'source', 'assembly', 'neslib-system.asm'), eta.render(fs.readFileSync(path.join(__dirname, 'neslib-system-famitracker.template.asm')).toString(), {game, mapper}));
            
            try { 
                fs.mkdirSync(path.join(directory, 'source', 'assembly', 'famitracker_driver')) 
            } catch (e) {
                logger.error('Failed making folder for famitracker driver', e);
                throw new Error('Failed creating directory for famitracker driver');
            }
            const libFiles = fs.readdirSync(path.join(__dirname, 'famitracker_driver')).filter(f => f.endsWith('.s'));
            libFiles.forEach(file => {
                
                copyFileSync(path.join(path.join(__dirname, 'famitracker_driver', file)), path.join(directory, 'source', 'assembly', 'famitracker_driver', file));
            });
            copyFileSync(path.join(__dirname, 'music-famitracker.bin'), path.join(directory, 'sound', 'music.bin'));
            copyFileSync(path.join(__dirname, 'sfx.template.nsf'), path.join(directory, 'sound', 'sfx.nsf'));
            copyFileSync(path.join(__dirname, 'samples-famitracker.bin'), path.join(directory, 'sound', 'samples.bin'));
            copyFileSync(path.join(__dirname, 'example-sfx.template.ftm'), path.join(directory, 'sound', 'example-sfx.ftm'));
            copyFileSync(path.join(__dirname, 'example-music.template.ftm'), path.join(directory, 'sound', 'example-music.ftm'));

            break;
        default:
            throw new Error('Unknown neslib derivative: ' + game.ciProvider);
    }

}

createConfig.stepName = 'ci-config';

module.exports = createConfig;