<script lang="ts">
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
	import type { TextLayerRenderTask } from 'pdfjs-dist/types/src/display/text_layer';
	import CanvasLayer from './utils/CanvasLayer.svelte';
	import PageContainer from './utils/PageContainer.svelte';
	import TextLayer from './utils/TextLayer.svelte';

	export let page: PDFPageProxy;

	// How to scale to fill width?
	//TODO Make dynamic
	let totalWidth: number;
	const scale = 1.5;
	const viewport = page.getViewport({ scale });
</script>

<div bind:clientWidth={totalWidth}>
	{#if !viewport}
		<p>Loading...</p>
	{:else}
		<PageContainer>
			<CanvasLayer {viewport} {page} />

			<TextLayer {viewport} {page} {scale} />
		</PageContainer>
	{/if}
</div>

<style>
</style>
