const appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    fs = require('fs'),
    path = require('path');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);

    logger.info('Downloading and configuring tools to compile and play:', game.name);

    // Make sure the tools folder exists at all. It could not, ya know.
    try { 
        fs.mkdirSync(path.join(appConfiguration.workingDirectory, 'tools')); 
    } catch (e) { 
        // If it exists we don't care, otherwise if it might be permissions, we do!
        if (e.code !== 'EEXIST') {
            logger.error('Failed creating a directory while installing tools! Do you have write permissions to the folder?', e);
            throw new Error('Failed creating a directory while installing tools');
        }
    }

    await require('./install-system-dependencies').run();

    const generators = [
        require('../generators/ca65/ca65-binaries'),
        require('../generators/shared/emulator')
    ];
    if (game.testProvider === 'nes-test') {
        generators.push(require('../generators/nes-test/nes-test-binary'));
    }


    for (let i = 0; i < generators.length; i++) {
        logger.debug('Starting step:', generators[i].stepName);
        await generators[i](game, appConfiguration.workingDirectory);
    }
}

module.exports = {run};