import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
                primary: '#14C38E',
                secondary: '#13AF80',
            },
		}
	},

	plugins: []
} satisfies Config;
