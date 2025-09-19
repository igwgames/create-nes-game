// Copies neslib conversion binaries to the disk. 
// I originally wanted to leave them embedded for simplicity, but pkg has a bug preventing that: https://github.com/vercel/pkg/issues/1516

const fs = require('fs'),
    path = require('path'),
    os = require('os'),
    copyFileSync = require('../../util/copy-file-sync'),
    spawnAndWait = require('../../util/spawn-and-wait'),
    appConfiguration = require('../../config/app-configuration');

let binaryExtension = "";

if (os.platform() === 'win32') {
    binaryExtension = '.exe';
} else {
    binaryExtension = "";
}
    

async function createConfig(game, directory) {
    if (game.includeCLibrary !== 'neslib with famitracker' && game.includeC !== 'neslib with famitone2') {
        logger.debug('Not using famitone2 or famitracker neslib, skipping extracting tools');
    }

    // First create the directory
    try {
        fs.mkdirSync(path.join(directory, 'tools', 'famitone2'));
    } catch (e) {
        logger.debug('Unable to create famitone2 directory, likely already exists', e);
    }

    // Now copy our files from the snapshot system to the real one
    if (os.platform() === 'win32') {
        copyFileSync(path.join(__dirname, '..', '..', 'tools', 'neslib', 'nsf2data', 'nsf2data' + binaryExtension), path.join(directory, 'tools', 'famitone2', 'nsf2data.exe'))
        copyFileSync(path.join(__dirname, '..', '..', 'tools', 'neslib', 'text2data', 'text2data' + binaryExtension), path.join(directory, 'tools', 'famitone2', 'text2data.exe'))
    } else {
        await buildNeslibBinaries(game, directory);
    }

    if (process.platform !== 'win32') {
        logger.debug('Non-windows platform, need to chmod the binaries for famitone2');
        fs.chmodSync(path.join(directory, 'tools', 'famitone2', 'nsf2data'), 0o755);
        fs.chmodSync(path.join(directory, 'tools', 'famitone2', 'text2data'), 0o755);
    }
}

async function buildNeslibBinaries(game, directory) {
    await Promise.all([buildNeslibBinary('text2data', directory),  buildNeslibBinary('nsf2data', directory)]);
}

async function buildNeslibBinary(name, directory) {
    const existingBinary = path.join(appConfiguration.cacheDirectory, name, name)
    if (!fs.existsSync(existingBinary)) {
        logger.debug('Building neslib binary:', name);
        try { 
            fs.mkdirSync(path.join(appConfiguration.cacheDirectory, name)); 
        } catch (e) {
            if (e.code !== 'EEXIST') {
                logger.error('Unable to create cache directory to build', name, ' bailing out!', e);
                throw new Error('Unable to build cache directory for', name);
            }
        }

        [name + '.cpp', ...(name === 'nsf2data' ? ['cpu2a03.h'] : [])].forEach(file => {
            copyFileSync(path.join(__dirname, '..', '..', 'tools', 'neslib', name, file), path.join(appConfiguration.cacheDirectory, name, file));
        });
        await spawnAndWait('gcc ' + name, '/usr/bin/gcc', existingBinary + '.cpp', [name + '.cpp', '-o', name], {cwd: path.dirname(existingBinary), outputLevel: 'debug', errOutputLevel: 'debug'});
    } else {
        logger.debug('Using existing binary for', name);
    }
    copyFileSync(existingBinary, path.join(directory, 'tools', 'famitone2', name));
}

createConfig.stepName = 'neslib binaries'

module.exports = createConfig;
