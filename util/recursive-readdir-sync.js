const fs = require('fs'),
    path = require('path');

function recursiveReaddirSync(dir) {
    const dirents = fs.readdirSync(dir, {withFileTypes: true});
    
    const files = dirents.map(ent => {
        const res = path.resolve(dir, ent.name);

        return ent.isDirectory() ? recursiveReaddirSync(res) : [res]
    });
    return Array.prototype.concat(...files);
}

module.exports = recursiveReaddirSync;