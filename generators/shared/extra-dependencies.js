// Downloads any files in extraDependencies, and puts the results in the tools folder
const fs = require('fs'),
    url = require('url'),
    path = require('path'),
    StreamZip = require('node-stream-zip'),
    appConfiguration = require('../../config/app-configuration'),
    downloadFile = require('../../util/download-file'),
    spawnAndWait = require('../../util/spawn-and-wait');

const ARCH_OS = process.platform + '-' + process.arch

async function downloadDependencies(game, directory) {
    logger.debug('Current architecture/os combo: ' + ARCH_OS);

    for (let i = 0; i < game.extraDependencies.length; i++) {
        logger.debug(`Starting installation for: ${JSON.stringify(game.extraDependencies[i])}`);

        let theUrl = game.extraDependencies[i][ARCH_OS];
        if (!theUrl) {
            logger.debug('Trying to fall back to `default` for tool.', game.extraDependencies[i]);
            theUrl = game.extraDependencies[i].default;
        }
        if (!theUrl) {
            logger.warn(`One of your tools is not available for this platform (${ARCH_OS})`)
            logger.warn(`Dependency: ${JSON.stringify(game.extraDependencies[i])}`);
            logger.warn(`Continuing, but builds may not work.`);
        }
        await doDownloadFile(game, directory, theUrl, game.extraDependencies[i].name);
    }
}
downloadDependencies.stepName = 'Download user dependencies'

async function doDownloadFile(game, directory, file, folderName) {
    const theFileOriginal = path.basename(url.parse(file).pathname),
        theFile = folderName + path.parse(theFileOriginal).ext
        landingSpot = path.join(directory, 'tools', folderName);
    logger.debug('Starting download of', file, 'to', landingSpot);

    try { fs.mkdirSync(landingSpot); } catch (e) { logger.debug('Failed creating directory, likely exists', landingSpot)}

    await downloadFile(file, path.join(landingSpot, theFile));

    if (theFile.endsWith('.zip')) {
        const zip = new StreamZip.async({file: path.join(landingSpot, theFile)});
        try {
            await zip.extract(null, landingSpot);
            await zip.close();
        } catch (e) {
            logger.error('Failed unzipping tool to project tools directory', file, e);
            throw new Error('Failed unzipping tool to project tools directory');
        }
    } else if (theFile.endsWith('.tar.gz')) {
        await spawnAndWait('tar xvzf', 'tar', theFile, ['xvzf', theFile], {cwd: landingSpot})
    } else {
        logger.verbose('Unrecognized extension, leaving file as-is.');
    }
}

module.exports = downloadDependencies;