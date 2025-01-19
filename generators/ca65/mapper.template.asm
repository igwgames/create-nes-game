<% if (it.game.mapper === 'mmc1 (skrom)') { %>
;
; MMC1 Mapper registers, for use with the functions below
; 
.define MMC1_REG_CONTROL $8000
.define MMC1_REG_CHR_0 $A000
.define MMC1_REG_CHR_1 $C000
.define MMC1_REG_PRG $e000

.define MMC1_MIRRORING_ONE_SCREEN_LOW 0
.define MMC1_MIRRORING_ONE_SCREEN_HIGH 1
.define MMC1_MIRRORING_VERTICAL 2
.define MMC1_MIRRORING_HORIZONTAL 3

; Values for which banks to load
.define MMC1_REG_CONTROL_DEFAULT #%11100

.segment "ZEROPAGE"
    ; Used to track whether a register write was interrupted, so we can try again if needed.
    mmc1RegisterWriteDepth: .res 1
.segment "CODE"
    ; Used internally, write to the register in A with the given address
    .macro mmc1_set_register addr
        ; Store the current depth, so we can make sure we weren't interrupted
        ldy mmc1RegisterWriteDepth
        ; Hide a in the x register in case we need it again
        tax
        @redo_register_write:
        ; Increment the depth, so anything else that runs at the same time as this can see it
        inc mmc1RegisterWriteDepth

        ; Write a value to reset the register
        pha
        lda #255
        sta MMC1_REG_CONTROL ; Register doesn't actually matter for reset
        pla
        ; Start the writing!
        .repeat 4
            sta addr
            lsr
        .endrepeat
        sta addr
        ; Bring back a, mainly for the step below
        txa
        ; Alright, did we get interrupted? If so head back
        dec mmc1RegisterWriteDepth
        cpy mmc1RegisterWriteDepth
        bne @redo_register_write
        
    .endmacro

    ; Store mirroring value to mmc1 register
    mmc1_set_mirroring:
    _mmc1_set_mirroring:
        ora MMC1_REG_CONTROL_DEFAULT
        mmc1_set_register MMC1_REG_CONTROL
        rts

    ; Set the first chr bank
    mmc1_set_chr_bank_0:
    _mmc1_set_chr_bank_0:
        mmc1_set_register MMC1_REG_CHR_0
        rts

    ; Set the second chr bank
    mmc1_set_chr_bank_1:
    _mmc1_set_chr_bank_1:
        mmc1_set_register MMC1_REG_CHR_1
        rts

    ; Set the prg bank currently used in the first slot.
    mmc1_set_prg_bank:
    _mmc1_set_prg_bank:
        mmc1_set_register MMC1_REG_PRG
        rts

    initialize_mapper:
        lda MMC1_MIRRORING_VERTICAL
        ; Mirroring writes to mmc1's ctrl register with everything we care about, so do that.
        jsr mmc1_set_mirroring
        ; Set bank 0 and 1 to the first 2 chr banks
        lda #0
        jsr mmc1_set_chr_bank_0
        lda #1
        jsr mmc1_set_chr_bank_1
        rts

    .export _mmc1_set_mirroring, _mmc1_set_chr_bank_0, _mmc1_set_chr_bank_1, _mmc1_set_prg_bank
<% if (it.game.prgBanks > 2) { /* 2 banks get merged into one large prg bank for ease of use, so only do for 3+ */ %>
; Every bank needs a reset method at the start to get the mapper to start in the right state. So, do that.
<% for (let i = 0; i < it.game.prgBanks - 1; i++) { %>
.segment "ROM_<%= i.toString().padStart(2, '0') %>" 
    jmp reset
<% } %>
<% } %>

; mmc1 requires in a reset stub in the last bank in the last 16 bytes to boot.
; NOTE: If you want to work with all versions of mmc1 (Namely 1C) you'll need to add this stub to every single rom bank.
.segment "MMC1_RESET_STUB"
    sei
    ldx #$ff
    txs
    stx MMC1_REG_CONTROL
    jmp reset

<% } else if (it.game.mapper === 'mmc3 (tkrom)') { %>
;
; MMC3 Mapper registers, for use with the functions below
; 
.define MMC3_REG_BANK_SELECT $8000
.define MMC3_REG_BANK_DATA $8001
.define MMC3_REG_MIRRORING $a000
.define MMC3_REG_PRG_RAM_PROTECT $a001
.define MMC3_REG_IRQ_LATCH $c000
.define MMC3_REG_IRQ_RELOAD $c001
.define MMC3_REG_IRQ_DISABLE $e000
.define MMC3_REG_IRQ_ENABLE $e001

.define MMC3_MIRRORING_VERTICAL 0
.define MMC3_MIRRORING_HORIZONTAL 1

.define MMC3_REG_SEL_2KB_CHR_0 %00000000
.define MMC3_REG_SEL_2KB_CHR_1 %00000001 
.define MMC3_REG_SEL_1KB_CHR_0 %00000010
.define MMC3_REG_SEL_1KB_CHR_1 %00000011
.define MMC3_REG_SEL_1KB_CHR_2 %00000100 
.define MMC3_REG_SEL_1KB_CHR_3 %00000101
.define MMC3_REG_SEL_PRG_BANK_0 %00000110
.define MMC3_REG_SEL_PRG_BANK_1 %00000111

.define MMC3_REG_SEL_CHR_MODE_A %00000000
.define MMC3_REG_SEL_CHR_MODE_B %10000000

; Values for which banks to load
.define MMC3_REG_CONTROL_DEFAULT #%11100

.segment "ZEROPAGE"
    ; Keeps track of setting for which chr banks are 2kb vs 1 (and the same for prg rom banks)
    mmc3ChrInversionSetting: .res 1

.segment "CODE_2"
    mmc3_internal_set_bank:
        tay
        txa
        ora mmc3ChrInversionSetting
        sta MMC3_REG_BANK_SELECT
        sty MMC3_REG_BANK_DATA
        rts


    ; Store mirroring value to mmc1 register
    mmc3_set_prg_bank_0:
    _mmc3_set_prg_bank_0:
        ldx #MMC3_REG_SEL_PRG_BANK_0
        jsr mmc3_internal_set_bank
        rts
    .export _mmc3_set_prg_bank_0

    mmc3_set_prg_bank_1:
    _mmc3_set_prg_bank_1:
        ldx #MMC3_REG_SEL_PRG_BANK_1
        jsr mmc3_internal_set_bank
        rts
    .export _mmc3_set_prg_bank_1

    mmc3_set_2kb_chr_bank_0:
    _mmc3_set_2kb_chr_bank_0:
        ldx #MMC3_REG_SEL_2KB_CHR_0
        jsr mmc3_internal_set_bank
        rts
    .export _mmc3_set_2kb_chr_bank_0

    mmc3_set_2kb_chr_bank_1:
    _mmc3_set_2kb_chr_bank_1:
        ldx #MMC3_REG_SEL_2KB_CHR_1
        jsr mmc3_internal_set_bank
        rts
    .export _mmc3_set_2kb_chr_bank_1

    mmc3_set_1kb_chr_bank_0:
    _mmc3_set_1kb_chr_bank_0:
        ldx #MMC3_REG_SEL_1KB_CHR_0
        jsr mmc3_internal_set_bank
        rts
    .export _mmc3_set_1kb_chr_bank_0

    mmc3_set_1kb_chr_bank_1:
    _mmc3_set_1kb_chr_bank_1:
        ldx #MMC3_REG_SEL_1KB_CHR_1
        jsr mmc3_internal_set_bank
        rts
    .export _mmc3_set_1kb_chr_bank_1

    mmc3_set_1kb_chr_bank_2:
    _mmc3_set_1kb_chr_bank_2:
        ldx #MMC3_REG_SEL_1KB_CHR_2
        jsr mmc3_internal_set_bank
        rts
    .export _mmc3_set_1kb_chr_bank_2

    mmc3_set_1kb_chr_bank_3:
    _mmc3_set_1kb_chr_bank_3:
        ldx #MMC3_REG_SEL_1KB_CHR_3
        jsr mmc3_internal_set_bank
        rts
    .export _mmc3_set_1kb_chr_bank_3

    mmc3_set_mirroring:
    _mmc3_set_mirroring:
        sta MMC3_REG_MIRRORING
        rts
    .export _mmc3_set_mirroring

    initialize_mapper:
        lda #MMC3_REG_SEL_CHR_MODE_A
        sta mmc3ChrInversionSetting

<% if (it.game.useSram) { %>
        lda #%10000000
        sta MMC3_REG_PRG_RAM_PROTECT
<% } %>

        lda #0
        jsr mmc3_set_prg_bank_0
        lda #1
        jsr mmc3_set_prg_bank_1
        rts

.segment "RODATA_2"
    ; This section isn't defined in all roms, so put something there to quiet a warning
    ; You can safely delete this if you're using RODATA_2 (or delete it)
    .byte 00

<% if (it.game.prgBanks > 2) { /* 2 banks get merged into one large prg bank for ease of use, so only do for 3+ */ %>
; Every bank needs a reset method at the start to get the mapper to start in the right state. So, do that.
<% for (let i = 0; i < (it.game.prgBanks - 2) / 2; i++) { %>
.segment "ROM_A_<%= i.toString().padStart(2, '0') %>" 
    jmp reset
.segment "ROM_B_<%= i.toString().padStart(2, '0') %>" 
    jmp reset
<% } %>
<% } %>

<% } else if (it.game.mapper === 'unrom') { %>
;
; UNROM Mapper registers, for use with the functions below
; 
.define UNROM_BANK_SELECT $8000

.segment "CODE"

    ; Bank table, used to 
    unrom_banktable:
        .byte $00, $01, $02, $03, $04, $05, $06, $07
        .byte $08, $09, $0a, $0b, $0c, $0d, $0e, $0f


    ; Set the prg bank to be used.
    unrom_set_prg_bank:
    _unrom_set_prg_bank:
        tax
        sta unrom_banktable, x
        rts
    .export _unrom_set_prg_bank

    initialize_mapper:
        ; Start in bank 0
        lda #0
        jsr unrom_set_prg_bank
        rts

<% if (it.game.prgBanks > 2) { /* 2 banks get merged into one large prg bank for ease of use, so only do for 3+ */ %>
; Make sure to put something in every bank, so the library doesn't get confused. Let's just jump to reset.
<% for (let i = 0; i < it.game.prgBanks - 1; i++) { %>
.segment "ROM_<%= i.toString().padStart(2, '0') %>" 
    jmp reset
<% } %>
<% } %>


<% } else throw new Error ('Unknown mapper: ' + it.game.mapper + '! Cannot generate game'); %>