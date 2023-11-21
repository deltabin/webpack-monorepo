import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ReactRefreshTypeScript from 'react-refresh-typescript'
import { ModuleOptions } from 'webpack'
import { buildBabelLoader } from './babel/buildBabelLoader'
import { BuildOptions } from './types/types'

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {
	const isDev = options.mode === 'development'

	const assetLoader = {
		test: /\.(png|jpg|jpeg|gif)$/i,
		type: 'asset/resource',
	}

	const svgrLoader = {
		test: /\.svg$/i,
		use: [
			{
				loader: '@svgr/webpack',
				options: {
					icon: true,
					svgoConfig: {
						plugins: [
							{
								name: 'convertColors',
								params: {
									currentColor: true,
								},
							},
						],
					},
				},
			},
		],
	}

	const cssLoaderWithModules = {
		loader: 'css-loader',
		options: {
			modules: {
				localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]',
			},
		},
	}

	const scssLoader = {
		test: /\.s[ac]ss$/i,
		use: [
			isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
			cssLoaderWithModules,
			'sass-loader',
		],
	}

	const tsLoader = {
		test: /\.tsx?$/,
		exclude: /node_modules/,
		use: [
			{
				loader: 'ts-loader',
				options: {
					getCustomTransformers: () => ({
						before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
					}),
					transpileOnly: true,
				},
			},
		],
	}

	const babelLoader = buildBabelLoader(options)

	return [
		assetLoader,
		svgrLoader,
		scssLoader,
		tsLoader,
		// babelLoader,
	]
}
