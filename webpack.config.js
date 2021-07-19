const path = require("path");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    port: 9000,
    compress: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    ],
  },
};
