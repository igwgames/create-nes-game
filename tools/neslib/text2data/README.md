# What's this? 

This is the text2 tool built into [famitone2](https://shiru.untergrund.net). It's a tool to convert text files
to music data that famitone2 understands.

It has been lightly updated to be compatible with linux systems.

Feel free to steal this binary to use as needed, code in this folder is available under cc0, same as 
Shiru's original release.

The binaries are intentionally committed, to make distribution easier. (And since cross-compiling isn't
really an option.)

## How do I compile? 

`gcc text2data.cpp -o text2data`

You'll need the following 2 libraries

`sudo apt-get install libncurses5-dev libncursesw5-dev`

## The output is different between windows and linux!

The line endings are the only difference - if you're using the `diff` command make sure to use the
`--strip-trailing-cr` argument.