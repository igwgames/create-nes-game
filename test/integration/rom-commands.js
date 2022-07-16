// Used to generate roms for the test commands with the various supported methods.

const defaults = {
    mapper: "nrom",
    "chr-ram": "yes",
    "prg-banks": 2,
    "chr-banks": 0,
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
 
}];

RomCommands = RomCommands.map(elem => {
    // Camel to dashcase
    Object.keys(elem).forEach(key => {
        elem[key.replace(/[A-Z]/g, m => "-" + m.toLowerCase())] = elem[key];
    });
    // Apply defaults
    return {
        ...defaults,
        ...elem
    };
});

module.exports = RomCommands;