const path = require('path'),
    fs = require('fs'),
    os = require('os'),
    process = require('process'),
    findExecutable = require('../util/find-executable');

// This ends up grabbing all configuration from the cli, including commands
// Perhaps not the clearest thing ever written, apologies if this trips you up.
class AppConfiguration {
    debugMode = false;
    workingDirectory = null;
    isControlledFolder = false;
    cacheDirectory = path.join(os.tmpdir(), 'create-nes-game', 'cache');
    updateDirectory = path.join(os.tmpdir(), 'create-nes-game', 'update');
    arguments = [];
    isUsingScratchpad = false;
    command = 'help';
    isInProjectDirectory = null;
    allowColors = true;
    assumeYes = false;
    presetAnswers = {};
    unattended = false;
    skipVersionCheck = false;
    nonDirectoryCommands = ["help", "create", "install", "check-update", "update"];
    updateUrl = 'https://cppchriscpp.github.io/create-nes-game/';
    binaryUrl = 'https://github.com/cppchriscpp/create-nes-game/releases/download/v';

    constructor() {
        const args = process.argv.filter((_, i) => i > 1).map(a => a.toLowerCase().trim());

        // Since we parse all other args here, look for help and dump it out.
        if (args.indexOf('--help') !== -1 || args.indexOf('-h') !== -1) {
            this.command = 'help';
            this.arguments = [];
            return;
        }

        // Mark debug mode early, so we can see other warnings we might hit
        this.debugMode = (process.env.DEBUG === 'true') || (args.indexOf('--debug') !== -1 || args.indexOf('-v') !== -1 || args.indexOf('--verbose') !== -1);
        logger.setDebugMode(this.debugMode);
        if (args.indexOf('--no-colors') !== -1) {
            this.allowColors = false;
        } else {
            this.allowColors = true;
        }
        logger.setAllowColors(this.allowColors);
        logger.setBinaryName(this.binaryName);
        logger.debug('[' + this.binaryName + '] [debug] Debug mode enabled');


        // Determine if we are in a project directory, and update working dir as needed
        this.workingDirectory = this._determineWorkingDirectory();
        this.isInProjectDirectory = fs.existsSync(path.join(this.workingDirectory, '.create-nes-game.config.json'));

        // FIXME: Implement isControlledFolder

        if (process.env.CACHE_DIRECTORY) {this.cacheDirectory = (process.env.CACHE_DIRECTORY) }

        if (!fs.existsSync(this.cacheDirectory)) {
            try {
                try { fs.mkdirSync(path.join(os.tmpdir(), 'create-nes-game')) } catch (e) { /* Probably already exists, ignore */ }
                fs.mkdirSync(this.cacheDirectory);
            } catch (e) {
                // NOTE: Cannot use logger here, it depends on this class.
                logger.error('Cannot write cache directory, cannot continue', e);
                throw new Error('Cache directory does not exist or is not writeable! Cannot continue. You can set it manually with the CACHE_DIRECTORY environment variable');
            }
        }

        if (args.indexOf('--scratchpad') !== -1) {
            logger.warn('[' + this.binaryName + '] [warn] Using scratchpad mode for testing, hope you know what you\'re doing ;)');
            this.isUsingScratchpad = true;
            this.workingDirectory = path.join(this.workingDirectory, 'scratchpad');
        }

        if (args.indexOf ('--assume-yes') !== -1 || args.indexOf('-y') !== -1) {
            this.assumeYes = true;
        }

        if (args.indexOf('--unattended') !== -1) {
            this.unattended = true;
        }

        if (args.indexOf('--skip-version-check') !== -1) {
            this.skipVersionCheck = true
        }

        while (args.indexOf('--answer') !== -1) {
            // PSST! This isn't documented for a reason! It's kinda garbage. If you've got a use case, please
            // create an issue or a PR so we can make this a first class citizen before spreading it around.
            const val = args.splice(args.indexOf('--answer'), 2)[1].split('=');
            // Really, REALLY bad type coercion. 
            if (val[1] == parseInt(val[1], 10)) {
                val[1] = parseInt(val[1], 10);
            } else {
                val[1] = val[1].trim();
            }
            this.presetAnswers[val[0]] = val[1];
        }

        this.arguments = args.filter(a => !a.startsWith('-'));
        if (this.isInProjectDirectory) {
            if (this.arguments[0]) {
                this.command = this.arguments[0];
                this.arguments.shift();
            } else {
                this.command = 'help';
            }
        } else {
            if (this.arguments[0] && this.arguments[0] === 'install') {
                this.command = 'install';
            } else {
                if (this.arguments[0]) {
                    if (this.nonDirectoryCommands.indexOf(this.arguments[0].toLowerCase()) === -1) {
                        logger.warn('[' + this.binaryName + '] [warn] Command ' + this.arguments[0] + ' ignored, not in a game directory.');
                        this.command = 'create';
                    } else {
                        this.command = this.arguments[0];
                    }
                } else {
                    this.command = 'create';
                }
            }
        }
    }

    _determineWorkingDirectory(dir = process.cwd(), prev = null) {
        let wd = path.resolve(dir);

        if (prev === dir) {
            throw new Error('Hit directory root, it ain\'t here');
        }

        // Recurse upwards until we either find a .create-nes-game.config.json or have nowhere to go
        if (fs.existsSync(path.join(wd, '.create-nes-game.config.json'))) {
            return wd;
        } else {
            try {
                wd = this._determineWorkingDirectory(path.resolve(path.join(wd, '..')), wd);
            } catch (e) {
                if (this.debugMode) {
                    logger.debug('[' + this.binaryName + '] [debug] Hit the end of the line trying to find parent directory.', e.toString());
                }
                return process.cwd();
            }
        }
        return wd;
    }

    get binaryName() {
        return 'create-nes-game';
    }

    get isInstalled() {
        return !!findExecutable('create-nes-game');
    }
}

module.exports = new AppConfiguration();
