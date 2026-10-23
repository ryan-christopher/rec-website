import type { RouteId } from '$app/types';

type WorkDetails = {
	title: string;
	/** e.g. "2025" or "2023 – 2024" */
	date: string;
	/** Short summary shown on the card */
	description: string;
	tags: string[];
	/** Path to an image in static/, e.g. "/images/project.jpg". A placeholder shows without one */
	image?: string;
	imageAlt?: string;
};

/**
 * A piece of work, linking either to its own page or to an external URL (opens in a new tab).
 * `page` is the route of a project page, e.g. '/work/project-one' for
 * src/routes/work/project-one/+page.svelte (wrap its content in ProjectPage)
 */
export type Work = WorkDetails & ({ page: RouteId; link?: never } | { link: string; page?: never });

// Newest first
export const works: Work[] = [
	{
		title: 'HPA File Hiding',
		date: '2026',
		description:
			"Using command-line utilities in Fedora Linux 43 KDE to place the script of “The Lord of the Rings: The Fellowship of the Ring” in the sectors of a drive's Host Protected Area.",
		tags: ['Red Team', 'Cybersecurity', 'Linux'],
		page: '/work/hpa-file-hiding',
		image: '/images/hard_drive.png',
		imageAlt: "Close-up of a Seagate hard drive's circuit board and SATA connector"
	},
	{
		title: 'Project Euler',
		date: '2025 – Ongoing',
		description: 'Solving the first 100 Project Euler questions with Rust.',
		tags: ['Number Theory', 'Data Science', 'Rust'],
		page: '/work/project-euler',
		image: '/images/euler.png',
		imageAlt: 'Rust code with nested while loops searching for a Pythagorean triplet'
	},
	{
		title: 'ML-KEM vs RSA',
		date: '2025',
		description:
			'A passion project turned academic work on the benefits and downsides of the post-quantum cryptographic suite outlined in NIST FIPS 203.',
		tags: ['Lattice-based Cryptography', 'Cybersecurity', 'Rust'],
		page: '/work/ml-kem-vs-rsa',
		image: '/images/lattice.png',
		imageAlt: 'Diagram of a two-dimensional lattice of points with basis vectors drawn as arrows'
	},
	{
		title: 'Bayesian or Brahmsian? Using Data Science to Compose Music',
		date: '2023',
		description:
			"A Python application using pygame, pandas, NumPy, and scikit-learn that takes a user's input as a melody and generates a corresponding harmony in the style of Bach.",
		tags: ['Data Science', 'Python', 'Machine Learning'],
		page: '/work/bayesian-or-brahmsian',
		image: '/images/bayesian.png',
		imageAlt:
			'Sheet music with a melody highlighted in green and a generated harmony in gray, notes labeled with MIDI numbers'
	},
	{
		title: 'Pythonic Retribution',
		date: '2023',
		description:
			"Shutting down a bullying ring at my sibling's school using web automation, hashing algorithms, and Python.",
		tags: ['Web Automation', 'Cryptography', 'Python'],
		link: 'https://medium.com/@ryanchristopher.dev/pythonic-retribution-6eda8928195a',
		image: '/images/retribution.png',
		imageAlt: 'Two test messages, each shown with its hash'
	},
	{
		title: 'The Coder School Curriculum',
		date: '2022',
		description:
			'Developed curricula including web development, game development, esports programming, algorithm design, and music production with code.',
		tags: ['Education', 'Python', 'Scratch', 'Web Development'],
		link: 'https://github.com/ryan-christopher/tcs-curriculum',
		image: '/images/scratch.png',
		imageAlt:
			'Scratch code blocks: when the green flag is clicked, forever check if touching Apple, then say “I found it!” for 2 seconds'
	}
];
