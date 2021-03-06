const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const pkg = require('./package.json');

const { name } = pkg;

const plugins = [
  new MiniCssExtractPlugin({
    filename: 'dist/[name].css',
    chunkFilename: 'dist/[id].css',
    ignoreOrder: false,
  }),
];

module.exports = (env = {}) => {
  const isProd = env.production;

  if (isProd) {
    plugins.push(new webpack.BannerPlugin(`${name} - ${pkg.version}`));
  } else {
    plugins.push(new HtmlWebpackPlugin({ template: 'index.html' }));
  }

  return {
    entry: './src/index.ts',
    mode: isProd ? 'production' : 'development',
    devtool: !isProd ? 'source-map' : 'cheap-module-eval-source-map',
    output: {
      path: path.resolve(__dirname),
      filename: `dist/${name}.min.js`,
      library: name,
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'babel-loader',
              options: { cacheDirectory: true },
            },
            'ts-loader',
          ],
          include: /src/,
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'less-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    externals: { grapesjs: 'grapesjs' },
    plugins,
  };
};
