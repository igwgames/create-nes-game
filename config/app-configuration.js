const path = require('path'),
    fs = require('fs'),
    os = require('os'),
    process = require('process'),
    helpCommand = require('../commands/help');

class AppConfiguration {
    debugMode = false;
    workingDirectory = null;
    isControlledFolder = false;
    cacheDirectory = path.join(os.tmpdir(), 'create-nes-game', 'cache');


    constructor() {
        const args = process.argv.map(a => a.toLowerCase().trim());

        // Since we parse all other args here, look for help and dump it out.
        if (args.indexOf('--help') !== -1 || args.indexOf('-h') !== -1) {
            helpCommand();
            process.exit(0);
        }

        this.workingDirectory = process.cwd();
        // FIXME: Dumb
        this.workingDirectory = path.join(this.workingDirectory, 'scratchpad');

        // FIXME: Implement isControlledFolder

        if (process.env.CACHE_DIRECTORY) {this.cacheDirectory = (process.env.CACHE_DIRECTORY) }

        if (!fs.existsSync(this.cacheDirectory)) {
            try {
                try { fs.mkdirSync(path.join(os.tmpdir(), 'create-nes-game')) } catch (e) { /* Probably already exists, ignore */ }
                fs.mkdirSync(this.cacheDirectory);
            } catch (e) {
                // NOTE: Cannot use logger here, it depends on this class.
                console.error('Cannot write cache directory, cannot continue', e);
                throw new Error('Cache directory does not exist or is not writeable! Cannot continue. You can set it manually with the CACHE_DIRECTORY environment variable');
            }
        }

        this.debugMode = (process.env.DEBUG === 'true') || (args.indexOf('--debug') !== -1 || args.indexOf('-v') !== -1 || args.indexOf('--verbose') !== -1);
    }
}

module.exports = new AppConfiguration();