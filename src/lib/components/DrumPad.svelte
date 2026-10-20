<script lang="ts">
	// Four drum sounds, synthesised with the Web Audio API (no audio files), each on a pad and a key.
	// Pads are orange and flash purple when hit (-400 in dark mode, -600 in light, like the footer icons).
	// The keys spell RYAN across the 2×2 grid: R Y over A N

	import { resolve } from '$app/paths';
	import { maxHitsPerRequest } from '#lib/drumHits.js';

	let { onhit }: { onhit?: () => void } = $props();

	let ctx: AudioContext | undefined;
	let output: GainNode | undefined;
	let noiseBuffer: AudioBuffer | undefined;

	// Browsers only allow sound after the visitor interacts, so the context is created on the first hit
	function audio() {
		if (!ctx) {
			ctx = new AudioContext();
			output = ctx.createGain();
			output.gain.value = 0.5;
			output.connect(ctx.destination);

			// One second of white noise, reused by the tom, hat and clap
			noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
			const data = noiseBuffer.getChannelData(0);
			for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
		}
		if (ctx.state === 'suspended') ctx.resume();
		return { ctx, output: output!, noiseBuffer: noiseBuffer! };
	}

	// A burst of filtered noise; the caller shapes its volume envelope
	function noise(type: BiquadFilterType, frequency: number, duration: number) {
		const { ctx, output, noiseBuffer } = audio();
		const source = ctx.createBufferSource();
		source.buffer = noiseBuffer;
		const filter = ctx.createBiquadFilter();
		filter.type = type;
		filter.frequency.value = frequency;
		const gain = ctx.createGain();
		source.connect(filter).connect(gain).connect(output);
		source.start(ctx.currentTime);
		source.stop(ctx.currentTime + duration);
		return { gain: gain.gain, t: ctx.currentTime };
	}

	// A sine wave dropping quickly in pitch
	function kick() {
		const { ctx, output } = audio();
		const t = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.frequency.setValueAtTime(150, t);
		osc.frequency.exponentialRampToValueAtTime(45, t + 0.15);
		gain.gain.setValueAtTime(1, t);
		gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
		osc.connect(gain).connect(output);
		osc.start(t);
		osc.stop(t + 0.4);
	}

	// Like the kick but higher and with a gentler pitch drop, plus a tiny click of noise for the
	// stick hitting the head
	function tom() {
		const { ctx, output } = audio();
		const t = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.frequency.setValueAtTime(220, t);
		osc.frequency.exponentialRampToValueAtTime(110, t + 0.3);
		gain.gain.setValueAtTime(0.8, t);
		gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
		osc.connect(gain).connect(output);
		osc.start(t);
		osc.stop(t + 0.5);

		const click = noise('lowpass', 3000, 0.02);
		click.gain.setValueAtTime(0.3, click.t);
		click.gain.exponentialRampToValueAtTime(0.001, click.t + 0.02);
	}

	// A very short burst of high noise
	function hat() {
		const { gain, t } = noise('highpass', 7000, 0.06);
		gain.setValueAtTime(0.4, t);
		gain.exponentialRampToValueAtTime(0.001, t + 0.06);
	}

	// Three quick noise bursts, then a short tail, like several hands clapping at once
	function clap() {
		const { gain, t } = noise('bandpass', 1500, 0.25);
		for (let i = 0; i < 3; i++) {
			gain.setValueAtTime(0.8, t + i * 0.01);
			gain.exponentialRampToValueAtTime(0.1, t + i * 0.01 + 0.009);
		}
		gain.setValueAtTime(0.8, t + 0.03);
		gain.exponentialRampToValueAtTime(0.001, t + 0.25);
	}

	// The icon snippets are defined in the markup below
	const pads = [
		{ name: 'hat', key: 'r', play: hat, icon: hatIcon },
		{ name: 'clap', key: 'y', play: clap, icon: clapIcon },
		{ name: 'kick', key: 'a', play: kick, icon: kickIcon },
		{ name: 'tom', key: 'n', play: tom, icon: tomIcon }
	];

	// Each hit bumps its pad's count, which re-keys the flash so its animation restarts
	const hits = $state(pads.map(() => 0));

	function hit(i: number) {
		pads[i].play();
		hits[i]++;
		onhit?.();
		countHit();
	}

	// Total hits by every visitor, kept in /api/drum-hits. Hits are sent in batches (at most one
	// request every 2s) rather than one request each. The shown total is the server's last answer
	// plus this visitor's hits it hasn't counted yet, so it goes up at once on every hit. It stays
	// hidden until the server first answers (and for good if the counter is unavailable)
	let serverTotal = $state<number>();
	let unsent = $state(0);
	let sending = $state(0);
	let flushTimer: ReturnType<typeof setTimeout> | undefined;
	const total = $derived(serverTotal === undefined ? undefined : serverTotal + unsent + sending);

	// The counter only goes up, so an older answer arriving late never lowers it
	function updateTotal(value: unknown) {
		if (typeof value === 'number') serverTotal = Math.max(serverTotal ?? 0, value);
	}

	function countHit() {
		unsent++;
		flushTimer ??= setTimeout(flush, 2000);
	}

	async function flush() {
		clearTimeout(flushTimer);
		flushTimer = undefined;
		const count = Math.min(unsent, maxHitsPerRequest);
		if (!count) return;
		unsent -= count;
		sending += count;
		if (unsent) flushTimer = setTimeout(flush, 2000);
		try {
			// keepalive lets the request finish when it's sent as the visitor leaves the page
			const response = await fetch(resolve('/api/drum-hits'), {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ count }),
				keepalive: true
			});
			if (!response.ok) throw new Error(`${response.status}`);
			updateTotal((await response.json()).total);
		} catch {
			// Try them again with the next batch
			unsent += count;
		} finally {
			sending -= count;
		}
	}

	$effect(() => {
		fetch(resolve('/api/drum-hits'))
			.then((response) => (response.ok ? response.json() : undefined))
			.then((data) => updateTotal(data?.total))
			.catch(() => {});

		// Send what's left when the tab is hidden or closed (more reliable on phones than pagehide),
		// and when the page is left for another one on the site
		const onvisibilitychange = () => document.visibilityState === 'hidden' && flush();
		document.addEventListener('visibilitychange', onvisibilitychange);
		return () => {
			document.removeEventListener('visibilitychange', onvisibilitychange);
			flush();
		};
	});

	// Pads sound on pointerdown, for less delay than waiting for the click. But on touch screens
	// pointerdown doesn't count as an interaction that allows sound, so until audio is running
	// the click plays it instead. Keyboard activation (Enter / Space) only fires click
	let playedOnPointerDown = false;

	function onpointerdown(i: number) {
		playedOnPointerDown = ctx?.state === 'running';
		if (playedOnPointerDown) hit(i);
	}

	function onclick(i: number) {
		if (!playedOnPointerDown) hit(i);
		playedOnPointerDown = false;
	}

	function onkeydown(event: KeyboardEvent) {
		playedOnPointerDown = false;
		if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
		const target = event.target as HTMLElement;
		if (target.isContentEditable || target.matches('input, textarea, select')) return;

		const i = pads.findIndex((pad) => pad.key === event.key.toLowerCase());
		if (i !== -1) hit(i);
	}

	$effect(() => () => ctx?.close());
