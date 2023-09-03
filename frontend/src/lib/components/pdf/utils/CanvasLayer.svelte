<script lang="ts">
	import type { PDFPageProxy, RenderTask } from 'pdfjs-dist/types/src/display/api';
	import type { PageViewport } from 'pdfjs-dist/types/src/display/display_utils';
	import type { Action } from 'svelte/action';
	import Spinner from './Spinner.svelte';
	import { createEventDispatcher } from 'svelte';

	export let viewport: PageViewport;
	export let page: PDFPageProxy;

	const dispatch = createEventDispatcher();
	let renderTask: RenderTask | undefined;
	let loading = false;

	const renderPage: Action<HTMLCanvasElement> = (canvas) => {
		loading = true;

		// Render the page
		renderTask = page.render({
			canvasContext: canvas.getContext('2d')!,
			viewport
		});

		renderTask.promise.then(() => {
			loading = false;
			dispatch('rendered');
		});

		return {
			destroy() {
				renderTask?.cancel();
			}
		};
	};
</script>

<div class="viewport" style="width: {viewport.width}px; height: {viewport.height}px;">
	<canvas width={viewport.width} height={viewport.height} use:renderPage />
	{#if loading}
		<div class="loader">
			<Spinner />
		</div>
	{/if}
</div>

<style>
	.viewport {
		position: relative;
	}

	.loader {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
