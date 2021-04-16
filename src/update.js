import updateNotifier from 'update-notifier'
import loadPackageJson from './load-package-json.js'

async function update() {
  const packageJson = await loadPackageJson()

  updateNotifier({pkg: packageJson}).notify()
}

export default update
