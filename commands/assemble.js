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

async function assembleCc65(game) {
    const wd = appConfiguration.workingDirectory;

    const filesToCompile = [
        // Application entrypoint
        path.join(wd, 'source', 'assembly', 'system-runtime.asm'),
        // All generated assembly files from c
        ...fs.readdirSync(path.join(wd, 'temp')).filter(w => w.endsWith('.asm')).map(f => path.join(wd, 'temp', f))
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
            '--debug-info',
            file
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