const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // Entry files for our popup and background pages
  entry: {
    popup: './src/js/popup.jsx',
    options: './src/js/options.jsx',
    jquery: './src/js/jquery.js',
    bootstrap: './src/js/bootstrap.js',
    background: './src/js/background.js',
    modifyhtml: './src/modifyhtml.js',
  },
  // Extension will be built into ./dist folder,
  // which we can then load as unpacked extension in Chrome
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  // Here we define loaders for different file types
  module: {
    rules: [
      {
        test: /\.js/,
        include: [path.resolve(__dirname, './src')],
        use: 'babel-loader',
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader?mimetype=application/font-woff&name=fonts/[name].[ext]',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?limit=100000',
          {
            loader: 'img-loader',
            options: {
              enabled: true,
              optipng: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // create CSS file with all used styles
    new ExtractTextPlugin('bundle.css'),
    // create popup.html from template and inject styles and script bundles
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['popup'],
      filename: 'popup.html',
      template: './src/popup.html',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['options'],
      filename: 'options.html',
      template: './src/options.html',
    }),
    // copy extension manifest and icons
    new CopyWebpackPlugin([
      { from: './src/manifest.json' },
      { context: './src/assets', from: '**', to: 'assets' },
    ]),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
