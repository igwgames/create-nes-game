const appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    spawnAndWait = require('../util/spawn-and-wait'),
    path = require('path'),
    fs = require('fs'),
    recursiveReaddirSync = require('../util/recursive-readdir-sync');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);

    // Make sure all required directories exist, if they didn't already
    try { fs.mkdirSync(path.join(wd, 'temp')); } catch (e) { /* Exists, probably don't care */ }
    try { fs.mkdirSync(path.join(wd, 'rom')); } catch (e) { /* Exists, probably don't care */ }

    // Only c games actually compile
    if (!game.includeC) { 
        logger.debug('Game does not require C, skipping compile step.');
        return; 
    }

    await compileCc65(game);
}

async function compileCc65(game) {
    const wd = appConfiguration.workingDirectory;

    const cc65 = path.join(wd, 'tools', 'cc65', 'bin', 'cc65');
    
    const allC = recursiveReaddirSync(path.join(wd, 'source', 'c'));
    
    await Promise.all(allC.map(file => {
        return spawnAndWait('cc65', cc65, path.relative(wd, file), [
            '-I', '.',
            '-Oi', file,
            '--add-source',
            '--include-dir', './tools/cc65/include',
            '-o', outputFilePath(file),
            '--debug-info'
        ])
    }))
}

function outputFilePath(file) {
    const newFile = file.replace(path.join('source', 'c'), 'temp');
    return newFile.substr(0, newFile.lastIndexOf('.') || newFile.length) + '.asm';
}

module.exports = {run};