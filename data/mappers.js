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

    },
    'unrom': {
        mapperNumber: 2,
        minPrgBanks: 2, 
        maxPrgBanks: 16,
        softwareMirroring: false,
        allowBankswitch: true,
        minChrBanks: 0,
        maxChrBanks: 0,
        prgBankOptions: [2, 4, 8, 16],
        chrBankOptions: [],
        
        features: {
            'chr ram': true,
            'chr rom': false,
            'software mirroring': false,
            'rom > 32k': true,
            'rom > 256k': false,
            'multiple chr banks': false,
            'Beginner Friendly': false,
            'prg ram': false,
            '32k prg ram': false,
            'scanline counter': false,
            'small chr banks': false,
            'small prg banks': false,
            'single screen mirror': false
        }

    },
    'mmc3 (tkrom)': {
        mapperNumber: 4,
        minPrgBanks: 2, 
        maxPrgBanks: 32,
        softwareMirroring: false,
        allowBankswitch: true,
        minChrBanks: 2,
        maxChrBanks: 32,
        prgBankOptions: [2, 4, 8, 16, 32],
        chrBankOptions: [2, 4, 8, 16, 32],
        
        features: {
            'chr ram': false,
            'chr rom': true,
            'software mirroring': true,
            'rom > 32k': true,
            'rom > 256k': true,
            'multiple chr banks': true,
            'Beginner Friendly': true,
            'prg ram': true,
            '32k prg ram': false,
            'scanline counter': true,
            'small chr banks': true,
            'small prg banks': true,
            'single screen mirror': false
        }

    }
};

Object.keys(Mappers).forEach(key => Mappers[key].name = key);

module.exports = Object.freeze(Mappers);