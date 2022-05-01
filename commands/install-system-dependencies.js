const appConfiguration = require('../config/app-configuration'),
    os = require('os'),
    inquirer = require('inquirer'),
    findExecutable = require('../util/find-executable'),
    spawnAndWait = require('../util/spawn-and-wait');

async function run() {

    // Linux only. We dunno what to do really
    if (os.platform() !== 'linux') {
        return;
    }
    const hasMono = !!findExecutable('mono'),
        hasApt = !!findExecutable('apt-get');

    if (!hasMono) {
        if (!hasApt) {
            logger.warn('Unable to find mono on your system! No apt, so cannot install it automatically.');
            logger.warn('The following packages are required for the tools to work:');
            logger.warn(' - tar');
            logger.warn(' - build-essential');
            logger.warn(' - mono-complete');
            logger.warn(' - libsdl2-2.0');
            logger.warn(' - gnome-themes-standard');
            return;
        } else {
            logger.warn('The following packages are required for the tool to work:');
            logger.warn(' - tar');
            logger.warn(' - build-essential');
            logger.warn(' - mono-complete');
            logger.warn(' - libsdl2-2.0');
            logger.warn(' - gnome-themes-standard');

            if (!appConfiguration.assumeYes) {
                const shouldInstall = await inquirer.prompt([{
                    type: 'confirm', 
                    name: 'v', 
                    message: `Would you like to try to automatically install them with apt? (Will require your sudo password)`, 
                    default: false
                }]);

                if (!shouldInstall.v) {
                    logger.debug('User aborted install');
                    return; 
                }
            }

            try {
                logger.info('Installing dependencies - this may take up 5-10 minutes, please be patient.');
                await spawnAndWait('apt-get update', 'sudo', null, ['apt-get', 'update']);
                logger.debug('Finished update, starting install.');
                await spawnAndWait('apt-get', 'sudo', null, ['apt-get', 'install', '-y', 'tar', 'build-essential', 'mono-complete', 'libsdl2-2.0', 'gnome-themes-standard']);
                logger.info('Successfully installed dependencies');
            } catch (e) {
                logger.error('Failed installing dependencies! Error follows, will try to continue anyway', e);
            }

        }
    }

}


module.exports = {run};