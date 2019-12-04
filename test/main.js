import test from 'ava'
import execa from 'execa'
import path from 'path'
import {version, description} from '../package.json'

const runCLI = cliArguments =>
  execa('node', [
    '-r',
    'esm',
    path.join(__dirname, '../src/index.js'),
    ...cliArguments,
  ])

test('--version', async t => {
  const {stdout} = await runCLI(['--version'])
  t.is(stdout, version)
})

test('--help', async t => {
  const {stdout} = await runCLI(['--help'])
  t.true(stdout.includes(description))
})
