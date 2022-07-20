<% if (it.game.mapper === 'mmc1 (skrom)') { %>

// Mirroring values to be used with the mirroring button below.
#define MMC1_MIRRORING_ONE_SCREEN_LOW 0
#define MMC1_MIRRORING_ONE_SCREEN_HIGH 1
#define MMC1_MIRRORING_VERTICAL 2
#define MMC1_MIRRORING_HORIZONTAL 3

// Store mirroring value to mmc1 register
extern void __fastcall__ mmc1_set_mirroring(unsigned char mirroring);
// Set the first chr bank
extern void __fastcall__ mmc1_set_chr_bank_0(unsigned char bank);
// Set the second chr bank
extern void __fastcall__ mmc1_set_chr_bank_1(unsigned char bank);
// Set the prg bank currently used in the first slot.
extern void __fastcall__ mmc1_set_prg_bank(unsigned char bank);

<% } else if (it.game.mapper === 'mmc3 (tkrom)') { %>

// Set the first 8kb prg bank
extern void __fastcall__ mmc3_set_prg_bank_0(unsigned char bank);
// Set the second 8kb prg bank
extern void __fastcall__ mmc3_set_prg_bank_1(unsigned char bank);
// Set the first 2kb chr bank
extern void __fastcall__ mmc3_set_2kb_chr_bank_0(unsigned char bank);
// Set the second 2kb chr bank
extern void __fastcall__ mmc3_set_2kb_chr_bank_1(unsigned char bank);
// Set the first 1kb chr bank
extern void __fastcall__ mmc3_set_1kb_chr_bank_0(unsigned char bank);
// Set the second 1kb chr bank
extern void __fastcall__ mmc3_set_1kb_chr_bank_1(unsigned char bank);
// Set the third 1kb chr bank
extern void __fastcall__ mmc3_set_1kb_chr_bank_2(unsigned char bank);
// Set the fourth 1kb chr bank
extern void __fastcall__ mmc3_set_1kb_chr_bank_3(unsigned char bank);
// Store mirroring value to mmc3 register
extern void __fastcall__ mmc3_set_mirroring(unsigned char mirroring);

<% } else if (it.game.mapper === 'unrom') { %>
// Set the prg bank currently used in the first slot.
extern void __fastcall__ unrom_set_prg_bank(unsigned char bank);

<% } else throw new Error ('Uknown mapper: ' + it.game.mapper + '! Cannot generate game'); %>