const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: ["./src/Autorization/autorization.js", "./src/styles/style.css"],
    output: {
        filename: "./js/bundle.js",
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "src/js"),
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: "env",
                    },
                },
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "./css/style.bundle.css",
            allChunks: true,
        }),
    ],
};
