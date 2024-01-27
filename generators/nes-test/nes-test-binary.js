// Downloads your selected emulator, and puts it in a known location.
const fs = require('fs'),
    path = require('path'),
    StreamZip = require('node-stream-zip'),
    appConfiguration = require('../../config/app-configuration'),
    downloadFile = require('../../util/download-file'),
    copyFileSync = require('../../util/copy-file-sync');

async function createConfig(game, directory) {

    // No test? Bail.
    if (game.testProvider !== 'nes-test') {
        logger.debug('Skipping nes-test install, test provider not nes-test');
        return;
    }

    
    // Make a folder for it
    try { 
        fs.mkdirSync(path.join(directory, 'tools', 'nes-test')); 
    } catch (e) { 
        // If it exists we don't care, otherwise if it might be permissions, we do!
        if (e.code !== 'EEXIST') {
            logger.error('Failed creating a directory while installing nes-test! Do you have write permissions to the folder?', e);
            throw new Error('Failed creating a directory while installing nes-test');
        }
    }

    // First download the zip to a known location on disk.
    let binInfo = {};
    switch (process.platform) {
        case 'win32': 
            binInfo = {name: 'nes-test-win.exe', url: 'https://gh.nes.science/nes-test/releases/download/v0.3.2/nes-test-win.exe'};
            break;
        case 'linux':
            binInfo = {name: 'nes-test-linux', url: 'https://gh.nes.science/nes-test/releases/download/v0.3.2/nes-test-linux'};
            break;
        default:
            logger.warn('nes-test not available on this platform! Unit testing will not be available');
            return;
            break;
    }
    const binFile = path.join(appConfiguration.cacheDirectory, binInfo.name);
    if (!fs.existsSync(binFile)) {
        logger.debug('Downloading nes-test from', binInfo);
        try {
            await downloadFile(binInfo.url, binFile);
        } catch (e) {
            logger.error('Encountered an error downloading nes-test binaries; cannot continue.', e);
            throw new Error('Encountered an error downloading nes-test binaries; cannot continue.');
        }
    } else {
        logger.debug('Using cached nes-test binary');
    }

    try {
        await copyFileSync(binFile, path.join(directory, 'tools', 'nes-test', 'nes-test' + (process.platform === 'win32' ? '.exe' : '')));
    } catch (e) {
        logger.error('Could not copy nes-test binary - something is wrong.', e);
        throw new Error('Unable to copy nes-test bin');
    }

    if (process.platform !== 'win32') {
        logger.debug('Non-windows platform, need to chmod the binary');
        fs.chmodSync(path.join(directory, 'tools', 'nes-test', 'nes-test'), 0o755);
    }
    
}


createConfig.stepName = 'nes-test binary';

module.exports = createConfig;