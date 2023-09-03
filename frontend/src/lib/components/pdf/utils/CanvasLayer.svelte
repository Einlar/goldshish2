<script lang="ts">
	import type { PDFPageProxy, RenderTask } from 'pdfjs-dist/types/src/display/api';
	import type { PageViewport } from 'pdfjs-dist/types/src/display/display_utils';
	import type { Action } from 'svelte/action';

	export let viewport: PageViewport;
	export let page: PDFPageProxy;

	let renderTask: RenderTask | undefined;

	const renderPage: Action<HTMLCanvasElement> = (canvas) => {
		// Render the page
		renderTask = page.render({
			canvasContext: canvas.getContext('2d')!,
			viewport
		});

		return {
			destroy() {
				renderTask?.cancel();
			}
		};
	};
</script>

<canvas width={viewport.width} height={viewport.height} use:renderPage />

<style>
	canvas {
		border: 2px solid blue;
	}
</style>
