import type { Attachment } from 'svelte/attachments';

// Smooth open/close for a <details> element: {@attach smoothDetails} on the <details>.
// Animates its height with the Web Animations API, which works in every current browser (CSS
// alone can't animate to `height: auto` outside Chromium yet). It stays a real <details>, so
// keyboard, screen readers and find-in-page work as normal, and without JS it opens instantly.
// While closing, it has `data-closing` (it's still `open` until the animation ends), so styles
// that follow the open state can use `details[open]:not([data-closing])`.
// Clicking again mid-animation reverses from wherever it is. Skipped under reduced motion
export const smoothDetails: Attachment<HTMLDetailsElement> = (details) => {
	const summary = details.querySelector('summary');
	if (!summary) return;

	let animation: Animation | undefined;

	const animate = (from: number, to: number, done?: () => void) => {
		details.style.overflow = 'hidden';
		animation = details.animate(
			{ height: [`${from}px`, `${to}px`] },
			{ duration: 300, easing: 'ease-out' }
		);
		animation.onfinish = () => {
			animation = undefined;
			details.style.overflow = '';
			done?.();
		};
	};

	const onClick = (event: MouseEvent) => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		event.preventDefault();

		// Measured before cancelling, so an interrupted animation reverses from where it was
		const from = details.offsetHeight;
		const opening = !details.open || 'closing' in details.dataset;
		animation?.cancel();

		if (opening) {
			delete details.dataset.closing;
			details.open = true;
			animate(from, details.offsetHeight);
		} else {
			details.dataset.closing = '';
			animate(from, summary.offsetHeight, () => {
				details.open = false;
				delete details.dataset.closing;
			});
		}
	};

	summary.addEventListener('click', onClick);
	return () => {
		summary.removeEventListener('click', onClick);
		animation?.cancel();
	};
};
