// Downloads your selected emulator, and puts it in a known location.
const fs = require('fs'),
    path = require('path'),
    StreamZip = require('node-stream-zip'),
    inquirer = require('inquirer'),
    appConfiguration = require('../../config/app-configuration'),
    downloadFile = require('../../util/download-file'),
    findExecutable = require('../../util/find-executable'),
    spawnAndWait = require('../../util/spawn-and-wait'),
    copyFileSync = require('../../util/copy-file-sync');

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
    let mesenInfo;
    
    if (process.platform === 'darwin') {
        const isAppleSilicon = process.arch === 'arm64';
        if (isAppleSilicon) {
            mesenInfo = {
                name: 'Mesen_2.1.1_macOS_ARM64_AppleSilicon.zip',
                url: 'https://github.com/SourMesen/Mesen2/releases/download/2.1.1/Mesen_2.1.1_macOS_ARM64_AppleSilicon.zip'
            };
        } else {
            mesenInfo = {
                name: 'Mesen_2.1.1_macOS_x64_Intel.zip',
                url: 'https://github.com/SourMesen/Mesen2/releases/download/2.1.1/Mesen_2.1.1_macOS_x64_Intel.zip'
            };
        }
    } else {
        mesenInfo = {name: 'Mesen.0.9.9.zip', url: 'https://github.com/SourMesen/Mesen/releases/download/0.9.9/Mesen.0.9.9.zip'};
    }

    const zipFile = path.join(appConfiguration.cacheDirectory, mesenInfo.name);
    
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
    }

    const mesenDir = path.join(directory, 'tools', 'emulators', 'mesen');
    try {
        fs.mkdirSync(mesenDir, { recursive: true });
    } catch (e) {
        if (e.code !== 'EEXIST') {
            logger.error('Failed creating a directory while installing mesen', e);
            throw new Error('Failed creating a directory while installing mesen');
        }
    }

    if (process.platform === 'win32') {
        const exeFile = path.join(appConfiguration.cacheDirectory, "Mesen.exe");
        if (!fs.existsSync(exeFile)) {
            logger.debug('Starting to unzip mesen to temp directory', zipFile);
            const zip = new StreamZip.async({file: zipFile});
            try {
                await zip.extract(null, appConfiguration.cacheDirectory);
                await zip.close();
            } catch (e) {
                logger.error('Failed unzipping mesen to project tools directory', e);
                logger.info('Extra test info', path.resolve(zipFile), fs.readFileSync(zipFile).toString().substring(0, 100));
                throw new Error('Failed unzipping mesen to temp directory');
            }
            logger.debug('mesen extraction complete.');
        } else {
            logger.debug('Using cached mesen exe');
        }
        logger.debug('Copying exe to tools directory', exeFile);
        copyFileSync(exeFile, path.join(mesenDir, 'Mesen.exe'));
    } else if (process.platform === 'darwin') {
        logger.debug('Starting to unzip mesen to project directory', zipFile);
        const zip = new StreamZip.async({file: zipFile});
        try {
            await zip.extract(null, mesenDir);
            await zip.close();
        } catch (e) {
            logger.error('Failed unzipping mesen to project tools directory', e);
            throw new Error('Failed unzipping mesen to project tools directory');
        }
        logger.debug('mesen extraction complete.');

        const nestedZip = path.join(mesenDir, 'Mesen.app.zip');
        if (fs.existsSync(nestedZip)) {
            logger.debug('Extracting nested Mesen.app.zip');
            const innerZip = new StreamZip.async({file: nestedZip});
            try {
                await innerZip.extract(null, mesenDir);
                await innerZip.close();
                fs.unlinkSync(nestedZip);
            } catch (e) {
                logger.error('Failed extracting Mesen.app from nested zip', e);
                throw new Error('Failed extracting Mesen.app from nested zip');
            }
        }

        const appPath = path.join(mesenDir, 'Mesen.app');
        if (fs.existsSync(appPath)) {
            logger.debug('Making Mesen.app executable');
            fs.chmodSync(path.join(appPath, 'Contents', 'MacOS', 'Mesen'), 0o755);
        }
    }

    if (process.platform !== 'win32' && fs.existsSync(path.join(mesenDir, 'Mesen.exe'))) {
        logger.debug('Non-windows platform, need to chmod the binary');
        fs.chmodSync(path.join(mesenDir, 'Mesen.exe'), 0o755);
    }
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
