const appConfiguration = require('../config/app-configuration'),
    ver = require('../package.json').version;

async function run() {
    logger.info(`create-nes-game version is ${ver}`);
}

module.exports = {run};