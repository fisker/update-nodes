import execa from 'execa'

const nvm = (command, cliArguments = []) =>
  execa('nvm', [command, ...cliArguments])

async function detect() {
  const {stdout} = await nvm('version')
  return Boolean(stdout)
}

async function list() {
  const {stdout} = await nvm('list')

  return stdout.match(/\d+\.\d+\.\d+/g, stdout)
}

const NVM_WINDOWS_INSTALL_COMPLETE_MESSAGE =
  '\n\nInstallation complete. If you want to use this version, type\n\nnvm use '
function install(version) {
  const process = nvm('install', [version])
  const promise = process.then(result => {
    const {stdout} = result

    if (stdout.includes(NVM_WINDOWS_INSTALL_COMPLETE_MESSAGE)) {
      return result
    }

    const error = new Error(
      `An error occurred while installing Node.js v${version}.`
    )
    error.version = version
    error.detail = result
    throw error
  })
  Object.assign(promise, process)
  return promise
}

export default {
  name: 'Node Version Manager (nvm) for Windows',
  home: 'https://github.com/coreybutler/nvm-windows',
  detect,
  list,
  install,
}
