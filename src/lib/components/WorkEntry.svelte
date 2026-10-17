<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Work } from '#lib/works.js';

	let { work }: { work: Work } = $props();

	// Arrow in the corner shows where the card leads, like the landing page links:
	// → the project's own page, ↗ an external link in a new tab
	const arrow = $derived(
		work.link
			? {
					path: 'M7 17L17 7M8 7h9v9',
					nudge:
						'motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:translate-x-1 motion-safe:group-focus-visible:-translate-y-1'
				}
			: {
					path: 'M5 12h14M12 5l7 7-7 7',
					nudge:
						'motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1'
				}
	);
</script>

<!-- The whole card is the link: to the external URL (new tab) if there is one, otherwise to the
     project's page. External URLs aren't routes, so resolve() doesn't apply to them -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
	href={work.link ?? resolve(work.page)}
	target={work.link ? '_blank' : undefined}
	rel={work.link ? 'noreferrer' : undefined}
	class="group grid border border-foreground transition-colors hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground motion-reduce:transition-none md:grid-cols-[2fr_3fr]"
>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
	{#if work.image}
		<!-- Same box as the placeholder below. The photo is absolutely positioned so its own size
		     doesn't stretch the card; it fills and crops to the box -->
		<div
			class="relative aspect-video overflow-hidden border-b border-foreground md:aspect-auto md:min-h-56 md:border-r md:border-b-0"
		>
			<img
				src={work.image}
				alt={work.imageAlt ?? ''}
				loading="lazy"
				class="absolute inset-0 size-full object-cover"
			/>
		</div>
	{:else}
		<!-- Diagonal-stripe placeholder until there's a screenshot -->
		<div
			aria-hidden="true"
			class="flex aspect-video items-center justify-center border-b border-foreground bg-[repeating-linear-gradient(45deg,var(--color-foreground)_0_1px,transparent_1px_12px)] md:aspect-auto md:min-h-56 md:border-r md:border-b-0"
		>
			<span class="bg-background px-2 font-mono text-sm text-foreground/70">image</span>
		</div>
	{/if}

	<div class="flex flex-col gap-3 p-5 sm:p-6">
		<p class="font-mono text-sm text-foreground/70">{work.date}</p>
		<h2 class="flex items-start justify-between gap-4 text-2xl leading-tight font-bold sm:text-3xl">
			{work.title}
			<svg
				class={[
					'mt-1 size-[0.8em] shrink-0 transition-transform duration-200 ease-out',
					arrow.nudge
				]}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d={arrow.path} />
			</svg>
		</h2>
		<p class="text-foreground/85">{work.description}</p>

		<!-- Spans rather than a list: lists inside links get read awkwardly by screen readers -->
		<p class="mt-auto flex flex-wrap gap-2 pt-2">
			{#each work.tags as tag (tag)}
				<span class="border border-foreground/50 px-2 py-0.5 font-mono text-sm">{tag}</span>
			{/each}
		</p>

		<!-- The ↗ arrow is hidden from screen readers, so say where the link goes for them -->
		{#if work.link}
			<span class="sr-only">(opens in a new tab)</span>
		{/if}
	</div>
</a>
