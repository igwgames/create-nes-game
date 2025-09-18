# create-nes-game

[![image](https://user-images.githubusercontent.com/750475/181422426-246a7625-298b-4a0e-82de-023cbbb036f7.png)](https://gh.nes.science/create-nes-game/releases)

create-nes-game is a command line tool that creates a simple hello world game for the NES, 
alongside all build tools you need, and a ready-to-go emulator. 

All you have to do is answer a series of multiple-choice questions about what 
language you want, a mapper, and optional features like libraries.

The tool will give you a git-ready folder full of code, which it can be used to 
compile and run. (and even unit test, if you want!)

[Download](https://gh.nes.science/create-nes-game/releases)

## Features

* Start your game with a working example and all configuration; no config files to change!
* No installing separate software and adding it to path. Just one exe
* Windows and Linux support
* Write code in assembly or C
* Interactive walkthrough to choose everything, including mapper and size
* Build your rom with one command: `create-nes-game build`
* Out-of-the-box support for debugging C and assembly in mesen, with full source code
* Automatically create source for tutorials like Nerdy Nights
* Optional rom testing support via [nes-test](https://nes-test.nes.science)
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
* [nes-test](https://nes-test.nes.science) For unit testing
* [Mesen](https://mesen.ca) For emulation by default, and as the game runner behind nes-test
* [neslib](https://shiru.untergrund.net/) - Optionally installed with C-based projects
* [LAN Master](https://shiru.untergrund.net) - For example music and sound effects
* [JamesSheppardd's Nerdy Nights Port](https://github.com/JamesSheppardd/Nerdy-Nights-ca65-Translation) - For Nerdy Nights support

# Getting Started

This tool intends to be pretty self-explanatory, so most of getting started is just running the program.

1. Head over to [the releases page](https://gh.nes.science/create-nes-game/releases) and download the latest version for your operating system
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

## Can I run my own tools or other build steps outside create-nes-game?

Yes! This is advanced behavior, and requires modifying the generated `.create-nes-game.config.json` file directly.
The file will be in the root of your repository. You should have keys named `beforeStepActions` and 
`afterStepActions` in your file (you can create them if you don't). These can be used to run any commands
or scripts you would like before or after a command is run. 

### Available actions: 
| Name                 | Description                                            | Before Timing               | after Timing |
|----------------------|--------------------------------------------------------|-----------------------------|-----------------------------------------------------------------------|
| build                | The full build, including steps below                  | before any build steps      | After all build steps completed, nes file available                   |
| neslib-sound-convert | For neslib projects, compiles sfx and music into code  | Before conversion           | After all converted files created                                     |
| compile              | The C Compilation step                                 | Before c code is compiled   | After C code is compiled, before assembling                           |
| assemble             | The assembly build step                                | Before asm code is compiled | After asm code is compiled, before link                               |
| link                 | Links all C/assembly objects into a nes file           | Before link started         | after .nes file is available                                          |
|**Non-build commands**| _n/a_                                                  | _n/a_                       | _n/a_                                                                 |
| download-dependencies| Downloading dependencies: emulator, tools, etc         | Before download             | After tools are set up                                                |
| run                  | Runs built rom with given emulator                     | Before emulator is started  | After emulator exits, or returns control to terminal (emulators vary) |
| clean                | Removes temporary files from create-nes-game           | Before clean is run         | After files are deleted                                               |

### What does it look like?

Let's say we want to show how long it takes to run the `build` command. We'll add a before action that will write
the current time to a json file, then an after action shows the current time, as well as the previously read time.

Here is the code we would add to `.create-nes-game.json`

```json
{
   // ... rest of configuration file...
    "console": "nes",
    "beforeStepActions": {
      "build": [
         "node -e \"fs.writeFileSync('test_file.txt', Date.now().toString())\""
      ]
    },
    "afterStepActions": {
      "build": [
         "node -e \"const oldTime = parseInt(fs.readFileSync('test_file.txt')); console.info('Build took ' + (Date.now() - oldTime).toString() + 'ms.')\"",
         "rm test_file.txt"
      ]
    }
}
```

And if we now run it, here's what it looks like:

```
$ node ../../index.js build
[create-nes-game] [info] Building game "test" in C:\create-nes-game\test
[create-nes-game] [info] Assembling .asm files for "honkin" in C:\create-nes-game\test
[create-nes-game] [info] Linking together rom "honkin" in C:\create-nes-game\test
[create-nes-game] [info] Game built successfully: rom\test.nes 
[create-nes-game] [info] ====================
[create-nes-game] [info] Stats for: test.nes
[create-nes-game] [info] Mapper: nrom | Rom Size: 24592 bytes. (16b header, 16384b prg, 8192b chr)
[create-nes-game] [info] 15993/16384 bytes free
[create-nes-game] [info] Bank Breakdown:
[create-nes-game] [info] Bank 01: 15993/16384 bytes free
[create-nes-game] [info] [afterStepActions build] Build took 109ms. 
```

## Can I make extra tools download when the user runs `create-nes-game download-dependencies`?

Yes! This is advanced behavior, and requires editing the generated `.create-nes-game.config.json` file. 
There should be a key named `extraDependencies`. This should be an array of file descriptions. 
Each file will be downloaded, and copied to the `tools` folder. 

At minimum, there should be a `name` and a `default` path.

The extension at the end of the url will determine what happens after the file is downloaded. If the
file ends with `.zip` or `.tar.gz` it will be automatically extracted to a subfolder of `tools` with
the same name as the zip file. Otherwise, it will be directly copied into that folder.

Example: 
```json
{
   // .. Rest of configuration file
   "extraDependencies": [
      {"name": "myzip", "default": "https://www.website.com/myzipfile.zip"},
      {"name": "myexe", "default": "https://www.website.com/myexefile.exe"}
   ]
}
```

This would create the following structure in the tools folder

```
myzip/myzipfile.zip
myzip/file1.txt
myzip/file2.exe
...
myexe/myexefile.exe
... Other existing tools
```

If you want to change anything after the file is downloaded/unzipped, you can add a `afterStepAction` for
`download-dependencies` to do what you need it to.

### Different files per operating system/architecture

If your files need to be different depending on architecture, include keys that are a
combination of the operating system and architecture. These will be used on the given os/arch combination.

To see what os/architecture combination you are on, you can run `create-nes-game download-dependencies --verbose`. Look for a line like this: 
```[create-nes-game] [debug] Current architecture/os combo: win32-x64```

Example: 
```json
{
   // ...Rest of configuration file
   "extraDependencies": [{
      "name": "my-tool",
      "win32-x64": "https://website.com/windows-x64.zip",
      "linux-x64": "https://website.com/linux-x64.tar.gz",
      "linux-arm64": "https://website.com/linux-arm64.tar.gz",
      "default": "https://website.com/something-else.zip"
   }]
}
```

### Can I run it in docker?

Yep! Each release is published to dockerhub under the name `igwgames/create-nes-game`. The `latest` tag is updated with every stable release, 
as well as a version tag, like `v1.0.16`. 

https://hub.docker.com/r/igwgames/create-nes-game

create-nes-game will also allow give you an option to autogenerate configuration to use this for testing in github actions during project setup.

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
