;
; system-runtime.asm
;
; This sets up the C compiler for your use.
; In most cases you probably won't want to edit this file! Nothing is stopping you, of course ;)
; NOTE: This gets compiled to a file named `crt0.o` that is special to cc65. 
; 

; Enable the c comment feature /* */ in case you want it
.feature c_comments

; System defines for various registers on the console
.include "./system-defines.asm"

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
; C Symbols from the engine and linker
;

.export _init, _exit,__STARTUP__:absolute=1
.import initlib,push0,popa,popax,_main,zerobss,copydata
.import __RAM_START__   ,__RAM_SIZE__
.import __ROM0_START__  ,__ROM0_SIZE__
.import __STARTUP_LOAD__,__STARTUP_RUN__,__STARTUP_SIZE__
.import	__CODE_LOAD__   ,__CODE_RUN__   ,__CODE_SIZE__
.import	__RODATA_LOAD__ ,__RODATA_RUN__ ,__RODATA_SIZE__
; Zeropage variables required by cc65's engine
.include "tools/cc65/asminc/zeropage.inc"

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
; You can access this via C using the `zpsym` pragma
;

.segment "ZEROPAGE"
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
; This is where variables you add in C are put by default.
;

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
	;
    start:
	_init:
    _exit:
	reset:
		sei       ; mask interrupts
		lda #0
		sta PPU_CTRL    ; disable NMI
		sta PPU_MASK    ; disable rendering
		sta APU_STATUS  ; disable APU sound
		sta APU_DMC_IRQ ; disable DMC IRQ
		lda #$40
		sta APU_FRAME_COUNTER ; disable APU IRQ
		cld                   ; disable decimal mode
		ldx #$FF
		txs       ; initialize stack
		; wait for first vblank
		bit PPU_STATUS
		:
			bit PPU_STATUS
			bpl :-
		; clear all RAM to 0
		lda #0
		ldx #0
		:
			sta $0000, x
			sta $0100, x
			sta $0200, x
			sta $0300, x
			sta $0400, x
			sta $0500, x
			sta $0600, x
			sta $0700, x
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
			bit PPU_STATUS
			bpl :-
		; NES is initialized, ready to begin!
		; enable the NMI for graphical updates, and jump to our main program
		lda #%10001000
		sta PPU_CTRL

        ; Do some C engine init
        jsr	zerobss
        jsr	copydata

        lda #<(__RAM_START__+__RAM_SIZE__)
        sta	sp
        lda	#>(__RAM_START__+__RAM_SIZE__)
        sta	sp+1            ; Set argument stack ptr

        jsr	initlib

        ; The main() function in your C
		jmp _main

	;
	; NMI Handler
	; 
	; This will run once every frame, and give you a chance to update graphics. Keep it short!
    ; You can call a C method here by calling jsr _your_c_method. 
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
		sta OAM_DMA

		; Keep track of how many frames have run (note: this loops over to 0 after 255.)
		inc nmiFrameCount

        ; Add your custom code or calls here!

		; Restore all registers from the stack
		pla
		tay
		pla
		tax
		pla

		rti ; Return from interrupt 


	; 
	; Helper function: Wait for a vblank to happen
	; 
	; Waits until the frame count is incremented by the nmi method
	; 

	vblankwait:
		lda nmiFrameCount
		sta vblankPreviousFrame

		@vblank_wait:
			cmp nmiFrameCount
			beq @vblank_wait
		rts
	;
	; IRQ Handler
	;
	; Empty - we don't need to use them, but a handler must be present.
	irq:
		rti

	;
	; Data
	; 
	; Game data is in this section. It's in the same code bank as above, and is only separated to make it easier to understand.
	;

	; Include the nametable data as a binary file
	background:
		.incbin "../../graphics/example.nam"
	
	; Do the same with palettes
	palette:
		; Foreground first
		.incbin "../../graphics/example.pal"
		; Next, background. We don't have two palettes created, so repeat the same palette for now
		.incbin "../../graphics/example.pal"
