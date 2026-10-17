// Contact / profile links, mostly carried over from the old site's footer. Used by the footer
// (icons only, casual ones left out) and the contact page (icon + link text).
// Icon paths are Tabler Icons outline (MIT), https://tabler.io/icons
// Tints are a lighter shade on the dark theme and a deeper one on the light theme. Tailwind needs
// whole class names in the source, so there are two sets: `tint` for hover/focus on the icon's own
// link (footer), `groupTint` for when it sits in a larger `group` link (contact page)
export type Contact = {
	href: string;
	label: string;
	/** Shown on the contact page */
	text: string;
	/** A less serious link: set a little apart on the contact page, and left out of the footer */
	casual?: boolean;
	tint: string;
	groupTint: string;
	icon: string;
};

export const contacts: Contact[] = [
	{
		href: "mailto:ryanchristopher.dev@gmail.com?subject=Let's Connect",
		label: 'Email',
		text: 'ryanchristopher.dev@gmail.com',
		tint: 'hover:text-red-400 focus-visible:text-red-400 light:hover:text-red-600 light:focus-visible:text-red-600',
		groupTint:
			'group-hover:text-red-400 group-focus-visible:text-red-400 light:group-hover:text-red-600 light:group-focus-visible:text-red-600',
		icon: 'M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z M3 7l9 6l9 -6'
	},
	{
		href: 'https://www.linkedin.com/in/rechristopher/',
		label: 'LinkedIn',
		text: 'linkedin.com/in/rechristopher',
		tint: 'hover:text-blue-400 focus-visible:text-blue-400 light:hover:text-blue-600 light:focus-visible:text-blue-600',
		groupTint:
			'group-hover:text-blue-400 group-focus-visible:text-blue-400 light:group-hover:text-blue-600 light:group-focus-visible:text-blue-600',
		icon: 'M8 11v5 M8 8v.01 M12 16v-5 M16 16v-3a2 2 0 1 0 -4 0 M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z'
	},
	{
		href: 'https://github.com/ryan-christopher/',
		label: 'GitHub',
		text: 'github.com/ryan-christopher',
		tint: 'hover:text-purple-400 focus-visible:text-purple-400 light:hover:text-purple-600 light:focus-visible:text-purple-600',
		groupTint:
			'group-hover:text-purple-400 group-focus-visible:text-purple-400 light:group-hover:text-purple-600 light:group-focus-visible:text-purple-600',
		icon: 'M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5'
	},
	{
		href: 'https://open.spotify.com/user/rechristopher99',
		label: 'Spotify',
		text: 'open.spotify.com/user/rechristopher99',
		casual: true,
		tint: 'hover:text-green-400 focus-visible:text-green-400 light:hover:text-green-600 light:focus-visible:text-green-600',
		groupTint:
			'group-hover:text-green-400 group-focus-visible:text-green-400 light:group-hover:text-green-600 light:group-focus-visible:text-green-600',
		icon: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M8 11.973c2.5 -1.473 5.5 -.973 7.5 .527 M9 15c1.5 -1 4 -1 5 .5 M7 9c2 -1 6 -2 10 .5'
	}
];
