const childProcess = require('child_process'),
    appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    path = require('path'),
    fs = require('fs');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);
    logger.info(`Building game "${game.name}" in ${appConfiguration.workingDirectory}`);

    // the cc65 and ca65 methods are different enough it makes sense to just separate em

    return game.includeC ? await buildCc65(game) : await buildCa65(game);
}

async function buildCa65(game) {
    const wd = appConfiguration.workingDirectory;

    // Make sure the tmp and rom directories exists if it didn't already
    try { fs.mkdirSync(path.join(wd, 'temp')); } catch (e) { /* Exists, probably don't care */ }
    try { fs.mkdirSync(path.join(wd, 'rom')); } catch (e) { /* Exists, probably don't care */ }

    // First assemble all the, uh, assembly.
    const ca65 = path.join(wd, 'tools', 'cc65', 'bin', 'ca65'),
        ld65 = path.join(wd, 'tools', 'cc65', 'bin', 'ld65');
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

    // Now, let's make a rom!
    const oFiles = fs.readdirSync(path.join(wd, 'temp')).filter(s => s.endsWith('.o'))

    await spawnAndWait('ld65', ld65, 'temp/*.o', [
        '-o', path.join(wd, 'rom', game.romName),
        '-C', path.join(wd, 'config', 'ca65.cfg'),
        '--dbgfile', path.join(wd, 'rom', game.romName.replace('.nes', '.dbg')),
        ...oFiles.map(f => path.join(wd, 'temp', f))
    ]);

    logger.info('Game built successfully:', path.join('rom', game.romName));

}

async function buildCc65(game) {
    throw new Error('cc65 support has not yet been written');
}

// TODO: This might belong in a library
function spawnAndWait(logCmd, cmd, file, args = []) {
    logger.debug('Running: ' + path.relative(appConfiguration.workingDirectory, cmd) + ' ' + args.join(' '));
    return new Promise((resolve, reject) => {
        const proc = childProcess.spawn(cmd, args, {cwd: appConfiguration.workingDirectory});

        proc.stdout.on('data', data => {
            const strs = data.toString().split('\n').filter(l => l.length > 0);
            strs.forEach(str => logger.debug(`[${logCmd}]`, str));
        });
        proc.stderr.on('data', data => {
            const strs = data.toString().split('\n').filter(l => l.length > 0);
            strs.forEach(str => logger.warn(`[${logCmd}]`, str));
        });
        proc.on('error', error => {
            logger.error('Failed compiling ', file, '!', error);
            reject(error);
        });

        proc.on('close', resultCode => {
            logger.debug(`[${logCmd}]`, 'finished with code', resultCode);

            if (resultCode === 0) {
                resolve();
            } else {
                reject(`[${logCmd}] Failed execution, exit code was ${resultCode}. \n\nFailed command: ${cmd} ${file} ${args.join(' ')});`);
            }
        });
    });
}

function outputFilePath(file) {
    const newFile = file.replace(path.join('source', 'assembly'), 'temp');
    return newFile.substr(0, newFile.lastIndexOf('.') || newFile.length) + '.o';
}

module.exports = {run};