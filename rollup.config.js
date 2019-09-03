export default {
  input: 'src/index.js',
  output: {
    file: 'bin/cli',
    format: 'cjs',
    banner: '#!/usr/bin/env node',
  },
}