</script>

<svelte:window {onkeydown} />

<!-- Pad icons, drawn in a 24-unit box with a 2-unit stroke like the site's other icons. Neither icon
     set has a hi-hat, clap or kick, so those are drawn here; the clap's hand is Tabler's hand-stop
     (MIT), shrunk to leave room for the impact lines, and the tom is Lucide's drum (ISC) -->
{#snippet hatIcon()}
	<!-- Two cymbals facing each other on a stand -->
	<path d="M3 8q9-4 18 0z" />
	<path d="M3 11q9 4 18 0z" />
	<path d="M12 4v2.2M12 13v8M8 21l4-3 4 3" />
{/snippet}

{#snippet clapIcon()}
	<!-- Scaled to 80% towards the bottom-right corner, so its stroke is widened to still draw 2 units -->
	<g transform="translate(24 24) scale(.8) translate(-24 -24)" stroke-width="2.5">
		<path
			d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5M14 5.5a1.5 1.5 0 0 1 3 0v6.5M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47"
		/>
	</g>
	<path d="M2 9h2.5M3 3.5l2 2M8 1.5v2.5" />
{/snippet}

{#snippet kickIcon()}
	<!-- A bass drum from the front, on its two spurs -->
	<circle cx="12" cy="11" r="8" />
	<circle cx="12" cy="11" r="2.5" />
	<path d="M6.5 17 4 21M17.5 17 20 21" />
{/snippet}

{#snippet tomIcon()}
	<path d="m2 2 8 8m12-8-8 8M7 13.4v7.9m5-7.3v8m5-8.6v7.9M2 9v8a10 5 0 0 0 20 0V9" />
	<ellipse cx="12" cy="9" rx="10" ry="5" />
{/snippet}

<!-- Everyone's hits so far, above the pads (the corner is anchored at the bottom, so it appearing
     doesn't move them). Kept on one line (whitespace-nowrap); its box is as wide as the pads
     (w-0 min-w-full), so longer text runs past their right edge instead of widening the corner -->
{#if total !== undefined}
	<p
		class="appear mb-1.5 w-0 min-w-full font-mono text-sm whitespace-nowrap text-foreground/90 sm:text-base"
	>
		<span class="text-base font-bold text-foreground sm:text-lg"
			>{total.toLocaleString('en-US')}</span
		><br>
		{total === 1 ? 'hit' : 'notes played'}<span class="sr-only">
			on the drum pad by all visitors</span
		>
	</p>
{/if}

<div role="group" aria-label="Drum pad" class="grid grid-cols-2 gap-2">
	{#each pads as pad, i (pad.name)}
		<button
			type="button"
			aria-label="{pad.name} ({pad.key.toUpperCase()})"
			aria-keyshortcuts={pad.key.toUpperCase()}
			onpointerdown={() => onpointerdown(i)}
			onclick={() => onclick(i)}
			class="relative flex size-14 touch-manipulation flex-col items-center justify-center gap-1 border border-orange-400/70 font-mono leading-none transition-[border-color,scale] duration-100 select-none hover:border-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground active:border-purple-400 motion-safe:active:scale-95 motion-reduce:transition-none sm:size-20 light:border-orange-600/70 light:hover:border-orange-600 light:active:border-purple-600"
		>
			{#key hits[i]}
				{#if hits[i]}
					<span
						aria-hidden="true"
						class="flash absolute -inset-px border border-purple-400 bg-purple-400/50 light:border-purple-600 light:bg-purple-600/50"
					></span>
				{/if}
			{/key}
			<span class="relative text-base sm:text-lg">[{pad.key}]</span>
			<!-- The sound's icon; its name is in the button's aria-label -->
			<svg
				class="relative size-5 text-foreground/70 sm:size-6"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				{@render pad.icon()}
			</svg>
		</button>
	{/each}
</div>

<style>
	/* Each hit flashes the pad purple (border and a tint), then fades back to orange. It covers the
	   button's own border (-inset-px) so that turns purple too */
	.flash {
		opacity: 0;
		animation: flash 300ms ease-out;
	}

	.appear {
		animation: appear 300ms ease-out;
	}

	@keyframes appear {
		from {
			opacity: 0;
		}
	}

	@keyframes flash {
		from {
			opacity: 1;
		}
	}
</style>
