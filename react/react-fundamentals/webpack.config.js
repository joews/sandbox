module.exports = {
  entry: "./main.js",
  output: {
    path: "./",
    filename: "index.js"
  },
  devServer: {
    port: 9090,

    // live reload the browser on changes.
    // The browser's <script> path must match the output path + filename exactly,
    //  because weback-dev-server handles compilation in memory.
    inline: true
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel",
      query: {
        "presets": ["es2015", "react"]
      }
    }]
  }
}
