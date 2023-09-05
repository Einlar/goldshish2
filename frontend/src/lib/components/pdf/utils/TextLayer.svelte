<script lang="ts">
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
	import type { PageViewport } from 'pdfjs-dist/types/src/display/display_utils';
	import type { TextLayerRenderTask } from 'pdfjs-dist/types/src/display/text_layer';
	import type { Action } from 'svelte/action';
	import { renderTextLayer } from 'pdfjs-dist';

	export let viewport: PageViewport;
	export let page: PDFPageProxy;
	export let scale: number = 1;

	let renderTask: TextLayerRenderTask | undefined;

	const renderText: Action<HTMLDivElement> = (div) => {
		renderTask?.cancel();

		while (div.firstChild) div.removeChild(div.firstChild);

		renderTask = renderTextLayer({
			container: div,
			textContentSource: page.streamTextContent(),
			viewport
		});

		/**
		 * This replicates the "bindMouse()" function from the official PDFViewer
		 * It improves text selection on Firefox, but not much on Chrome it would seem.
		 * It is basically a "hack". A div is created at the bottom of the page, and it is extended to fill the page onmousedown. This maintains the selection when the mouse
		 * is dragged over the whitespace.
		 * See:
		 * - Implementation: https://github.com/mozilla/pdf.js/blob/cf5a1d60a61e13108afffbb1046521b5bb46f918/web/text_layer_builder.js#L182-L233
		 * - Issue (Chrome): https://github.com/mozilla/pdf.js/issues/9843
		 *
		 * According to this (https://github.com/agentcooper/react-pdf-highlighter/issues/246) there should be an alternate way of showing the text layer that solves this
		 * on Chrome (but not on Firefox), so I could try switching that
		 */
		renderTask.promise.then(() => {
			const endOfContent = document.createElement('div');
			endOfContent.classList.add('endOfContent');
			div.append(endOfContent);

			div.addEventListener('mousedown', (evt) => {
				const divBounds = div.getBoundingClientRect();
				// Adjust the top side of the div to the start of the selection (it seems to have not much effect)
				// const r = Math.max(0, (evt.pageY - divBounds.top) / divBounds.height);
				// endOfContent.style.top = (r * 100).toFixed(2) + '%';
				// console.log(evt.pageY);
				endOfContent.style.top = evt.clientY - divBounds.top + 'px';
				endOfContent.classList.add('active');
			});
			div.addEventListener('mouseup', () => endOfContent.classList.remove('active'));
		});

		return {
			destroy() {
				renderTask?.cancel();
			}
		};
	};
</script>

<div style="--scale-factor: {scale}" use:renderText />

<style>
	div {
		position: absolute;
		inset: 0;
		overflow: clip;
		opacity: 0.8;
		/* This allows the highlights not to cover the text */
		mix-blend-mode: multiply;
		line-height: 1;
		z-index: 2;
		opacity: 0.8;
	}

	div > :global(span) {
		color: transparent;
		position: absolute;
		white-space: pre;
		cursor: text;
		transform-origin: 0% 0%;
	}

	div > :global(span)::selection {
		background: yellow;
		text-shadow: none;
	}

	:global(.endOfContent) {
		display: block;
		position: absolute;
		inset: 100% 0 0;
		z-index: -1;
		cursor: default;
		user-select: none;
		background-color: red;
	}

	:global(.active) {
		top: 0;
	}
</style>
