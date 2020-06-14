const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PrerenderSPAPlugin = require("./prerender-spa-plugin");

module.exports = {
  mode: "development",
  context: process.cwd(),
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }]
            ]
          }
        },
        include: path.join(__dirname, "src"),
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", //指定模板文件
      filename: "index.html" //产出后的文件名
    }),
     new PrerenderSPAPlugin({
      staticDir: path.join(__dirname, "dist"),
      routes: ["/","/user","/profile"]
    }) 
  ]
};