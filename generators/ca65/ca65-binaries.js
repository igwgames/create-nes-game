// Downloads the cc65/ca65 binaries, and puts them in a known location. 
// This also gets everything else they distribute, lib files, etc etc.
const fs = require('fs'),
    path = require('path'),
    process = require('process'),
    axios = require('axios'),
    StreamZip = require('node-stream-zip'),
    appConfiguration = require('../../config/app-configuration');

// If this gets much use, let's move it to a library
async function downloadFile(url, dest) {
    logger.debug('Downloading file', url);
    const res = await axios({method: 'get', url, responseType: 'stream'});
    const writer = fs.createWriteStream(dest);

    await new Promise((resolve, reject) => {
        res.data.pipe(writer);

        let error = null;
        writer.on('error', err => {
            writer.close();
            reject(err);
            error = err;
        });

        writer.on('close', () => {
            if (!error) {
                resolve();
            }
        });
    });
}

function getBinaryZip() {
    if (process.arch !== 'x32' && process.arch !== 'x64') {
        throw new Error('Unsupported architecture ' + process.arch + '. ca65 binaries for nes games only exist for x86 and x86_64 processors. Others (such as raspberry pi/arm) are not supported. Sorry!');
    }

    // NOTE: If re-hosting these zips gets expensive, we could probably create a github project that literally just hosts the releases of these. Maybe
    // with a nice build script for the linux version. Or maybe build both, give another source. Options, options.
    switch (process.platform) {
        case 'freebsd':
        case 'openbsd':
        case 'aix':
            logger.warn('bsd and aix platforms are unsupported. Using the linux binaries and hoping for the best!');
        case 'linux':
            // FIXME: Create this so we can create a url for it
            throw new Error('cc65 binaries not built for linux! Contact the maintainer, they should be.');
            return {name: 'cc65-2.19-win.zip', url: ''};
        case 'darwin':
            throw new Error('Project initialization failed: cc65 binaries for mac os are not currently available. If you have a working build, please get in contact!');
        case 'win32':
            // This is a private mirror of the binary provided from sourceforge, so it can be automatically downloaded. It uses my bandwidth instead of theirs.
            return {name: 'cc65-2.19-win.zip', url: 'https://gde-files.nes.science/cc65-2.19-win.zip'};
        case 'sunos':
            throw new Error('Sunos platform not supported, sorry! Also, you seriously ran this on sunos? You should like, send me a dm or something screenshotting this, haha.');
        default:
            throw new Error(`Unknown platform ${process.platform}, unable to find binaries.`);
    }
}

async function createConfig(game, directory) {
    
    // First download the zip to a known location on disk.
    const zipInfo = getBinaryZip();
    const zipFile = path.join(appConfiguration.cacheDirectory, zipInfo.name);
    if (!fs.existsSync(zipFile)) {
        logger.debug('Downloading cc65 from', zipInfo);
        try {
            await downloadFile(zipInfo.url, zipFile);
        } catch (e) {
            logger.error('Encountered an error downloading cc65 binaries; cannot continue.', e);
            throw new Error('Encountered an error downloading cc65 binaries; cannot continue.');
        }
    } else {
        logger.debug('Using cached cc65 zip');
    }
    // Now extract it to the tools directory, shifting it around as needed

    try {
        fs.mkdirSync(path.join(directory, 'tools', 'cc65'));
    } catch (e) {
        // If it exists we don't care, otherwise if it might be permissions, we do!
        if (e.code !== 'EEXIST') {
            logger.error('Failed creating a directory while installing cc65', e);
            throw new Error('Failed creating a directory while installing cc65');
        }
    }

    logger.debug('Starting to unzip cc65 to project tools directory', zipFile);
    const zip = new StreamZip.async({file: zipFile});
    try {
        await zip.extract(null, path.join(directory, 'tools', 'cc65'));
        await zip.close();
    } catch (e) {
        logger.error('Failed unzipping cc65 to project tools directory', e);
        throw new Error('Failed unzipping cc65 to project tools directory');
    }
    logger.debug('cc65 extraction complete.');

    // Okay, we done.
}
createConfig.stepName = 'cc65 binaries';

module.exports = createConfig;