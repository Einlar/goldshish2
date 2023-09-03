import type { Action } from 'svelte/action';

/**
 * Adapted from https://svelte.dev/repl/c6a402704224403f96a3db56c2f48dfc?version=4.2.0
 */

let intersectionObserver: IntersectionObserver | undefined;

const ensureIntersectionObserver = () => {
	if (intersectionObserver) return intersectionObserver;

	return new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const eventName = entry.isIntersecting ? 'enterViewport' : 'exitViewport';
			entry.target.dispatchEvent(new CustomEvent(eventName));
		});
	});
};

const viewport: Action<
	Element,
	undefined,
	{ 'on:enterViewport': (e: CustomEvent) => void; 'on:exitViewport': (e: CustomEvent) => void }
> = (element) => {
	intersectionObserver = ensureIntersectionObserver();

	intersectionObserver.observe(element);

	return {
		destroy() {
			intersectionObserver?.unobserve(element);
		}
	};
};

export default viewport;
