<script lang="ts">
	import ProjectPage from '#lib/components/ProjectPage.svelte';
	import { problems } from '#lib/euler/problems.js';
	import { smoothDetails } from '#lib/smoothDetails.js';

	// Highlighted solutions by problem number, built in +page.server.ts
	let { data } = $props();

	// Problem numbers, two digits: 1 → "01"
	const pad = (number: number) => String(number).padStart(2, '0');
</script>

<!-- Title and date come from this page's entry in src/lib/works.ts -->
<ProjectPage>
	<p>
		When I found out about Project Euler, I was especially interested in the challenge to solve a
		problem efficiently. Below is how I have gone about approaching the problems I have solved so
		far. Project Euler allows problems 1 to 100 to be shared for educational purposes, and I am a
		big fan of allowing others the ability to have that "aha!" moment as well, so I have removed
		function calls and any outputted answers.
		<br /><br />
		For more information,
		<!-- New tab, like the badge's link. External URL, so there's no app route to resolve() -->
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<a
			href="https://projecteuler.net"
			target="_blank"
			rel="noreferrer"
			class="underline decoration-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:decoration-foreground motion-reduce:transition-none"
			>check out the Project Euler site here.<span class="sr-only">&nbsp;(opens in a new tab)</span
			></a
		>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	</p>

	<!-- The badge, centered, links to projecteuler.net in a new tab. External URL, so there's no app route to
	     resolve() -->
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		href="https://projecteuler.net"
		target="_blank"
		rel="noreferrer"
		class="w-fit self-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
	>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
		<img
			class="w-50"
			alt="My Project Euler badge"
			src="https://projecteuler.net/profile/rechris.png"
		/><span class="sr-only"> (opens Project Euler in a new tab)</span>
	</a>

	<!-- Key for the favorites' asterisk. Hidden from screen readers: they hear "(one of my
	     favorites)" in the list instead of the asterisk, so the key wouldn't mean anything to them -->
	<p aria-hidden="true">
		<span class="font-mono text-xl font-bold text-green-500 sm:text-2xl light:text-green-700"
			>*</span
		>
		indicates a problem I especially liked
	</p>

	<p>Runtimes listed are the averages taken from 20 build release runs of the corresponding program. According to
		Project Euler, these problems are designed such that "an efficient implementation will allow a solution to be obtained on a modestly 
		powered computer in less than one minute."
	</p>

	<!-- One expandable section per solved problem (<details>: opens on click / Enter / Space),
	     sliding open and shut via smoothDetails. The summary row shows the number and title, with a
	     circled arrow right after the title that turns as it opens, and back as soon as it starts
	     closing. 1px lines only between entries (divide-y), none above the first or below the last -->
	<ul class="mt-6 flex flex-col divide-y divide-foreground">
		{#each problems as problem (problem.number)}
			<li>
				<details class="group/problem" {@attach smoothDetails}>
					<summary
						class="group/summary flex cursor-pointer list-none items-center gap-4 py-4 transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-foreground [&::-webkit-details-marker]:hidden"
					>
						<!-- The number and title on one line, sharing a baseline; the solution's average runtime
						     under the title -->
						<span class="grid grid-cols-[auto_auto] items-baseline gap-x-4">
							<span class="font-mono text-base text-foreground/90">{pad(problem.number)}</span>
							<span class="text-xl font-bold sm:text-2xl"
								>{problem.title}{#if problem.liked}
									<!-- A problem I especially liked: a green asterisk, said in words to screen readers -->
									<span class="sr-only">&nbsp;</span>
									<span aria-hidden="true" class="font-mono text-green-500 light:text-green-700"
										>*</span
									><span class="sr-only">&nbsp;(one of my favorites)</span>
								{/if}</span
							>
							{#if problem.runtime}
								<span class="col-start-2 font-mono text-sm text-foreground/70"
									>runtime: {problem.runtime}</span
								>
							{/if}
						</span>
						<!-- A circled down arrow like the landing page's and the back arrow. The circle turns
						     to point it up while open (and back as soon as it starts closing); the arrow
						     inside nudges the way it points on hover/focus. With a mouse it only shows while the
						     pointer is over the problem (open or not) or the summary has keyboard focus; touch
						     screens can't hover, so there it always shows -->
						<span
							class="shrink-0 rounded-full border border-foreground p-2 transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none pointer-fine:opacity-0 pointer-fine:group-hover/problem:opacity-100 pointer-fine:group-focus-visible/summary:opacity-100 [details[open]:not([data-closing])_&]:rotate-180"
						>
							<svg
								class="size-5 transition-transform duration-200 ease-out motion-safe:group-hover/summary:translate-y-1 motion-safe:group-focus-visible/summary:translate-y-1"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path d="M12 5v14M5 12l7 7 7-7" />
							</svg>
						</span>
					</summary>

					<div class="flex flex-col gap-3 pb-5">
						<!-- The problem on projecteuler.net first, then its statement. External URL, so there's no
						     app route to resolve() -->
						<!-- eslint-disable svelte/no-navigation-without-resolve -->
						<a
							href="https://projecteuler.net/problem={problem.number}"
							target="_blank"
							rel="noreferrer"
							class="w-fit font-mono text-sm text-foreground/90 underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground focus-visible:decoration-foreground"
						>
							<!-- eslint-enable svelte/no-navigation-without-resolve -->
							projecteuler.net/problem={problem.number} ↗<span class="sr-only">
								(opens in a new tab)</span
							>
						</a>
						{#each problem.statement as paragraph (paragraph)}
							<p class="whitespace-pre-line">{paragraph}</p>
						{/each}

						<!-- The solution: the Rust file's code, highlighted at build time (trusted HTML from
						     Shiki), scrolling sideways if a line is too long. No visible label; the heading is
						     for screen readers, so the code block isn't announced without context -->
						<h3 class="sr-only">Solution in Rust</h3>
						<div class="mt-3">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html data.solutions[problem.number]}
						</div>
					</div>
				</details>
			</li>
		{/each}
	</ul>

	<!-- Problem statements are Project Euler's, under CC BY-NC-SA 4.0, which asks for credit -->
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<p class="mt-6 font-mono text-sm text-foreground/90">
		Problems from <a
			href="https://projecteuler.net"
			target="_blank"
			rel="noreferrer"
			class="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground focus-visible:decoration-foreground"
			>projecteuler.net<span class="sr-only"> (opens in a new tab)</span></a
		>, licensed under
		<a
			href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
			target="_blank"
			rel="noreferrer"
			class="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground focus-visible:decoration-foreground"
			>CC BY-NC-SA 4.0<span class="sr-only"> (opens in a new tab)</span></a
		>.
	</p>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
</ProjectPage>
