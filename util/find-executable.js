const path = require("path"),
    fs = require("fs");

/**
 * @param {string} exe executable name (without extension if on Windows)
 * @return {Promise<string|null>} executable path if found
 * */
function findExecutable(exe) {
    const envPath = process.env.PATH || "";
    const envExt = process.env.PATHEXT || "";
    const pathDirs = envPath
        .replace(/["]+/g, "")
        .split(path.delimiter)
        .filter(Boolean);
    const extensions = envExt.split(";");
    const candidates = pathDirs.flatMap((d) =>
        extensions.map((ext) => path.join(d, exe + ext))
    );
    try {
        return candidates.map(checkFileExists).filter(c => c !== null)[0];
    } catch (e) {
        return null;
    }

    function checkFileExists(filePath) {
        try { 
            if ((fs.statSync(filePath)).isFile()) {
                return filePath;
            }
        } catch (e) {}
        return null;
    }
}

module.exports = findExecutable;