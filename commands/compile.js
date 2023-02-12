const appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    spawnAndWait = require('../util/spawn-and-wait'),
    path = require('path'),
    fs = require('fs'),
    recursiveReaddirSync = require('../util/recursive-readdir-sync');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);

    await game.doRunBefore('compile');

    // Make sure all required directories exist, if they didn't already
    try {
        fs.mkdirSync(path.join(appConfiguration.workingDirectory, 'temp')); 
    } catch (e) {
        if (e.code !== 'EEXIST') {
            logger.error('Failed creating a directory while compiling! Do you have write permissions to the folder?', e);
            throw new Error('Failed creating a directory while compiling');
        }
    }
    try { 
        fs.mkdirSync(path.join(appConfiguration.workingDirectory, 'rom')); 
    } catch (e) {
        if (e.code !== 'EEXIST') {
            logger.error('Failed creating a directory while compiling! Do you have write permissions to the folder?', e);
            throw new Error('Failed creating a directory while compiling');
        }
    }

    // Only c games actually compile
    if (!game.includeC) { 
        logger.debug('Game does not require C, skipping compile step.');
        return; 
    }

    await compileCc65(game);

    await game.doRunAfter('compile');
}

async function compileCc65(game) {
    const wd = appConfiguration.workingDirectory;

    const cc65 = path.join(wd, 'tools', 'cc65', 'bin', 'cc65');
    
    const allC = recursiveReaddirSync(path.join(wd, 'source', 'c'));
    
    await Promise.all(allC.map(file => {
        // Could be quite a recursive directory path, make sure to create it.
        const outFile = outputFilePath(file);
        try {
            fs.mkdirSync(path.dirname(outFile));
        } catch (e) {
            if (e.code !== 'EEXIST') {
                logger.error('Failed creating a directory while compiling! Do you have write permissions to the folder?', e);
                throw new Error('Failed creating a directory while compiling');
            }    
        }

        return spawnAndWait('cc65', cc65, path.relative(wd, file), [
            '-I', '.',
            '-Oi', file,
            '--add-source',
            '--include-dir', './tools/cc65/include',
            '-o', outFile,
            '--debug-info',
            ...(appConfiguration.compilerOptions ?? [])
        ])
    }));
}

function outputFilePath(file) {
    const newFile = file.replace(path.join('source', 'c'), 'temp');
    return newFile + '.asm';
}

module.exports = {run};