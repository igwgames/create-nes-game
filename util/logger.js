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

const noColors = {
    reset: '',
    dim: '',
    red: '',
    green: '',
    yellow: '',
    blue: '',
    deepBlue: '',
    gray: ''
};

class Logger {
    debugMode = false
    allowColors = false;
    levelColors = {};
    // This is kinda lame.
    binaryName = 'create-nes-game';

    constructor(configuration = {}) {
        this.debugMode = configuration.debugMode;
        this.setAllowColors(configuration.allowColors);
        ['debug', 'trace', 'log', 'info', 'warn', 'error'].forEach((lvl, idx) => {
            this[lvl] = (...args) => {
                if (!this.debugMode && idx < 2) { return; }
                console[lvl].apply(this, [
                    '[' + this.binaryName + ']', 
                    '[' + this.levelColors[lvl] + lvl + this.colors.reset + ']' + (idx < 2 ? this.colors.gray : ''), 
                    ...args, 
                    colors.reset
                ]);
            }
        })
    }

    setBinaryName(val) {
        this.binaryName = val;
    }

    setDebugMode(val) {
        this.debugMode = !!val;
    }

    setAllowColors(val) {
        this.allowColors = !!val;
        let arr = this.allowColors ? colors : noColors;
        this.levelColors = {
            debug: arr.deepBlue,
            trace: arr.deepBlue,
            log: arr.blue,
            info: arr.blue,
            warn: arr.yellow,
            error: arr.red        
        };
    }

    get colors() {
        return this.allowColors ? colors : noColors;
    }
}

// Make this available as a global. Yep...
global.logger = new Logger();

// If you ever wanna see what these all look like, here you go.
// ['debug', 'trace', 'log', 'info', 'warn', 'error'].forEach(l => logger[l]("Hi there", l));