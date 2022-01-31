const appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);
    logger.info(`Building game "${game.name}" in ${appConfiguration.workingDirectory}`);

    const steps = [
        require('./compile'),
        require('./assemble'),
        require('./link')
    ];
    
    for (let i = 0; i < steps.length; i++) {
        await steps[i].run();
    }
}


module.exports = {run};