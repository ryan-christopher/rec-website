<script lang="ts">
	import { contacts } from '#lib/contacts.js';
	import type { Contact } from '#lib/contacts.js';
	import BackArrow from '#lib/components/BackArrow.svelte';

	// Two sections, like the resume page: the professional links, then the casual ones (Spotify)
	const sections = [
		{ heading: 'Contact', links: contacts.filter((contact) => !contact.casual) },
		{ heading: 'Less Serious Contact', links: contacts.filter((contact) => contact.casual) }
	];

	// Same as the resume page: bold heading, then a 1px rule with the same space above and below it
	const headingClass = 'text-3xl font-bold sm:text-4xl';
	const ruleClass = 'my-3 border-foreground';
</script>

<svelte:head>
	<title>Contact · Ryan Christopher</title>
</svelte:head>

<!-- One row per link: icon on the left, the address on the right. The whole row is the link;
     on hover/focus the icon grows and tints (as in the footer) and the underline goes solid -->
{#snippet contactLink(contact: Contact)}
	{@const external = contact.href.startsWith('http')}
	<!-- External URLs and mailto:, so there's no app route to resolve() -->
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		href={contact.href}
		target={external ? '_blank' : undefined}
		rel={external ? 'noreferrer' : undefined}
		class="group inline-flex items-center gap-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
	>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
		<svg
			class={[
				'size-8 shrink-0 transition duration-200 ease-out motion-safe:group-hover:scale-120 motion-safe:group-focus-visible:scale-120 motion-reduce:transition-none',
				contact.groupTint
			]}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d={contact.icon} />
		</svg>
		<span
			class="text-md break-all underline decoration-foreground/40 underline-offset-4 transition-colors group-hover:decoration-foreground group-focus-visible:decoration-foreground motion-reduce:transition-none sm:text-xl"
		>
			<span class="sr-only">{contact.label}:</span>
			{contact.text}
			{#if external}<span class="sr-only">(opens in a new tab)</span>{/if}
		</span>
	</a>
{/snippet}

<!-- Top padding clears the fixed nav bar, 2.5% side inset. The content is centered vertically in
     the screen-tall section (between the paddings, so a little below the middle, as the nav covers
     the top) -->
<section id="top" class="flex min-h-svh flex-col justify-center px-[2.5%] pt-24 pb-14">
	<!-- No visible page heading, like the resume page; kept for screen readers and the outline -->
	<h1 class="sr-only">Contact</h1>

	<!-- Fixed top-left back arrow, like the resume page's. The content is centered vertically, so it
	     starts well below the arrow and needs no extra room -->
	<BackArrow />

	<!-- Both sections in one block, centered and as wide as its widest row, so the headings,
	     lines and icons all line up -->
	<div class="mx-auto flex w-fit max-w-full flex-col gap-12">
		{#each sections as section (section.heading)}
			<section>
				<h2 class={headingClass}>{section.heading}</h2>
				<hr class={ruleClass} />
				<ul class="flex flex-col gap-6">
					{#each section.links as contact (contact.href)}
						<li>{@render contactLink(contact)}</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</section>
