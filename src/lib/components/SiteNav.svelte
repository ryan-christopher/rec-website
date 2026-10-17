<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { flushSync, tick } from 'svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	// Menu links. Routes go through resolve(). `inPage` links (#id) don't change the page, so they
	// close the menu on click rather than in afterNavigate below
	const links: { href: string; label: string; inPage?: boolean }[] = [
		{ href: resolve('/'), label: 'Home' },
		{ href: resolve('/work'), label: 'Works' },
		{ href: resolve('/resume'), label: 'Resumé' },
		{ href: resolve('/contact'), label: 'Contact' }
	];

	let scrollY = $state(0);
	let menuOpen = $state(false);
	let nav: HTMLElement;
	let menu: HTMLElement;

	// The bar and name stay hidden at the top of the home page (where the big name is) until you
	// scroll; every other page shows them all the time
	const showName = $derived(page.route.id !== '/' || scrollY > 250);
	// The panel hangs off the bar, so show the bar whenever the menu is open
	const barVisible = $derived(showName || menuOpen);

	// When opened from the keyboard (Enter/Space give a click with detail 0), move focus to the
	// first link. Not on taps or mouse clicks: mobile browsers would show its focus underline,
	// so it looked hovered
	async function toggleMenu(event: MouseEvent) {
		menuOpen = !menuOpen;
		if (menuOpen && event.detail === 0) {
			// Wait for the panel to lose `inert` so the link can take focus
			await tick();
			menu.querySelector('a')?.focus();
		}
	}

	// Close the menu once a link has navigated, not on click: during a page slide the old page's
	// snapshot must still show it open, so the view transition can slide it shut (flushSync gets the
	// closed state into the DOM before the new page's snapshot)
	afterNavigate(() => {
		menuOpen = false;
		flushSync();
	});

	function closeOnOutsideClick(event: MouseEvent) {
		if (menuOpen && !nav.contains(event.target as Node)) menuOpen = false;
	}

	function closeOnEscape(event: KeyboardEvent) {
		if (event.key === 'Escape') menuOpen = false;
	}
</script>

<svelte:window bind:scrollY onclick={closeOnOutsideClick} onkeydown={closeOnEscape} />

<!-- Click-through while the bar is hidden, so it doesn't block the page beneath it.
     Named for view transitions, so it stays put while pages slide (layout.css) -->
<nav
	bind:this={nav}
	aria-label="Main"
	class="pointer-events-none fixed inset-x-0 top-0 z-50 [view-transition-name:site-nav]"
>
	<!-- Dims the page behind the open menu; clicking it closes the menu.
	     During a page slide ([data-page-transition] on <html>) the backdrop and panel drop their own
	     transitions: the view transition already animates them from the old page's snapshot, so a
	     live transition on top would show a second, out-of-step copy -->
	<div
		aria-hidden="true"
		onclick={() => (menuOpen = false)}
		class={[
			'fixed inset-0 bg-background/50 transition-opacity duration-300 ease-out motion-reduce:transition-none [[data-page-transition]_&]:transition-none',
			menuOpen ? 'pointer-events-auto opacity-100' : 'opacity-0'
		]}
	></div>

	<!-- Panel that slides in from off the right edge of the screen, filling the height below the bar.
	     It's out of flow, so the nav's height (100%) is just the bar's. Its own view-transition-name
	     lets a page slide move it from open to closed in one piece (layout.css) -->
	<div
		id="site-menu"
		bind:this={menu}
		inert={!menuOpen}
		class={[
			'pointer-events-auto absolute top-full right-0 flex h-[calc(100dvh-100%)] w-72 max-w-[85vw] flex-col border-l border-foreground bg-background/85 transition-transform duration-300 ease-out [view-transition-name:site-menu] motion-reduce:transition-none [[data-page-transition]_&]:transition-none',
			menuOpen ? 'translate-x-0' : 'translate-x-full'
		]}
	>
		<!-- The list is centered in the panel as a block (as wide as its longest link), with the links
		     left-aligned inside it -->
		<ul class="mx-auto flex w-fit flex-col items-start gap-6 p-4 pt-8">
			{#each links as link (link.href)}
				<li>
					<!-- Hrefs are resolved in `links` above, apart from the #id ones -->
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<a
						href={link.href}
						aria-current={page.url.pathname === link.href ? 'page' : undefined}
						onclick={link.inPage ? () => (menuOpen = false) : undefined}
						class="block border-b border-transparent px-3 py-2 text-2xl font-bold transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:outline-none motion-reduce:transition-none"
					>
						<!-- eslint-enable svelte/no-navigation-without-resolve -->
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<!-- Bar background: current theme background at 85%, with a 1px text-colored line along the bottom -->
	<div
		class={[
			'absolute inset-0 border-b border-foreground bg-background/85 transition-opacity duration-300 ease-out motion-reduce:transition-none',
			barVisible ? 'pointer-events-auto opacity-100' : 'opacity-0'
		]}
	></div>

	<div class="relative flex items-center justify-between px-4 py-3">
		<!-- Home link. Slides in from off the left edge of the screen -->
		<a
			href={resolve('/')}
			inert={!showName}
			class={[
				'pointer-events-auto text-xl font-bold transition duration-300 ease-out motion-reduce:transition-none',
				showName ? 'translate-x-0 opacity-100' : '-translate-x-[calc(100%+1rem)] opacity-0'
			]}
		>
			Ryan Christopher
		</a>

		<div class="pointer-events-auto flex items-center">
			<ThemeToggle />

			<div class="ml-2">
				<button
					type="button"
					onclick={toggleMenu}
					aria-label={menuOpen ? 'Close menu' : 'Menu'}
					aria-expanded={menuOpen}
					aria-controls="site-menu"
					class="rounded-full p-2 transition hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-foreground motion-reduce:transition-none"
				>
					<svg
						class="size-6"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						aria-hidden="true"
					>
						<!-- Burger to ✕: the outer lines slide to the middle and rotate about the center
						     (the icon's center, since SVG transforms use the viewBox) while the middle line fades -->
						<path
							d="M4 6h16"
							class={[
								'origin-center transition duration-300 ease-out motion-reduce:transition-none',
								menuOpen && '[transform:rotate(45deg)_translateY(6px)]'
							]}
						/>
						<path
							d="M4 12h16"
							class={[
								'origin-center transition duration-300 ease-out motion-reduce:transition-none',
								menuOpen && 'opacity-0'
							]}
						/>
						<path
							d="M4 18h16"
							class={[
								'origin-center transition duration-300 ease-out motion-reduce:transition-none',
								menuOpen && '[transform:rotate(-45deg)_translateY(-6px)]'
							]}
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</nav>
