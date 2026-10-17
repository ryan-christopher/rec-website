<script lang="ts">
	function toggle() {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// Crossfade the whole page between themes where supported; otherwise switch instantly
		if (document.startViewTransition && !reduceMotion) {
			document.startViewTransition(switchTheme);
		} else {
			switchTheme();
		}
	}

	function switchTheme() {
		const root = document.documentElement;
		const next = root.dataset.theme === 'light' ? 'dark' : 'light';

		if (next === 'light') root.dataset.theme = 'light';
		else delete root.dataset.theme;

		try {
			localStorage.setItem('theme', next);
		} catch {
			// Storage unavailable (e.g. private mode); the toggle still works for this visit
		}
	}
</script>

<!-- Icons are swapped with CSS so the right one shows before hydration -->
<button
	type="button"
	onclick={toggle}
	aria-label="Toggle light and dark mode"
	class="rounded-full p-2 transition-colors hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-foreground"
>
	<!-- Sun: shown in dark mode -->
	<svg
		class="size-6 light:hidden"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="4" />
		<path
			d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
		/>
	</svg>
	<!-- Moon: shown in light mode -->
	<svg
		class="hidden size-6 light:block"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
	</svg>
</button>
