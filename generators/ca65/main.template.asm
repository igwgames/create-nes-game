;
; main.asm
;
; The entrypoint to your game! 
; Everything you will write should go into files included in this file, 
; or of course this file itself.
; 
; Note: Much of this was lifted and adapted from the nerdy nights tutorials
; https://nerdy-nights.nes.science

;
; iNES header
; 
; This declares basic information about your game. You probably don't want
; to change it.
;
.segment "HEADER"

	INES_MAPPER = <%= it.mapper.mapperNumber %> ; <%= it.mapper.mapperNumber %> = <%= it.mapper.name + '\n' %>
	INES_MIRROR = <%= it.game.mirroring === 'horizontal' ? 0 : 1 %> ; 0 = horizontal mirroring, 1 = vertical mirroring
	INES_SRAM   = <%= it.game.useSram ? 1 : 0 %> ; 1 = battery backed SRAM at $6000-7FFF

	.byte 'N', 'E', 'S', $1A ; ID
	.byte <%= it.game.prgBanks %> ; 16k PRG chunk count
	.byte <%= it.game.useChrRam ? 0 : it.game.chrBanks %> ; 8k CHR chunk count
	.byte INES_MIRROR | (INES_SRAM << 1) | ((INES_MAPPER & $f) << 4)
	.byte (INES_MAPPER & %11110000)
	.byte $0, $0, $0, $0, $0, $0, $0, $0 ; padding

;
; CHR ROM data
;

; FIXME: Break this into a config file 
.segment "TILES"
	.incbin "../../graphics/background.chr"
	.incbin "../../graphics/sprite.chr"

;
; Vectors
; 
; These definitions have to be kept here so the NES knows how to reset the game, and what to call when
; it's time to redraw the screen. 
;

.segment "VECTORS"
	.word nmi
	.word reset
	.word irq

;
; ZeroPage variables 
; 
; This is a section of "special" variables that can be accessed faster than the rest, because they are in the first "page" of
; memory. It can have up to 256 bytes worth of variables in it. They otherwise work the same as all other variables.
.segment "ZEROPAGE"
	backgroundPointerLo: .res 1    ; pointer variables declared in RAM
	backgroundPointerHi: .res 1    ; low byte first, high byte immediately after
	nmiFrameCount: .res 1          ; 256 byte counter, will increment every time nmi is called. Used to wait for vblank
	vblankPreviousFrame: .res 1    ; Used to track when we started waiting for vblank

;
; OAM Memory
; 
; This is the sprite memory for your game. IT is used for "hardware" sprites (you might create more information for your)
; sprites elsewhere. Don't add anything here.
.segment "OAM"
	oam: .res 256        ; sprite OAM data to be uploaded by DMA

;
; BSS variables
; 
; This is the "rest" of the memory for your game. There are about 1500 bytes available in total.
.segment "BSS"
; yourvariable: .res 8


; 
; Main Code area
; 
; You know this one! This is the primary code bank for your game. There may be more banks available, but this 
; one will always be loaded. 
;

