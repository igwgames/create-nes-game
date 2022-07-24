const fs = require('fs'),
    axios = require('axios');

async function downloadFile(url, dest) {
    logger.debug('Downloading file', url);
    const res = await axios({method: 'get', url, responseType: 'stream'});
    const writer = fs.createWriteStream(dest);

    await new Promise((resolve, reject) => {
        res.data.pipe(writer);

        let error = null;
        writer.on('error', err => {
            writer.close();
            reject(err);
            error = err;
        });

        writer.on('close', () => {
            if (!error) {
                resolve();
            }
        });
    });
    return dest;
}

module.exports = downloadFile;