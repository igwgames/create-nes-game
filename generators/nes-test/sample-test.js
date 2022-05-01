// Creates a sample test file for nes-test, assuming it is being used.

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers');

function createConfig(game, directory) {
    try { 
        fs.mkdirSync(path.join(directory, 'test')); 
    } catch (e) { 
        // If it exists we don't care, otherwise if it might be permissions, we do!
        if (e.code !== 'EEXIST') {
            logger.error('Failed creating test directory! Do you have write permissions to the folder?', e);
            throw new Error('Failed creating a directory during game setup');
        }
    }

    const mapper = mappers[game.mapper];
    fs.writeFileSync(path.join(directory, 'test', 'example-test.js'), eta.render(fs.readFileSync(path.join(__dirname, 'sample-test.template.js')).toString(), {game, mapper}));
}

createConfig.stepName = 'sample-test.js';

module.exports = createConfig;