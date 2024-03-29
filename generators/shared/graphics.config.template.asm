<% if (it.game.useChrRam === false) { %>
;
; CHR ROM data
;
; The files below will be loaded into the game's chr banks directly, and available for your
; use.
;

; First chr bank, this is used by default.
; Each segment is 8kb, but we store data in 4kb tilesets. Each segment thus contains 2 tilesets. 
.segment "CHR_00"
    .incbin "./background.chr"
    .incbin "./sprite.chr"

; Other chr banks need some data in them - repeated chr data can be replaced.
<% for (let i = 1; i < it.game.chrBanks; i++) { %>
.segment "CHR_<%= i.toString().padStart(2, '0') %>"
    .incbin "./background.chr"
    .incbin "./sprite.chr"
<% } %>

<% } else { %>

;
; CHR Data
;
; The files below are currently loaded into your game's prg banks, and have to be loaded
; manually in your code. 
; 
; You will probably want to add compression to this data, since you have limited space!
; It also is a good idea to move this to a prg bank other than the primary.
;
<% if (it.game.includeC) { %>
; Make sure to start the names with an underscore - this tells the assembler to make the
; data available to C. (C will not use the underscore)
; 
; Any new graphics you add here also need to be added to `graphics.config.h` as extern 
; variables, so they can be read from C code. 
;
<% } %>
<% if (it.game.includeCLibrary !== 'none') { %>
; additionally, the data is run-length encoded. This will automatically be done for 
; any .chr,.nam and .bin files you add to the graphics directory. neslib has a utility 
; to uncompress them.
;
<% } %>

.segment "CODE"
    
    <%= (it.game.includeC ? '_background_graphics:' : 'background_graphics:') %>
        .incbin "<%= (it.game.includeCLibrary === 'none' ? './background.chr' : './background.rle.chr') %>"

    <%= (it.game.includeC ? '_sprite_graphics:' : 'sprite_graphics:') %>
        .incbin "<%= (it.game.includeCLibrary === 'none' ? './sprite.chr' : './sprite.rle.chr') %>"

;
; Make sure to export all symbols created, too, so we can read them from our code!
;
.export <%= (it.game.includeC ? '_background_graphics' : 'background_graphics') %>

.export <%= (it.game.includeC ? '_sprite_graphics' : 'sprite_graphics') %>
<% } %>
