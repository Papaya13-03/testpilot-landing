// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Served by GitHub Pages at https://papaya13-03.github.io/testpilot-landing/
export default defineConfig({
	site: 'https://papaya13-03.github.io',
	base: '/testpilot-landing',
	integrations: [
		starlight({
			title: 'Testpilot',
			description: 'Describe the test. Testpilot flies it.',
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
			},
			favicon: '/favicon.svg',
			customCss: ['./src/styles/docs.css'],
			head: [
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap',
					},
				},
			],
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'How it works', slug: 'how-it-works' },
						{ label: 'Getting started', slug: 'getting-started' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Using Testpilot', slug: 'using-testpilot' },
						{ label: 'Test machine setup', slug: 'test-machine-setup' },
					],
				},
			],
		}),
	],
});
