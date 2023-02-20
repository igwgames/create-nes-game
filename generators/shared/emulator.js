// Downloads your selected emulator, and puts it in a known location.
const fs = require('fs'),
    path = require('path'),
    StreamZip = require('node-stream-zip'),
    inquirer = require('inquirer'),
    appConfiguration = require('../../config/app-configuration'),
    downloadFile = require('../../util/download-file'),
    findExecutable = require('../../util/find-executable'),
    spawnAndWait = require('../../util/spawn-and-wait');

async function createConfig(game, directory) {
    
    // Make sure the emulators folder exists (it could be empty)
    try { 
        fs.mkdirSync(path.join(directory, 'tools', 'emulators')); 
    } catch (e) { 
        // If it exists we don't care, otherwise if it might be permissions, we do!
        if (e.code !== 'EEXIST') {
            logger.error('Failed creating a directory while installing emulator! Do you have write permissions to the folder?', e);
            throw new Error('Failed creating a directory while installing emulator');
        }
    }

    switch (game.installEmulator) {
        case 'mesen':
            return downloadMesen(game, directory);
        case 'fceux':
            return installFceux(game, directory);
        case 'system default':
            // Nothing to do here, just use the system default
            return;
        default:
            throw new Error('Do not know how to install emulator: ' + game.installEmulator);
    }
}

async function downloadMesen(game, directory) {

    // First download the zip to a known location on disk.
    const mesenInfo = {name: 'Mesen.0.9.9.zip', url: 'https://github.com/SourMesen/Mesen/releases/download/0.9.9/Mesen.0.9.9.zip'};
    const zipFile = path.join(appConfiguration.cacheDirectory, mesenInfo.name);
    let wasCached = false;
    if (!fs.existsSync(zipFile)) {
        logger.debug('Downloading mesen from', mesenInfo);
        try {
            await downloadFile(mesenInfo.url, zipFile);
        } catch (e) {
            logger.error('Encountered an error downloading mesen binaries; cannot continue.', e);
            throw new Error('Encountered an error downloading mesen binaries; cannot continue.');
        }
    } else {
        logger.debug('Using cached mesen zip');
        wasCached = true;
    }
    
    // Now extract it to the tools directory, shifting it around as needed
    try {
        fs.mkdirSync(path.join(directory, 'tools', 'emulators', 'mesen'));
    } catch (e) {
        // If it exists we don't care, otherwise if it might be permissions, we do!
        if (e.code !== 'EEXIST') {
            logger.error('Failed creating a directory while installing mesen', e);
            throw new Error('Failed creating a directory while installing mesen');
        }
    }

    logger.debug('Starting to unzip mesen to project tools directory', zipFile);
    const zip = new StreamZip.async({file: zipFile});
    try {
        await zip.extract(null, path.join(directory, 'tools', 'emulators', 'mesen'));
        await zip.close();
    } catch (e) {
        logger.error('Failed unzipping mesen to project tools directory', e, wasCached ? 'Cached version used' : 'Fresh download');
        logger.info('Extra test info', path.resolve(zipFile), fs.readFileSync(zipFile).toString().substring(0, 100));
        throw new Error('Failed unzipping mesen to project tools directory');
    }
    logger.debug('mesen extraction complete.');

    if (process.platform !== 'win32') {
        logger.debug('Non-windows platform, need to chmod the binary');
        fs.chmodSync(path.join(directory, 'tools', 'emulators', 'mesen', 'Mesen.exe'), 0o755);
    }

    // Okay, we done.
}

async function installFceux(game, directory) {
    if (process.platform === 'win32' || process.platform === 'win64') {
        // First download the zip to a known location on disk.
        const fceuxInfo = {name: 'fceux-2.6.4-win32.zip', url: 'https://gde-files.nes.science/fceux-2.6.4-win32.zip'};
        const zipFile = path.join(appConfiguration.cacheDirectory, fceuxInfo.name);
        if (!fs.existsSync(zipFile)) {
            logger.debug('Downloading fceux from', fceuxInfo);
            try {
                await downloadFile(fceuxInfo.url, zipFile);
            } catch (e) {
                logger.error('Encountered an error downloading fceux binaries; cannot continue.', e);
                throw new Error('Encountered an error downloading fceux binaries; cannot continue.');
            }
        } else {
            logger.debug('Using cached fceux zip');
        }
        
        // Now extract it to the tools directory, shifting it around as needed
        try {
            fs.mkdirSync(path.join(directory, 'tools', 'emulators', 'fceux'));
        } catch (e) {
            // If it exists we don't care, otherwise if it might be permissions, we do!
            if (e.code !== 'EEXIST') {
                logger.error('Failed creating a directory while installing fceux', e);
                throw new Error('Failed creating a directory while installing fceux');
            }
        }

        logger.debug('Starting to unzip fceux to project tools directory', zipFile);
        const zip = new StreamZip.async({file: zipFile});
        try {
            await zip.extract(null, path.join(directory, 'tools', 'emulators', 'fceux'));
            await zip.close();
        } catch (e) {
            logger.error('Failed unzipping fceux to project tools directory', e);
            throw new Error('Failed unzipping fceux to project tools directory');
        }
        logger.debug('fceux extraction complete.');

        // Okay, we done.
    } else if (process.platform === 'darwin') {
        const hasFceux = !!findExecutable('fceux');
        if (!hasFceux) {
            throw new Error('fceux not supported on darwin! Please install it and put it on your path yourself if you wish to use it.');
        }
    } else {
        const hasFceux = !!findExecutable('fceux');
        if (!hasFceux) {
            if (!appConfiguration.assumeYes) {
                const shouldInstall = await inquirer.prompt([{
                    type: 'confirm', 
                    name: 'v', 
                    message: `Emulator fceux not found! Would you like to try to automatically install it with apt? (Will require your sudo password)`, 
                    default: false
                }]);

                if (!shouldInstall.v) {
                    logger.debug('User aborted install');
                    return; 
                }
            }

            try {
                logger.info('Installing fceux - this may take a few minues, please be patient.');
                await spawnAndWait('apt-get update', 'sudo', null, ['apt-get', 'update']);
                logger.debug('Finished update, starting install.');
                await spawnAndWait('apt-get', 'sudo', null, ['apt-get', 'install', '-y', 'fceux']);
                logger.info('Successfully installed fceux');
            } catch (e) {
                logger.error('Failed installing fceux! Error follows, will try to continue anyway', e);
            }
        } else {
            logger.debug('Fceux already installed, moving on!');
        }

    }

}

createConfig.stepName = 'emulator binaries';

module.exports = createConfig;