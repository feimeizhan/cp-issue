const util = require('util')
const cp = require('child_process')
const execAsync = util.promisify(cp.exec)
const path = require('path')
const os  = require('os')

async function _exec(command, opts) {
    try {
        const {stdout, stderr} = await execAsync(command, opts)
        console.log('stdout', stdout)
        console.log('stderr', stderr)
    } catch(e) {
        console.error(e)
    }
}

function getEnvSep() {
    if (os.platform() === 'win32') return ';'
    return ':'
}

function sortNodePath(envPath) {
    const envPaths = envPath.split(getEnvSep())
    const nodePaths = []
    const otherPaths = []

    envPaths.forEach(ep => {
        if (ep.includes('node')) return nodePaths.push(ep)
        otherPaths.push(ep)
    })

    return otherPaths.concat(nodePaths)
}

async function main() {
    // to change the path for using the global `npm` command
    // more about the `PATH` @link https://man7.org/linux/man-pages/man7/environ.7.html#:~:text=LC_*%20environment%20variables).-,PATH,-The%20sequence%20of
    // and node.js code @link https://github.com/nodejs/node/blob/c61870c376e2f5b0dbaa939972c46745e21cdbdd/deps/uv/src/unix/process.c?_pjax=%23js-repo-pjax-container%2C%20div%5Bitemtype%3D%22http%3A%2F%2Fschema.org%2FSoftwareSourceCode%22%5D%20main%2C%20%5Bdata-pjax-container%5D#L335
    console.log(`Before change PATH: ${process.env.PATH}`)
    process.env.PATH = sortNodePath(process.env.PATH).join(getEnvSep())
    console.log(`After change PATH: ${process.env.PATH}`)

    await _exec('npm install --production', {cwd: path.join(process.cwd(), '/another-pkg')})
    await _exec('which npm', {cwd: path.join(process.cwd(), '/another-pkg')})
    await _exec('npm --version', {cwd: path.join(process.cwd(), '/another-pkg')})
    await _exec('npm --version', {cwd: '/'})
}

main().then(() => console.log('All done')).catch(console.error)

setInterval(() => console.log('heartbreak'), 60000)
