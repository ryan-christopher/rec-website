<script lang="ts">
	import BackArrow from '#lib/components/BackArrow.svelte';
	import WorkEntry from '#lib/components/WorkEntry.svelte';
	import { works } from '#lib/works.js';
</script>

<svelte:head>
	<title>My work · Ryan Christopher</title>
</svelte:head>

<!-- Top padding clears the fixed nav bar; sides match the 2.5% inset used on the home page.
     The heading is centered at the cards' width so its left edge lines up with theirs. Below lg:
     the heading reaches the back arrow's corner, so the content starts under it there (pt-36, like
     the resume page) -->
<section id="top" class="min-h-svh px-[2.5%] pt-36 pb-14 lg:pt-24">
	<!-- Fixed top-left back arrow -->
	<BackArrow />

	<h1 class="mx-auto w-[90vw] text-[clamp(2.5rem,8vw,5rem)] leading-none font-bold lg:w-[75vw]">
		Works & Projects
	</h1>
	<!-- 1px line under the heading, like the resume page's section headings, at the cards' width -->
	<hr class="mx-auto mt-3 w-[90vw] border-foreground lg:w-[75vw]" />

	<!-- Entries stacked and centered: 90% of the screen on phones, 75% from laptops (lg) up.
	     Widths are of the viewport, so they ignore the section's side padding -->
	<ul class="mt-8 flex flex-col items-center gap-10">
		{#each works as work (work.title)}
			<li class="w-[90vw] lg:w-[75vw]">
				<WorkEntry {work} />
			</li>
		{/each}
	</ul>
</section>
