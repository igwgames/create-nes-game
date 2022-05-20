// bootstrap this thing separately. Kinda gross...
require('../../util/logger');
// This is absolute nastiness... I should probably expose these somehow.
require('../../node_modules/nes-test/util/jasmine-matchers');

const fs = require('fs'),
    NesRomFile = require('nes-test').NesRomFile,
    NesEmulator = require('nes-test').NesEmulator,
    path = require('path'),
    romDir = path.join(__dirname, 'test-roms'),
    RomCommands = require('./rom-commands'),
    spawnAndWait = require('../../util/spawn-and-wait'),
    // FIXME: Be smart about os, use proper one
    bin = "../../../dist/create-nes-game-win";


describe('Test all roms', () => {
    it('Runs all of the test roms, validates that they start', async () => {
        const promises = RomCommands.map(async cmd => {
            const romFile = path.join(romDir, cmd.name, 'rom', cmd.name + '.nes'),
                rom = new NesRomFile(romFile),
                ctx = "(" + cmd.name + ")";
            expect(rom.hasValidHeader()).withContext(ctx).toEqual(true);

            const emu = new NesEmulator(romFile);
            await emu.start();
            await emu.runCpuFrames(1);
            expect(await emu.getByteValue('testVariable')).withContext(ctx).toEqual(1);
            const beforeCount = await emu.getByteValue('nmiFrameCount');
            expect(await emu.getByteValue('nmiFrameCount')).withContext(ctx).toEqual(beforeCount + 1);
            const screenshot = await emu.takeScreenshot(cmd.name + '.png');
            if (cmd['use-c'] === 'yes') {
                expect(screenshot).withContext(ctx).toBeIdenticalToImage('./test-screenshots/simple-nrom-128-c_000.png');
            } else {
                expect(screenshot).withContext(ctx).toBeIdenticalToImage('./test-screenshots/simple-nrom-128-asm_000.png');
            }
            await emu.stop();
        });


        await Promise.all(promises);
    });
});