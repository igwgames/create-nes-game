// bootstrap this thing separately. Kinda gross...
require('../../util/logger');

const fs = require('fs'),
    path = require('path'),
    os = require('os'),
    romDir = path.join(__dirname, 'test-roms'),
    RomCommands = require('./rom-commands'),
    spawnAndWait = require('../../util/spawn-and-wait'),
    // FIXME: Be smart about os, use proper one
    bin = "../../../dist/create-nes-game" + (os.platform() === 'linux') ? '-linux' : '';

try {
    fs.rmSync(romDir, {recursive: true, force: true});
} catch (e) {
    logger.debug('Failed removing existing roms. Maybe they arent really existing, moving on.', e);
}

const promises = RomCommands.map(async cmd => {
    const args = ['--debug', '--assume-yes'];
    Object.keys(cmd).forEach(key => {
        args.push('--answer');
        args.push(key + '=' + cmd[key]);
    })

    try { fs.mkdirSync(romDir, {recursive: true}); } catch (e) { logger.debug('Failed creating test folder, probably nothing.', e); }
    try {
        await spawnAndWait('CNG (' + cmd.name + ')', bin, null, args, {outputLevel: 'info', cwd: romDir});
        await spawnAndWait('CNG (' + cmd.name + ')', path.join('..', bin), null, ['build'], {cwd: path.join(romDir, cmd.name)});
    } catch (e) {
        logger.error('Generating a rom failed! Dumping everything I know and bailing out.', {e, args, cmd});
        logger.error('REMINDER: This uses the binary, make sure you built one recently!');
        throw e;

    }
});

Promise.all(promises).then(() => console.info('Done!'));