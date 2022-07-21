// Used to generate roms for the test commands with the various supported methods.
// NOTE: There's probably a smart way to programatically list out all possibilities, which may be worth
// doing at some point. For now I'm cherry-picking to try to catch edge cases.

const defaults = {
    mapper: "nrom",
    "chr-ram": "yes",
    "prg-banks": 2,
    "chr-banks": 0,
    "prg-ram": "none",
    "mirroring": "horizontal",
    "use-c": "no",
    "ci-provider": "none",
    // Alwys use nes-test! Testing relies on it!
    "test-provider": "nes-test",
    "emulator": "system default",
    "c-library": "none"
};

let RomCommands = [{
    // NROM
    name: "simple-nrom-128-asm",
    mapper: "nrom",
    chrRam: "none",
    prgBanks: 1,
    chrBanks: 1,
    mirroring:"horizontal",
    useC:"no",
}, {
    name: "simple-nrom-256-asm",
    mapper: "nrom",
    chrRam: "none",
    prgBanks: 2,
    chrBanks: 1,
    mirroring:"horizontal",
    useC:"no",
}, {
    name: "simple-nrom-128-c",
    mapper: "nrom",
    chrRam: "none",
    prgBanks: 1,
    chrBanks: 1,
    mirroring:"vertical",
    useC:"yes",
}, {
    name: "simple-nrom-256-c",
    mapper: "nrom",
    chrRam: "none",
    prgBanks: 2,
    chrBanks: 1,
    mirroring:"vertical",
    useC:"yes",
}, {
    // Unrom
    name: "simple-unrom-32-c",
    mapper: "unrom",
    chrRam: "yes",
    prgBanks: 2,
    chrBanks: 0,
    mirroring:"vertical",
    useC:"yes"
}, {
    name: "simple-unrom-64-asm",
    mapper: "unrom",
    chrRam: "yes",
    prgBanks: 4,
    mirroring: "horizontal",
    useC: "no"
}, {
    name: "simple-unrom-128-c",
    mapper: "unrom",
    chrRam: "yes",
    prgBanks: 8,
    chrBanks: 0,
    mirroring:"vertical",
    useC:"yes"
}, {
    name: "simple-unrom-256-asm",
    mapper: "unrom",
    chrRam: "yes",
    prgBanks: 16,
    mirroring: "horizontal",
    useC: "no"
}, {
    name: "simple-unrom-32-neslib",
    mapper: "unrom",
    chrRam: "yes",
    prgBanks: 2,
    chrBanks: 0,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitone2"
}, {
    name: "simple-unrom-256-neslib",
    mapper: "unrom",
    chrRam: "yes",
    prgBanks: 16,
    chrBanks: 0,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitone2"
}, {
    name: "simple-nrom-16-neslib",
    mapper: "nrom",
    chrRam: "no",
    prgBanks: 1,
    chrBanks: 1,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitone2"
}, {
    name: "simple-nrom-16-neslib-ft",
    mapper: "nrom",
    chrRam: "no",
    prgBanks: 1,
    chrBanks: 1,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitracker"
}, {
    name: "simple-unrom-32-neslib-ft",
    mapper: "unrom",
    chrRam: "yes",
    prgBanks: 2,
    chrBanks: 0,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitracker"
}, {
    name: "simple-unrom-256-neslib-ft",
    mapper: "unrom",
    chrRam: "yes",
    prgBanks: 16,
    chrBanks: 0,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitracker"
}, {
    name: "simple-mmc1-32-asm-chrram",
    mapper: "mmc1 (skrom)",
    chrRam: "yes",
    prgBanks: 2,
    chrBanks: 0,
    mirroring: "vertical",
    useC: "no",
    cLibrary: "none"
}, {
    name: "simple-mmc1-128-asm-chrrom",
    mapper: "mmc1 (skrom)",
    chrRam: "no",
    prgBanks: 8,
    chrBanks: 4,
    mirroring: "vertical",
    useC: "no",
    cLibrary: "none"
}, {
    name: "simple-mmc1-32-c-chrram",
    mapper: "mmc1 (skrom)",
    chrRam: "yes",
    prgBanks: 2,
    chrBanks: 0,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "none"
}, {
    name: "simple-mmc1-256-c-chrrom",
    mapper: "mmc1 (skrom)",
    chrRam: "no",
    prgBanks: 16,
    chrBanks: 2,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "none"
}, {
    name: "simple-mmc1-32-c-neslib-chrram",
    mapper: "mmc1 (skrom)",
    chrRam: "yes",
    prgBanks: 2,
    chrBanks: 0,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitone2"
}, {
    name: "simple-mmc1-64-c-neslib-chrrom",
    mapper: "mmc1 (skrom)",
    chrRam: "no",
    prgBanks: 4,
    chrBanks: 2,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitone2"
}, {
    name: "simple-mmc1-32-c-neslib-ft-chrram",
    mapper: "mmc1 (skrom)",
    chrRam: "yes",
    prgBanks: 2,
    chrBanks: 0,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitracker"
}, {
    name: "simple-mmc1-64-c-neslib-ft-chrrom",
    mapper: "mmc1 (skrom)",
    chrRam: "no",
    prgBanks: 4,
    chrBanks: 4,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitracker"
}, {
    name: "simple-mmc3-32-c-neslib-ft",
    mapper: "mmc3 (tkrom)",
    chrRam: "no",
    prgBanks: 4,
    chrBanks: 2,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitracker"
}, {
    name: "simple-mmc3-32-c-neslib",
    mapper: "mmc3 (tkrom)",
    chrRam: "no",
    prgBanks: 4,
    chrBanks: 2,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitone2"
}, {
    name: "simple-mmc3-32-c",
    mapper: "mmc3 (tkrom)",
    chrRam: "no",
    prgBanks: 4,
    chrBanks: 2,
    mirroring: "vertical",
    useC: "yes",
}, {
    name: "simple-mmc3-32-asm",
    mapper: "mmc3 (tkrom)",
    chrRam: "no",
    prgBanks: 4,
    chrBanks: 2,
    mirroring: "vertical",
    useC: "no"
}, {
    name: "simple-mmc3-256-c-neslib",
    mapper: "mmc3 (tkrom)",
    chrRam: "no",
    prgBanks: 64,
    chrBanks: 32,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitracker"
}, {
    name: "simple-mmc3-c-prg-ram",
    mapper: "mmc3 (tkrom)",
    chrRam: "no",
    prgBanks: 64,
    chrBanks: 32,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "none",
    prgRam: "8kb"
}, {
    name: "simple-mmc3-c-neslib-prg-ram",
    mapper: "mmc3 (tkrom)",
    chrRam: "no",
    prgBanks: 64,
    chrBanks: 32,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitone2",
    prgRam: "8kb"
}, {
    name: "simple-mmc3-c-neslib-ft-prg-ram",
    mapper: "mmc3 (tkrom)",
    chrRam: "no",
    prgBanks: 16,
    chrBanks: 16,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitracker",
    prgRam: "8kb"
}, {
    name: "simple-mmc1-asm-prg-ram",
    mapper: "mmc1 (skrom)",
    chrRam: "no",
    prgBanks: 8,
    chrBanks: 4,
    mirroring: "vertical",
    useC: "no",
    cLibrary: "none",
    prgRam: "8kb"

}];

function convertJson(elem) {
    // Camel to dashcase
    Object.keys(elem).forEach(key => {
        elem[key.replace(/[A-Z]/g, m => "-" + m.toLowerCase())] = elem[key];
    });
    // Apply defaults
    return {
        ...defaults,
        ...elem
    };
}

RomCommands = RomCommands.map(convertJson);

module.exports = RomCommands;