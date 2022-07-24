const appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration'),
    spawnAndWait = require('../util/spawn-and-wait'),
    os = require('os'),
    path = require('path'),
    fs = require('fs');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);

    if (game.includeCLibrary !== 'neslib with famitone2' && game.includeCLibrary !== 'neslib with famitracker') {
        logger.debug('Not using neslib, skipping conversion');
        return;
    }

    const nsfFile = path.join(appConfiguration.workingDirectory, 'sound', 'sfx.nsf');
    const txtFile = path.join(appConfiguration.workingDirectory, 'sound', 'music.txt');
    
    const sfxTarget = path.join(appConfiguration.workingDirectory, 'sound', 'sfx.asm');
    const musicTarget = path.join(appConfiguration.workingDirectory, 'sound', 'sfx.nsf');

    let sfxUpdated = false, musicUpdated = false;

    try {
        const sfxMtimes = [nsfFile, sfxTarget].map(fs.statSync).map(a => a.mtime);
        if (sfxMtimes[0] > sfxMtimes[1]) {
            sfxUpdated = true;
        }
    } catch (e) {
        logger.debug('Failed checking sfx, rebuilding.', e);
        sfxUpdated = true;
    }
    
    if (game.includeCLibrary === 'neslib with famitone2') {
        try {
            const musicMTimes = [txtFile, musicTarget].map(fs.statSync).map(a => a.mtime);
            if (musicMTimes[0] > musicMTimes[1]) {
                musicUpdated = true;
            }    
        } catch (e) {
            logger.debug('Failed checking music, rebuilding');
            musicUpdated = true;
        }
    }

    if (!sfxUpdated && !musicUpdated) {
        logger.debug('No updates made to sfx or music, not re-running conversion.');
        return;
    }
    logger.info('Running neslib music/sfx conversion');

    const nsfArgs = [nsfFile, '-ca65'];
    if (game.neslibNtscOrPal === 'pal') {
        nsfArgs.push('-pal');
    }
    if (game.neslibNtscOrPal === 'ntsc') {
        nsfArgs.push('-ntsc');
    }

    if (!fs.existsSync(nsfFile)) {
        logger.error('Sound effect file sfx.nsf not found! Cannot continue.');
        throw new Error('Sound effect file sfx.nsf not found!');
    }

    await spawnAndWait('nsf2data', path.join(appConfiguration.workingDirectory, 'tools', 'famitone2', 'nsf2data' + (os.platform() === 'win32' ? '.exe' : '')), nsfFile, nsfArgs, {outputLevel: 'info'});
    try {
        fs.rmSync(path.join(appConfiguration.workingDirectory, 'sound', 'sfx.asm'));
    } catch (e) {
        logger.debug('Failed removing old file, probably fine', e);
    }
    // Yeah, I know, I'm picky.
    fs.renameSync(path.join(appConfiguration.workingDirectory, 'sound', 'sfx.s'), path.join(appConfiguration.workingDirectory, 'sound', 'sfx.asm'));
    logger.debug('Finished converting sfx.nsf');

    if (game.includeCLibrary === 'neslib with famitracker') {
        logger.debug('Famitracker version, not doing music conversion (uses .bin)');
        return;
    }

    if (!fs.existsSync(txtFile)) {
        logger.error('Music file music.text not found! Cannot continue.');
        throw new Error('Music file music.text not found!');
    }

    await spawnAndWait('text2data', path.join(appConfiguration.workingDirectory, 'tools', 'famitone2', 'text2data' + (os.platform() === 'win32' ? '.exe' : '')), txtFile, [txtFile, '-ca65'], {outputLevel: 'info'});
    // Yeah, I know, I'm picky.
    fs.renameSync(path.join(appConfiguration.workingDirectory, 'sound', 'music.s'), path.join(appConfiguration.workingDirectory, 'sound', 'music.asm'));
    logger.debug('Finished converting sfx.nsf');
    
}

module.exports = {run};