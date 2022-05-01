const process = require('process'),
    path = require('path'),
    fs = require('fs'),
    appConfiguration = require('../config/app-configuration'),
    BaseGameConfiguration = require('../config/base-game-configuration');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory);

    const romPath = path.join(appConfiguration.workingDirectory, 'rom', game.romName);

    if (!fs.existsSync(romPath)) {
        logger.error('Rom not available! Try building it first with create-nes-game build!');
        process.exit(1);
    }

    logger.debug('Opening rom to get stats...');
    const romData = new Uint8Array(fs.readFileSync(romPath).buffer);
    const prgLength = romData[4];
    const chrLength = romData[5];

    if (romData[0] !== 'N'.charCodeAt(0) || romData[1] !== 'E'.charCodeAt(0) || romData[2] !== 'S'.charCodeAt(0) || romData[3] !== 0x1a) {
        logger.error('Not a valid nes rom, invalid header!');
        process.exit(1);
    }

    if (romData.length !== (16/* header*/) + (prgLength * 16384) + (chrLength * 8192)) {
        logger.warn('Rom file size appears to be wrong! Behavior past this point may be unexpected!');
    }

    let freeBytes = 0,
        thisBankFreeBytes = 0,
        currentByteRun = 0,
        bankFreeBytes = [];

    for (let prgBankId = 0; prgBankId < prgLength; ++prgBankId) {
        currentByteRun = 0;
        thisBankFreeBytes = 0;
        for (let i = 0; i < 16384; ++i) {
            if (romData[16 + (prgBankId * 16384) + i] === 0) {
                ++currentByteRun;
            } else {
                if (currentByteRun > 8) {
                    freeBytes += currentByteRun;
                    thisBankFreeBytes += currentByteRun;
                }
                currentByteRun = 0;
            }
        }
        if (currentByteRun > 8) {
            freeBytes += currentByteRun;
            thisBankFreeBytes += currentByteRun;
        }
        bankFreeBytes.push(thisBankFreeBytes);
    }

    logger.info('Stats for: ' + game.name + '.nes');
    logger.info('Mapper: ' + game.mapper + ' | Rom Size: ' + romData.length + ' bytes. (16b header, ' + (prgLength * 16384) + 'b prg, ' + (chrLength * 8192) + 'b chr)');
    logger.info(freeBytes + '/' + (prgLength * 16384) + ' bytes free');
    logger.info('Bank Breakdown: ');
    for (let i = 0; i < bankFreeBytes.length; ++i) {
        logger.info('Bank ' + ((i + 1).toString().padStart(2, '0')) + ': ' + bankFreeBytes[i] + '/16384 bytes free');
    }
    
}

module.exports = {run};