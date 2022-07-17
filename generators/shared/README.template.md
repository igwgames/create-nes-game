# <%= it.game.name %>


Enter a description of your game here. And maybe more documentation too, if you like.

# How to compile

This rom uses [create-nes-game](https://cppchriscpp.github.io/create-nes-game/) to build. Download a copy
of that to start.

## First time setup

1. Download [create-nes-game](https://cppchriscpp.github.io/create-nes-game/), if you haven't already.
2. (Optional) Run `./create-nes-game install` to install the tool globally
3. Run `create-nes-game download-dependencies` to download dependencies of this game into this folder

## Building the game

To build the rom, run `create-nes-game build` in the same directory as this readme file. 

You can run the game using the selected emulator (if available on your operating system) using the 
`create-nes-game run` command. Alternatively, the rom is available in the `rom/` folder.

<% if (it.game.testProvider === 'nes-test') { %>
## Running unit tests

This rom includes unit tests that can be used to verify that the game works. Run them using the 
`create-nes-game test` command. 

<% } %>
# Directory layout

```
<%= it.game.name %>

└─ config/                  - Configuration for the assembler/compiler
└─ graphics/                - Graphics data - backgrounds, palettes, and nametables
|    graphics.config.asm    - Add references to new graphics files here to use them from code
|    YOUR_FILE_NAME.chr     - Graphics data in binary form, such as exported from nesst
|                             Will automatically be run-length encoded into files with the .rle.chr suffix
└─ rom/
|    YOUR_GAME.nes          - The game rom
|    YOUR_GAME.dbg          - Debugging information for the game - Mesen can use this to debug your code directly
<% if (it.game.includeCLibrary === 'neslib with famitracker' || it.game.includeCLibrary === 'neslib with famitone2') { %>
└─ sound/
<% if (it.game.includeCLibrary === 'neslib with famitracker') { %>
|    music.bin              - Music data for your game, as exported from famitracker
|    samples.bin            - Sample data from famitracker, should be automatically exported with the above file
<% } else { %>
|    music.asm              - Music data, as exported from neslib's tool for music
<% } %>
|    sfx.asm                - Sound effect data, as exported from neslib's tool for sfx
<% } %>
└─ source/
<% if (it.game.includeC) { %>
|    assembly/              - Runtime information to support the C engine. Can also contain custom code
|    c/                     - Most game code lives here
|        main.c             - Entrypoint for the game
|        system-defines.h   - Constants and symbols commonly used in nes development
<% if (it.game.mapper !== 'nrom') { %>
|        mapper.h           - Helpers for working with the rom's mapper
<% } %>
<% } else { %>
|    assembly/              - All game code lives here 
|        main.asm           - This is the main entrypoint of the game
|        system-defines.asm - Constants and symbols commonly used in nes development
<% if (it.game.mapper !== 'nrom') { %>
|        mapper.asm         - Helpers for working with the rom's mapper
<% } %>
<% } %>
└─ temp/                    - Temporary storage for the compiler. Usually safe to ignore
<% if (it.game.testProvider === 'nes-test') { %>
└─ test/                    - Test files for the game, written in javascript. Uses nes-test
<% } %>
└─ tools/                   - Compile and emulation tools required by the game, downloaded by nes-test
```

<% if (it.game.includeCLibrary === 'neslib with famitracker' || it.game.includeCLibrary === 'neslib with famitone2') { %>
# NESLib 

This rom uses multiple tools from [Shiru](https://shiru.untergrund.net/) - namely neslib and famitone2. You can find the 
details on [Shiru's website](https://shiru.untergrund.net/). 

<% if (it.game.includeCLibrary === 'neslib with famitracker') { %>
It also includes the famitracker driver, provided with [famitracker](http://famitracker.com/). (Version 0.4.6)

<% } %>
<% } %>
<% if (it.game.includeCLibrary === 'neslib with famitracker') { %>
# Music

Music is created using [Famitracker 0.4.6](http://famitracker.com/). Once you have music you like, you'll need to
export it for use with this engine. Follow these steps to do so: 

1. In the `File` menu, select `Create NSF`.
2. Toward the middle of the dialog, there is a `Type of file` dropdown - choose `BIN - Raw music data`
3. Save the generated file into the `sound/` folder as `music.bin`.
4. If it offers to save samples after the main save, save the second file in `sound/` as `samples.bin`.

Next time you run `create-nes-game build` your new music will be added to the game.

<% } %>
-----

This rom uses [create-nes-game](https://cppchriscpp.github.io/create-nes-game/)!