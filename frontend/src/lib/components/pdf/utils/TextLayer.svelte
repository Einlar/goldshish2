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
	}

	div > :global(span) {
		color: transparent;
		position: absolute;
		white-space: pre;
		cursor: text;
		transform-origin: 0% 0%;
		/* Hack to improve text selection */
		/* This should be the way: https://github.com/mozilla/pdf.js/pull/7539, but it was removed https://github.com/mozilla/pdf.js/issues/16684 and now we have this https://github.com/mozilla/pdf.js/issues/15733 */
		/* padding-bottom: 100%; */
		/* padding-right: 100%; */
	}

	div > :global(span)::selection {
		background: yellow;
		text-shadow: none;
	}

	.noselect {
	}
</style>
