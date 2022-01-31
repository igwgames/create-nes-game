const AppConfiguration = require('../config/app-configuration');

const colors = {
    reset: "\x1b[0m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[36m",
    deepBlue: "\x1b[34m",
    gray: "\u001b[38;5;244m"
};

// Kill colors if requested
if (!AppConfiguration.allowColors) { Object.keys(colors).forEach(key => colors[key] = ''); }

const levelColors = {
    debug: colors.deepBlue,
    trace: colors.deepBlue,
    log: colors.blue,
    info: colors.blue,
    warn: colors.yellow,
    error: colors.red
}

class Logger {

    constructor(configuration) {
        ['debug', 'trace', 'log', 'info', 'warn', 'error'].forEach((lvl, idx) => {
            this[lvl] = (...args) => {
                if (!configuration.debugMode && idx < 2) { return; }
                console[lvl].apply(this, [
                    '[' + AppConfiguration.binaryName + ']', 
                    '[' + levelColors[lvl] + lvl + colors.reset + ']' + (idx < 2 ? colors.gray : ''), 
                    ...args, 
                    colors.reset
                ]);
            }
        })
    }
}

// Make this available as a global. Yep...
global.logger = new Logger(AppConfiguration);

// If you ever wanna see what these all look like, here you go.
// ['debug', 'trace', 'log', 'info', 'warn', 'error'].forEach(l => logger[l]("Hi there", l));