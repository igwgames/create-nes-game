# create-nes-game

create-nes-game is a command line tool that creates a simple hello world game for the NES, 
alongside all build tools you need, and a ready-to-go emulator. 

All you have to do is answer a series of multiple-choice questions about what 
language you want, a mapper, and optional features like libraries.

The tool will give you a git-ready folder full of code, which it can be used to 
compile and run. (and even unit test, if you want!)


## Features

* Start your game with a working example and all configuration; no config files to change!
* No installing separate software and adding it to path
* Write code in assembly or C
* Interactive walkthrough to choose everything, including mapper and size
* Build your rom with one command: `create-nes-game build`
* Out-of-the-box support for debugging C and assembly in mesen, with full source code
* Optional rom testing support via [nes-test](https://github.com/cppchriscpp/nes-test)
* Optional continuous integration support with either github or circleci

# How does it work?

The tool will ask you a series of questions about your game, giving reasonable defaults and 
explanations as needed. You pick the options you want, and it figures out the rest.

Once you have all of your options chosen, it will create a directory for your game, and 
pre-populate the folder with all of the configuration ca65/cc65 need to run. It will also
create a "hello world" source file that you can use to start building your game. 

Finally, it will trigger a build the same way it will, creating a nes rom in the `rom/` folder.

From there, you can run `create-nes-game run` to test your rom. You can also edit the source, then do 
`create-nes-game build` to build any updates.

# Getting Started

TBD

# FAQ

## Where can I put my code?

The general answer is to use the "source" directory. There are subfolders for assembly (assembly) and
optionally for C, if you've enabled that. You can create as many subfolders as you'd like beneath
these.

Assembly code must be included from `source/assembly/main.asm`, using the `.include` feature of ca65.

All C code in the `source/c/` folder will automatically be compiled and included - you do not need
to do anything.

# For maintainers

## How to create a release

Releases are largely automated, but there are two manual steps needed: 

1. Create a new tag locally using git, eg `git tag v1.0.1`, then push it using `git push --tags`
2. Wait for the automation to create the new release...
3. Update the release with real release notes from us. This will trigger updates to what we show in the 
   app ui when you try to update.