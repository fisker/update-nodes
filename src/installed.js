import execa from 'execa'

async function getInstalledVersions() {
  const {stdout} = await execa('nvm', ['list'])

  return stdout.match(/\d+\.\d+\.\d+/g, stdout)
}

export default getInstalledVersions