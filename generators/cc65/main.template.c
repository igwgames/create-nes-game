<%- /* FIXME: This currently is very raw, and very much does not consider things like neslib. Do better */ %>

// Include defines for various pieces of the NES hardware
#include "system-defines.h"

<%- /* FIXME: Include bank helpers if appropriate here */ %>

//
// Global Variables (zeropage) 
// Small, frequently-used variables should go in this space. There are only around 250 bytes to go around, so choose wisely!.
//
#pragma bss-name(push, "ZEROPAGE")
    unsigned char i;
#pragma bss-name(pop)

//
// Normal Variables
// You can define larger, less frequently accessed variables here. You have about 1.5k to work with.
//
// EXAMPLE: 
// unsigned char myBigBufferArray[32];

//
// Constant variables
// Anything with const in front of it will go into write-only prg instead of the very limited ram we have.
//
const unsigned char welcomeMessage[] = "Make something unique!";

//
// Main entrypoint
// This is where your game will start running. It should essentially be an endless loop in most
// cases. The name "main" tells the runtime to run this. You can add more methods in this file
// or others and call them as your game expands. 
// 
void main(void) {
    // Turn off the screen
    WRITE_REGISTER(PPU_CTRL, 0x00);

    // Read ppu status to reset the system
    READ_REGISTER(PPU_ADDR);

    // Write the address $2064 to the screen, we we can start drawing text
    WRITE_REGISTER(PPU_ADDR, 0x20);
    WRITE_REGISTER(PPU_ADDR, 0x64);

    i = 0;
    while (welcomeMessage[i]) {
        WRITE_REGISTER(PPU_DATA, welcomeMessage[i]);
        ++i;
    }

    // Turn the screen back on
    WRITE_REGISTER(PPU_CTRL, 0x1e);

    // Infinite loop to end things
    while (1) {}
}