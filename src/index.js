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
    } catch {}
  }

  if (!manager) {
    console.error('No package manager avalible.')
    return
  }

  const installed = await manager.list()

  const spinner = ora({
    text: 'Fetching recommended Node.js versions',
    discardStdin: false,
  })
  spinner.start()
  const recommended = (await getRecommendedVersions()).map((version) => ({
    ...version,
    name: `Node.js v${version.version}${
      version.codeName ? ` "${version.codeName}"` : ''
    }`,
  }))
  spinner.stop()

  const notInstalled = recommended
    .filter(({version}) => !installed.includes(version))
    .map(({version}) => version)

  let selected = []

  if (notInstalled.length !== 0) {
    try {
      ;({selected} = await prompt({
        type: 'multiselect',
        name: 'selected',
        message: 'Select Node.js version(s) you want install:',
        choices: recommended.map(({name, version}) => ({
          name: version,
          message: name,
          value: version,
          disabled: installed.includes(version) ? '(Installed)' : false,
        })),
        initial: notInstalled,
      }))
    } catch {
      console.log('Cancelled.')
      return
    }
  }

  const tasks = new Listr(
    recommended.map(({name, version}) => ({
      title: name,
      task(context, task) {
        if (installed.includes(version)) {
          task.title = `${name} already installed.`
          task.skip()
          return
        }

        if (!selected.includes(version)) {
          task.skip()
          return
        }

        task.title = `Installing ${name}`

        const process = manager.install({name, version})

        process.stdout.on('data', (chunk) => {
          chunk = String(chunk).trim()
          if (chunk) {
            task.output = chunk
          }
        })

        process.then(() => {
          task.title = `${name} successfully installed.`
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
        selected.length !== 0 ? 'selected' : 'recommended'
      } Node.js versions are installed.`
    )
  } catch (error) {
    printListrError(error)
  }
}

update()
main(cli)
