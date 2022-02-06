const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const PENUMBRA_DIRECTORY = path.join(
  __dirname,
  'node_modules',
  '@transcend-io/penumbra',
  'build',
);

module.exports = {
    entry: './src/index.js',
    output: {
        //filename: 'main.js',
        filename: '[hash].js',
        chunkFilename: '[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
    },
  plugins: [
    new CopyPlugin({
      patterns: fs.readdirSync(PENUMBRA_DIRECTORY)
        .filter((fil) => fil.indexOf('.') > 0)
        .map((fil) => ({
          from: `${PENUMBRA_DIRECTORY}/${fil}`,
          to: `${"dist"}/${fil}`,
        })),
    }),
  ]
}