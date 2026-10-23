<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Attachment } from 'svelte/attachments';
	import type { RouteId } from '$app/types';
	import DrumPad from '#lib/components/DrumPad.svelte';

	// "made you look!" as 8-bit ASCII bytes
	const binary = [...'made you look!']
		.map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
		.join(' ');

	// Links around the ticker: a 70%-opacity underline (under the label and arrow) that goes solid on
	// hover/focus, plus an arrow showing where the link leads, which nudges that way on hover/focus.
	// Each link sets --accent (one of the theme accent colors) for its underline and arrow.
	// pb-1 leaves room under the arrow so the downward nudge doesn't hit the underline
	const landingLink =
		'group inline-flex items-center gap-1 border-b-2 border-(--accent)/70 pb-1 font-bold transition-colors hover:border-(--accent) focus-visible:border-(--accent) focus-visible:outline-none motion-reduce:transition-none';

	// Every link reserves room for the widest of these labels (stacked invisibly behind its own),
	// so all four links, and their underlines, come out the same width
	const landingLabels = ['about', 'resumé', 'my work', 'contact'];

	// Inline links in the about text: an underline in a landing accent color (added per link, as
	// Tailwind needs whole class names)
	const aboutLink =
		'underline decoration-2 underline-offset-4 transition-colors focus-visible:outline-none motion-reduce:transition-none';

	// A blurb is plain text, or a list of pieces to put links in it: strings, plus links to a page
	// of the site ({ text, page: '/work' }) or elsewhere ({ text, href: 'https://...' }, new tab),
	// e.g. ['I like ', { text: 'this', href: 'https://example.com' }, ' a lot']
	type BlurbPart = string | { text: string; page: RouteId } | { text: string; href: string };

	// Shown as chips after the about text, in this order. One with a blurb becomes a button: clicking it
	// shows the blurb under the chips until it's clicked again, Escape, or a click elsewhere
	const interests: { name: string; blurb?: string | BlurbPart[] }[] = [
		{
			name: 'cybersecurity',
			blurb:
				"I thought about having a .txt file be downloaded to the user's device when this is clicked but that seemed extreme to me..."
		},
		{
			name: 'music',
			blurb: 'I studied double bass in undergrad and now I play a lot of bass guitar'
		},
		{ name: 'programming', blurb: 'Rust is my favorite programming language, long live Ferris 🦀' },
		{ name: 'tennis', blurb: "I've been playing tennis since I was 7!" },
		{
			name: 'PC building',
			blurb: "I will build a PC at every possible opportunity, let's talk hardware!"
		},
		{ name: 'free and open source software', blurb: 'Fedora KDE is my distro of choice' },
		{
			name: 'video games',
			blurb:
				'Mass Effect is my all-time favorite, with Elden Ring and Cyberpunk 2077 as honorable mentions'
		},
		{
			name: 'cryptography',
			blurb: [
				'38762cf7f55934b34d179ae6a4c80cadccbb7f0a, ',
				{
					text: 'iykyk',
					href: 'https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html'
				}
			]
		},
		{
			name: 'DJing',
			blurb: [
				'Four Tet is my favorite DJ, I highly recommend watching ',
				{
					text: 'his set from Alexandra Palace',
					href: 'https://youtu.be/07CAVFFNyw4?si=DM8YndBfEJnZXI2Z'
				}
			]
		},
		{ name: 'horology', blurb: "I really like pilot's watches" },
		{
			name: 'art',
			blurb: 'Gustave Doré is one of my favorite artists, particularly his Dance of Sabbath'
		}
	];

	// Links in blurbs: underlined in crimson, like the chips' hover border
	const blurbLinkColor =
		'decoration-crimson/70 hover:decoration-crimson focus-visible:decoration-crimson';

	// Every blurb (and the hint) shares one grid cell, fading in and out in place
	const blurbSlot =
		'col-start-1 row-start-1 transition-[opacity,visibility] duration-200 motion-reduce:transition-none';

	let openInterest = $state<string>();
	const shownInterest = $derived(interests.find((interest) => interest.name === openInterest));

	const arrows = {
		// Scrolls down the page
		down: {
			path: 'M12 5v14M5 12l7 7 7-7',
			nudge: 'motion-safe:group-hover:translate-y-1 motion-safe:group-focus-visible:translate-y-1'
		},
		// Goes to another page
		right: {
			path: 'M5 12h14M12 5l7 7-7 7',
			nudge: 'motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1'
		}
	};

	// The cartoon's speech bubble shows on hover ("Howdy"), or for a few seconds when he says
	// something: "Howdy" for 2s when tapped (touch screens have no hover), "Sounds good" for 5s on
	// the fifth drum hit. Saying something again restarts the timer
	let speech = $state('Howdy');
	let speaking = $state(false);
	let speechTimer: ReturnType<typeof setTimeout> | undefined;

	function say(text: string, duration = 2000) {
		speech = text;
		speaking = true;
		clearTimeout(speechTimer);
		speechTimer = setTimeout(() => (speaking = false), duration);
	}

	// The text stays put while the bubble fades out, then goes back to "Howdy" for the next hover
	function resetSpeech() {
		if (!speaking) speech = 'Howdy';
	}

	let drumHits = 0;

	function onDrumHit() {
		if (drumHits < 100) {
			++drumHits;
		}
		if (drumHits === 5) say('Sounds good', 4000);
		if (drumHits === 20) say('Groovy', 4000);
		if (drumHits === 40) say("That one's a classic", 4000);
		if (drumHits === 80) say("When's the next concert?", 4000);
	}

	let jsParallax = $state(false);

	// Scripted parallax for browsers without CSS scroll-driven animations (e.g. Firefox).
	// Mirrors the CSS version below: translates the photo from -10% to 10% as the section
	// scrolls from entering the bottom of the viewport to leaving the top.
	const parallaxFallback: Attachment<HTMLElement> = (section) => {
		if (CSS.supports('animation-timeline: view()')) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const photo = section.querySelector<HTMLElement>('.bridge-photo');
		if (!photo) return;

		jsParallax = true;
		let frame = 0;

		const update = () => {
			frame = 0;
			const rect = section.getBoundingClientRect();
			const viewport = window.innerHeight;
			const progress = Math.min(Math.max((viewport - rect.top) / (viewport + rect.height), 0), 1);
			photo.style.translate = `0 ${-10 + 20 * progress}%`;
		};

		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		// Only track scrolling while the section is on screen
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				window.addEventListener('scroll', onScroll, { passive: true });
				window.addEventListener('resize', onScroll);
				update();
			} else {
				window.removeEventListener('scroll', onScroll);
				window.removeEventListener('resize', onScroll);
			}
		});
		observer.observe(section);
		update();

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			cancelAnimationFrame(frame);
			jsParallax = false;
		};
	};
