import path from 'node:path'
import test from 'ava'
import {execa} from 'execa'
import createEsmUtils from 'esm-utils'

const {readJson, dirname} = createEsmUtils(import.meta)

const runCLI = (cliArguments) =>
  execa('node', [path.join(dirname, '../cli.js'), ...cliArguments])

test('--version', async (t) => {
  const {version} = await readJson('../package.json')
  const {stdout} = await runCLI(['--version'])
  t.is(stdout, version)
})

test('--help', async (t) => {
  const {description} = await readJson('../package.json')
  const {stdout} = await runCLI(['--help'])
  t.true(stdout.includes(description))
})
