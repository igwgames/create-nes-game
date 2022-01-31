const appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    path = require('path'),
    fs = require('fs');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);
    logger.info(`Building game "${game.name}" in ${appConfiguration.workingDirectory}`);

    if (!fs.existsSync(path.join(appConfiguration.workingDirectory, 'tools', 'cc65', 'bin', 'ca65.exe'))) {
        logger.error(`Build tools (cc65 suite) not found. You may need to run \`${appConfiguration.binaryName} install\``);
        throw new Error(`Build tools (cc65 suite) not found. You may need to run \`${appConfiguration.binaryName} install\``);
    }


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