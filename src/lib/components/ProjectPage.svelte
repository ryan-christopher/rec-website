<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import BackArrow from '#lib/components/BackArrow.svelte';
	import { works } from '#lib/works.js';

	// Shared frame for a project page (src/routes/work/<name>/+page.svelte): back arrow, title and
	// date from the page's entry in works.ts, then the page's own content, all in one centered
	// column, 60% of the screen from lg: up (full width below)
	let { children }: { children: Snippet } = $props();

	const work = $derived.by(() => {
		const found = works.find((work) => work.page === page.route.id);
		if (!found) throw new Error(`No entry in works.ts with page: '${page.route.id}'`);
		return found;
	});
</script>

<svelte:head>
	<title>{work.title} · Ryan Christopher</title>
</svelte:head>

<!-- Same layout as the work page: top padding clears the fixed nav bar, 2.5% side inset. The
     content starts under the back arrow below lg: (pt-36: its top-20 + 42px + a ~22px gap); from
     lg: up the centered column clears it -->
<section id="top" class="min-h-svh px-[2.5%] pt-36 pb-14 lg:pt-24">
	<!-- Fixed top-left back arrow, to the work page -->
	<BackArrow to="/work" />

	<div class="mx-auto lg:w-[55vw]">
		<!-- The same space (mt-4) between title and date, and between date and content -->
		<h1 class="text-[clamp(2.5rem,8vw,5rem)] leading-none font-bold">{work.title}</h1>
		<p class="mt-4 font-mono text-sm text-foreground/70">{work.date}</p>

		<div class="mt-4 flex flex-col gap-4">
			{@render children()}
		</div>
	</div>
</section>
