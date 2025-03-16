const path = require("path");

module.exports = {
  mode: "production", // Webpack automatically enables Terser in production mode
  entry: "./index.js", // Change this to your main JS file
  output: {
    filename: "index.min.js", // The output file will be minified
    path: path.resolve(__dirname, "src"),
  },
  optimization: {
    minimize: true, // Enable minification
  },
};
