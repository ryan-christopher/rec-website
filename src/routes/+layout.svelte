<script lang="ts">
	import './layout.css';
	import { injectAnalytics } from '@vercel/analytics/sveltekit-next';
	import { dev } from '$app/env';
	import { onNavigate } from '$app/navigation';
	import favicon from '#lib/assets/favicon.svg';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import SiteNav from '#lib/components/SiteNav.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Vercel Web Analytics: loads the script once and sends a pageview on every route change
	injectAnalytics({ mode: dev ? 'development' : 'production' });

	// How deep a route sits: / is 0, /work is 1, /work/[slug] is 2
	const depth = (routeId: string | null | undefined) =>
		routeId ? routeId.split('/').filter(Boolean).length : 0;

	// Page changes slide sideways: going deeper (Home → Work → a project), the old page slides off
	// to the left as the new one comes in from the right; going back up reverses it. Between pages
	// at the same depth, browser Back slides back and anything else slides forward. Uses the View
	// Transitions API; without it, or under reduced motion, pages switch instantly
	onNavigate((navigation) => {
		const { from, to } = navigation;
		if (!document.startViewTransition || !from || !to) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		// Same page, e.g. an in-page #id link, which scrolls instead
		if (from.url.pathname === to.url.pathname) return;

		const fromDepth = depth(from.route.id);
		const toDepth = depth(to.route.id);
		const back =
			toDepth === fromDepth
				? navigation.type === 'popstate' && (navigation.delta ?? 0) < 0
				: toDepth < fromDepth;

		// Picks the slide direction in layout.css, and keeps the theme crossfade (also a view
		// transition) from sliding
		const root = document.documentElement;
		root.dataset.pageTransition = back ? 'back' : 'forward';

		return new Promise((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			transition.finished.finally(() => delete root.dataset.pageTransition);
		});
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" sizes="32x32" />
	<link rel="icon" href={favicon} type="image/svg+xml" />
</svelte:head>

<SiteNav />

{@render children()}

<SiteFooter />
