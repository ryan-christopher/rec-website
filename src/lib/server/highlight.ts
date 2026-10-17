import { codeToHtml } from 'shiki';

// Rust code to highlighted HTML, for prerendered pages (call it in a +page.server.ts load), so
// the highlighter never ships to the browser. Both themes' colors go in CSS variables
// (--shiki-light / --shiki-dark); layout.css picks one to match the site theme. The <pre> gets
// the site's own box styling.
// GitHub High Contrast: of the themes tried, the one whose colors stay readable (≥4.5:1) on the
// site's cream and charcoal (most light themes are made for white). Only its comment gray fell
// short on cream (4.1:1), so it's darkened to 4.8:1
export function highlightRust(code: string) {
	return codeToHtml(code, {
		lang: 'rust',
		themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
		colorReplacements: { 'github-light-high-contrast': { '#66707b': '#5c656f' } },
		defaultColor: false,
		transformers: [
			{
				pre(node) {
					this.addClassToHast(
						node,
						'overflow-x-auto border border-foreground/50 p-4 font-mono text-sm leading-relaxed'
					);
				}
			}
		]
	});
}
