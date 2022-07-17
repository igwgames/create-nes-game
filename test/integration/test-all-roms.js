// bootstrap this thing separately. Kinda gross...
require('../../util/logger');
// Install the image matchers provided with nes-test

beforeAll(() => {
    require('nes-test').JasmineMatchers.installMatchers();
});

const NesRomFile = require('nes-test').NesRomFile,
    NesEmulator = require('nes-test').NesEmulator,
    path = require('path'),
    romDir = path.join(__dirname, 'test-roms'),
    RomCommands = require('./rom-commands');

async function runRom(cmd) {
    const romFile = path.join(romDir, cmd.name, 'rom', cmd.name + '.nes'),
        rom = new NesRomFile(romFile),
        ctx = cmd.name;
    expect(rom.hasValidHeader()).withContext(ctx).toEqual(true);

    const emu = new NesEmulator(romFile);
    await emu.ensureEmulatorAvailable();
    await emu.start();
    await emu.runCpuFrames(12);
    expect(await emu.getByteValue('testVariable')).withContext(`${ctx} - testVariable`).toEqual(1);
    const beforeCount = await emu.getByteValue('nmiFrameCount');
    expect(await emu.getByteValue('nmiFrameCount')).withContext(`${ctx} - nmiFrameCount`).toEqual(beforeCount + 1);
    const screenshot = await emu.takeScreenshot(cmd.name + '.png');
    if (cmd['use-c'] === 'yes') {
        expect(screenshot).withContext(`${ctx} - screenshot`).toBeIdenticalToImage('./test-screenshots/simple-nrom-128-c_000.png');
    } else {
        expect(screenshot).withContext(`${ctx} - screenshot`).toBeIdenticalToImage('./test-screenshots/simple-nrom-128-asm_000.png');
    }
    await emu.stop();
}

describe('Test all roms', () => {
    // NOTE: This isn't really a good use of jasmine - it'd be nice to have tests for each thing, but that would make them
    // run in sequence, which is _SLOW_ - as of now it's 5s vs 12s, and that'll only get worse. 
    it('Runs all of the test roms, validates that they start', async () => {
        // Do first one separate to prep mesen, etc
        const firstOne = RomCommands.shift();
        await runRom(firstOne);
        console.info('First test completed, running the rest in chunks.');

        const chunkSize = 8;
        const romCommandChunks = [];
        for (let i = 0; i < RomCommands.length; i += chunkSize) {
            romCommandChunks.push(RomCommands.slice(i, i + chunkSize))
        }


        for (let i = 0; i < romCommandChunks.length; i++) {
            console.info(`Running chunk ${i+1} of ${romCommandChunks.length+1}`)
            await Promise.all(romCommandChunks[i].map(runRom))
        }

    }, 30000);
});
