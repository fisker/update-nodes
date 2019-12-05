import execa from 'execa'

async function detect() {
  const {stdout} = await execa('nvm', ['list'])
  return Boolean(stdout)
}

async function list() {
  const {stdout} = await execa('nvm', ['list'])

  return stdout.match(/\d+\.\d+\.\d+/g, stdout)
}

const NVM_WINDOWS_INSTALL_COMPLETE_MESSAGE =
  '\n\nInstallation complete. If you want to use this version, type\n\nnvm use '
function install(version) {
  const process = execa('nvm', ['install', version])
  const promise = process.then(result => {
    const {stdout} = result

    if (stdout.includes(NVM_WINDOWS_INSTALL_COMPLETE_MESSAGE)) {
      return result
    }

    const error = new Error(
      `An error occurred while installing Node.js v${version}.`
    )
    error.version = version
    error.detail = stdout
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
