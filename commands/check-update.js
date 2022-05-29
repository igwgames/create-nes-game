const appConfiguration = require('../config/app-configuration'),
    axios = require('axios');

async function run() {
    logger.debug('Running version update check');

    try { 
        const ver = await axios.get(appConfiguration.updateUrl),
            latestVersion = ver.data.version,
            ourVersion = require('../package.json').version;

            if (latestVersion > ourVersion) {
                logger.info(`${logger.colors.green}A new version of create-nes-game is available! Your version: ${ourVersion}, latest is ${latestVersion + logger.colors.reset}`);
                logger.info('Automatically download and install it by typing: create-nes-game update');
                logger.info('Learn more and see the changelog here: https://cppchriscpp.github.io/create-nes-game')
            } else {
                if (appConfiguration.command === 'check-update') {
                    logger.info('You are on the latest version of create-nes-game!');
                } else {
                    logger.debug('You are on the latest version of create-nes-game');
                }
            }

    } catch (e) {
        logger.warn('Checking for latest version failed - you can check online at https://cppchriscpp.github.io/create-nes-game');
        logger.debug('Version check error', e);
    }
}

module.exports = {run};