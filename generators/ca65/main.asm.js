// Creates main assembly file for ca65 assembly projects (no cc65)

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    StreamZip = require('node-stream-zip'),
    mappers = require('../../data/mappers'),
    appConfiguration = require('../../config/app-configuration'),
    tutorialGroups = require('../../creation-wizard/tutorials').tutorialGroups,
    copyFileSync = require('../../util/copy-file-sync'),
    downloadFile = require('../../util/download-file');

async function createConfig(game, directory) {
    const mapper = mappers[game.mapper];

    let content
    if (game.useTutorial) {
        content = await downloadTutorial(game, directory);
    } else {
        content = eta.render(fs.readFileSync(path.join(__dirname, 'main.template.asm')).toString(), {game, mapper})
    }
    fs.writeFileSync(path.join(directory, 'source', 'assembly', 'main.asm'), content);
}

async function downloadTutorial(game, directory) {
    // First download the zip to a known location on disk.
    const tutorialGroup = tutorialGroups.find(t => t.id === game.tutorialGroup);
    if (!tutorialGroup) {
        logger.error('Unknown tutorial group, cannot continue!', game)
        throw new Error ('Unknown tutorial group');
    }
    const tutorialInfo = tutorialGroup.availableTutorials.find(t => t.id === game.tutorialId);
    const tutorialUrl = tutorialGroup.buildZipUrl(tutorialInfo.id)

    const zipFile = path.join(appConfiguration.cacheDirectory, 'tutorial', tutorialGroup.id, tutorialInfo.id, tutorialGroup.buildZipName(tutorialInfo.id));
    try {
        fs.mkdirSync(path.dirname(zipFile), {recursive: true});
    } catch (e) {
        // If it exists we don't care, otherwise if it might be permissions, we do!
        if (e.code !== 'EEXIST') {
            logger.error('Failed creating a directory while downloading tutorial', e);
            throw new Error('Failed creating a directory while downloading tutorial');
        }
        
    }
    if (!fs.existsSync(zipFile)) {
        logger.debug('Downloading tutorial from', tutorialUrl);
        try {
            await downloadFile(tutorialUrl, zipFile);
        } catch (e) {
            logger.error('Encountered an error downloading tutorial zip; cannot continue.', e);
            throw new Error('Encountered an error downloading tutorial zip; cannot continue.');
        }
    } else {
        logger.debug('Using cached tutorial zip', tutorialUrl, zipFile);
    }
    
    // Now extract it (possibly over a previous copy. Meh.)
    logger.debug('Starting to unzip tutorial into temp folder', zipFile);
    const zip = new StreamZip.async({file: zipFile});
    try {
        await zip.extract(null, path.dirname(zipFile));
        await zip.close();
    } catch (e) {
        logger.error('Failed unzipping tutorial', e);
        throw new Error('Failed unzipping tutorial');
    }
    logger.debug('tutorial extraction complete.');

    // Okay, finally, let's copy all of the files, and grab the content for the main file.
    const tutorialBase = path.join(path.dirname(zipFile), tutorialGroup.buildZipPath(tutorialInfo.id));
    for (let i = 0; i  < tutorialInfo.supportingFiles.length; i++) {
        await copyFileSync(path.join(tutorialBase, tutorialInfo.supportingFiles[i]), path.join(directory, 'source', 'assembly', tutorialInfo.supportingFiles[i]));
    }
    return tutorialGroup.rewriteText(fs.readFileSync(path.join(tutorialBase, tutorialInfo.mainFile)).toString());
}

createConfig.stepName = 'main.asm';

module.exports = createConfig;