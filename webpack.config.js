const webpack = require("webpack"); //to access built-in plugins
var path = require("path");
var APP = path.resolve(__dirname);

var baseConfig = {
   mode: "development", // "production", "none"
   context: APP,
   entry: {
      app: path.join(APP, "index.js"),
   },
   // output: {
   //    path: path.join(APP, "dist"),
   //    filename: "ABDesigner.js",
   // },
   module: {
      rules: [
         // {
         //    test: /\.m?js$/,
         //    exclude: /node_modules/,
         //    use: {
         //       loader: "babel-loader",
         //       options: {
         //          presets: [["@babel/preset-env", { targets: "defaults" }]],
         //       },
         //    },
         // },
         {
            test: /\.css$/,
            use: ["style-loader", "css-loader?url=false"],
         },
         {
            test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
            use: ["url-loader?limit=10000000"],
         },
      ],
   },
   devtool: "source-map",
   plugins: [],
   resolve: {
      alias: {
         assets: path.resolve(__dirname, "..", "..", "..", "assets"),
      },
   },
};

// Store the local dist/ABDesigner.js
var pluginConfig = Object.assign({}, baseConfig, {
   output: {
      path: path.join(APP, "dist"),
      filename: "ABDesigner.js",
   },
});

// Store our common /assets/tenant/default/ABDesigner.js
var assetConfig = Object.assign({}, baseConfig, {
   output: {
      path: path.join(APP, "..", "..", "..", "assets", "tenant", "default"),
      filename: "ABDesigner.js",
   },
});

module.exports = [pluginConfig, assetConfig];
