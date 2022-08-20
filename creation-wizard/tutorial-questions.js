const tutorialGroups = require('./tutorials').tutorialGroups;
const tutorialQuestions = [
    {
        id: "tutorial-group",
        question: `Which tutorial set would you like to use?`,
        type: 'choice', 
        possibleValues: tutorialGroups.map(a => a.name),
        defaultValue: 'Nerdy Nights',
        showIf: (game) => game.useTutorial,
        onSubmit: (game, userValue) => {
            const theGroup = tutorialGroups.find(a => a.name.toLowerCase() === userValue.toLowerCase())
            game.tutorialGroup = theGroup.id
            return true;
        }
    }, {
        id: "tutorial-id",
        question: `Which tutorial would you like to use?`,
        type: 'choice', 
        possibleValues: (game) => tutorialGroups.find(g => g.id === game.tutorialGroup).availableTutorials.map(b => b.name),
        defaultValue: 'Week 3: background',
        showIf: (game) => game.useTutorial,
        onSubmit: (game, userValue) => {
            const theGroup = tutorialGroups.find(a => a.id === game.tutorialGroup)
            const tutorial = theGroup.availableTutorials.find(a => a.name.toLowerCase() === userValue.toLowerCase())
            game.tutorialId = tutorial.id

            // Need to pre-fill lots of other values now that we know what we're doing.
            game.mapper = 'nrom';
            game.useChrRam = false;
            game.useSram = false;
            game.chrBanks = 1;
            game.prgBanks = 2;
            game.includeC = false;
            game.includeCLibrary = 'none';
            game.testProvider = 'none';

            return true;
        }
    },
]

module.exports = tutorialQuestions