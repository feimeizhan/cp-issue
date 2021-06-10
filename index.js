const util = require('util')
const cp = require('child_process')
const execAsync = util.promisify(cp.exec)
const path = require('path')

async function _exec(command, opts) {
    try {
        const {stdout, stderr} = await execAsync(command, opts)
        console.log('stdout', stdout)
        console.log('stderr', stderr)
    } catch(e) {
        console.error(e)
    }
}

async function main() {
    await _exec('npm install --production', {cwd: path.join(process.cwd(), '/another-pkg')})
    await _exec('which npm', {cwd: path.join(process.cwd(), '/another-pkg')})
    await _exec('npm --version', {cwd: path.join(process.cwd(), '/another-pkg')})
    await _exec('npm --version', {cwd: '/'})
}

main().then(() => console.log('All done')).catch(console.error)

setInterval(() => console.log('heartbreak'), 60000)
