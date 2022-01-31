const AppConfiguration = require('../config/app-configuration');
class Logger {

    constructor(configuration) {
        ['debug', 'trace', 'log', 'info', 'warn', 'error'].forEach((lvl, idx) => {
            this[lvl] = (...args) => {
                if (!configuration.debugMode && idx < 2) { return; }
                console[lvl].apply(this, ['[' + AppConfiguration.binaryName + ']', '[' + lvl + ']', ...args]);
            }
        })
    }

    verbose() {
        if (!configuration.debugMode) { return; }
        console[lvl].apply(this, ['[' + AppConfiguration.binaryName + ']', '[verbose]', ...args]);}
}

// Make this available as a global. Yep...
global.logger = new Logger(AppConfiguration);