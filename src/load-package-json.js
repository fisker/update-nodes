import {promises as fs} from 'fs'

async function loadPackageJson() {
  const packageJson = new URL('../package.json', import.meta.url)
  const text = await fs.readFile(packageJson, 'utf8')
  return JSON.parse(text)
}

export default loadPackageJson
