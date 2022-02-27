const appConfiguration = require('../config/app-configuration'),
    os = require('os'),
    path = require('path'),
    fs = require('fs'),
    process = require('process'),
    inquirer = require('inquirer'),
    copyFileSync = require('../util/copy-file-sync'),
    findExecutable = require('../util/find-executable'),
    spawnAndWait = require('../util/spawn-and-wait');

async function run() {
    if (appConfiguration.isInstalled) {
        logger.error(`${appConfiguration.binaryName} is already installed on your system! Did you mean \`create-nes-game download-dependencies\`?`);
        process.exit(1);
    }

    if (!process.pkg) {
        logger.error('Cannot install outside of pkg. Please build pkg and run from the executable');
        process.exit(1);
    }

    // This should never be used, but leave a value that won't screw anything up just in case.
    let installLocation = '/tmp';
    let powershell = null;
    let isWindows = false;
    switch (os.platform()) {
        case 'win32':
        case 'win64':
            isWindows = true;
            installLocation = path.join(os.homedir(), appConfiguration.binaryName);
            powershell = findExecutable('powershell');
            if (!powershell) {
                logger.error('The powershell command is not available on your system! Cannot add the binary to your path.');
                logger.error('Please create a directory for the file and add it to your path manually.');
                process.exit(1);
            }
            // FIXME: Del
            // powershell = "%SystemRoot%\\system32\\WindowsPowerShell\\v1.0\\powershell.exe";
            break;
        case 'linux':
        case 'freebsd':
        case 'openbsd':
        case 'darwin': 
            if (process.getuid() !== 0) {
                logger.error('The install command must be run as root, as it installs for all users!');
                logger.error('You can manually add the binary to your path if this is not an option.');
                process.exit(1);
            }
            installLocation = '/usr/local/bin/';
            break;
        default:
            logger.error(`Unknown OS platform ${os.platform}. Cannot continue, sorry!`);
            process.exit(1);
    }

    const inputRes = await inquirer.prompt([{
        type: 'confirm', 
        name: 'v', 
        message: `This will install create-nes-game into ${installLocation} add add it to your PATH.
This will allow you to run it using \`create-nes-game\` from any folder.

Do you wish to continue?`, 
        default: false
    }]);

    if (!inputRes.v) {
        logger.debug('User cancelled install');
        process.exit(0);
    }

    if (!fs.existsSync(installLocation)) {
        logger.debug('Creating install directory, since it did not exist');
        fs.mkdirSync(installLocation, {recursive: true});
    }
    
    logger.debug(`Installing binary ${appConfiguration.binaryName} to ${installLocation}.`);
    copyFileSync(process.argv0, path.join(installLocation, appConfiguration.binaryName + (isWindows ? '.exe' : '')));

    if (powershell !== null) {
        logger.debug('On windows, trying to modify path using powershell');
        logger.info('Updating path with new directory - this can be slow!');
        const psScript = `
$oldPath = [Environment]::GetEnvironmentVariable('PATH', 'User');
[Environment]::SetEnvironmentVariable('PATH', "$oldPath;${installLocation}", 'User')`;
        const ps1File = path.join(os.tmpdir(), 'install-create-nes-game.ps1');
        fs.writeFileSync(ps1File, psScript);
        await spawnAndWait('powershell', 'powershell', ps1File, ['-ExecutionPolicy', 'Bypass', `-File`,  `${ps1File}`]);
        try { 
            fs.rmSync(ps1File);
        } catch (e) {
            logger.debug('Failed removing temp powershell file. Ignoring and moving on', e);
        }
    } else {
        logger.debug('Linux system detected, no path modifications should be needed. Chmodding');
        fs.chmodSync(path.join(installLocation, appConfiguration.binaryName), 0o755);
    }

    logger.info('Successfully installed! You can now run `create-nes-game` from any folder!');
}


module.exports = {run};