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
        shortFlag: 'h',
      },
      version: {
        shortFlag: 'v',
      },
    },
  },
)

export default cli
