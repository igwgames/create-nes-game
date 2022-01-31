// This exists because pkg hasn't properly wrapped this.
// They want to do slightly more complex things, but for our simple use case...
// this will do.
const fs = require('fs');

function copyFileSync(src, dest) {
    const fileBuffer = fs.readFileSync(src)
 
    fs.writeFileSync(dest, fileBuffer)

}
module.exports = copyFileSync;