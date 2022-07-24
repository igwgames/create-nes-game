# create-nes-game

**Note**: I'm still putting the finishing touches on this thing; feel free to use it, but
be aware some core features such as updating don't fully work yet. I'm hoping to clean this
up and share it more formally with a version 1.0 in the next week or two!

create-nes-game is a command line tool that creates a simple hello world game for the NES, 
alongside all build tools you need, and a ready-to-go emulator. 

All you have to do is answer a series of multiple-choice questions about what 
language you want, a mapper, and optional features like libraries.

The tool will give you a git-ready folder full of code, which it can be used to 
compile and run. (and even unit test, if you want!)

## Features

* Start your game with a working example and all configuration; no config files to change!
* No installing separate software and adding it to path. Just one exe
* Windows and Linux support
* Write code in assembly or C
* Interactive walkthrough to choose everything, including mapper and size
* Build your rom with one command: `create-nes-game build`
* Out-of-the-box support for debugging C and assembly in mesen, with full source code
* Optional rom testing support via [nes-test](https://github.com/cppchriscpp/nes-test)
* Optional continuous integration support with either github or circleci

## Supported operating systems

* Windows (x86 and x86_64)
* Ubuntu (x64) (Other distros using apt may also work unofficially)

# How does it work?

The tool will ask you a series of questions about your game, giving reasonable defaults and 
explanations as needed. You pick the options you want, and it figures out the rest.

Once you have all of your options chosen, it will create a directory for your game, and 
pre-populate the folder with all of the configuration ca65/cc65 need to run. It will also
create a "hello world" source file that you can use to start building your game. 

From there, you can build your game using `create-nes-game build`. 

Finally, you can use `create-nes-game run` to launch your chosen emulator with the new rom.

## What tools and resources does it use behind the scenes?

* [cc65 and ca65](https://cc65.github.io/) for assembling and compiling games
* [nes-test](https://cppchriscpp.github.io/nes-test) For unit testing
* [Mesen](https://mesen.ca) For emulation by default, and as the game runner behind nes-test
* [neslib](https://shiru.untergrund.net/) - Optionally installed with C-based projects
* [LAN Master](https://shiru.untergrund.net) - For example music and sound effects 

# Getting Started

This tool intends to be pretty self-explanatory, so most of getting started is just running the program.

1. Head over to [the releases page](https://github.com/cppchriscpp/create-nes-game/releases) and download the latest version for your operating system
2. Unzip the file using the tools of your choosing
3. Run the binary from where you downloaded it, and install it using `./create-nes-game install` (or `create-nes-game.exe install` on windows)
4. Switch to a folder where you want to store the games you make
5. Run `create-nes-game` with no other arguments, and follow the prompts. The tool will tell you what to do from here!

# Building an existing game

Once you make a game, you may want to share it with someone else, or perhaps just build it on another pc.
This tool aims to make that very simple. Start by installing create-nes-game on the pc. Then get the code
for the game onto the pc somehow. (For example, `git clone`). 

Next, run `create-nes-game download-dependencies` to get all of the tools needed to build the game. This only
needs to be done once for each project. 

Finally, you'll be able to run `create-nes-game build` and the game should build! `create-nes-game run` should
also work.

(Note: Instructions to do this are also added to the default readme generated with games)

# FAQ

## Where can I put my code?

The general answer is to use the "source" directory. There are subfolders for assembly, and
optionally for C if you've enabled that. You can create as many subfolders as you'd like beneath
these.

Assembly code must be included from `source/assembly/main.asm`, using the `.include` feature of ca65.

All C code in the `source/c/` folder will automatically be compiled and included - you do not need
to do anything.

## Do I actually have to install this thing? I don't wanna!

Nope, installation isn't required! It's only there as a convenience so you can type `create-nes-game`
anywhere.

If you prefer run the downloaded binary directly to build your games, that will work just fine.

# Useful software 

This is a list of software that's typically very helpful in NES development - either because it directly
supports creating assets for the NES, or it creates things with open file formats that you can use.

* Music composition: [Famitracker](https://famitracker.com)
* Graphics creation: [NEXXT](https://www.patreon.com/frankengraphics) (Updates are free posts) or [NESST](https://shiru.untergrund.net/software.shtml)
* Map creation: [Tiled](https://www.mapeditor.org/) (This requires you to convert the maps yourself - not plug and play!) 
* C Library: [neslib](https://shiru.untergrund.net/software.shtml) (create-nes-game can automatically install this!)

# For maintainers

If you're working on this tool, this section is for you. Otherwise, feel free to stop reading here!

## How to create a release

Releases are largely automated, but there are two manual steps needed: 

1. Create a new tag locally using git, eg `git tag v1.0.1`, then push it using `git push --tags`
2. Wait for the automation to create the new release...
3. Update the release with real release notes. This will trigger updates to what we show in the 
   app ui when it offers to update.

Once in a rare while, a bug with mesen may cause it to crash when running the tests. Start the process
over from the top right of the github ui and hope for the best. 