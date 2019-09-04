import getRecommendedVersions from 'nodejs-recommended-versions'
import {prompt} from 'enquirer'
import ora from 'ora'
import cli from './cli'
import update from './update'
import getInstalledVersions from './installed'
import installNode from './install-node'

async function main(cli) {
  const installed = await getInstalledVersions()
  const recommended = await getRecommendedVersions()
  const notInstalled = recommended.filter(
    version => !installed.includes(version)
  )

  if (notInstalled.length === 0) {
    console.log('All Recommend Node.js Versions are installed.')
    return
  }

  const {selected} = await prompt({
    type: 'multiselect',
    name: 'selected',
    message: 'Select Node.js version(s) you want to install:',
    choices: recommended.map(version => ({
      name: version,
      message: `v${version}`,
      disabled: installed.includes(version) ? '(Installed)' : false,
    })),
    initial: notInstalled,
  })

  for (const version of selected) {
    const spinner = ora(`Installing Node.js v${version}`)
    spinner.start()
    // eslint-disable-next-line no-await-in-loop
    await installNode(version)
    spinner.stop()
  }
}

update()
main(cli)
