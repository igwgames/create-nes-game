const process = require('process'),
    helpCommand = require('../commands/help');

class AppConfiguration {
    debugMode = false;
    workingDirectory = null;
    isControlledFolder = false;


    constructor() {
        const args = process.argv.map(a => a.toLowerCase().trim());

        // Since we parse all other args here, look for help and dump it out.
        if (args.indexOf('--help') !== -1 || args.indexOf('-h') !== -1) {
            helpCommand();
            process.exit(0);
        }

        this.workingDirectory = process.cwd();

        // FIXME: Implement isControlledFolder

        this.debugMode = (process.env.DEBUG === 'true') || (args.indexOf('--debug') !== -1 || args.indexOf('-v') !== -1 || args.indexOf('--verbose') !== -1);
    }
}

module.exports = new AppConfiguration();