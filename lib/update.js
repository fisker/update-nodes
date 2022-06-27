import updateNotifier from 'update-notifier'
import createEsmUtils from 'esm-utils'

const {readJson} = createEsmUtils(import.meta)

async function update() {
  const packageJson = await readJson('../package.json')

  updateNotifier({pkg: packageJson}).notify()
}

export default update
