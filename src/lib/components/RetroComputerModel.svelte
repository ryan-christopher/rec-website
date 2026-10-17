<script lang="ts">
	import { asset } from '$app/paths';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { GLTF } from '@threlte/extras';

	// Must sit inside a Threlte <Canvas> (useTask and useThrelte need its context).
	// coast: whether a flick keeps it turning after letting go (off under reduced motion)
	let { coast }: { coast: boolean } = $props();

	// At rest it faces slightly to the viewer's left (~20°), so it reads as 3D. It doesn't spin by
	// itself; it only turns when dragged
	let turn = $state(-0.35);

	// Set while the user drags it (below). Declared before useTask: Threlte reads `running`
	// straight away, so a later declaration throws when the scene loads already on screen
	let dragging = $state(false);

	// Speed after a flick (radians per second), easing to a stop. Also declared before useTask,
	// which reads it in `running`
	let velocity = $state(0);

	// Only runs (and so only renders frames) while coasting after a flick
	useTask(
		(delta) => {
			// Loses ~78% of its speed each second (time constant ~0.67s)
			velocity *= Math.exp(-delta * 1.5);
			if (Math.abs(velocity) < 0.01) velocity = 0;
			turn += velocity * delta;
		},
		{ running: () => !dragging && velocity !== 0 }
	);

	// Drag sideways to turn it. Only horizontal: touch-action pan-y
	// leaves vertical swipes to scroll the page on touch screens
	const { dom } = useThrelte();

	$effect(() => {
		let lastX = 0;
		let lastTime = 0;
		// The drag's speed (radians per second), smoothed over the last few moves
		let dragVelocity = 0;

		const onDown = (event: PointerEvent) => {
			dragging = true;
			lastX = event.clientX;
			lastTime = event.timeStamp;
			dragVelocity = 0;
			dom.setPointerCapture(event.pointerId);
		};
		const onMove = (event: PointerEvent) => {
			if (!dragging) return;
			// Dragging right turns the front to the right; ~1 turn per 630px
			const step = (event.clientX - lastX) * 0.01;
			const seconds = (event.timeStamp - lastTime) / 1000;
			turn += step;
			if (seconds > 0) dragVelocity = 0.7 * (step / seconds) + 0.3 * dragVelocity;
			lastX = event.clientX;
			lastTime = event.timeStamp;
		};
		const onUp = (event: PointerEvent) => {
			if (!dragging) return;
			dragging = false;
			// Held still before letting go: no flick. Capped so a wild flick can't blur it
			const held = event.timeStamp - lastTime > 100;
			velocity = coast && !held ? Math.max(-8, Math.min(8, dragVelocity)) : 0;
		};

		dom.style.touchAction = 'pan-y';
		dom.addEventListener('pointerdown', onDown);
		dom.addEventListener('pointermove', onMove);
		dom.addEventListener('pointerup', onUp);
		dom.addEventListener('pointercancel', onUp);
		return () => {
			dom.removeEventListener('pointerdown', onDown);
			dom.removeEventListener('pointermove', onMove);
			dom.removeEventListener('pointerup', onUp);
			dom.removeEventListener('pointercancel', onUp);
		};
	});

	$effect(() => {
		dom.style.cursor = dragging ? 'grabbing' : 'grab';
	});
</script>

<!-- 4.4 away, 15° above, aimed a little below the model's middle. Checked by projecting the
     model's corners at every angle of the turn: it stays within ~80% of the 160×112 box's height
     and ~63% of its width, so nothing clips -->
<T.PerspectiveCamera
	makeDefault
	position={[0, 0.94, 4.25]}
	fov={35}
	oncreate={(camera) => camera.lookAt(0, -0.2, 0)}
/>

<!-- The whole model (computer, monitor on top, keyboard and mouse in front) spans about
     x -0.69 to 1.08, y -0.1 to 1.55, z -0.63 to 1.06. Shifted so it turns around its middle -->
<T.Group rotation.y={turn}>
	<GLTF
		url={asset('models/retro-computer/source/lowres computer.glb')}
		position={[-0.1, -0.72, -0.2]}
	/>
</T.Group>
