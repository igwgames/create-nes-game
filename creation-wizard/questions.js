const mappers = require('../data/mappers');
const colors = {
    reset: "\x1b[0m",
    blue: "\x1b[36m",
};

const allQuestions = [

    {
        question: 'Name for game (no spaces)',
        type: 'input',
        showIf: () => true,
        onSubmit: (game, userValue) => {
            try {
                game.name = userValue;
                return true;
            } catch (e) {
                return false;
            }
        }
    },
    {
        question: `What mapper should the rom use?\nnrom is by far the simplest. Use ${colors.blue}https://mapper.nes.science${colors.reset} to compare\n`,
        type: 'choice', 
        possibleValues: Object.keys(mappers),
        defaultValue: 'nrom',
        showIf: () => true,
        onSubmit: (game, userValue) => {
            game.mapper = userValue;
            return true;
        }
    },
    {
        question: 'Would you like to use chr ram?',
        type: 'choice', 
        possibleValues: ['yes', 'no'],
        defaultValue: 'no',
        showIf: (game) => game.getMapperDefinition().features['chr ram'],
        onSubmit: (game, userValue) => {
            game.useChrRam = userValue === 'yes';
            if (game.useChrRam) {
                game.chrBanks = 0;
            }
            return true;
        }
    },
    {
        question: 'How many (16kb) prg banks should the rom have?',
        type: 'choice',
        possibleValues: (game) => game.getMapperDefinition().prgBankOptions,
        defaultValue: (game) => game.getMapperDefinition().prgBankOptions[game.getMapperDefinition().prgBankOptions.length - 1],
        showIf: (game) => true,
        onSubmit: (game, userValue) => {
            game.prgBanks = userValue;
            return true;
        }
    },
    {
        question: 'How many (8kb) chr banks should the rom have?',
        type: 'choice',
        possibleValues: (game) => game.getMapperDefinition().chrBankOptions,
        defaultValue: (game) => game.getMapperDefinition().chrBankOptions[game.getMapperDefinition().chrBankOptions.length - 1],
        showIf: (game) => !game.useChrRam,
        onSubmit: (game, userValue) => {
            game.chrBanks = userValue;
            return true;
        }
    },
    {
        question: 'How would you like mirroring set by default?',
        type: 'choice',
        possibleValues: (game) => [
            'horizontal', 
            'vertical', 
            ...(game.getMapperDefinition().features['single screen mirror'] ? ['single screen'] : []),
        ],
        defaultValue: 'horizontal',
        showIf: (game) => true,
        onSubmit: (game, userValue) => {
            game.mirroring = userValue;
            return true;
        }
    },
    {
        question: 'Would you like to use C?',
        type: 'choice',
        possibleValues: ['yes', 'no'],
        defaultValue: 'no',
        showIf: (game) => true,
        onSubmit: (game, userValue) => {
            game.includeC = userValue === 'yes';
            return true;
        }
    }, 
    {
        // TODO: Implement (not phase 1)
        question: 'What CI provider would you like configuration for?',
        type: 'choice',
        possibleValues: ['none', 'circleci', 'github (no unit tests)'],
        defaultValue: 'none',
        showIf: (game) => true,
        onSubmit: (game, userValue) => {
            game.ciProvider = userValue.replace(' (no unit tests)', '');
            return true;
        }
    }, 
    {
        question: 'What test provider would you like to use?',
        type: 'choice',
        possibleValues: ['none', 'nes-test'],
        defaultValue: 'nes-test',
        showIf: (game) => true,
        onSubmit: (game, userValue) => {
            game.testProvider = userValue;
            return true;
        }
    },
    {
        question: 'Which emulator would you like to install?',
        type: 'choice',
        possibleValues: ['system default', 'mesen', 'fceux'],
        showIf: (game) => true,
        defaultValue: 'mesen',
        onSubmit: (game, userValue) => {
            game.installEmulator = userValue;
            return true;
        }
    },
    // TODO: Mappings for banking library and C libraries

];

module.exports = allQuestions;