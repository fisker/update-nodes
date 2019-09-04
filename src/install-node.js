import execa from 'execa'

function installNode(version) {
  return execa('nvm', ['install', version])
}

export default installNode
