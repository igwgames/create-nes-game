const mappers = require("../data/mappers"),
    tutorialGroups = require('../creation-wizard/tutorials').tutorialGroups,
    tutorials = require('../creation-wizard/tutorials').tutorials,
    slugify = require('../util/slugify'),
    fs = require('fs'),
    path = require('path'),
    childProcess = require('child_process');

const CONFIG_VERSION = 10000;

const BaseGameConfigurationFields = {
    name: {
        type: 'string',
        default: null,
        possibleValues: null,
        validates: val => /^[A-Za-z0-9\-_]+$/.test(val) ? true : 'Game name must be a valid directory name. It should only contain alphanumeric characters, as well as dashes and underscores.',
        validationWarning: 'Game name must be a valid directory name. It should only contain alphanumeric characters, as well as dashes and underscores.'
    },
    mapper: {
        type: 'string',
        default: 'nrom',
        possibleValues: Object.keys(mappers)
    },
    mirroring: {
        type: 'string',
        default: 'horizontal',
        possibleValues: ['horizontal', 'vertical', 'single screen', 'four screen']
    },
    useChrRam: {
        type: 'boolean',
        default: false,
        possibleValues: [true, false]
    },
    useSram: {
        type: 'boolean',
        default: false,
        possibleValues: [true, false]
    },
    sramSize: {
        type: 'number',
        default: 8,
        possibleValues: [8, 32]
    },
    chrBanks: {
        // 8K banks, do conversion if you're counting 4k banks.
        type: 'number',
        default: 1,
        possibleValues: [...Array(33).keys()]
    },
    prgBanks: {
        // 16K banks, do conversion for other sizes
        type: 'number',
        default: 2,
        possibleValues: [1, 2, 4, 8, 16, 32, 64, 128, 256]
    },
    includeC: {
        type: 'boolean',
        default: false,
        possibleValues: [false, true]
    },
    ciProvider: {
        type: 'string',
        default: 'none',
        possibleValues: ['none', 'circleci', 'github']
    },
    testProvider: {
        type: 'string',
        default: 'nes-test',
        possibleValues: ['none', 'nes-test']
    },
    installEmulator: {
        type: 'string',
        default: 'mesen',
        possibleValues: ['system default', 'mesen', 'fceux']
    },
    includeCLibrary: {
        type: 'boolean',
        default: 'none',
        possibleValues: ['none', 'neslib with famitone2', 'neslib with famitracker']
    },
    neslibNtscPal: {
        type: 'string',
        default: 'both',
        possibleValues: ['both', 'ntsc', 'pal']
    },
    useTutorial: {
        type: 'boolean',
        default: false,
        possibleValues: [true, false]
    },
    tutorialGroup: {
        type: 'string',
        default: null,
        possibleValues: tutorialGroups.map(a => a.id)
    },

    tutorialId: {
        type: 'string',
        default: null,
        possibleValues: tutorials.map(a => a.id)
    },

    console: {
        type: 'string',
        default: 'nes',
        possibleValues: ['nes']
    },

    beforeStepActions: {
        type: 'object',
        default: {},
        possibleValues: null,
        validates: () => true
    },

    afterStepActions: {
        type: 'object',
        default: {},
        possibleValues: null,
        validates: () => true
    },

    emulatorParams: {
        type: 'array',
        default: [],
        possibleValues: null,
        validates: () => true
    },

    extraDependencies: {
        type: 'array',
        default: [],
        possibleValues: null,
        validates: (val) => (val.filter(v => typeof v === 'object' && v.name).length === val.length),
        validationWarning: 'extra dependencies not in a valid format, must all be objects, and have a name at miniumum.'
    },

    configVersion: {
        type: 'number',
        default: CONFIG_VERSION,
        possibleValues: [CONFIG_VERSION]
    }

};
Object.keys(BaseGameConfigurationFields).map(key => BaseGameConfigurationFields[key].name = key);
Object.freeze(BaseGameConfigurationFields);

class BaseGameConfiguration {
    _properties = {}
    
