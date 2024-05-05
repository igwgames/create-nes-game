const process = require('process'),
    path = require('path'),
    fs = require('fs'),
    appConfiguration = require('../config/app-configuration'),
    mappers = require('../data/mappers'),
    BaseGameConfiguration = require('../config/base-game-configuration');

async function run() {
    const game = BaseGameConfiguration.fromDirectory(appConfiguration.workingDirectory),
        mapper = mappers[game.mapper];

    const romPath = appConfiguration.outputFile ?? path.join(appConfiguration.workingDirectory, 'rom', game.romName);

    if (!fs.existsSync(romPath)) {
        logger.error('Rom not available! Try building it first with create-nes-game build!');
        process.exit(1);
    }

    logger.debug('Opening rom to get stats...');
    const romData = new Uint8Array(fs.readFileSync(romPath).buffer);
    let prgLength = romData[4];
    const chrLength = romData[5];

    if (romData[0] !== 'N'.charCodeAt(0) || romData[1] !== 'E'.charCodeAt(0) || romData[2] !== 'S'.charCodeAt(0) || romData[3] !== 0x1a) {
        logger.error('Not a valid nes rom, invalid header!');
        process.exit(1);
    }

    let prgBankSize = 16384;
    if (mapper.prgBankSize === '8kb') {
        prgLength *= 2;
        prgBankSize = 8192;
    }
    const chrBankSize = 8192;

    const expectedSize = (16/* header*/) + (prgLength * prgBankSize) + (chrLength * chrBankSize);
    if (romData.length !== expectedSize) {
        logger.warn('Rom file size appears to be wrong! Behavior past this point may be unexpected!', {expectedSize, actualSize: romData.length});
        logger.debug('Rest of the variables', {prgLength, prgBankSize, chrLength, chrBankSize})
    }

    let freeBytes = 0,
        thisBankFreeBytes = 0,
        currentByteRun = 0,
        bankFreeBytes = [];

    for (let prgBankId = 0; prgBankId < prgLength; ++prgBankId) {
        currentByteRun = 0;
        thisBankFreeBytes = 0;
        for (let i = 0; i < prgBankSize; ++i) {
            if (romData[16 + (prgBankId * prgBankSize) + i] === 0) {
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
    logger.info('Mapper: ' + game.mapper + ' | Rom Size: ' + romData.length + ' bytes. (16b header, ' + (prgLength * prgBankSize) + 'b prg, ' + (chrLength * chrBankSize) + 'b chr)');
    logger.info(freeBytes + '/' + (prgLength * prgBankSize) + ' bytes free');
    logger.info('Bank Breakdown: ');
    for (let i = 0; i < bankFreeBytes.length; ++i) {
        logger.info('Bank ' + ((i + 1).toString().padStart(2, '0')) + ': ' + bankFreeBytes[i] + '/' + prgBankSize + ' bytes free');
    }
    
}

module.exports = {run};