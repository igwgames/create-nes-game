// Logger is a global, so just require it
require('./util/logger');

const AppConfiguration = require('./config/app-configuration'),
    BaseGameConfiguration = require('./config/base-game-configuration');

logger.info('App started n stuff');

const game = new BaseGameConfiguration('beees', {mapper: 'nrom'});

// logger.info('smile, you\'re on gameboy camera', game.toString());

// FIXME: there should be an interface of commands here - this should only be the default if not in a create-nes-game project already
const CreateCommand = require('./commands/create');

CreateCommand.run();