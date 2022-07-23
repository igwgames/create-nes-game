// Copies neslib conversion binaries to the disk. 
// I originally wanted to leave them embedded for simplicity, but pkg has a bug preventing that: https://github.com/vercel/pkg/issues/1516

const fs = require('fs'),
    path = require('path'),
    os = require('os'),
    copyFileSync = require('../../util/copy-file-sync');

let binaryExtension = "";

if (os.platform() === 'win32') {
    binaryExtension = '.exe';
} else if (os.platform() === 'darwin') {
    throw new Error('No binaries available for mac yet');
} else {
    binaryExtension = "-linux";
}
    

function createConfig(game, directory) {
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
    copyFileSync(path.join(__dirname, '..', '..', 'tools', 'neslib', 'nsf2data', 'nsf2data' + binaryExtension), path.join(directory, 'tools', 'famitone2', 'nsf2data' + (os.platform() === 'win32' ? '.exe' : '')))
    copyFileSync(path.join(__dirname, '..', '..', 'tools', 'neslib', 'text2data', 'text2data' + binaryExtension), path.join(directory, 'tools', 'famitone2', 'text2data' + (os.platform() === 'win32' ? '.exe' : '')))

    if (process.platform !== 'win32') {
        logger.debug('Non-windows platform, need to chmod the binaries for famitone2');
        fs.chmodSync(path.join(directory, 'tools', 'famitone2', 'nsf2data'), 0o755);
        fs.chmodSync(path.join(directory, 'tools', 'famitone2', 'text2data'), 0o755);
    }

}
createConfig.stepName = 'directory structure'

module.exports = createConfig;