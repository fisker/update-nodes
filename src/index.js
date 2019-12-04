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

  const spinner = ora({
    text: 'Fetching Recommended Node.js Versions',
    discardStdin: false,
  })
  spinner.start()
  const recommended = await getRecommendedVersions()
  spinner.stop()
  const notInstalled = recommended.filter(
    version => !installed.includes(version)
  )

  if (notInstalled.length === 0) {
    console.log(recommended.map(version => `v${version}`).join('\n'))
    console.log()
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

  const errors = []
  const tasks = new Listr(
    selected.map(version => ({
      title: `Install Node.js v${version}`,
      task(context, task) {
        const subprocess = installNode(version)

        subprocess.stdout.on('data', chunk => {
          chunk = String(chunk).trim()
          if (chunk) {
            task.output = chunk
          }
        })

        return subprocess.then(({stdout}) => {
          let message
          // Download npm error
          if (/Download failed/.test(stdout)) {
            message = `An error occurred while installing ${version}.`
          }

          // Download Node.js
          if (/is not yet released or available/.test(stdout)) {
            message = stdout
          }

          if (message) {
            errors.push({
              version,
              error: new Error(`Installing Node.js v${version}\n${stdout}`),
            })

            throw new Error(message)
          }

          return stdout
        })
      },
    })),
    {
      exitOnError: false,
    }
  )

  try {
    await tasks.run()
  } catch (_) {}

  for (const {version, error} of errors) {
    console.log()
    signale.fatal(error)
  }
}

update()
main(cli)
