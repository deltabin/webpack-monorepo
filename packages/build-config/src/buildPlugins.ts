import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { DefinePlugin, ProgressPlugin, type Configuration } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { BuildOptions } from './types/types'

export function buildPlugins({
	mode,
	paths,
	analyzer,
	platform,
}: BuildOptions) {
	const isDev = mode === 'development'
	const isProd = mode === 'production'

	const plugins: Configuration['plugins'] = [
		new HtmlWebpackPlugin({
			template: paths.html,
			favicon: path.resolve(paths.public, 'favicon.ico'),
			publicPath: '/',
		}),
		new DefinePlugin({
			__PLATFORM__: JSON.stringify(platform),
		}),
	]

	if (isDev) {
		plugins.push(new ProgressPlugin())
		/** Выносит проверку типов в отдельный процесс: не нагружая сборку */
		// plugins.push(new ForkTsCheckerWebpackPlugin());
		plugins.push(new ReactRefreshWebpackPlugin())
	}

	if (isProd) {
		plugins.push(
			new MiniCssExtractPlugin({
				filename: 'css/[name].[contenthash:8].css',
				chunkFilename: 'css/[name].[contenthash:8].css',
			})
		)
		plugins.push(
			new CopyPlugin({
				patterns: [
					{
						// Сюда написать папки и файлы которые нужно переместить в билд
						from: path.resolve(paths.public, 'locales'),
						to: path.resolve(paths.output, 'locales'),
					},
				],
			})
		)
	}

	if (analyzer) plugins.push(new BundleAnalyzerPlugin())

	return plugins
}
