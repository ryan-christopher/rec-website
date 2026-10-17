<script lang="ts">
	import { resolve } from '$app/paths';

	// Where it leads: the home page, or the work page (from a project page)
	let { to = '/' }: { to?: '/' | '/work' } = $props();

	const labels = { '/': 'Back to home', '/work': 'Back to my work' };
</script>

<!-- Back to the home page (or the work page): a circled arrow like the landing page's down arrow,
     nudging left on hover/focus. Fixed in the top-left corner just under the 65px nav bar (top-20
     on phones, a 15px gap; top-24 from lg:), at z-40, below the nav's z-50, so the open menu
     covers it. Opaque background (the hover tint too, mixed into it) so text scrolls behind it.
     42px square (p-2 + size-6 + 1px border); a page's content can reach the corner (below lg:,
     or at every size if it's left-aligned), so pages leave room under it there. Used on the work,
     resume, contact and project pages -->
<a
	href={resolve(to)}
	aria-label={labels[to]}
	class="group fixed top-20 left-[2.5%] z-40 rounded-full border border-foreground bg-background p-2 transition hover:bg-[color-mix(in_oklab,var(--color-foreground)_10%,var(--color-background))] focus-visible:outline-2 focus-visible:outline-foreground motion-reduce:transition-none lg:top-24"
>
	<svg
		class="size-6 transition-transform duration-200 ease-out motion-safe:group-hover:-translate-x-1 motion-safe:group-focus-visible:-translate-x-1"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="M19 12H5M12 19l-7-7 7-7" />
	</svg>
</a>
