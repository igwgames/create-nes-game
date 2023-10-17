const appConfiguration = require('../config/app-configuration'),
    path = require('path'),
    fs = require('fs');

async function run() {
    let files = [],
        saveToFiles = [];

    if (appConfiguration.command === 'rle' && appConfiguration.arguments.length > 0) {
        files = appConfiguration.arguments;
        logger.debug('RLE-encoding provided files:', files);
    } else {
        if (!fs.existsSync(path.join(appConfiguration.workingDirectory, 'graphics'))) {
            logger.debug('Skipping rle due to missing graphics folder.');
            return;
        }
        logger.debug('Running rle on all .chr files in graphics/');
        files = fs.readdirSync(path.join(appConfiguration.workingDirectory, 'graphics'))
            .filter(f => (f.endsWith('.chr') || f.endsWith('.nam') || f.endsWith('.bin')))
            .filter(f => !(f.endsWith('.rle.chr') || f.endsWith('.rle.nam') || f.endsWith('.rle.bin')))
            .map(f => path.join('graphics', f));
    }
    saveToFiles = JSON.parse(JSON.stringify(files)).map(f => {
        const spl = f.split('.'),
            ext = spl.pop();
        spl.push('rle');
        spl.push(ext);
        return spl.join('.');
    });

    files.forEach((file, fileNum) => {
        const data = fs.readFileSync(path.join(appConfiguration.workingDirectory, file));
        let newData = [],
            stat = [],
            min = 256,
            pp = 0,
            len = 0,
            sym = -1,
            tag = 255;

        for (let i = 0; i < 256; i++) {
            stat[i] = 0;
        }
        for(let i = 0; i < data.length; i++) {
            stat[data[i]]++;
        }
    

        for (let i = 0; i < 256; i++) {
            if (stat[i] < min) {
                min = stat[i];
                tag = i;
            }
        }

        pp = 0;
        newData[pp++] = tag;
        len = 0;
        sym = -1;

        for (let i = 0; i < data.length; i++) {
            if (data[i] != sym || len === 255 || i === (data.length - 1)) {
                if (data[i] === sym && i === (data.length - 1)) { len++; }
                if (len) {
                    newData[pp++] = sym;
                }
                if (len > 1) {
                    if (len === 2) {
                        newData[pp++] = sym;
                    } else {
                        newData[pp++] = tag;
                        newData[pp++] = len - 1;
                    }
                }
                sym = data[i];
                len = 1;
            } else {
                len++;
            }
        }

        newData[pp++] = tag;
        newData[pp++] = 0;

        fs.writeFileSync(path.join(appConfiguration.workingDirectory, saveToFiles[fileNum]), Buffer.from(newData));

        logger.debug('Finished rle-encoding file', file);

    });

}

module.exports = {run};