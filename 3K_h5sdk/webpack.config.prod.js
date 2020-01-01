const path = require("path")
const fs = require("fs")
const webpack = require("webpack")
const getWatch = dir => dir.map(e => "../src/" + e + "/**/*")
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")

const config = {
  jsDir: "/js/app/",
  entry: path.join(__dirname, "./src/js/app") //webpack入口
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
  // devtool: '#source-map',
  entry: fn.getJS(config.entry),
  output: {
    filename: "./build/[name].js"
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
      },
      {
        test: /\.(css|scss)$/,
        use: ["css-loader", "sass-loader"]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [
                require("autoprefixer")({
                  browsers: ["last 8 versions"],
                  cascade: false
                })
              ]
            }
          },
          "less-loader"
        ]
      },
      { test: /\.(png|jpg)$/, use: "url-loader?limit=100000" }
    ]
  },
  plugins: [
    new FriendlyErrorsPlugin(),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
    // new webpack.optimize.UglifyJsPlugin({
    //   comments: false,
    //   compress: {
    //     warnings: false
    //   }
    // }),
  ]
}
