import test from 'ava'
import execa from 'execa'
import {version} from '../package.json'

const runCLI = cliArguments =>
  execa('node', ['-r', 'esm', 'src/index.js', ...cliArguments])

// test('cli', async t => {
//   const {stdout} = await runCLI(['--version'])
//   t.is(stdout, version)
// })

test('--version', async t => {
  const {stdout} = await runCLI(['--version'])
  t.is(stdout, version)
})
