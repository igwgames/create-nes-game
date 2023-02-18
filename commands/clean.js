const appConfiguration = require('../config/app-configuration'),
    path = require('path'),
    fs = require('fs');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);
    await game.doRunBefore('clean');

    logger.debug('Running rm on all generated files');

    fs.rmSync(path.join(appConfiguration.workingDirectory, 'temp'), {recursive: true});
    fs.rmSync(path.join(appConfiguration.workingDirectory, 'rom'), {recursive: true});
    const rleFiles = fs.readdirSync(path.join(appConfiguration.workingDirectory, 'graphics')).filter(f => (f.endsWith('.rle.bin') || f.endsWith('.rle.chr') || f.endsWith('.rle.nam')));
    rleFiles.forEach(f => fs.rmSync(path.join(appConfiguration.workingDirectory, 'graphics', f)));

    try { fs.mkdirSync(path.join(appConfiguration.workingDirectory, 'temp')) } catch (e) {}
    try { fs.mkdirSync(path.join(appConfiguration.workingDirectory, 'rom')) } catch (e) {}

    try { fs.rmSync(path.join(appConfiguration.workingDirectory, 'sound', 'sfx.asm')); } catch (e) {}
    try { fs.rmSync(path.join(appConfiguration.workingDirectory, 'sound', 'music.asm')); } catch (e) {}

    await game.doRunAfter('clean');
}

module.exports = {run};