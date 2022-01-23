const Mappers = {
    'nrom': {
        mapperNumber: 0,
        minPrgBanks: 1, 
        maxPrgBanks: 2,
        softwareMirroring: false,
        allowBankswitch: false,
        minChrBanks: 1,
        maxChrBanks: 1,
        prgBankOptions: [1, 2],
        chrBankOptions: [1],
        
        features: {
            'chr ram': false,
            'chr rom': true,
            'software mirroring': false,
            'rom > 32k': false,
            'rom > 256k': false,
            'multiple chr banks': false,
            'Beginner Friendly': true,
            'prg ram': false,
            '32k prg ram': false,
            'scanline counter': false,
            'small chr banks': false,
            'small prg banks': false,
            'single screen mirror': false
        }
    },
    'mmc1 (skrom)': {
        mapperNumber: 1,
        minPrgBanks: 2, 
        maxPrgBanks: 16, // Technically 512k is possible, but it's a pain in the ass.
        softwareMirroring: true,
        allowBankswitch: true,
        minChrBanks: 1,
        maxChrBanks: 16,
        prgBankOptions: [2, 4, 8, 16],
        chrBankOptions: [2, 4, 8, 16],
        
        features: {
            'chr ram': true,
            'chr rom': true,
            'software mirroring': true,
            'rom > 32k': true,
            'rom > 256k': false,
            'multiple chr banks': true,
            'Beginner Friendly': false,
            'prg ram': true,
            '32k prg ram': true,
            'scanline counter': false,
            'small chr banks': false,
            'small prg banks': false,
            'single screen mirror': true
        }

    }
    // FIXME: Implement more mappers!
};

Object.keys(Mappers).forEach(key => Mappers[key].name = key);

module.exports = Object.freeze(Mappers);