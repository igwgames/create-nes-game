// Creates config to allow builds in vscode.

const fs = require('fs'),
    path = require('path');

const vscodeTasks = 
`{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "build",
            "type": "shell",
            "command": "create-nes-game build && create-nes-game run",
            "problemMatcher": [],

            "group": {
                "kind": "build",
                "isDefault": true,
            }
        }
    ]
}
`

function createConfig(game, directory) {
    try { fs.mkdirSync(path.join(directory, '.vscode')); } catch (e) {}

    fs.writeFileSync(path.join(directory, '.vscode', 'tasks.json'), vscodeTasks);
}

createConfig.stepName = '.vscode config';

module.exports = createConfig;