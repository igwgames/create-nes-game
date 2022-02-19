const childProcess = require('child_process'),
    path = require('path'),
    fs = require('fs'),
    appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);

    logger.debug('Finding an emulator to run this game...');
    let execFile = ''

    switch (game.installEmulator) {
        case 'mesen':
            // Yes, believe it or not this is cross-platform. Mono is weiiiird.
            execFile = path.join(appConfiguration.workingDirectory, 'tools', 'emulators', 'mesen', 'Mesen.exe');
            break;
            // FIXME: Implement fceux
            // FIXME: implement "system" across all platforms
        default:
            logger.error('Do not know how to run emulator: ' + game.installEmulator);
            throw new Error('Do not know how to run emulator: ' + game.installEmulator);
    }

    if (!fs.existsSync(execFile)) {
        logger.error(`Emulator not found. You may need to run \`${appConfiguration.binaryName} download-dependencies\``);
        throw new Error(`Emulator not found. You may need to run \`${appConfiguration.binaryName} download-dependencies\``);
    }

    const romPath = path.join(appConfiguration.workingDirectory, 'rom', game.romName);

    logger.debug('Running', execFile, 'with args', [romPath]);
    childProcess.spawn(execFile, [romPath], {
        stdio: 'ignore', // piping all stdio to /dev/null
        detached: true
    }).unref();
    
}

module.exports = {run};