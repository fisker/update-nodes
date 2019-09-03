import execa from 'execa'
import ora from 'ora'

async function installNode(version) {
  const spinner = ora(`Installing Node.js v${version}`)

  spinner.start()
  await execa('nvm', ['install', version]).stdout.pipe(process.stdout)
  await new Promise(resolve => setTimeout(resolve, 10000))
  spinner.stop()
}

export default installNode
