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
; It also is a good idea to move this to a bank other than the primary.
;

.segment "PRG"
    
    <%= (it.game.includeC ? '_background_graphics:' : 'background_graphics:') %>
        .incbin "./background.chr"
    <%= (it.game.includeC ? '_sprite_graphics:' : 'sprite_graphics:') %>

<% } %>