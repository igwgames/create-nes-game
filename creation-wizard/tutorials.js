const tutorialGroups = [
    {
        name: "Nerdy Nights",
        id: "nerdy-nights",
        buildZipUrl: () => "https://github.com/JamesSheppardd/Nerdy-Nights-ca65-Translation/archive/refs/heads/master.zip",
        buildZipPath: id => './Nerdy-Nights-ca65-Translation-master/Nerdy Nights ' + id,
        buildZipName: () => 'master.zip',
        rewriteText: text => {
            return text
                .replace(/\.segment \"CHARS\"/g, '.segment "CHR_00"')
        },
        availableTutorials: [
            {
                id: "L3",
                name: "Week 3: background",
                mainFile: "background.asm",
                mainPath: '',
                supportingFiles: []
            }, {
                id: "L4",
                name: "Week 4: sprites",
                mainFile: "sprites.asm",
                supportingFiles: ['mario.chr']
            }, {
                id: "L5",
                name: "Week 5: controller",
                mainFile: "controller.asm",
                supportingFiles: ['mario.chr']
            }, {
                id: "L6",
                name: "Week 6: background2",
                mainFile: "background2.asm",
                supportingFiles: ["mario.chr"]
            }, {
                id: "L7",
                name: "Week 7: pong1",
                mainFile: "pong1.asm",
                supportingFiles: ['mario.chr']
            }, {
                id: "L8",
                name: "Week 8: background3",
                mainFile: "backgrounds3.asm",
                supportingFiles: ['mario.chr']
            }, {
                id: "L9",
                name: "Week 9: pong2",
                mainFile: "pong2.asm",
                supportingFiles: ['mario.chr']
            }
        ].map(a => { a.tutorialGroup = "nerdy-nights"; return a; })
    }, {
        name: "nes-starter-kit",
        id: "nes-starter-kit",
        custom: true,
        availableTutorials: [
            {
                id: "main",
                name: "Main branch (default)",
            }, {
                name: "Section 3: Giving your main character a sword",
                id: "section3_add_sword",
            }, {
                name: "Section 3: Adding features to the pause menu",
                id: "section3_pause_improvements",
            }, {
                name: "Section 3: Adding a second map",
                id: "section3_second_map",
            }, {
                name: "Section 3: Adding objects that attract or repel the player",
                id: "section3_attract_repel",
            }, {
                name: "Section 3: Adding an enemy that mimics player behavior",
                id: "section3_mimic_enemy",
            }, {
                name: "Section 3: Adding a new sprite size",
                id: "section3_sprite_size",
            }, {
                name: "Section 4: Making a full title screen",
                id: "section4_custom_title"
            }, {
                name: "Section 4: Animating tiles",
                id: "section4_animated_tiles"
            }, {
                name: "Section 5: Getting finer control over graphics with chr ram",
                id: "section5_chr_ram"
            }, {
                name: "Section 5; Switching to unrom 512 for advanced features",
                id: "section5_mapper_30"
            }
        ].map(a => { a.tutorialGroup = "nes-starter-kit"; return a; })

    }
]

let tutorials = []
tutorialGroups.forEach(a => {
    tutorials = tutorials.concat(a.availableTutorials)
})
module.exports = {
    tutorialGroups, 
    tutorials
}