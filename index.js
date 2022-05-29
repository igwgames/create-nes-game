// Logger is a global, so just require it
require('./util/logger');

const AppConfiguration = require('./config/app-configuration');

logger.debug('App started with arguments', AppConfiguration.command, AppConfiguration.arguments, 'working dir: ', AppConfiguration.workingDirectory);

(async function() {

    if (AppConfiguration.command !== 'check-update') {
        // Run update check in the background, unless that's the exact command we want
        await require('./commands/check-update').run()
    }

    try {
        const command = require('./commands/' + AppConfiguration.command);
        logger.debug('Command loaded', AppConfiguration.command);
       
        try {
            await command.run() 
            process.exit(0);
        } catch (e) {
            logger.error('Failed running command', error);
            process.exit(1);
        }
    } catch (e) {
        logger.error('Unable to run command', AppConfiguration.command, e);
        process.exit(1);
    }
})();