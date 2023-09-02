<script lang="ts">
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
	import type { TextLayerRenderTask } from 'pdfjs-dist/types/src/display/text_layer';

	export let page: PDFPageProxy;

	let canvas: HTMLCanvasElement | undefined;
	let textLayer: HTMLDivElement | undefined;

	let totalWidth: number | undefined;

	// How to scale to fill width?
	//TODO Make dynamic
	const scale = 2.5;

	const viewport = page.getViewport({ scale });
	const outputScale = window?.devicePixelRatio || 1;

	const renderPage = async () => {
		const context = canvas?.getContext('2d');

		if (!context || !canvas) return;

		const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

		const renderContext = {
			canvasContext: context,
			viewport,
			transform
		};

		page.render(renderContext);
	};

	let renderTask: TextLayerRenderTask | undefined;

	const renderText = async () => {
		if (!textLayer) return;

		renderTask?.cancel();

		// Remove all the previous elements
		while (textLayer.firstChild) {
			textLayer.removeChild(textLayer.firstChild);
		}

		const { renderTextLayer } = await import('pdfjs-dist');

		renderTask = renderTextLayer({
			container: textLayer,
			textContentSource: page.streamTextContent(),
			viewport
		});
	};

	$: if (canvas) renderPage();

	$: if (textLayer) renderText();
</script>

<div class="container" bind:clientWidth={totalWidth}>
	<canvas
		bind:this={canvas}
		width={viewport.width * outputScale}
		height={viewport.height * outputScale}
	/>

	<div bind:this={textLayer} class="text-layer" style="--scale-factor: {scale};" />
</div>

<style>
	canvas {
		border: 2px solid blue;
	}

	.container {
		position: relative;
		border: 2px solid red;
	}

	.text-layer {
		position: absolute;
		inset: 0;
		overflow: clip;
		opacity: 0.8;
		/* This allows the highlights not to cover the text */
		mix-blend-mode: multiply;
		line-height: 1;
		border: 1px solid black;
	}

	.text-layer > :global(span) {
		color: transparent;
		position: absolute;
		white-space: pre;
		cursor: text;
		transform-origin: 0% 0%;
	}

	.text-layer > :global(span)::selection {
		background: yellow;
		text-shadow: none;
	}
</style>
