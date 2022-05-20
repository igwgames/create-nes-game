// bootstrap this thing separately. Kinda gross...
require('../../util/logger');

const fs = require('fs'),
    path = require('path'),
    romDir = path.join(__dirname, 'test-roms'),
    RomCommands = require('./rom-commands'),
    spawnAndWait = require('../../util/spawn-and-wait'),
    // FIXME: Be smart about os, use proper one
    bin = "../../../dist/create-nes-game-win";

fs.rmdirSync(romDir, {recursive: true, force: true});

const promises = RomCommands.map(async cmd => {
    const args = ['--debug', '--assume-yes'];
    Object.keys(cmd).forEach(key => {
        args.push('--answer');
        args.push(key + '=' + cmd[key]);
    })
    console.info('args', args);
    try { fs.mkdirSync(romDir); } catch (e) { logger.debug('Failed creating test folder, probably nothing.', e); }
    await spawnAndWait('create-nes-game', bin, null, args, {outputLevel: 'info', cwd: romDir});
    await spawnAndWait('create-nes-game', path.join('..', bin), null, ['build'], {cwd: path.join(romDir, cmd.name)});
});

Promise.all(promises).then(() => console.info('Done!'));