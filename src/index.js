import getRecommendVersions from 'nodejs-recommended-versions'
import cli from './cli'
import update from './update'
import getInstalledVersions from './installed'
import installNode from './install-node'

async function main(cli) {
  const installed = await getInstalledVersions()
  const recommend = await getRecommendVersions()
  const willInstall = recommend.filter(version => !installed.includes(version))

  if (willInstall.length === 0) {
    console.log('All Recommend Node.js Versions are installed.')
    return
  }

  console.log(`Will Install Node.js versions:

${willInstall.join('\n')}
  `)

  for (const version of willInstall) {
    await installNode(version)
  }
}

update()
main(cli)
