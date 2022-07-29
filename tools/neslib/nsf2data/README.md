# What's this? 

This is the nsf2data tool built into [famitone2](https://shiru.untergrund.net). It's a tool to convert nsf files
to sound data that famitone2 understands.

It has been lightly updated to be compatible with linux systems.

Feel free to steal this code as needed, code in this folder is available under cc0, same as 
Shiru's original release.

They should compile under linux with little to no modification. (And still work on Windows)

## How do I compile? 

`gcc nsf2data.cpp -o nsf2data`

## The output is different between windows and linux!

The line endings are the only difference - if you're using the `diff` command make sure to use the
`--strip-trailing-cr` argument.