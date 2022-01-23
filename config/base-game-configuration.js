const mappers = require("../data/mappers");

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
        possibleValues: [...Array(31).keys()].map(i => i+1)
    },
    includeC: {
        type: 'boolean',
        default: false,
        possibleValues: [false, true]
    },
    ciProvider: {
        type: 'string',
        default: 'none',
        possibleValues: ['none', 'circleci']
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
    includeBankingLibrary: {
        type: 'boolean',
        default: false,
        possibleValues: [false, true]
    },
    includeCLibrary: {
        type: 'boolean',
        default: 'none',
        possibleValues: ['none', 'neslib with famitone2', 'neslib with famitracker']
    },

    _useMapperPicker: {
        type: 'boolean',
        default: false,
        possibleValues: [true, false]
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

    getMapperDefinition() {
        return mappers[this.mapper];
    }

    clone() {
        return new BaseGameConfiguration(JSON.parse(JSON.stringify(this._properties)));
    }

    toObject() {
        return Object.keys(this._properties)
            .filter(x => !x.startsWith('_'))
            .reduce((obj, key) => { 
                obj[key] = this._properties[key]; 
                return obj; 
            }, {});
    }

    toString() {
        return JSON.stringify(this.toObject(), null, 4);
    }

    static get BaseGameConfigurationFields() {
        return BaseGameConfigurationFields;
    }
}

module.exports = BaseGameConfiguration;