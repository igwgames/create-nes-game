const appConfiguration = require('../config/app-configuration'),
    path = require('path'),
    fs = require('fs');

async function run() {
    logger.debug('Running rm on all generated files');

    fs.rmdirSync(path.join(appConfiguration.workingDirectory, 'temp'), {recursive: true});
    fs.rmdirSync(path.join(appConfiguration.workingDirectory, 'rom'), {recursive: true});

    try { fs.mkdirSync(path.join(appConfiguration.workingDirectory, 'temp')) } catch (e) {}
    try { fs.mkdirSync(path.join(appConfiguration.workingDirectory, 'rom')) } catch (e) {}

}

module.exports = {run};