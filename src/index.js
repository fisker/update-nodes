import getRecommendedVersions from 'nodejs-recommended-versions'
import {prompt} from 'enquirer'
import ora from 'ora'
import signale from 'signale'
import Listr from 'listr'
import cli from './cli'
import update from './update'
// eslint-disable-next-line unicorn/import-index
import managers from './managers/index.js'
import printListrError from './print-listr-error'

async function main(cli) {
  let manager
  for (const implementation of managers) {
    try {
      // eslint-disable-next-line no-await-in-loop
      if (await implementation.detect()) {
        manager = implementation
        break
      }
    } catch (_) {}
  }

  if (!manager) {
    console.error('nvm-windows is not installed.')
    return
  }

  const installed = await manager.list()

  const spinner = ora({
    text: 'Fetching recommended Node.js versions',
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

  const tasks = new Listr(
    recommended.map(version => ({
      title: `Node.js v${version}`,
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

        const process = manager.install(version)

        process.stdout.on('data', chunk => {
          chunk = String(chunk).trim()
          if (chunk) {
            task.output = chunk
          }
        })

        process.then(() => {
          task.title = `Node.js v${version} successfully installed.`
        })

        // eslint-disable-next-line consistent-return
        return process
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
      `All ${
        selected.length > 0 ? 'selected' : 'recommended'
      } Node.js versions are installed.`
    )
  } catch (error) {
    printListrError(error)
  }
}

update()
main(cli)
