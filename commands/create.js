const questions = require('../creation-wizard/questions'),
    appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    BaseGameConfigurationFields = BaseGameConfiguration.BaseGameConfigurationFields,
    inquirer = require('inquirer'),
    path = require('path'),
    fs = require('fs');

async function run() {

    logger.info('Ready to start making a game! Fill out these prompts to figure out what configuration you need.');

    // Get name manually, since it's a bit odd, and we need it to initialize the game.
    let currentGame = null;
    let name = await inquirer.prompt([{type: 'input', name: 'v', message: questions[0].question, validate: (val) => {
        const valMsg = BaseGameConfigurationFields.name.validates(val); 
        if (valMsg !== true) { return valMsg; }
        if (fs.existsSync(path.join(appConfiguration.workingDirectory, val))) { return 'Directory already exists'; }
        return true;
    }}]);
    currentGame = new BaseGameConfiguration(name.v);
    
    // TODO: I probably should rewrite this to serve everything in one "session", but that's a bit of work.
    for (let i = 1; i < questions.length; i++) {
        const question = questions[i];
        if (!question.showIf(currentGame)) { continue; }
        
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
        require('../generators/shared/emulator')
    ];

    if (currentGame.includeC) {
        // FIXME: Uh, yeah. things.
    } else {
        generators.push(require('../generators/ca65/main.asm'));
    }

    const gamePath = path.join(appConfiguration.workingDirectory, currentGame.name);
    for (let i = 0; i < generators.length; i++) {
        logger.debug('Starting step:', generators[i].stepName);
        await generators[i](currentGame, gamePath);
    }
}

module.exports = {run};