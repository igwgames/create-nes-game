const appConfiguration = require('../config/app-configuration'),
    path = require('path'),
    fs = require('fs'),
    BaseGameConfiguration = require('../config/base-game-configuration');
const spawnAndWait = require('../util/spawn-and-wait');

async function run() {
    logger.debug('Running unit tests using nes-test!');
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);
    const romPath = path.join(appConfiguration.workingDirectory, 'rom', game.romName);
    const nesTestBin = path.join(appConfiguration.workingDirectory, 'tools', 'nes-test', 'nes-test' + (process.platform === 'win32' ? '.exe' : ''));

    if (!fs.existsSync(romPath)) {
        logger.error('Rom not available! Try building it first with create-nes-game build!');
        process.exit(1);
    }


    if (!fs.existsSync(nesTestBin)) {
        logger.error(`nes-test not found. You may need to run \`${appConfiguration.binaryName} download-dependencies\``);
        throw new Error(`nes-test not found. You may need to run \`${appConfiguration.binaryName} download-dependencies\``);
    }

    await spawnAndWait('nes-test', nesTestBin, null, ['.'], {cwd: path.join(appConfiguration.workingDirectory, 'test'), outputLevel: 'info'});
    logger.debug('Tests completed successfully!');
}

module.exports = {run};