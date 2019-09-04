import execa from 'execa'

function installNode(version) {
  return execa('nvm', ['install', version]).stdout.pipe(process.stdout)
}

export default installNode
