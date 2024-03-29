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
    expect(rom.hasValidHeader()).withContext(`${ctx} - header`).toEqual(true);

    let emu = new NesEmulator(romFile);
    await emu.ensureEmulatorAvailable();
    await emu.start();
    await emu.runCpuFrames(12);
    expect(await emu.getByteValue('testVariable')).withContext(`${ctx} - testVariable`).toEqual(1);
    const beforeCount = await emu.getByteValue('nmiFrameCount');
    expect(await emu.getByteValue('nmiFrameCount')).withContext(`${ctx} - nmiFrameCount`).toEqual(beforeCount + 1);
    const compareCmdName = cmd['prg-ram'] !== 'none' ? 'toBeSimilarToImage' : 'toBeIdenticalToImage';
    const screenshot = await emu.takeScreenshot(cmd.name + '.png');
    if (cmd['use-c'] === 'yes') {
        expect(screenshot).withContext(`${ctx} - screenshot`)[compareCmdName]('./test-screenshots/simple-nrom-128-c_000.png');
    } else {
        expect(screenshot).withContext(`${ctx} - screenshot`)[compareCmdName]('./test-screenshots/simple-nrom-128-asm_000.png');
    }
    if (cmd['prg-ram'] !== 'none') {
        const oldValue = await emu.getByteValue('testSramVariable');
        let expectedNewValue = oldValue + 1;
        if (expectedNewValue > 9) {
            expectedNewValue = 0;
        }
        await emu.stop()
        emu = new NesEmulator(romFile);
        await emu.start();
        await emu.runCpuFrames(12);
        expect(await emu.getByteValue('testSramVariable')).withContext(`${ctx} - testSramVariable`).toEqual(expectedNewValue);
    }

    await emu.stop();
}

async function runRomSimple(cmd) {
    const romFile = path.join(romDir, cmd.name, 'rom', cmd.name + '.nes'),
        rom = new NesRomFile(romFile),
        ctx = cmd.name;
    expect(rom.hasValidHeader()).withContext(`${ctx} - header`).toEqual(true);

    let emu = new NesEmulator(romFile);
    await emu.ensureEmulatorAvailable();
    await emu.start();
    await emu.runCpuFrames(1);
    const screenshot = await emu.takeScreenshot(cmd.name + '.png');
    expect(screenshot).withContext(`${ctx} - screenshot`).toBeSimilarToImage('./test-screenshots/' + cmd.name + '_000.png');
    await emu.stop();
}

describe('Test all roms', () => {
    // NOTE: This isn't really a good use of jasmine - it'd be nice to have tests for each thing, but that would make them
    // run in sequence, which is _SLOW_ - as of now it's 5s vs 12s, and that'll only get worse. 
    it('Runs all of the non-tutorial test roms, validates that they start', async () => {
        const ourRomCommands = RomCommands.filter(a => a["use-tutorial"] === "no")
        // Do first one separate to prep mesen, etc
        const firstOne = ourRomCommands.shift();
        await runRom(firstOne);
        // NOTE: This is mainly for github actions; it doesn't like me starting up 32+ processes for rom builds+tests at once
        console.info('First normal test completed, running the rest in chunks.');

        const chunkSize = 5;
        const romCommandChunks = [];
        for (let i = 0; i < ourRomCommands.length; i += chunkSize) {
            romCommandChunks.push(ourRomCommands.slice(i, i + chunkSize))
        }


        for (let i = 0; i < romCommandChunks.length; i++) {
            console.info(`Running normal chunk ${i+1} of ${romCommandChunks.length+1}`)
            await Promise.all(romCommandChunks[i].map(runRom))
        }

    // NOTE: This limit is really high to support github actions - though oddly it seems to time out way before the limit in place.
    // I had a 30 second limit and it timed out with something that took 17 seconds when I upped it to 30. In short, if it's crashing, 
    // we may need to up this test's time.
    }, 60000);

    it('Runs all tutorial roms, compares screenshots with expectations', async () => {
        const ourRomCommands = RomCommands.filter(a => a["use-tutorial"] === "yes")
        // Do first one separate to prep mesen, etc
        const firstOne = ourRomCommands.shift();
        await runRomSimple(firstOne);
        console.info('First tutorial test completed, running the rest in chunks.');
        
        const chunkSize = 5;
        const romCommandChunks = [];
        for (let i = 0; i < ourRomCommands.length; i += chunkSize) {
            romCommandChunks.push(ourRomCommands.slice(i, i + chunkSize))
        }


        for (let i = 0; i < romCommandChunks.length; i++) {
            console.info(`Running tutorial chunk ${i+1} of ${romCommandChunks.length+1}`)
            await Promise.all(romCommandChunks[i].map(runRomSimple))
        }

    }, 60000);
});