.segment "CODE"


	;
	; reset routine
	;
	; This is used to reset the NES (and sometimes memory on your cartridge) to a known state, so the game
	; can play consistently. Don't change this unless you know what you're doing!
	; Note: It should be the first thing written to the CODE segment, so it's always the first thing the console runs!

	reset:
		sei       ; mask interrupts
		lda #0
		sta $2000 ; disable NMI
		sta $2001 ; disable rendering
		sta $4015 ; disable APU sound
		sta $4010 ; disable DMC IRQ
		lda #$40
		sta $4017 ; disable APU IRQ
		cld       ; disable decimal mode
		ldx #$FF
		txs       ; initialize stack
		; wait for first vblank
		bit $2002
		:
			bit $2002
			bpl :-
		; clear all RAM to 0
		lda #0
		ldx #0
		:
			sta $0000, X
			sta $0100, X
			sta $0200, X
			sta $0300, X
			sta $0400, X
			sta $0500, X
			sta $0600, X
			sta $0700, X
			inx
			bne :-
		; place all sprites offscreen at Y=255
		lda #255
		ldx #0
		:
			sta oam, X
			inx
			inx
			inx
			inx
			bne :-
		; wait for second vblank
		:
			bit $2002
			bpl :-
		; NES is initialized, ready to begin!
		; enable the NMI for graphical updates, and jump to our main program
		lda #%10001000
		sta $2000
		jmp main


	; Main entrypoint, this is where most of your code goes
	main:

		; First let's clear the nametables 
		lda $2002   ; reset PPU status
		lda #$20
		sta $2006
		lda #$00
		sta $2006
		ldx #$08
		ldy #$00
		lda #$24    ; clear background tile
		@nametableWriteLoop:
			sta $2007
			dey 
			bne @nametableWriteLoop
			dex 
			bne @nametableWriteLoop

		; Next we'll write palettes from the palette we define below
		lda $2002
		lda #$3f
		sta $2006
		lda #$00
		sta $2006
		ldx #$00
		@loadPalettesLoop:
			lda palette,X   ; load data from adddress (palette + X)
								; 1st time through loop it will load palette+0
								; 2nd time through loop it will load palette+1
								; 3rd time through loop it will load palette+2
								; etc
			sta $2007
			inx 
			cpx #$20
			bne @loadPalettesLoop

					
	; Use nested loops to load the background efficiently
		lda $2002               ; read PPU status to reset the high/low latch
		lda #$20
		sta $2006               ; write high byte of $2000 address
		lda #$00
		sta $2006               ; write low byte of $2000 address

		lda #<background 
		sta backgroundPointerLo ; put the low byte of address of background into pointer
		lda #>background        ; #> is the same as HIGH() function in NESASM, used to get the high byte
		sta backgroundPointerHi ; put high byte of address into pointer

		ldx #$00                ; start at pointer + 0
		ldy #$00
		@outsideLoop:

			@insideLoop:
				lda (backgroundPointerLo),Y       ; copy one background byte from address in pointer + Y
				sta $2007               ; runs 256*4 times

				iny                     ; inside loop counter
				cpy #$00                
				bne @insideLoop         ; run inside loop 256 times before continuing

			inc backgroundPointerHi     ; low byte went from 0 -> 256, so high byte needs to be changed now

			inx                     ; increment outside loop counter
			cpx #$04                ; needs to happen $04 times, to copy 1KB data
			bne @outsideLoop         

		cli             ; Re-enable interrupts
		lda #%10001000  ; enable NMI, sprites from pattern table 1, background from 0
		sta $2000
		lda #%00011110  ; background and sprites enable, no left clipping
		sta $2001

		; After getting through the drawing, just run an infinite loop. 
		@forever:
			jmp @forever 

	;
	; NMI Handler
	; 
	; This will run once every frame, and give you a chance to update graphics. Keep it lean!
	;

	nmi:
		; Store all registers - since this can run at any time, and any changes we make to the registers
		; will impact whatever code was running before otherwise. 
		pha
		txa
		pha
		tya
		pha

		; Tell the ppu to draw sprites from $0200 to the screen
		lda #$02
		sta $4014

		inc nmiFrameCount

		; Restore all registers
		pla
		tay
		pla
		tax
		pla

		rti ; Return from interrupt 


	; Helper function: Wait until the frame count is incremented by the nmi method
	vblankwait:
		lda nmiFrameCount
		sta vblankPreviousFrame

		@vblank_wait:
			cmp nmiFrameCount
			beq @vblank_wait
		rts
	
	; Empty irq handler, since we do not use them
	irq:
		rti

	;
	; Data
	; 
	; Game data is in this section. It's in the same code bank as above, and is only separated to make it easier to understand.
	;

	; Include the nametable data as a binary file
	; FIXME: Would it be clearer to include this as text, or in a .asm file?
	background:
		.incbin "../../graphics/example.nam"
	
	; Do the same with palettes
	palette:
		; Foreground first
		.incbin "../../graphics/example.pal"
		; Next, background. We can just use the same ones again
		.incbin "../../graphics/example.pal"
