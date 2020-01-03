const path = require("path");

module.exports = {
  entry: "./src/index.js",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        include: path.join(__dirname, "./src"),
        exclude: /node_modules/
      }
    ]
  },
  output: {
    // publicPath:'/demos/2020/code-splitting/',
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  }
};
