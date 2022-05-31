const appConfiguration = require('../config/app-configuration'),
    path = require('path'),
    fs = require('fs');

async function run() {
    logger.debug('Running rm on all generated files');

    fs.rmdirSync(path.join(appConfiguration.workingDirectory, 'temp'), {recursive: true});
    fs.rmdirSync(path.join(appConfiguration.workingDirectory, 'rom'), {recursive: true});
    const rleFiles = fs.readdirSync(path.join(appConfiguration.workingDirectory, 'graphics')).filter(f => (f.endsWith('.rle.bin') || f.endsWith('.rle.chr') || f.endsWith('.rle.nam')));
    rleFiles.forEach(f => fs.rmSync(path.join(appConfiguration.workingDirectory, 'graphics', f)));

    try { fs.mkdirSync(path.join(appConfiguration.workingDirectory, 'temp')) } catch (e) {}
    try { fs.mkdirSync(path.join(appConfiguration.workingDirectory, 'rom')) } catch (e) {}

}

module.exports = {run};