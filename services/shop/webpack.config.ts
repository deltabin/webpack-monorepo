import {
	buildWebpack,
	type BuildMode,
	type BuildPaths,
	type BuildPlatform,
} from '@packages/build-config'

import packageJson from './package.json'

import path from 'path'
import webpack from 'webpack'

interface EnvVariables {
	mode?: BuildMode
	port?: number
	analyzer?: boolean
	platform?: BuildPlatform
}

export default (env: EnvVariables) => {
	const paths: BuildPaths = {
		output: path.resolve(__dirname, 'build'),
		entry: path.resolve(__dirname, 'src', 'index.tsx'),
		html: path.resolve(__dirname, 'public', 'index.html'),
		src: path.resolve(__dirname, 'src'),
		public: path.resolve(__dirname, 'public'),
	}
	const config: webpack.Configuration = buildWebpack({
		port: env.port ?? 3001,
		mode: env.mode ?? 'development',
		paths,
		platform: env.platform ?? 'desktop',
		analyzer: env.analyzer,
	})

	config.plugins.push(
		new webpack.container.ModuleFederationPlugin({
			name: 'shop',
			filename: 'remoteEntry.js',
			exposes: {
				'./router': './src/router/router.tsx',
			},
			shared: {
				...packageJson.dependencies,
				react: {
					eager: true,
					requiredVersion: packageJson.dependencies['react'],
				},
				'react-router-dom': {
					eager: true,
					requiredVersion: packageJson.dependencies['react-router-dom'],
				},
				'react-dom': {
					eager: true,
					requiredVersion: packageJson.dependencies['react-dom'],
				},
			},
		})
	)

	return config
}