    constructor(name = null, defaultOverrides = {}) {
        Object.keys(BaseGameConfigurationFields).forEach(key => {
            this._properties[key] = BaseGameConfigurationFields[key].default;

            Object.defineProperty(this, key, {
                get: () => this._properties[key],
                set: value => {
                    if (value === null) {
                        throw new Error(`${key}: Field cannot be null!`);
                    }
                    if (BaseGameConfigurationFields[key].possibleValues !== null && BaseGameConfigurationFields[key].possibleValues.indexOf(value) === -1) {
                        throw new Error(`Cannot set field ${key} to ${value}! Possible values: [${BaseGameConfigurationFields[key].possibleValues.join(', ')}]`);
                    } else if (BaseGameConfigurationFields[key].validates && !BaseGameConfigurationFields[key].validates(value) === true) {
                        throw new Error(`Field ${key} does not validate! ${BaseGameConfigurationFields[key].validationWarning}`);
                    }
                    this._properties[key] = value;
                }
            })
        });

        // Doing it this way to run it through the validation above.
        this.name = name;
        Object.keys(defaultOverrides).forEach(key => {
            this[key] = defaultOverrides[key];
        });
    }

    getVersionString() {
        const major = Math.floor(this.configVersion / 10000),
            minor = Math.floor(this.configVersion / 100) % 100,
            patch = this.configVersion % 100;

        return `${major}.${minor}.${patch}`;
    }

    get configVersionString() {
        return this.getVersionString();
    }

    get romName() {
        return slugify(this.name) + '.nes';
    }

    getMapperDefinition() {
        return mappers[this.mapper];
    }

    clone() {
        return new BaseGameConfiguration(JSON.parse(JSON.stringify(this._properties)));
    }

    toObject() {
        return {
            configVersion: this.configVersion,
            configVersionString: this.configVersionString,
            ...Object.keys(this._properties)
                .filter(x => !x.startsWith('_'))
                .reduce((obj, key) => { 
                    obj[key] = this._properties[key]; 
                    return obj; 
                }, {})
        };
    }

    toString() {
        return JSON.stringify(this.toObject(), null, 4);
    }

    doRunBefore(command) {
        return this.doRunAct('beforeStepActions', command);
    }

    doRunAfter(command) {
        return this.doRunAct('afterStepActions', command);
    }

    async doRunAct(actType, command) {
        for (let i = 0; i < (this[actType][command] ?? []).length; i++) {
            const baseCmd = this[actType][command][i];
            let modifiedCmd
            if (process.platform === 'win32') {
                // Windows doesn't recognize / in commands like linux, but people tend to put slashes in.
                // Let's try to hack it in, to make things more likely to be cross-platform-friendly. (I hope)
                const firstWord = baseCmd.split(' ')[0].replace(/\//g, '\\');
                modifiedCmd = firstWord + baseCmd.substring(baseCmd.indexOf(' '));
                logger.debug('Updated command to work with windows. original:', baseCmd, 'updated:', modifiedCmd);
            } else {
                modifiedCmd = baseCmd;
            }
            // This is some stupid messiness - pkg overrides `node` if it sees it at the start of a command.
            // So... If that's the case, we'll make it not
            if (modifiedCmd.startsWith('node')) {
                modifiedCmd = " " + modifiedCmd;
            }

            await new Promise((resolve, reject) => childProcess.exec(modifiedCmd, (error, stdout, stderr) => {
                if (stdout) {
                    stdout.split('\n').forEach(t => {
                        if (t.length > 0) {
                            logger.info(`[${actType} ${command}]`, t);
                        }
                    });
                } 
                if (stderr) {
                    stderr.split('\n').forEach(t => {
                        if (t.length > 0) {
                            logger.warn(`[${actType} ${command}]`, t);
                        }
                    });
                }

                if (error) { 
                    reject(error) 
                } else {
                    resolve();
                }
            }));
        }

    }

    static fromString(str) {
        const obj = JSON.parse(str);
        const game = new BaseGameConfiguration(obj.name, {});
        Object.keys(obj).forEach(key => {
            try {
                game[key] = obj[key];
            } catch (e) {
                // We know about this one and it's spammy. Shush.
                if (key !== 'configVersionString') {
                    logger.debug('Skipping field', key, 'assuming getter only.', e.toString());
                }
            }
        });
        return game;
    }

    static fromDirectory(dir) {
        const strConfig = fs.readFileSync(path.join(dir, '.create-nes-game.config.json')).toString();
        return BaseGameConfiguration.fromString(strConfig);
    }

    static get BaseGameConfigurationFields() {
        return BaseGameConfigurationFields;
    }
}

module.exports = BaseGameConfiguration;
