const appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    path = require('path'),
    fs = require('fs');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);
    logger.info(`Building game "${game.name}" in ${appConfiguration.workingDirectory}`);

    const ca65Bin = process.platform === 'win32' ? 'ca65.exe' : 'ca65';

    if (!fs.existsSync(path.join(appConfiguration.workingDirectory, 'tools', 'cc65', 'bin', ca65Bin))) {
        logger.error(`Build tools (cc65 suite) not found. You may need to run \`${appConfiguration.binaryName} download-dependencies\``);
        throw new Error(`Build tools (cc65 suite) not found. You may need to run \`${appConfiguration.binaryName} download-dependencies\``);
    }


    const steps = [
        require('./rle'),
        require('./neslib-sound-convert'),
        require('./compile'),
        require('./assemble'),
        require('./link'),
        {run: function() { logger.info('===================='); }},
        require('./stats')
    ];
    
    for (let i = 0; i < steps.length; i++) {
        await steps[i].run();
    }
}


module.exports = {run};