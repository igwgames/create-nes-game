// Logger is a global, so just require it
require('./util/logger');

const AppConfiguration = require('./config/app-configuration'),
    path = require('path');

logger.debug('App started with arguments', AppConfiguration.command, AppConfiguration.arguments, 'working dir: ', AppConfiguration.workingDirectory);

try {
    const command = require('./commands/' + AppConfiguration.command);
    logger.debug('Command loaded', AppConfiguration.command);
    
    command.run().then(() => process.exit(0), error => {
        logger.error('Failed running command', error);
        process.exit(1);
    });
} catch (e) {
    logger.error('Unable to run command', AppConfiguration.command, e);
    process.exit(1);
}