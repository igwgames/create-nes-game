// Downloads your selected emulator, and puts it in a known location.
const fs = require('fs'),
    path = require('path'),
    StreamZip = require('node-stream-zip'),
    appConfiguration = require('../../config/app-configuration'),
    downloadFile = require('../../util/download-file');

async function createConfig(game, directory) {
    
    // Make sure the emulators folder exists (it could be empty)
    try { 
        fs.mkdirSync(path.join(appConfiguration.workingDirectory, 'tools', 'emulators')); 
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
        // FIXME: Implement fceux download
        // FIXME: handle "system" - most likely skip
        default:
            throw new Error('Do not know how to install emulator: ' + game.installEmulator);
    }
}

async function downloadMesen(game, directory) {

    // First download the zip to a known location on disk.
    const zipInfo = {name: 'Mesen.0.9.9.zip', url: 'https://github.com/SourMesen/Mesen/releases/download/0.9.9/Mesen.0.9.9.zip'}
    ;
    const zipFile = path.join(appConfiguration.cacheDirectory, zipInfo.name);
    if (!fs.existsSync(zipFile)) {
        logger.debug('Downloading mesen from', zipInfo);
        try {
            await downloadFile(zipInfo.url, zipFile);
        } catch (e) {
            logger.error('Encountered an error downloading mesen binaries; cannot continue.', e);
            throw new Error('Encountered an error downloading mesen binaries; cannot continue.');
        }
    } else {
        logger.debug('Using cached mesen zip');
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
        logger.error('Failed unzipping mesen to project tools directory', e);
        throw new Error('Failed unzipping mesen to project tools directory');
    }
    logger.debug('mesen extraction complete.');

    // Okay, we done.
}
createConfig.stepName = 'emulator binaries';

module.exports = createConfig;