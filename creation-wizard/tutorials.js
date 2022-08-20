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