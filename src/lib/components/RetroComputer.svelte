<script lang="ts">
	import type { Component } from 'svelte';
	import type { Attachment } from 'svelte/attachments';

	// Decorative 3D retro computer for the footer. three.js and Threlte (~200 KB) are only
	// downloaded once the footer comes near the screen, so they never slow the first page load.
	// It can be dragged to turn it; under reduced motion a flick doesn't keep it turning
	let Scene = $state<Component<{ coast: boolean }>>();
	let reducedMotion = $state(false);

	const lazyScene: Attachment<HTMLElement> = (box) => {
		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = motionQuery.matches;
		const onMotionChange = () => (reducedMotion = motionQuery.matches);
		motionQuery.addEventListener('change', onMotionChange);

		// Start loading a little before the footer scrolls into view
		const loader = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				loader.disconnect();
				import('./RetroComputerScene.svelte').then((module) => (Scene = module.default));
			},
			{ rootMargin: '300px' }
		);
		loader.observe(box);

		return () => {
			loader.disconnect();
			motionQuery.removeEventListener('change', onMotionChange);
		};
	};
</script>

<!-- Fixed size, so nothing shifts when the scene loads in -->
<div aria-hidden="true" class="h-28 w-40" {@attach lazyScene}>
	{#if Scene}
		<Scene coast={!reducedMotion} />
	{/if}
</div>
