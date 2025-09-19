const childProcess = require('child_process'),
    appConfiguration = require('../config/app-configuration'),
    path = require('path');

// Wraps running an outside command. 
// NOTE: logCmd and file are both only used in output logs. cmd and args are the real things that matter. cmd should be the
// full path to the command (c:\blah\blah\blah.exe or /home/dorkus/blah)
function spawnAndWait(logCmd, cmd, file, args = [], options = {}) {
    logger.debug('Running: ' + path.relative(appConfiguration.workingDirectory, cmd) + ' ' + args.join(' '));
    return new Promise((resolve, reject) => {
        const proc = childProcess.spawn(cmd, args, {cwd: options.cwd ? options.cwd : appConfiguration.workingDirectory});
        const outputLogLevel = options.outputLevel ? options.outputLevel : 'debug';
        const errLogLevel = options.errOutputLevel ? options.errOutputLevel : 'warn';
        let stdout = '';
        let stderr = '';

        proc.stdout.on('data', data => {
            stdout += data.toString();
            const strs = data.toString().split('\n').filter(l => l.length > 0);
            strs.forEach(str => logger[outputLogLevel](`[${logCmd}]`, str));
        });
        proc.stderr.on('data', data => {
            stderr += data.toString();
            const strs = data.toString().split('\n').filter(l => l.length > 0);
            strs.forEach(str => logger[errLogLevel](`[${logCmd}]`, str));
        });
        proc.on('error', error => {
            logger.error('Failed compiling ', file, '!', error);
            reject(error);
        });

        proc.on('close', resultCode => {
            logger.debug(`[${logCmd}]`, 'finished with code', resultCode);

            if (resultCode === 0) {
                resolve();
            } else {
                reject(`[${logCmd}] Failed execution, exit code was ${resultCode}. \n\nFailed command: ${cmd} ${file} ${args.join(' ')}\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`);
            }
        });
    });
}

module.exports = spawnAndWait;