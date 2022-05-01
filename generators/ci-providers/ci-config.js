// Creates circleci config

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers');

function createConfig(game, directory) {
    const mapper = mappers[game.mapper];

    switch (game.ciProvider) {
        case 'none':
            logger.debug('No ci provider configured, skipping ci setup');
            return;
        case 'github':
            // If you don't have permission to create directories by now, we probably know.
            try { fs.mkdirSync(path.join(directory, '.github', 'workflows'), {recursive: true}) } catch (e) {}
            fs.writeFileSync(path.join(directory, '.github', 'workflows', 'main.yml'), eta.render(fs.readFileSync(path.join(__dirname, 'github-workflow-main.template.yml')).toString(), {game, mapper}));
            break;

        case 'circleci':
            // If you don't have permission to create directories by now, we probably know.
            try { fs.mkdirSync(path.join(directory, '.circleci')) } catch (e) {}
            fs.writeFileSync(path.join(directory, '.circleci', 'config.yml'), eta.render(fs.readFileSync(path.join(__dirname, 'circleci-config.template.yml')).toString(), {game, mapper}));
            break;
        default:
            throw new Error('Unknown CI Provider: ' + game.ciProvider);
    }

}

createConfig.stepName = 'ci-config';

module.exports = createConfig;