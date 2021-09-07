import meow from 'meow'

const cli = meow(
  `
  Usage
    $ update-nodes
  `,
  {
    importMeta: import.meta,
    flags: {
      help: {
        alias: 'h',
      },
      version: {
        alias: 'v',
      },
    },
  },
)

export default cli
