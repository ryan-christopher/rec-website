<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { NoToneMapping } from 'three';
	import RetroComputerModel from './RetroComputerModel.svelte';

	// Loaded lazily by RetroComputer. Renders on demand: only when something changes (the model
	// finishing loading, a drag, or coasting after a flick). The model is self-lit (an emissive
	// texture), so there are no lights, and no tone mapping so its colors show as painted
	let { coast }: { coast: boolean } = $props();
</script>

<Canvas renderMode="on-demand" toneMapping={NoToneMapping}>
	<RetroComputerModel {coast} />
</Canvas>
