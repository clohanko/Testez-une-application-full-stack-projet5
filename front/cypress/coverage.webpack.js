const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        use: {
          loader: '@jsdevtools/coverage-istanbul-loader',
          options: { esModules: true }
        },
        enforce: 'post',
        include: path.resolve(__dirname, '../src'),
        exclude: [/\.e2e\.ts$/, /\.spec\.ts$/, /node_modules/]
      }
    ]
  }
};
