import getRecommendedVersions from 'nodejs-recommended-versions'
import {prompt} from 'enquirer'
import ora from 'ora'
import signale from 'signale'
import Listr from 'listr'
import cli from './cli'
import update from './update'
import getInstalledVersions from './installed'
import installNode from './install-node'

async function main(cli) {
  const installed = await getInstalledVersions()

  const spinner = ora('Fetching Recommended Node.js Versions')
  // TODO: enable this, when fetch-node-website resolve this problem
  // spinner.start()
  const recommended = await getRecommendedVersions()
  // spinner.stop()
  const notInstalled = recommended.filter(
    version => !installed.includes(version)
  )

  if (notInstalled.length === 0) {
    signale.success('All Recommended Node.js Versions are installed.')
    return
  }

  const {selected} = await prompt({
    type: 'multiselect',
    name: 'selected',
    message: 'Select Node.js version(s) you want install:',
    choices: recommended.map(version => ({
      name: version,
      message: `v${version}`,
      disabled: installed.includes(version) ? '(Installed)' : false,
    })),
    initial: notInstalled,
  })

  const tasks = new Listr(
    selected.map(version => ({
      title: `Install Node.js v${version}`,
      task() {
        return installNode(version).stdout
      },
    }))
  )

  await tasks.run()
}

update()
main(cli)
