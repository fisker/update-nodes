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
    text: 'Fetching recommended Node.js Versions',
    discardStdin: false,
  })
  spinner.start()
  const recommended = await getRecommendedVersions()
  spinner.stop()

  const notInstalled = recommended.filter(
    version => !installed.includes(version)
  )

  let selected = []

  if (notInstalled.length !== 0) {
    try {
      ;({selected} = await prompt({
        type: 'multiselect',
        name: 'selected',
        message: 'Select Node.js version(s) you want install:',
        choices: recommended.map(version => ({
          name: version,
          message: `v${version}`,
          disabled: installed.includes(version) ? '(Installed)' : false,
        })),
        initial: notInstalled,
      }))
    } catch (error) {
      console.log('Cancelled.')
      return
    }
  }

  const errors = []
  const tasks = new Listr(
    recommended.map(version => ({
      title: `Install Node.js v${version}`,
      task(context, task) {
        if (installed.includes(version)) {
          task.title = `Node.js v${version} already installed.`
          task.skip()
          return
        }

        if (!selected.includes(version)) {
          task.skip()
          return
        }

        task.title = `Installing Node.js v${version}`
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
            message = `An error occurred while installing Node.js v${version}.`
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

            task.title = `Install Node.js v${version} failed.`
            throw new Error(message)
          }

          task.title = `Node.js v${version} successfully installed.`
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
    console.log()

    signale.complete(
      selected.length > 0
        ? 'All selected Node.js versions are installed.'
        : 'All recommended Node.js Versions are installed.'
    )
  } catch (_) {}

  for (const {version, error} of errors) {
    console.log()
    signale.fatal(error)
  }
}

update()
main(cli)
