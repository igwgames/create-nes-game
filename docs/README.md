# Create NES Game

## About

Creates a barebones hello world game for the NES, alongside all build tools you need, and
a ready-to-go emulator. Pick whether to write in assembly or c, the mapper you'd like, and
a bunch of optional features, hit create, then build your game!

## Features

* Generates all config, and the code required to put "hello world" on the screen
* Can choose to create code in assembly or C
* Interactive mapper and size choices
* Build your rom with one command: `create-nes-game build`
* Out-of-the-box support for debugging C and assembly in mesen with source code
* Optionally include rom testing support via [nes-test](https://github.com/cppchriscpp/nes-test)
* Optionally configure your game to build with CI tools like circleci

# Getting Started

TBD

# How does it work?

The tool will ask you a series of questions about your game, giving reasonable defaults and 
explanations as needed. You pick the options you want, and it figures out the rest.

Once you have all of your options chosen, it will create a directory for your game, and 
pre-populate the folder with all of the configuration ca65/cc65 need to run. It will also
create a "hello world" source file that you can use to start building your game. 

Finally, it will trigger a build the same way it will, creating a nes rom in the `rom/` folder.

From there, you can run `create-nes-game run` to test your rom. You can also edit the source, then do 
`create-nes-game build` to build any updates.

# FAQ

## Where can I put my code?

The general answer is to use the "source" directory. There are subfolders for assembly (assembly) and
optionally for C, if you've enabled that. You can create as many subfolders as you'd like beneath
these.

Assembly code must be included from `source/assembly/main.asm`, using the `.include` feature of ca65.

All C code in the `source/c/` folder will automatically be compiled and included - you do not need
to do anything.