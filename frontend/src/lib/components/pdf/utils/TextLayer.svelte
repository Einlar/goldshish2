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
		border: 1px solid black;
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
</style>
