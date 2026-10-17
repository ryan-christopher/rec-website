import rsa from '#lib/ml-kem/rsa.rs?raw';
import kyber from '#lib/ml-kem/kyber.rs?raw';
import { highlightRust } from '#lib/server/highlight.js';
import type { PageServerLoad } from './$types';

// Built once at build time into static HTML, so the highlighter never ships to the browser
export const prerender = true;

// The write-up's two functions, transcribed from the screenshots in the PDF
export const load: PageServerLoad = async () => ({
	rsa: await highlightRust(rsa.trim()),
	kyber: await highlightRust(kyber.trim())
});
