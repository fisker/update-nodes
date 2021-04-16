import test from 'ava'
import execa from 'execa'
import loadPackageJson from '../src/load-package-json.js'

const runCLI = (cliArguments) =>
  execa('node', ['src/index.js', ...cliArguments])

test('--version', async (t) => {
  const {version} = await loadPackageJson()
  const {stdout} = await runCLI(['--version'])
  t.is(stdout, version)
})

test('--help', async (t) => {
  const {description} = await loadPackageJson()
  const {stdout} = await runCLI(['--help'])
  t.true(stdout.includes(description))
})
