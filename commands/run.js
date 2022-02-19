const process = require('process'),
    childProcess = require('child_process'),
    path = require('path'),
    fs = require('fs'),
    appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);

    const romPath = path.join(appConfiguration.workingDirectory, 'rom', game.romName);

    logger.debug('Finding an emulator to run this game...');
    let execFile = ''
    let execArgs = [romPath];

    switch (game.installEmulator) {
        case 'mesen':
            // Yes, believe it or not this is cross-platform. Mono is weiiiird.
            execFile = path.join(appConfiguration.workingDirectory, 'tools', 'emulators', 'mesen', 'Mesen.exe');
            break;
            // FIXME: Implement fceux
        case 'system default':
            switch (process.platform) {
                case 'win32':
                case 'win64':
                    execFile = 'cmd';
                    execArgs = ['/c', 'start', romPath];
                    break;
                case 'darwin':
                    // TODO: Guessed where this lives, may need to be more clever
                    execFile = '/usr/bin/open';
                    break;
                default:
                    // Linux, maybe more
                    execFile = '/usr/bin/xdg-open';
            }
            break;
        default:
            logger.error('Do not know how to run emulator: ' + game.installEmulator);
            throw new Error('Do not know how to run emulator: ' + game.installEmulator);
    }

    if (game.installEmulator !== 'system default' && !fs.existsSync(execFile)) {
        logger.error(`Emulator not found. You may need to run \`${appConfiguration.binaryName} download-dependencies\``);
        throw new Error(`Emulator not found. You may need to run \`${appConfiguration.binaryName} download-dependencies\``);
    }


    logger.debug('Running', execFile, 'with args', execArgs);
    childProcess.spawn(execFile, execArgs, {
        stdio: 'ignore', // piping all stdio to /dev/null
        detached: true
    }).unref();
    
}

module.exports = {run};