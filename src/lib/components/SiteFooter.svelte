<script lang="ts">
	import { contacts } from '#lib/contacts.js';
	import RetroComputer from './RetroComputer.svelte';

	// Email / LinkedIn / GitHub links, shared with the contact page. The casual ones (Spotify) are
	// only on the contact page
	const links = contacts.filter((contact) => !contact.casual);

	const year = new Date().getFullYear();

	const creditLink =
		'underline decoration-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:decoration-foreground motion-reduce:transition-none';
</script>

<!-- Side padding matches the 2.5% inset used on the landing section.
     From sm: up, three columns: name left, the 3D retro computer centered, icons right.
     On phones the column is reversed, so the icons sit on top, then the computer, then the name.
     The model's credit sits under all of them, left-aligned -->
<footer id="contact" class="border-t border-foreground px-[2.5%] py-8">
	<div class="flex flex-col-reverse items-center gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr]">
		<p class="text-center text-foreground/70 sm:text-left">&copy; {year} Ryan Christopher</p>

		<RetroComputer />

		<ul class="-mx-2 flex justify-center gap-2 sm:justify-self-end">
			{#each links as link (link.href)}
				<li>
					<!-- External URLs, so there's no app route to resolve() -->
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<a
						href={link.href}
						target="_blank"
						rel="noreferrer"
						aria-label={link.label}
						title={link.label}
						class={[
							'group block rounded-full p-2 transition focus-visible:outline-2 focus-visible:outline-foreground motion-reduce:transition-none',
							link.tint
						]}
					>
						<svg
							class="size-8 transition-transform duration-200 ease-out group-hover:scale-140 group-focus-visible:scale-140 motion-reduce:transition-none"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d={link.icon} />
						</svg>
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				</li>
			{/each}
		</ul>
	</div>

	<!-- The model is CC BY 4.0, which requires this credit. External URLs, so there's no app
	     route to resolve() -->
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<p class="mt-6 text-left text-xs text-foreground/50">
		<a
			href="https://sketchfab.com/3d-models/retro-computer-3a496376915846459d77fc14fdd6c1e0"
			target="_blank"
			rel="noreferrer"
			class={creditLink}>“Retro computer”<span class="sr-only"> (opens in a new tab)</span></a
		>
		by Tobalation,
		<a
			href="https://creativecommons.org/licenses/by/4.0/"
			target="_blank"
			rel="noreferrer"
			class={creditLink}>CC BY 4.0<span class="sr-only"> (opens in a new tab)</span></a
		>
	</p>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
</footer>
