import type { Config } from 'tailwindcss'

const config: Config = {
	content: ['app/**/*.tsx'],
  presets: [require('nativewind/preset')],
	theme: {
		extend: {},
	},
	plugins: [],
}

export default config
