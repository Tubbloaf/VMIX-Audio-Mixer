const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // Import the CleanWebpackPlugin

module.exports = {
    mode: 'development', // Change to 'production' for production builds
    entry: './src/app.js', // Entry point for your application
    output: {
        filename: 'main.js', // Output bundle file
        path: path.resolve(__dirname, 'dist'), // Output directory
        clean: true, // Clean the output directory before each build (this is optional since the plugin will also handle this)
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Process JavaScript files
                exclude: /node_modules/, // Exclude node_modules
                use: {
                    loader: 'babel-loader', // Use Babel for transpiling
                    options: {
                        presets: ['@babel/preset-env'], // Use the latest JavaScript features
                    },
                },
            },
            {
                test: /\.css$/, // Process CSS files
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.json'], // Resolve JS and JSON extensions
    },
    devServer: {
        static: path.join(__dirname, 'dist'), // Serve from the dist directory
        port: 8080, // Development server port
    },
    plugins: [
        new CleanWebpackPlugin(), // Add the CleanWebpackPlugin to the plugins array
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'), // Template for index.html
            filename: 'index.html', // Output filename for the generated HTML file
        }),
    ],
};
