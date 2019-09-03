module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '6',
        },
        exclude: ['transform-typeof-symbol', 'transform-async-to-generator'],
        useBuiltIns: false,
        modules: false,
      },
    ],
  ],
  plugins: ['babel-plugin-transform-async-to-promises'],
}
