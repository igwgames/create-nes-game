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
    arguments = [];
    isUsingScratchpad = false;
    command = 'help';
    isInProjectDirectory = null;
    allowColors = true;
    assumeYes = false;

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
        if (this.debugMode) {
            console.debug('[' + this.binaryName + '] [debug] Debug mode enabled');
        }


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
                console.error('Cannot write cache directory, cannot continue', e);
                throw new Error('Cache directory does not exist or is not writeable! Cannot continue. You can set it manually with the CACHE_DIRECTORY environment variable');
            }
        }

        if (args.indexOf('--scratchpad') !== -1) {
            console.warn('[' + this.binaryName + '] [warn] Using scratchpad mode for testing, hope you know what you\'re doing ;)');
            this.isUsingScratchpad = true;
            this.workingDirectory = path.join(this.workingDirectory, 'scratchpad');
        }

        if (args.indexOf('--no-colors') !== -1) {
            this.allowColors = false;
        }

        if (args.indexOf ('--assume-yes') !== -1 || args.indexOf('-y') !== -1) {
            this.assumeYes = true;
        }

        this.arguments = args.filter(a => !a.startsWith('-'));
        if (this.isInProjectDirectory) {
            this.command = this.arguments[0] ?? 'help';
        } else {
            if (this.arguments[0] && this.arguments[0] === 'install') {
                this.command = 'install';
            } else {
                if (this.arguments[0] && this.arguments[0] !== 'create') {
                    console.info('[' + this.binaryName + '] [warn] Command ' + this.arguments[0] + ' ignored, not in a game directory.');
                }
                this.command = 'create';
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
                    console.debug('[' + this.binaryName + '] [debug] Hit the end of the line trying to find parent directory.', e.toString());
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
