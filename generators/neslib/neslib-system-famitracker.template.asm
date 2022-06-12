; Startup code for cc65 and Shiru's NES library
; based on code by Groepaz/Hitmen <groepaz@gmx.net>, Ullrich von Bassewitz <uz@cc65.org>
; Updated for create-nes-game by cppchriscpp


    .import initlib,push0,popa,popax,_main,zerobss,copydata

; Linker generated symbols
    .import __RAM_START__   ,__RAM_SIZE__
    .import __ROM0_START__  ,__ROM0_SIZE__
    .import __STARTUP_LOAD__,__STARTUP_RUN__,__STARTUP_SIZE__
    .import __CODE_LOAD__   ,__CODE_RUN__   ,__CODE_SIZE__
    .import __RODATA_LOAD__ ,__RODATA_RUN__ ,__RODATA_SIZE__
    .import __DMC_LOAD__

; Commented out defines are created by system-defines instead.
;PPU_CTRL   =$2000
;PPU_MASK   =$2001
;PPU_STATUS =$2002
PPU_OAM_ADDR=$2003
PPU_OAM_DATA=$2004
;PPU_SCROLL =$2005
;PPU_ADDR   =$2006
;PPU_DATA   =$2007
PPU_OAM_DMA =$4014
DMC_FREQ    =$4010
CTRL_PORT1  =$4016
CTRL_PORT2  =$4017

OAM_BUF     =$0200
PAL_BUF     =$01c0



.segment "ZEROPAGE"

NTSC_MODE:          .res 1
FRAME_CNT1:         .res 1
FRAME_CNT2:         .res 1
VRAM_UPDATE:        .res 1
NAME_UPD_ADR:       .res 2
NAME_UPD_ENABLE:    .res 1
PAL_UPDATE:         .res 1
PAL_BG_PTR:         .res 2
PAL_SPR_PTR:        .res 2
SCROLL_X:           .res 1
SCROLL_Y:           .res 1
SCROLL_X1:          .res 1
SCROLL_Y1:          .res 1
PAD_STATE:          .res 2      ;one byte per controller
PAD_STATEP:         .res 2
PAD_STATET:         .res 2
PPU_CTRL_VAR:       .res 1
PPU_CTRL_VAR1:      .res 1
PPU_MASK_VAR:       .res 1
RAND_SEED:          .res 2
FT_TEMP:            .res 3

MUSIC_PLAY:         .res 1
ft_music_addr:      .res 2

BUF_4000:           .res 1
BUF_4001:           .res 1
BUF_4002:           .res 1
BUF_4003:           .res 1
BUF_4004:           .res 1
BUF_4005:           .res 1
BUF_4006:           .res 1
BUF_4007:           .res 1
BUF_4008:           .res 1
BUF_4009:           .res 1
BUF_400A:           .res 1
BUF_400B:           .res 1
BUF_400C:           .res 1
BUF_400D:           .res 1
BUF_400E:           .res 1
BUF_400F:           .res 1

PREV_4003:          .res 1
PREV_4007:          .res 1

TEMP:               .res 11

PAD_BUF     =TEMP+1

PTR         =TEMP   ;word
LEN         =TEMP+2 ;word
NEXTSPR     =TEMP+4
SCRX        =TEMP+5
SCRY        =TEMP+6
SRC         =TEMP+7 ;word
DST         =TEMP+9 ;word

RLE_LOW     =TEMP
RLE_HIGH    =TEMP+1
RLE_TAG     =TEMP+2
RLE_BYTE    =TEMP+3



.segment "CODE"

initialize_library:
    jsr _oam_clear

    jsr zerobss
    jsr copydata

    lda #<(__RAM_START__+__RAM_SIZE__)
    sta sp
    lda #>(__RAM_START__+__RAM_SIZE__)
    sta sp+1            ; Set argument stack ptr

    jsr initlib

    lda #%10000000
    sta <PPU_CTRL_VAR
    sta PPU_CTRL        ;enable NMI
    lda #%00000110
    sta <PPU_MASK_VAR

waitSync3:
    lda <FRAME_CNT1
@1:
    cmp <FRAME_CNT1
    beq @1

detectNTSC:
    ldx #52             ;blargg's code
    ldy #24
@1:
    dex
    bne @1
    dey
    bne @1

    lda PPU_STATUS
    and #$80
    sta <NTSC_MODE

    jsr _ppu_off

    lda #$ff                ;previous pulse period MSB, to not write it when not changed
    sta PREV_4003
    sta PREV_4007
    
    jsr _music_stop

.if(FT_SFX_ENABLE)
    ldx #<sounds_data
    ldy #>sounds_data
    jsr FamiToneSfxInit
.endif

    lda #$fd
    sta <RAND_SEED
    sta <RAND_SEED+1

    lda #0
    sta PPU_SCROLL
    sta PPU_SCROLL          
    sta PPU_OAM_ADDR

    jmp _main           ;no parameters

    ; Famitracker driver uses .s for file extension, but is otherwise normal asm
    .include "famitracker_driver/driver.s"
