const appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    spawnAndWait = require('../util/spawn-and-wait'),
    path = require('path'),
    fs = require('fs');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);
    logger.info(`Linking together rom "${game.name}" in ${appConfiguration.workingDirectory}`);

    // the cc65 and ca65 methods are different enough it makes sense to just separate em

    return game.includeC ? await linkCc65(game) : await linkCa65(game);
}

async function linkCa65(game) {
    return doLink(game);
}

async function linkCc65(game) {
    // Need to add the nes library files from cc65 to do some default stuff
    const wd = appConfiguration.workingDirectory;
    return doLink(game, [path.join(wd, 'tools', 'cc65', 'lib', 'nes.lib')]);
}

async function doLink(game, additionalOFiles = []) {
    const wd = appConfiguration.workingDirectory;

    // Make sure the tmp and rom directories exists if it didn't already
    try { fs.mkdirSync(path.join(wd, 'rom')); } catch (e) { /* Exists, probably don't care */ }

    // Find all of the object files to combine
    const ld65 = path.join(wd, 'tools', 'cc65', 'bin', 'ld65');

    // Let's make a rom!
    const oFiles = [
        ...fs.readdirSync(path.join(wd, 'temp')).filter(s => s.endsWith('.o')).map(f => path.join(wd, 'temp', f)),
        ...additionalOFiles,
    ];

    await spawnAndWait('ld65', ld65, 'temp/*.o', [
        '-o', path.join(wd, 'rom', game.romName),
        '-C', path.join(wd, 'config', 'ca65.cfg'),
        ...oFiles,
        '--dbgfile', path.join(wd, 'rom', game.romName.replace('.nes', '.dbg')),
    ]);

    logger.info('Game built successfully:', path.join('rom', game.romName));
}

module.exports = {run};