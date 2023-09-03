<svelte:options immutable />

<script lang="ts">
	import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
	import CanvasLayer from './utils/CanvasLayer.svelte';
	import TextLayer from './utils/TextLayer.svelte';
	import AnnotationLayer from './utils/AnnotationLayer.svelte';

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
		<div>
			<CanvasLayer {viewport} {page} on:rendered />
			<TextLayer {viewport} {page} {scale} />
			<AnnotationLayer {viewport} {page} />
		</div>
	{/if}
</div>

<style>
	div {
		position: relative;
		padding: 0;
	}
</style>
