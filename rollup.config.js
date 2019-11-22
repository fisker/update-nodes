export default {
  input: 'src/index.js',
  output: {
    file: 'dist/cli',
    format: 'cjs',
    banner: '#!/usr/bin/env node',
  },
}
