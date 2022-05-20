// Used to generate roms for the test commands with the various supported methods.

const RomCommands = [{
    name: "simple-nrom-128-asm",
    mapper: "nrom",
    "chr-ram": "no",
    "prg-banks": 1,
    "chr-banks": 1,
    "mirroring": "horizontal",
    "chr-ram": "none",
    "use-c": "no",
    "ci-provider": "none",
    // Always use nes-test! Our testing relies on it!
    "test-provider": "nes-test",
    "emulator": "system default"
}, {
    name: "simple-nrom-256-asm",
    mapper: "nrom",
    "chr-ram": "no",
    "prg-banks": 2,
    "chr-banks": 1,
    "mirroring": "horizontal",
    "chr-ram": "none",
    "use-c": "no",
    "ci-provider": "none",
    // Always use nes-test! Our testing relies on it!
    "test-provider": "nes-test",
    "emulator": "system default"
}, {
    name: "simple-nrom-128-c",
    mapper: "nrom",
    "chr-ram": "no",
    "prg-banks": 1,
    "chr-banks": 1,
    "mirroring": "vertical",
    "chr-ram": "none",
    "use-c": "yes",
    "ci-provider": "none",
    // Always use nes-test! Our testing relies on it!
    "test-provider": "nes-test",
    "emulator": "system default"
}, {
    name: "simple-nrom-256-c",
    mapper: "nrom",
    "chr-ram": "no",
    "prg-banks": 2,
    "chr-banks": 1,
    "mirroring": "vertical",
    "chr-ram": "none",
    "use-c": "yes",
    "ci-provider": "none",
    // Always use nes-test! Our testing relies on it!
    "test-provider": "nes-test",
    "emulator": "system default"

}];

module.exports = RomCommands;