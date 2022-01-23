const questions = require('../creation-wizard/questions'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    BaseGameConfigurationFields = BaseGameConfiguration.BaseGameConfigurationFields,
    inquirer = require('inquirer');

async function run() {

    logger.info('Ready to start making a game! Fill out these prompts to figure out what configuration you need.');

    // Get name manually, since it's a bit odd, and we need it to initialize the game.
    let currentGame = null;
    let name = await inquirer.prompt([{type: 'input', name: 'v', message: questions[0].question, validate: BaseGameConfigurationFields.name.validates}]);
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

    console.info('game', currentGame.toString());
}

module.exports = {run};