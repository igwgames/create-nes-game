// This test file is run using nes-test. 
// Check out the documentatation here: https://cppchriscpp.github.io/nes-test/
// The tool will automatically run the tests in every file in this directory, so feel free to spread them out!
const NesRomFile = require('nes-test').NesRomFile;
const NesEmulator = require('nes-test').NesEmulator;

const romPath = '../rom/<%= it.game.name %>.nes';


describe('Sample Tests', () => {

    it('Validates that this is a valid NES rom', async () => {
        // Rom paths are relative to the test script
        romData = new NesRomFile(romPath);
        expect(romData.hasValidHeader()).toEqual(true);
    });

    describe('emulator tests', () => {

        let emulator;
        // This will run before every test in this describe
        beforeEach(async () => {
            emulator = new NesEmulator(romPath);
            await emulator.start();
        });

        // This will run after every test in the describe

        afterEach(async () => {
            // Exit the emulator
            await emulator.stop();
        });

        it('Updates testVariable to 1 when it is done drawing', async () => {
            await emulator.runCpuFrames(10);
            expect(await emulator.getByteValue('testVariable')).toEqual(1);
        });

        it('Should update the nmi counter each frame', async () => {
            const beforeCount = await emulator.getByteValue('nmiFrameCount');
            // getByteValue runs a frame, so the next time we call it will increase.
            expect(await emulator.getByteValue('nmiFrameCount')).toEqual(beforeCount + 1);
        });
    });
});