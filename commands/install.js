const appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);

    logger.info('Installing tools to compile and play:', game.name);

    const generators = [
        require('../generators/ca65/ca65-binaries'),
        require('../generators/shared/emulator')
    ];


    for (let i = 0; i < generators.length; i++) {
        logger.debug('Starting step:', generators[i].stepName);
        await generators[i](game, appConfiguration.workingDirectory);
    }
}

module.exports = {run};