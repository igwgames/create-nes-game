const appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    spawnAndWait = require('../util/spawn-and-wait'),
    path = require('path'),
    recursiveReaddirSync = require('../util/recursive-readdir-sync');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);
    await game.doRunBefore('assemble');

    logger.info(`Assembling .asm files for "${game.name}" in ${appConfiguration.workingDirectory}`);

    // the cc65 and ca65 methods are different enough it makes sense to just separate em

    const result = game.includeC ? await assembleCc65(game) : await assembleCa65(game);
    await game.doRunAfter('assemble');
    return result;
}

async function assembleCc65(game) {
    const wd = appConfiguration.workingDirectory;

    const filesToCompile = [
        // Application entrypoint
        path.join(wd, 'source', 'assembly', 'system-runtime.asm'),
        // All generated assembly files from c
        ...recursiveReaddirSync(path.join(wd, 'temp')).filter(w => w.endsWith('.asm')).map(s => path.relative(wd, s))

    ];
    return assembleFiles(game, filesToCompile);
}

async function assembleCa65(game) {
    const wd = appConfiguration.workingDirectory;

    const filesToCompile = [
        path.join(wd, 'source', 'assembly', 'main.asm')
    ];
    return assembleFiles(game, filesToCompile);
}

async function assembleFiles(game, filesToCompile) {
    const wd = appConfiguration.workingDirectory;

    // First assemble all the, uh, assembly.
    const ca65 = path.join(wd, 'tools', 'cc65', 'bin', 'ca65');

    await Promise.all(filesToCompile.map(file => {
        return spawnAndWait('ca65', ca65, path.relative(wd, file), [
            '-I', '.',
            '-o', outputFilePath(file),
            file,
            '--debug-info',
            ...(appConfiguration.assemblerOptions ?? [])
        ]);
    }));
}

function outputFilePath(file) {
    if (file.endsWith('system-runtime.asm')) {
        file = file.replace('system-runtime.asm', 'crt0.asm');
    }
    const newFile = file.replace(path.join('source', 'assembly'), 'temp');
    return newFile.substr(0, newFile.lastIndexOf('.') || newFile.length) + '.o';
}

module.exports = {run};