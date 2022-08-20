const ppuDefines = {
    PPU_CTRL: 0x2000,
    PPU_MASK: 0x2001,
    PPU_STATUS: 0x2002,
    OAM_ADDR: 0x2003,
    OAM_DATA: 0x2004,
    PPU_SCROLL: 0x2005,
    PPU_ADDR: 0x2006,
    PPU_DATA: 0x2007,


    OAM_DMA: 0x4014
};

const apuDefines = {
    APU_PULSE_1_DUTY: 0x4000,
    APU_PULSE_1_SWEEP: 0x4001,
    APU_PULSE_1_TIMER_LOW: 0x4002,
    APU_PULSE_1_LEN_TIMER: 0x4003,

    APU_PULSE_2_DUTY: 0x4004,
    APU_PULSE_2_SWEEP: 0x4005,
    APU_PULSE_2_TIMER_LOW: 0x4006,
    APU_PULSE_2_LEN_TIMER: 0x4007,

    APU_TRIANGLE_LEN: 0x4008,
    APU_TRIANGLE_TIMER_LOW: 0x400a,
    APU_TRIANGLE_LEN_TIMER: 0x400b,

    APU_NOISE_LEN: 0x400c,
    APU_NOISE_LOOP: 0x400e,
    APU_NOISE_LEN: 0x400f,

    APU_DMC_IRQ: 0x4010,
    APU_DMC_DIRECT_LOAD: 0x4011,
    APU_DMC_SAMPLE_ADDR: 0x4012,
    APU_DMC_SAMPLE_LEN: 0x4013,

    APU_STATUS: 0x4015,
    APU_FRAME_COUNTER: 0x4017
};

const controllerDefines = {
    CTRL_PORT_1: 0x4016,
    CTRL_PORT_2: 0x4017
}

const allDefines = {
    'PPU Registers': ppuDefines, 
    'APU Registers': apuDefines,
    'Controller Registers': controllerDefines
};

// Creates main assembly file for ca65 assembly projects (no cc65)

const fs = require('fs'),
    path = require('path');

function getAsmString() {
    return `
; NES System Defines
; Contains various register definitions commonly used in NES development

`
    + Object.keys(allDefines).map(defineGroup => {
        return `
;
; ${defineGroup}            
;

${Object.keys(allDefines[defineGroup]).map(name => {
    return '.define ' + name + ' $' + allDefines[defineGroup][name].toString(16);
}).join('\n')}
`
    
    }).join('\n');
}

function getCString() {
    return `
// NES System Defines
// Contains various register definitions commonly used in NES development
// NOTE: These are also available in Assembly in a similarly named .asm file

`
    + Object.keys(allDefines).map(defineGroup => {
        return `
//
// ${defineGroup}            
//

${Object.keys(allDefines[defineGroup]).map(name => {
    return '#define ' + name + ' 0x' + allDefines[defineGroup][name].toString(16);
}).join('\n')}
`
    
    }).join('\n') + `
//
// Internal use variables
// Some variables used by the engine. You probably don't need to understand these. Just skip
// over them unless you know what you're doing!

// Used in "read_register" below, to make sure the call isn't optimized away. If you avoid calling
// read_register entirely, you can get rid of this. (It's defined in system-runtime.asm)

extern volatile unsigned char junk;
#pragma zpsym ("junk")

// 
// Shortcuts 
// These are shortcuts to writing and reading raw registers on the NES. This seems a little bit
// easier to read as a newbie. You could also replace a lot of these with a library. Neslib eliminates
// the need for most/all of these.
//
#define write_register(name, val) ((*(unsigned char*)name) = val)
#define read_register(name) junk = (*(unsigned char*)name)
    `;
}

function createConfig(game, directory) {
    if (game.useTutorial) {
        logger.debug('Tutorial detected, skipping system defines');
        return;
    }

    fs.writeFileSync(path.join(directory, 'source', 'assembly', 'system-defines.asm'), getAsmString());

    if (game.includeC) {
        fs.writeFileSync(path.join(directory, 'source', 'c', 'system-defines.h'), getCString());
    }
}

createConfig.stepName = 'main.asm';

module.exports = createConfig;