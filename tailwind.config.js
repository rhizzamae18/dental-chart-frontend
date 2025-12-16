export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	plugins: [require("tailwindcss-animate")],
	theme: {
		extend: {
			colors: {
				// Custom Design System Colors
				primary: {
					DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
					hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
					light: 'rgb(var(--color-primary-light) / <alpha-value>)',
					border: 'rgb(var(--color-primary-border) / <alpha-value>)',
				},
				accent: {
					DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
					light: 'rgb(var(--color-accent-light) / <alpha-value>)',
				},
				text: {
					primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
					secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
					muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
				},
				bg: {
					primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
					secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
					dark: 'rgb(var(--color-bg-dark) / <alpha-value>)',
					darker: 'rgb(var(--color-bg-darker) / <alpha-value>)',
				},
				border: {
					DEFAULT: 'rgb(var(--color-border-default) / <alpha-value>)',
					dark: 'rgb(var(--color-border-dark) / <alpha-value>)',
				},
				success: 'rgb(var(--color-success) / <alpha-value>)',
				warning: 'rgb(var(--color-warning) / <alpha-value>)',
				error: 'rgb(var(--color-error) / <alpha-value>)',
			}
		}
	}
}