const appConfiguration = require('../config/app-configuration'),
    axios = require('axios'),
    semver = require('semver'),
    os = require('os'),
    path = require('path'),
    fs = require('fs'),
    StreamZip = require('node-stream-zip'),
    downloadFile = require('../util/download-file');
const copyFileSync = require('../util/copy-file-sync');
const spawnAndWait = require('../util/spawn-and-wait');

let clientZipExt = 'create-nes-game.zip';
let clientBinaryExt = 'create-nes-game.exe';

if (os.platform() !== 'win32') {
    clientZipExt = 'create-nes-game.tar.gz';
    clientBinaryExt = 'create-nes-game';
}

async function run() {
    logger.debug('Running version update check');

    try { 
        const ver = await axios.get(`${appConfiguration.updateUrl}/latest-version.json`),
            latestVersion = ver.data.version.substring(1),
            ourVersion = require('../package.json').version;

        if (semver.eq(ourVersion, latestVersion)) {
            logger.warn('You are already on the latest version of', appConfiguration.binaryName, '. Exiting!');
            return;
        }

        const landingFolder = path.join(appConfiguration.updateDirectory, latestVersion);

        try {
            fs.rmSync(landingFolder, {recursive: true, force: true});
            fs.mkdirSync(landingFolder, {recursive: true});
        } catch (e) {
            logger.debug('Failed creating directory for updates, carrying on anyway', e);
        }

        const newBinCompressed = await downloadFile(`${appConfiguration.binaryUrl}${latestVersion}/${clientZipExt}`, path.join(landingFolder, clientZipExt));
        let binFolder = path.dirname(process.argv[0]),
            binFile = process.argv[0]

        if (!process.pkg || !process.pkg.entrypoint) {
            logger.info('Not running in pkg, using dist/ folder to test');
            binFolder = path.join(__dirname, '..', 'dist');
            binFile = path.join(binFolder, 'update-test.exe');
            copyFileSync(path.join(binFolder, 'create-nes-game.exe'), path.join(binFolder, 'update-test.exe'));
        }
        logger.info('Downloading and unpacking latest version of', appConfiguration.binaryName + '.', '(This may take a minute or two)');
        logger.debug('Triggering update with the following params', {newBinCompressed, binFolder, binFile});

        let newBin;
        if (os.platform() === 'win32') {
            logger.debug('Unzipping manually to disk');
            const zip = new StreamZip.async({file: newBinCompressed});
            try {
                await zip.extract(null, landingFolder);
                await zip.close();
                newBin = path.join(landingFolder, clientBinaryExt);
            } catch (e) {
                logger.warn('Unable to unzip downloaded binary. Something is probably wrong on GitHub! Bailing out', e);
                throw new Error('Unable to unzip new zip for update');
            }
        } else {
            logger.debug('Attempting to use system tar to unzip file');
            await spawnAndWait('tar xvzf', '/usr/bin/tar', clientZipExt, ['xvzf', newBinCompressed], {cwd: landingFolder})
            newBin = path.join(landingFolder, clientBinaryExt);
        }

        try {
            fs.renameSync(binFile, binFile + '.bak');
        } catch (e) {
            logger.error('Unable to write binary file. Cannot continue!');
            logger.warn('If you installed this binary using sudo, make sure to use it here too.');
        }
        try {
            copyFileSync(newBin, binFile);
            logger.info('Successfully updated process. Cleaning up and exiting');
        } catch (e) {
            logger.warn('Failed updating! Attempting to roll back to old version', e);
            fs.renameSync(binFile + '.bak', binFile);
            logger.warn('Successful rollback. Bailing out.');
            return;
        }

        try {
            fs.rmSync(binFile + '.bak');
            fs.rmSync(landingFolder, {recursive: true, force: true});
        } catch (e) {
            logger.warn('Cleanup failed, temporary files may have been left behind. Continuing...');
            logger.debug('Cleanup failure', e);
        }

    } catch (e) {
        logger.warn('Updating create-nes-game failed! Get the latest version online at https://cppchriscpp.github.io/create-nes-game');
        logger.debug('Version update error', e);
        throw new Error('Process updating failed');
    }
}

module.exports = {run};