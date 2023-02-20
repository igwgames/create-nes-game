// bootstrap this thing separately. Kinda gross...
require('../../util/logger');

const fs = require('fs'),
    path = require('path'),
    os = require('os'),
    romDir = path.join(__dirname, 'test-roms'),
    RomCommands = require('./rom-commands'),
    spawnAndWait = require('../../util/spawn-and-wait'),
    bin = "../../../dist/create-nes-game" + (os.platform() === 'linux' ? '-linux' : '');

async function createCmd(cmd) {
    const args = ['--assume-yes', '--skip-version-check'];
    Object.keys(cmd).forEach(key => {
        args.push('--answer');
        args.push(key + '=' + cmd[key]);
    })

    try { fs.mkdirSync(romDir, {recursive: true}); } catch (e) { logger.debug('Failed creating test folder, probably nothing.', e); }
    try {
        await spawnAndWait('CNG (' + cmd.name + ')', bin, null, args, {outputLevel: 'info', cwd: romDir});
        await spawnAndWait('CNG (' + cmd.name + ')', path.join('..', bin), null, ['build', '--skip-version-check', '--unattended'], {cwd: path.join(romDir, cmd.name)});
    } catch (e) {
        logger.error('Generating a rom failed! Dumping everything I know and bailing out.', {e, args, cmd});
        logger.error('REMINDER: This uses the binary, make sure you built one recently!');
        throw e;

    }
}

try {
    fs.rmSync(romDir, {recursive: true, force: true});
} catch (e) {
    logger.debug('Failed removing existing roms. Maybe they arent really existing, moving on.', e);
}

// Do one first just to make sure installs work/don't run 8 times in ci
createCmd(RomCommands.shift()).then(async () => {
    // const promises = RomCommands.map(createCmd);

    const chunkSize = 16;
    const romCommandChunks = [];
    for (let i = 0; i < RomCommands.length; i += chunkSize) {
        romCommandChunks.push(RomCommands.slice(i, i + chunkSize));
    }

    for (let i = 0; i < romCommandChunks.length; i++) {
        console.info(`Running chunk ${i+1} of ${romCommandChunks.length}`);
        await Promise.all(romCommandChunks[i].map(createCmd));
    }
    console.info('Done!')


});