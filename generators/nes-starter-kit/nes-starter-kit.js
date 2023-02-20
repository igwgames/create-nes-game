// Creates neslib library files

const fs = require('fs'),
    path = require('path'),
    mappers = require('../../data/mappers'),
    downloadFile = require('../../util/download-file'),
    StreamZip = require('node-stream-zip'),
    appConfiguration = require('../../config/app-configuration'),
    recursiveReaddirSync = require('../../util/recursive-readdir-sync'),
    copyFileSync = require('../../util/copy-file-sync');

async function createConfig(game, directory) {

    if (game.tutorialGroup !== 'nes-starter-kit') {
        logger.debug('Not using nes-starter-kit, doing nothing');
        return;
    }

    const branch = game.tutorialId,
        zipFile = path.join(appConfiguration.cacheDirectory, 'nes-starter-kit-'+branch+'.zip'),
        zipContents = path.join(appConfiguration.cacheDirectory, 'nes-starter-kit-' + branch);

    if (!fs.existsSync(zipFile)) {
        try {
            await downloadFile(`https://github.com/cppchriscpp/nes-starter-kit/archive/refs/heads/${branch}.zip`, zipFile)
        } catch (e) {
            logger.error(`Could not download nes-starter-kit branch ${branch}. Cannot continue`, e);
            throw new Error('Failed downloading nes-starter-kit');
        }
    } else {
        logger.debug('Using cached nes-starter-kit zip');
    }

    const zip = new StreamZip.async({file: zipFile});
    try {
        await zip.extract(null, appConfiguration.cacheDirectory, zipFile);
        await zip.close();
    } catch (e) {
        logger.error('Failed unzipped nes-starter-kit zip to code directory', e);
        throw new Error('Failed unzipping nes-starter-kit');
    }

    const allFiles = recursiveReaddirSync(zipContents);
    allFiles.forEach(file => {
        const dir = path.dirname(path.relative(zipContents, file));
        if (!fs.existsSync(path.join(directory, dir))) {
            logger.debug('Creating new directory', dir);
            fs.mkdirSync(path.join(directory, dir), {recursive: true});
        }
        copyFileSync(file, path.join(directory, path.relative(zipContents, file)))
    });

    const configContent = fs.readFileSync(path.join(directory, '.create-nes-game.config.json')).toString(),
        updatedContent = configContent.replace(/"name": "[\w\-]+",/, `"name": "${game.name}",`);

    fs.writeFileSync(path.join(directory, '.create-nes-game.config.json'), updatedContent);

    // nes-starter-kit threw new dependencies in the config file at this point, but we've
    // already downloaded them in the mainline. Kinda cheap, but just do it again.
    const extDep = JSON.parse(fs.readFileSync(path.join(directory, '.create-nes-game.config.json')).toString()).extraDependencies;
    game.extraDependencies = extDep;
    await require('../shared/extra-dependencies')(game, directory);
}

createConfig.stepName = 'nes-starter-kit-setup';

module.exports = createConfig;