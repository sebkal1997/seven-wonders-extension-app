const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports =
{
	mode: "development",
	entry: "./public/js/main.js",
	output:
	{
		path: path.resolve(__dirname, "dist"),
		filename: "main.js"
	},
	devServer:
	{
		contentBase: "./dist"
	},
	devtool: "inline-source-map",
	optimization:
	{
		minimizer:
		[
			new TerserPlugin({}),
			new OptimizeCssAssetsPlugin({})
		]
	},
	module:
	{
		rules:
		[
			{
				test: /\.css$/i,
				use:
				[
					MiniCssExtractPlugin.loader,
					"css-loader"
				]
			},
			{
				test: /\.(png)$/,
				use:
				{
					loader: "file-loader",
					options:
					{
						outputPath: "images",
						name: "[name].[ext]"
					}
				}
			},
			{
				test: /\.(jpg)$/,
				use:
				{
					loader: "file-loader",
					options:
					{
						outputPath: "images",
						name: "[name].[ext]"
					}
				}
			},
			{
				test: /\.html$/,
				loader: "html-loader"
			}
		]
	},
	plugins:
	[
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin(
		{
			filename: "index.html",
			template: "./public/index.html",
			favicon: "./public/images/favicon.ico"
		})
	]
};
