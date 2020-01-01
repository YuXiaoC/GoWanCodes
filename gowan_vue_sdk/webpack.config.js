const path = require("path")
const fs = require("fs")
const webpack = require("webpack")
const getWatch = dir => dir.map(e => "../src/" + e + "/**/*")
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")

const config = {
  jsDir: "/js/app/",
  entry: path.join(__dirname, "./src/h5sdk") //webpack入口
}
const fn = {
  getJS(dir) {
    let arr = fs.readdirSync(dir)
    return Object.assign(
      ...arr.map(e => ({
        [e.replace(".js", "")]: path.join(dir, e)
      }))
    )
  }
}
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin

module.exports = {
  // devtool: '#eval-source-map',
  devtool: '#source-map',
  entry: fn.getJS(config.entry),
  output: {
    filename: "./src/js/[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new FriendlyErrorsPlugin(),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
