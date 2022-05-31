const questions = require('../creation-wizard/questions'),
    appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    BaseGameConfigurationFields = BaseGameConfiguration.BaseGameConfigurationFields,
    inquirer = require('inquirer'),
    path = require('path'),
    fs = require('fs'),
    os = require('os');

async function run() {

    await require('./install-system-dependencies').run();

    logger.info('Ready to start making a game! Fill out these prompts to figure out what configuration you need.');

    // Get name manually, since it's a bit odd, and we need it to initialize the game.
    let currentGame = null,
        name;
    if (appConfiguration.presetAnswers.name) {
        name = {v: appConfiguration.presetAnswers.name};
        logger.info('Using preset name', name.v);
    } else {
        name = await inquirer.prompt([{type: 'input', name: 'v', message: questions[0].question, validate: (val) => {
            const valMsg = BaseGameConfigurationFields.name.validates(val); 
            if (valMsg !== true) { return valMsg; }
            if (fs.existsSync(path.join(appConfiguration.workingDirectory, val))) { return 'Directory already exists'; }
            return true;
        }}]);
    }
    currentGame = new BaseGameConfiguration(name.v);
    
    // TODO: I probably should rewrite this to serve everything in one "session", but that's a bit of work.
    logger.debug('Preset answer list', appConfiguration.presetAnswers);
    for (let i = 1; i < questions.length; i++) {
        const question = questions[i];
        if (question.runDefault) {
            question.runDefault(currentGame);
        }
        if (!question.showIf(currentGame)) { 
            continue; 
        }

        if (typeof appConfiguration.presetAnswers[question.id] !== 'undefined') {
            logger.debug('Using preset field value', question.id, appConfiguration.presetAnswers[question.id]);
            question.onSubmit(currentGame, appConfiguration.presetAnswers[question.id]);
            continue;
        }
        
        if (question.type === 'choice') {
            let res = await inquirer.prompt([{
                type: 'list', 
                name: 'v', 
                message: question.question, 
                choices: typeof question.possibleValues === 'function' ? question.possibleValues(currentGame) : question.possibleValues, 
                default: typeof question.defaultValue === 'function' ? question.defaultValue(currentGame) : question.defaultValue
            }]);

            question.onSubmit(currentGame, res.v);
        }

    }

    logger.debug('Created game record', currentGame.toString());
    logger.info('Creating your game - this will take a moment...');

    const generators = [
        require('../generators/ca65/directory-structure'), 
        require('../generators/shared/.create-nes-game.config.json.js'),
        require('../generators/ca65/.gitignore'),
        require('../generators/ca65/ca65-binaries'),
        require('../generators/ca65/ca65.cfg'),
        require('../generators/ca65/chr-files'),
        require('../generators/ca65/nam-files'),
        require('../generators/shared/system-defines.varied'),
        require('../generators/shared/graphics.config.asm'),
        require('../generators/shared/emulator'),
        require('../generators/ci-providers/ci-config'),
        require('../generators/ca65/mapper.asm')
    ];

    if (currentGame.includeC) {
        generators.push(require('../generators/cc65/system-runtime.asm'));
        generators.push(require('../generators/cc65/main.c'));
        generators.push(require('../generators/cc65/mapper.h'));

        if (currentGame.includeCLibrary) {
            generators.push(require('../generators/neslib/neslib'));
        }
    } else {
        generators.push(require('../generators/ca65/main.asm'));
    }

    if (currentGame.testProvider === 'nes-test') {
        generators.push(require('../generators/nes-test/nes-test-binary'));
        generators.push(require('../generators/nes-test/sample-test'));
    }

    const gamePath = path.join(appConfiguration.workingDirectory, currentGame.name);
    for (let i = 0; i < generators.length; i++) {
        logger.debug('Starting step:', generators[i].stepName);
        await generators[i](currentGame, gamePath);
    }

    if (!appConfiguration.isInstalled) {
        logger.info(`${appConfiguration.binaryName} isn't installed globally.`);
        logger.info(`If you would like to be able to run ${appConfiguration.binaryName} in any folder, you can install it with `)
        logger.info(`  \`${os.platform() === 'win32' ? '' : 'sudo '}./create-nes-game install\``)
    }

    logger.info(`Success! Your game has been created in ${currentGame.name}/
Switch into that directory, and you can run the following useful commands: 

- ${appConfiguration.binaryName} build - Build your game
- ${appConfiguration.binaryName} test  - Run the tests for your game
- ${appConfiguration.binaryName} run   - Play your game!
`);

}

module.exports = {run};