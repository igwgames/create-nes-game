<% if (it.game.useChrRam === false) { %>
;
; CHR ROM data
;
; The files below will be loaded into the game's chr banks directly, and available for your
; use.
;

.segment "TILES"
	.incbin "./background.chr"
	.incbin "./sprite.chr"

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