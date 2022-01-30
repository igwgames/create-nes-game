const mappers = require('../data/mappers');

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
        // TODO: Implement this, requested feature.
        // See: http://pineight.com/nes/mapperwizard.html
        // See also: https://wiki.nesdev.org/w/index.php/Comparison_of_Nintendo_mappers
        // It might be better to create a quick-n-dirty web version
        question: 'Have you already decided on a mapper?',
        type: 'choice',
        possibleValues: ['yes', 'no'],
        defaultValue: 'no',
        showIf: () => false,
        onSubmit: (game, userValue) => {
            game._useMapperPicker = userValue === 'yes';
            return true;
        }
    },
    {
        question: 'Which features would you like?',
        type: 'checklist',
        possibleValues: [
            'beginner friendly',
            'rom > 32k',
            'rom > 256k',
            'chr Rom',
            'chr Ram',
            'multiple chr Banks',
            'software mirroring',
            'prg ram',
            '32k prg ram',
            'small chr banks',
            'small prg banks',
            'single screen mirror'
        ],
        defaultValue: ['beginner friendly'],
        showIf: (game) => game._useMapperPicker,
        onSubmit: (game, userValue) => {
            // TODO: Create smart implementation map
            game._suggestedMapper = 'nrom';
            return true;
        }
    },
    {
        question: 'What mapper should the rom use?',
        type: 'choice', 
        possibleValues: Object.keys(mappers),
        defaultValue: 'nrom',
        showIf: (game) => !game._useMapperPicker,
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
        possibleValues: ['none', 'circleci'],
        defaultValue: 'none',
        showIf: (game) => false,
        onSubmit: (game, userValue) => {
            game.ciProvider = userValue;
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