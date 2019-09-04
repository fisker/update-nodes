import getRecommendVersions from 'nodejs-recommended-versions'
import {prompt} from 'enquirer'
import ora from 'ora'
import cli from './cli'
import update from './update'
import getInstalledVersions from './installed'
import installNode from './install-node'

async function main(cli) {
  const installed = await getInstalledVersions()
  const recommend = await getRecommendVersions()
  const notInstalled = recommend.filter(version => !installed.includes(version))

  if (notInstalled.length === 0) {
    console.log('All Recommend Node.js Versions are installed.')
    return
  }

  const {selected} = await prompt({
    type: 'multiselect',
    name: 'selected',
    message: 'Select Node.js version(s) you want install:',
    choices: notInstalled.map(version => ({
      name: version,
      message: `v${version}`,
      selected: true,
    })),
    initial: notInstalled,
  })

  for (const version of selected) {
    const spinner = ora(`Installing Node.js v${version}`)
    spinner.start()
    await installNode(version)
    spinner.stop()
  }
}

update()
main(cli)
