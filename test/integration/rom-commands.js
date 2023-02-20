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
    "c-library": "none",
    "neslib-ntsc-or-pal": "both",
    "use-tutorial": "no",
    "tutorial-group": "Nerdy Nights",
    "tutorial-id": "Week 3: Background"
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
    cLibrary: "neslib with famitone2",
    neslibNtscOrPal: "ntsc"
}, {
    name: "simple-mmc1-64-c-neslib-chrrom",
    mapper: "mmc1 (skrom)",
    chrRam: "no",
    prgBanks: 4,
    chrBanks: 2,
    mirroring: "vertical",
    useC: "yes",
    cLibrary: "neslib with famitone2",
    neslibNtscOrPal: "pal"
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
},
// {
    // START OF NERDY NIGHTS
    // First tutorial actually doesn't enable nmis, so we can't wait frames. 
    // name: "nerdy-nights-3",
    // useTutorial: "yes",
    // tutorialGroup: "Nerdy Nights",
    // tutorialId: "Week 3: background"
//}, 
{
    name: "nerdy-nights-4",
    useTutorial: "yes",
    tutorialGroup: "Nerdy Nights",
    tutorialId: "Week 4: sprites"
}, {
    name: "nerdy-nights-5",
    useTutorial: "yes",
    tutorialGroup: "Nerdy Nights",
    tutorialId: "Week 5: controller"
}, {
    name: "nerdy-nights-6",
    useTutorial: "yes",
    tutorialGroup: "Nerdy Nights",
    tutorialId: "Week 6: background2"
}, {
    name: "nerdy-nights-7",
    useTutorial: "yes",
    tutorialGroup: "Nerdy Nights",
    tutorialId: "Week 7: pong1"
}, {
    name: "nerdy-nights-8",
    useTutorial: "yes",
    tutorialGroup: "Nerdy Nights",
    tutorialId: "Week 8: background3"
}, {
    name: "nerdy-nights-9",
    useTutorial: "yes",
    tutorialGroup: "Nerdy Nights",
    tutorialId: "Week 9: pong2"
}, { 
    // START OF NES-STARTER-KIT
    name: "nes-starter-kit-main",
    useTutorial: "yes",
    tutorialGroup: "nes-starter-kit",
    nesStarterKitTutorialBranch: "Main branch (default)"
}, {
    name: "nes-starter-kit-sword",
    useTutorial: "yes",
    tutorialGroup: "nes-starter-kit",
    nesStarterKitTutorialBranch: "Section 3: Giving your main character a sword"
}, {
    name: "nes-starter-kit-pause",
    useTutorial: "yes",
    tutorialGroup: "nes-starter-kit",
    nesStarterKitTutorialBranch: "Section 3: Adding features to the pause menu"
}, {
    name: "nes-starter-kit-map",
    useTutorial: "yes",
    tutorialGroup: "nes-starter-kit",
    nesStarterKitTutorialBranch: "Section 3: Adding a second map"
}, {
    name: "nes-starter-kit-attract",
    useTutorial: "yes",
    tutorialGroup: "nes-starter-kit",
    nesStarterKitTutorialBranch: "Section 3: Adding objects that attract or repel the player"
}, {
    name: "nes-starter-kit-mimic",
    useTutorial: "yes",
    tutorialGroup: "nes-starter-kit",
    nesStarterKitTutorialBranch: "Section 3: Adding an enemy that mimics player behavior"
}, {
    name: "nes-starter-kit-spritesz",
    useTutorial: "yes",
    tutorialGroup: "nes-starter-kit",
    nesStarterKitTutorialBranch: "Section 3: Adding a new sprite size"
}, {
    name: "nes-starter-kit-title",
    useTutorial: "yes",
    tutorialGroup: "nes-starter-kit",
    nesStarterKitTutorialBranch: "Section 4: Making a full title screen"
}, {
    name: "nes-starter-kit-animating",
    useTutorial: "yes",
    tutorialGroup: "nes-starter-kit",
    nesStarterKitTutorialBranch: "Section 4: Animating tiles"
}, {
    name: "nes-starter-kit-chrram",
    useTutorial: "yes",
    tutorialGroup: "nes-starter-kit",
    nesStarterKitTutorialBranch: "Section 5: Getting finer control over graphics with chr ram"
}, {
    name: "nes-starter-kit-mapper30",
    useTutorial: "yes",
    tutorialGroup: "nes-starter-kit",
    nesStarterKitTutorialBranch: "Section 5; Switching to unrom 512 for advanced features"
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