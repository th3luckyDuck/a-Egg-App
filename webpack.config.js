var webpack = require('webpack');
module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      Please: 'pleasejs'
    })
  ],
  module: {
    rules: [
      {
        test: /scoreboard\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      }
    ]
  }
}
