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
<% if (it.game.mapper !== 'nrom') { %>
.include "./mapper.asm"
<% } %>

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
    .byte <%= (it.game.prgBanks / (it.mapper.prgBankSize === '8kb' ? 2 : 1)) %> ; 16k PRG chunk count
    .byte <%= it.game.useChrRam ? 0 : it.game.chrBanks %> ; 8k CHR chunk count
    .byte INES_MIRROR | (INES_SRAM << 1) | ((INES_MAPPER & $f) << 4)
    .byte (INES_MAPPER & %11110000)
    .byte $0, $0, $0, $0, $0, $0, $0, $0 ; padding

;
; C Symbols from the engine and linker
;

.export _init, _exit,__STARTUP__:absolute=1
.export _junk
.import initlib,push0,popa,popax,_main,zerobss,copydata
.import __RAM_START__   ,__RAM_SIZE__
.import __ROM0_START__  ,__ROM0_SIZE__
.import __STARTUP_LOAD__,__STARTUP_RUN__,__STARTUP_SIZE__
.import __CODE_LOAD__   ,__CODE_RUN__   ,__CODE_SIZE__
.import __RODATA_LOAD__ ,__RODATA_RUN__ ,__RODATA_SIZE__
.import __DMC_LOAD__

; Zeropage variables required by cc65's engine
.include "tools/cc65/asminc/zeropage.inc"

;
; Graphics
; 
; Includes chr files for the graphics -see the included file for more details.
;

.include "../../graphics/graphics.config.asm"

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
    _junk: .res 1                  ; Used to make register writes not get optimized away. Kinda silly
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

<% if (it.game.mapper === 'mmc3 (tkrom)') { %>
; The reset code MUST live in the last bank, because of how mmc3 works. Don't move this unless you know what
; you're doing!
.segment "CODE_2"
<% } else { %>
.segment "CODE"
<% } %>


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
        jsr zerobss
        jsr copydata

        lda #<(__RAM_START__+__RAM_SIZE__)
        sta sp
        lda #>(__RAM_START__+__RAM_SIZE__)
        sta sp+1            ; Set argument stack ptr

        jsr initlib

<% if (it.game.mapper !== 'nrom') { %>
        ; Do any initialization the mapper needs
        jsr initialize_mapper

<% } %>
<% if (it.game.includeCLibrary !== 'none') { %>
        ; Initialize our library
        jsr initialize_library
<% } %>
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
<% if (it.game.includeCLibrary !== 'none') { %>

        ; Call neslib's nmi methods
        jsr neslib_nmi
<% } %>

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

<% if (it.game.includeCLibrary !== 'none') { %>
<% if (it.game.includeCLibrary === 'neslib with famitone2') { %>
;
; famitone2 settings
;
; This configures the settings for famitone2.
;

FT_BASE_ADR     = $0100 ;page in the RAM used for FT2 variables, should be $xx00
FT_SFX_STREAMS  = 4     ;number of sound effects played at once, 1..4

FT_DPCM_ENABLE  = 0     ;undefine to exclude all DMC code
FT_SFX_ENABLE   = 1     ;undefine to exclude all sound effects code
FT_THREAD       = 1     ;undefine if you are calling sound effects from the same thread as the sound update call

FT_PAL_SUPPORT  = 0     ;undefine to exclude PAL support
FT_NTSC_SUPPORT = 1     ;undefine to exclude NTSC support

.ifdef __DMC_LOAD__
    FT_DPCM_OFF     = __DMC_LOAD__ ;set in the linker CFG file via MEMORY/DMC section
                                    ;'start' there should be $c000..$ffc0, in 64-byte steps
.else
    ; Give it a dummy value to make it compile, if not using DPCM
    FT_DPCM_OFF     = $c000
.endif
<% } else if (it.game.includeCLibrary === 'neslib with famitracker') { %>
;
; famitone2 settings
;
; This configures the settings for famitone2, used for sound effects.
;

FT_BASE_ADR=$0100           ;page in RAM, should be $xx00

FT_SFX_STREAMS          = 4 ;number of sound effects played at once, 1..4
.define FT_DPCM_ENABLE  1   ;undefine to exclude all DMC code
.define FT_SFX_ENABLE   1   ;undefine to exclude all sound effects code
.define FT_THREAD       1   ;undefine if you call sound effects in the same thread as sound update
.define FT_PAL_SUPPORT  1   ;undefine to exclude PAL support
.define FT_NTSC_SUPPORT 1   ;undefine to exclude NTSC support

<% } %>

;
; Library data
; 
; Includes all initialization for the used library (<%= it.game.includeCLibrary %>)
;

.include "./neslib-system.asm"
.include "./neslib.asm"

;
; Music and sound data
; 
; This is the music and sound effects for your game. If you move these into a different bank,
; make sure you update the nmi method in neslib.asm to switch banks too!
;

<% if (it.game.mapper === 'mmc3 (tkrom)') { %>
; Store music in the second fixed bank
.segment "RODATA_2"
<% } else { %>
.segment "RODATA"
<% } %>


music_data:
<% if (it.game.includeCLibrary === 'neslib with famitone2') { %>
	; Music.asm file, as generated by text2data, provided with famitone2
    .include "../../sound/music.asm"
<% } else if (it.game.includeCLibrary === 'neslib with famitracker') { %>
	; .bin file, as generated by famitracker through the export menu
    .incbin "../../sound/music.bin"

music_dummy_data:

    .byte $0D,$00,$0D,$00,$0D,$00,$0D,$00,$00,$10,$0E,$B8,$0B,$0F,$00,$16
    .byte $00,$01,$40,$06,$96,$00,$18,$00,$22,$00,$22,$00,$22,$00,$22,$00
    .byte $22,$00,$00,$3F
<% } %>

.if(FT_SFX_ENABLE)
sounds_data:
    .include "../../sound/sfx.asm"
.endif

.segment "DMC"

.if(FT_DPCM_ENABLE)
<% if (it.game.includeCLibrary === 'neslib with famitone2') { %>
	.incbin "../../sound/music.dmc"
<% } else { %>
    .incbin "../../sound/samples.bin"
<% } %>
.endif
<% } %>
