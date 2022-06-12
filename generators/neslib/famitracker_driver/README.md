# What's this?

It's the famitracker driver, as distributed by shiru with the neslib+famitracker driver. 

I made very few changes, only to make it work with the library:
- I updated where it looks for DMC to `__DMC_LOAD__` instead of `__DMC_START__` to match our segments