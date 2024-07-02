import {execa} from 'execa'

const fnm = (command, cliArguments = []) =>
  execa('fnm', [command, ...cliArguments])

async function detect() {
  const {stdout} = await fnm('--version')
  return Boolean(stdout)
}

async function list() {
  const {stdout} = await fnm('list')
  return stdout.match(/\d+\.\d+\.\d+/g)
}

function install({name, version}) {
  const process = fnm('install', [version])
  const promise = process.then((result) => {
    const {stdout,stderr} = result

    if (stdout.startsWith(`Installing Node v${version}`) && stderr === '') {
      return result
    }

    const error = new Error(`An error occurred while installing ${name}.`)
    error.version = version
    error.detail = result
    throw error
  })
  Object.assign(promise, process)
  return promise
}


export default {
  name: '🚀 Fast and simple Node.js version manager, built in Rust',
  home: 'https://github.com/Schniz/fnm',
  detect,
  list,
  install,
}
