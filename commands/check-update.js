const appConfiguration = require('../config/app-configuration'),
    axios = require('axios'),
    semver = require('semver');

async function run() {
    if (appConfiguration.skipVersionCheck || appConfiguration.command === 'update') {
        logger.debug('Skipped version check');
        return;
    }
    logger.debug('Running version update check');

    try { 
        const ver = await axios.get(`${appConfiguration.updateUrl}/latest-version.json`),
            latestVersion = ver.data.version.substring(1),
            ourVersion = require('../package.json').version;

            if (semver.lt(ourVersion, latestVersion)) {
                logger.info(`${logger.colors.green}A new version of create-nes-game is available! New Version: ${logger.colors.blue}${latestVersion}${logger.colors.green} (You are on ${ourVersion}) ${logger.colors.reset}`);
                logger.info(`${logger.colors.green}Automatically download and install it by typing: ${logger.colors.blue}create-nes-game update${logger.colors.reset}`);
                logger.info(`${logger.colors.green}Learn more and see the changelog here: https://cppchriscpp.github.io/create-nes-game${logger.colors.reset}`)
            } else {
                if (appConfiguration.command === 'check-update') {
                    logger.info('You are on the latest version of create-nes-game!');
                } else {
                    logger.debug('You are on the latest version of create-nes-game');
                }
            }

    } catch (e) {
        logger.warn('Checking for latest version failed - you can check online at https://cppchriscpp.github.io/create-nes-game');
        logger.debug('Version check error', e.toString());
    }
}

module.exports = {run};