const appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    spawnAndWait = require('../util/spawn-and-wait'),
    path = require('path'),
    fs = require('fs');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);
    // Only c games actually compile
    if (!game.includeC) { 
        logger.debug('Game does not require C, skipping compile step.');
        return; 
    }

    await compileCc65(game);
}

async function compileCc65(game) {
    logger.info(`Compiling together rom "${game.name}" in ${appConfiguration.workingDirectory}`);
    throw new Error('cc65 support has not yet been written');
}

module.exports = {run};