</script>

<svelte:head>
	<title>Ryan Christopher</title>
</svelte:head>

<!-- An open interest blurb closes on Escape or a click outside the chips and the blurb -->
<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') openInterest = undefined;
	}}
	onclick={(event) => {
		if (
			event.target instanceof Element &&
			!event.target.closest('[aria-controls="interest-blurb"], #interest-blurb')
		)
			openInterest = undefined;
	}}
/>

{#snippet linkContent(label: string, arrow: keyof typeof arrows)}
	<span class="grid">
		<span class="col-start-1 row-start-1">{label}</span>
		{#each landingLabels as sizer (sizer)}
			<span aria-hidden="true" class="invisible col-start-1 row-start-1">{sizer}</span>
		{/each}
	</span>
	<svg
		class={[
			'size-[0.9em] shrink-0 transition-transform duration-200 ease-out',
			'text-(--accent)',
			arrows[arrow].nudge
		]}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d={arrows[arrow].path} />
	</svg>
{/snippet}

<!-- At least a screen tall, but never under 45rem: the links, drum pad, arrow and cartoon are
     absolutely positioned, so on short screens (phones in landscape, short laptop windows) they'd
     overlap each other and the name.
     There the section grows past the screen and scrolls instead -->
<section id="top" class="relative min-h-[max(100svh,45rem)]">
	<!-- 2.5% padding (of the section width, on every side), the same inset as the drum pad and cartoon.
	     At least 2rem on top, since 2.5% of a phone's width leaves the name nearly touching the top -->
	<header class="p-[2.5%] pt-[max(2.5%,2rem)]">
		<!-- Scales with screen width, capped by height so it stays clear of the cartoon on short screens.
		     About 25% smaller from laptop widths up -->
		<h1
			class="font-sans text-[clamp(2.5rem,min(12vw,22svh),12rem)] leading-none font-bold lg:text-[clamp(2.5rem,min(9vw,17svh),9rem)]"
		>
			<span class="block">Ryan</span>
			<span class="block">Christopher</span>
		</h1>
	</header>

	<!-- Links around the binary ticker, the group centered vertically. They line up with the
	     ends of the ticker lines: "about me" and "resume" above, "my work" and "contact" below,
	     each pair split left and right -->
	<div class="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col gap-4">
		<p class="flex justify-between px-[20%] text-lg leading-tight sm:text-2xl lg:px-[35%]">
			<a href="#about" class={landingLink} style:--accent="var(--color-crimson)">
				{@render linkContent('about', 'down')}
			</a>
			<a href={resolve('/resume')} class={landingLink} style:--accent="var(--color-cobalt)">
				{@render linkContent('resumé', 'right')}
			</a>
		</p>

		<!-- Scrolling binary ticker, full width, between 1px lines that span the full screen width
		     (drawn by ::before / ::after). Four copies, sliding by half the strip (two copies)
		     per loop, so it repeats seamlessly and stays full on wide screens -->
		<div
			aria-hidden="true"
			class="pointer-events-none relative overflow-hidden py-3 font-mono text-base whitespace-nowrap text-foreground/50 select-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-foreground sm:text-lg"
		>
			<div class="flex w-max motion-safe:animate-marquee">
				{#each { length: 4 }, i (i)}
					<span>{binary}</span>
					<span class="px-[1ch]">•</span>
				{/each}
			</div>
		</div>

		<p class="flex justify-between px-[20%] text-lg leading-tight sm:text-2xl lg:px-[35%]">
			<a href={resolve('/work')} class={landingLink} style:--accent="var(--color-jade)">
				{@render linkContent('my work', 'right')}
			</a>
			<a href={resolve('/contact')} class={landingLink} style:--accent="var(--color-saffron)">
				{@render linkContent('contact', 'right')}
			</a>
		</p>
	</div>

	<!-- Drum pad in the bottom-left corner, its bottom level with the down arrow's from sm: up.
	     A little lower on phones, nearer the cartoon's height -->
	<div class="absolute bottom-3 left-[2.5%] sm:bottom-14">
		<DrumPad onhit={onDrumHit} />
	</div>

	<!-- Hovering the cartoon fades in a "Howdy" speech bubble above his head (the head is at ~72%
	     of the image width), its tail pointing down at him. The tail is a rotated square with only
	     its right and bottom borders, overlapping the bubble's edge so the outline flows into it.
	     Tailwind's hover: variants only apply on devices that can hover, so on touch screens a tap
	     shows it instead (say). The fifth drum hit makes him say "Sounds good" -->
	<button
		type="button"
		onclick={() => say('Howdy')}
		onpointerenter={resetSpeech}
		class="group absolute right-[2.5%] bottom-0 w-[min(35vw,16rem)] focus-visible:outline-2 focus-visible:outline-foreground"
	>
		<span
			aria-hidden="true"
			class={[
				'pointer-events-none absolute bottom-full left-[68%] mb-3 -translate-x-3/4 rounded-2xl border border-foreground bg-background px-4 py-2 leading-none whitespace-nowrap transition-opacity duration-200 motion-reduce:transition-none',
				speaking ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
			]}
		>
			{speech}
			<span
				class="absolute top-full left-3/4 size-2.5 -translate-1/2 rotate-45 border-r border-b border-foreground bg-background"
			></span>
		</span>
		<img
			src="/images/cartoonRyan.png"
			alt="Hand-drawn illustration of Ryan sitting with an arm resting on one knee"
			width="867"
			height="710"
			class="w-full"
		/>
	</button>

	<a
		href="#about"
		aria-label="Scroll to the next section"
		class="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-foreground p-2 transition hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-foreground motion-safe:animate-nudge motion-reduce:transition-none sm:bottom-14"
	>
		<svg
			class="size-8"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M12 4v16M5 13l7 7 7-7" />
		</svg>
	</a>
</section>

<!-- overflow-clip (not hidden) so the section isn't a scroll container, which would break the parallax timeline.
     scroll-mt-[65px]: #about links stop with the photo starting right under the fixed nav bar (65px tall,
     including its 1px bottom line) instead of behind it -->
<section
	id="about"
	class="bridge relative h-[25svh] min-h-40 scroll-mt-[65px] overflow-clip"
	class:js-parallax={jsParallax}
	{@attach parallaxFallback}
>
	<img
		src="/images/bu-bridge.jpg"
		alt=""
		width="1700"
		height="1127"
		loading="lazy"
		class="bridge-photo absolute inset-0 size-full object-cover object-[50%_60%] brightness-60"
	/>
	<!-- Theme-colored overlay: darkens the photo in dark mode, lightens it in light mode.
	     Strong enough for the text to sit directly on the photo -->
	<div class="absolute inset-0 bg-background/80"></div>

	<!-- Just the heading, left-aligned (at the landing name's 2.5% inset, so they line up) and
	     vertically centered, straight on the photo (the overlay keeps it
	     readable); sized like the other pages' headings. The section is a quarter of the screen
	     tall, but at least 10rem so the heading still fits on short screens (phones in landscape) -->
	<div class="relative flex h-full items-center px-[2.5%]">
		<h2 class="text-[clamp(2.5rem,8vw,5rem)] leading-none font-bold">A bit about me</h2>
	</div>
</section>

<!-- The about me text, after the photo section, on the plain page background. The column
     (max-w-2xl) is centered on the screen, with its text and chips left-aligned in it. Less space
     above it on phones (pt-10), where the photo band is short too -->
<section class="px-[5%] pt-10 pb-24 sm:pt-24">
	<p class="mx-auto max-w-2xl text-lg leading-snug sm:text-xl">
		Hello there! I'm Ryan, a classically trained musician turned security-focused IT professional. I
		have an MS in Computer Science with a concentration in Security from Boston University, where I
		currently work. Cybersecurity, IT operations, and higher education are my specialties, and I am
		always looking for ways to help others do their work effectively and safely.
	</p>

	<!-- Interests: outlined mono chips, like the resume's skills and the work cards' tags -->
	<p class="mx-auto mt-8 max-w-2xl text-lg sm:text-xl">Some of my interests are:</p>
	<!-- The shown blurb sits under the chips. Every blurb (and the hint shown when none is) is
	     stacked in one grid cell, the hidden ones invisible, so the space is always as tall as the
	     longest one and the text below never jumps -->
	<div class="mx-auto mt-3 max-w-2xl">
		<ul class="flex flex-wrap gap-2">
			{#each interests as interest (interest.name)}
				<li class="font-mono text-sm text-foreground/90 sm:text-base">
					{#if interest.blurb}
						<!-- Neutral border like the other chips, solid and underlined on hover/focus; both crimson
						     (the landing "about me" link's color) while its blurb shows -->
						<button
							type="button"
							aria-expanded={openInterest === interest.name}
							aria-controls="interest-blurb"
							class={[
								'cursor-pointer border px-2 py-0.5 underline-offset-4 transition-colors focus-visible:outline-none motion-reduce:transition-none',
								shownInterest === interest
									? 'border-crimson underline decoration-crimson'
									: 'border-foreground/50 hover:border-foreground hover:underline focus-visible:border-foreground focus-visible:underline'
							]}
							onclick={() =>
								(openInterest = openInterest === interest.name ? undefined : interest.name)}
						>
							{interest.name}
						</button>
					{:else}
						<span class="block border border-foreground/50 px-2 py-0.5">{interest.name}</span>
					{/if}
				</li>
			{/each}
		</ul>
		<div
			id="interest-blurb"
			aria-live="polite"
			class="mt-3 grid text-base leading-snug text-foreground/90 sm:text-lg"
		>
			<p class={[blurbSlot, 'text-foreground/50', shownInterest?.blurb && 'invisible opacity-0']}>
				Click or tap one to read more.
			</p>
			{#each interests as interest (interest.name)}
				{#if interest.blurb}
					<p class={[blurbSlot, shownInterest !== interest && 'invisible opacity-0']}>
						{#each typeof interest.blurb === 'string' ? [interest.blurb] : interest.blurb as part, i (i)}
							{#if typeof part === 'string'}
								{part}
							{:else if 'page' in part}
								<a href={resolve(part.page)} class={[aboutLink, blurbLinkColor]}>{part.text}</a>
							{:else}
								<!-- External URLs aren't routes, so resolve() doesn't apply to them -->
								<!-- eslint-disable svelte/no-navigation-without-resolve -->
								<a
									href={part.href}
									target="_blank"
									rel="noopener noreferrer"
									class={[aboutLink, blurbLinkColor]}
									>{part.text}<span class="sr-only"> (opens in a new tab)</span></a
								>
								<!-- eslint-enable svelte/no-navigation-without-resolve -->
							{/if}
						{/each}
					</p>
				{/if}
			{/each}
		</div>
	</div>

	<!-- Pointers to the work and contact pages, underlined in the same accent colors as the landing
	     links (jade / saffron, 2px at 70%, solid on hover/focus) -->
	<p class="mx-auto mt-8 max-w-2xl text-lg leading-snug sm:text-xl">
		To see what I've been working on lately check out my <a
			href={resolve('/work')}
			class={[aboutLink, 'decoration-jade/70 hover:decoration-jade focus-visible:decoration-jade']}
			>works & projects page</a
		>, and to get in touch visit my
		<a
			href={resolve('/contact')}
			class={[
				aboutLink,
				'decoration-saffron/70 hover:decoration-saffron focus-visible:decoration-saffron'
			]}>contact page</a
		>.
	</p>
</section>

<style>
	/* Parallax: the photo drifts slower than the page as the section scrolls past */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.bridge {
				view-timeline-name: --bridge;
			}

			.bridge-photo {
				/* Extra height so the edges never show while the photo shifts */
				top: -15%;
				height: 130%;
				/* Firefox needs a non-zero duration to run scroll-driven animations */
				animation: parallax 1ms linear both;
				animation-timeline: --bridge;
			}
		}
	}

	/* Scripted fallback sets the translate itself; it just needs the same extra height */
	.js-parallax .bridge-photo {
		top: -15%;
		height: 130%;
		will-change: translate;
	}

	@keyframes parallax {
		from {
			translate: 0 -10%;
		}
		to {
			translate: 0 10%;
		}
	}
</style>
