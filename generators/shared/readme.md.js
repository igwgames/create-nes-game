// Creates main assembly file for ca65 assembly projects (no cc65)

const fs = require('fs'),
    path = require('path'),
    eta = require('eta'),
    mappers = require('../../data/mappers'),
    tutorialGroups = require('../../creation-wizard/tutorials').tutorialGroups;

function createConfig(game, directory) {
    const mapper = mappers[game.mapper];
    let tutorialGroup
    let tutorial
    if (game.useTutorial) {
        tutorialGroup = tutorialGroups.find(a => a.id === game.tutorialGroup)
        tutorial = tutorialGroup.availableTutorials.find(a => a.id === game.tutorialId)
    }
    fs.writeFileSync(path.join(directory, 'README.md'), eta.render(fs.readFileSync(path.join(__dirname, 'README.template.md')).toString(), {game, mapper, tutorialGroup, tutorial}));
}

createConfig.stepName = 'README.md';

module.exports = createConfig;