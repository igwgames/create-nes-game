const appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    spawnAndWait = require('../util/spawn-and-wait'),
    path = require('path'),
    fs = require('fs');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);
    logger.info(`Assembling .asm files for "${game.name}" in ${appConfiguration.workingDirectory}`);

    // the cc65 and ca65 methods are different enough it makes sense to just separate em

    return game.includeC ? await assembleCc65(game) : await assembleCa65(game);
}

async function assembleCa65(game) {
    const wd = appConfiguration.workingDirectory;

    // Make sure the tmp and rom directories exists if it didn't already
    try { fs.mkdirSync(path.join(wd, 'temp')); } catch (e) { /* Exists, probably don't care */ }
    try { fs.mkdirSync(path.join(wd, 'rom')); } catch (e) { /* Exists, probably don't care */ }

    // First assemble all the, uh, assembly.
    const ca65 = path.join(wd, 'tools', 'cc65', 'bin', 'ca65');
    const filesToCompile = [
        path.join(wd, 'source', 'assembly', 'main.asm')
    ];

    await Promise.all(filesToCompile.map(file => {
        return spawnAndWait('ca65', ca65, path.relative(wd, file), [
            '-I', '.',
            '-o', outputFilePath(file),
            '--debug-info',
            file
        ]);
    }));
}

async function assembleCc65(game) {
    throw new Error('cc65 support has not yet been written');
}

function outputFilePath(file) {
    const newFile = file.replace(path.join('source', 'assembly'), 'temp');
    return newFile.substr(0, newFile.lastIndexOf('.') || newFile.length) + '.o';
}

module.exports = {run};