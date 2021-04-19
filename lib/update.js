import updateNotifier from 'update-notifier'
import createEsmUtils from 'esm-utils'

const {json} = createEsmUtils(import.meta)

async function update() {
  const packageJson = await json.load('../package.json')

  updateNotifier({pkg: packageJson}).notify()
}

export default update
