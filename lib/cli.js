import meow from 'meow'

const cli = meow(
  `
  Usage
    $ update-nodes
  `,
  {
    flags: {
      help: {
        alias: 'h',
      },
      version: {
        alias: 'v',
      },
    },
  }
)

export default cli
