import { problems } from '#lib/euler/problems.js';
import { highlightRust } from '#lib/server/highlight.js';
import type { PageServerLoad } from './$types';

// Built once at build time into static HTML, so the highlighter never ships to the browser
export const prerender = true;

// Solution files, copied from the ProjectEuler repo's src/bin/ into src/lib/euler/ (same names,
// e.g. 001.rs), shown whole. Re-copy a file when the solution changes
const files = import.meta.glob<string>('/src/lib/euler/*.rs', {
	query: '?raw',
	import: 'default',
	eager: true
});

export const load: PageServerLoad = async () => {
	// Highlighted solution HTML by problem number
	const solutions: Record<number, string> = {};

	for (const { number } of problems) {
		const source = files[`/src/lib/euler/${String(number).padStart(3, '0')}.rs`];
		if (source === undefined) throw new Error(`Missing src/lib/euler/ file for problem ${number}`);
		solutions[number] = await highlightRust(source.trim());
	}

	return { solutions };
};
